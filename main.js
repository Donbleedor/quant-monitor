/**
 * main.js - 游戏主控制器
 * 状态管理、事件绑定、游戏流程
 */

const Game = {
    engine: null,
    levels: [],
    save: null,
    state: 'menu', // menu, playing, paused

    // Current game session
    currentLevel: null,
    selectedTile: null,
    hintTileIds: [],
    hintTimer: null,
    combo: 0,
    comboTimer: null,
    moveCount: 0,
    startTime: 0,
    elapsedSeconds: 0,
    timerInterval: null,

    // Tools
    tools: { hint: 3, undo: 3, shuffle: 2 },

    // ===== 初始化 =====
    init() {
        UI.init();
        this.engine = new MahjongEngine();
        this.levels = generateLevelList();
        this.save = loadSave();
        this.showMenu();
    },

    // ===== 主菜单 =====
    showMenu() {
        this.state = 'menu';
        this.stopTimer();
        UI.renderMenu(
            this.save,
            () => this.playCurrentLevel(),
            () => this.showLevelSelect(),
            () => this.playDailyChallenge(),
            () => this.showSettings()
        );
    },

    // ===== 开始当前关卡 =====
    playCurrentLevel() {
        this.startLevel(this.save.currentLevel);
    },

    // ===== 开始指定关卡 =====
    startLevel(levelId) {
        const levelConfig = this.levels.find(l => l.id === levelId);
        if (!levelConfig) return;

        this.currentLevel = levelConfig;
        this.selectedTile = null;
        this.hintTileIds = [];
        this.combo = 0;
        this.moveCount = 0;
        this.elapsedSeconds = 0;
        this.state = 'playing';

        // Reset tools based on difficulty
        if (levelConfig.difficulty === 'easy') {
            this.tools = { hint: 3, undo: 3, shuffle: 2 };
        } else if (levelConfig.difficulty === 'medium') {
            this.tools = { hint: 2, undo: 3, shuffle: 2 };
        } else {
            this.tools = { hint: 2, undo: 2, shuffle: 1 };
        }

        // Generate level
        this.engine.generateLevel(levelConfig);

        // Render
        UI.renderGameScreen(levelId, this.tools);
        UI.initBoardLayout(this.engine); // 固定棋盘布局，不随消除变化
        this.renderBoard();
        this.bindGameEvents();
        this.startTimer();
    },

    // ===== 每日挑战 =====
    playDailyChallenge() {
        // Use today's date as seed for a consistent daily level
        const today = new Date().toISOString().slice(0, 10);
        // Simple seed-based config
        const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0);
        const pairs = 35 + (seed % 10);

        const dailyConfig = {
            id: 'D',
            difficulty: 'medium',
            pairs: pairs,
            totalTiles: pairs * 2,
            layoutIndex: seed % LAYOUT_TEMPLATES.length,
        };

        this.currentLevel = dailyConfig;
        this.selectedTile = null;
        this.hintTileIds = [];
        this.combo = 0;
        this.moveCount = 0;
        this.tools = { hint: 2, undo: 2, shuffle: 1 };
        this.state = 'playing';

        this.engine.generateLevel(dailyConfig);

        UI.renderGameScreen('每日挑战', this.tools);
        UI.initBoardLayout(this.engine); // 固定棋盘布局
        this.renderBoard();
        this.bindGameEvents();
        this.startTimer();
    },

    // ===== 渲染棋盘 =====
    renderBoard() {
        const selectedId = this.selectedTile ? this.selectedTile.id : null;
        UI.renderBoard(this.engine, selectedId, this.hintTileIds);
        this.bindTileClicks();
    },

    // ===== 绑定游戏事件 =====
    bindGameEvents() {
        const btnHome = document.getElementById('btnHome');
        const btnPause = document.getElementById('btnPause');
        const btnHint = document.getElementById('btnHint');
        const btnUndo = document.getElementById('btnUndo');
        const btnShuffle = document.getElementById('btnShuffle');

        if (btnHome) btnHome.onclick = () => this.pauseAndShowMenu();
        if (btnPause) btnPause.onclick = () => this.pauseGame();
        if (btnHint) btnHint.onclick = () => this.useHint();
        if (btnUndo) btnUndo.onclick = () => this.useUndo();
        if (btnShuffle) btnShuffle.onclick = () => this.useShuffle();
    },

    // ===== 绑定牌点击 =====
    bindTileClicks() {
        const container = document.getElementById('boardContainer');
        if (!container) return;

        container.onclick = (e) => {
            if (this.state !== 'playing') return;

            const tileEl = e.target.closest('.tile');
            if (!tileEl) return;

            const tileId = parseInt(tileEl.dataset.tileId);
            const tile = this.engine.getTileById(tileId);
            if (!tile || tile.removed) return;

            this.onTileClick(tile);
        };
    },

    // ===== 牌点击逻辑 =====
    onTileClick(tile) {
        // Clear hint
        this.clearHint();

        // If tile is not free, shake it
        if (!tile.isFree) {
            UI.animateWrongShake(tile.id);
            return;
        }

        // No tile selected yet
        if (!this.selectedTile) {
            this.selectedTile = tile;
            this.renderBoard();
            return;
        }

        // Same tile - deselect
        if (this.selectedTile.id === tile.id) {
            this.selectedTile = null;
            this.renderBoard();
            return;
        }

        // Different tile - check match
        const tileA = this.selectedTile;
        const tileB = tile;

        if (this.engine.canMatch(tileA, tileB)) {
            // Match!
            this.selectedTile = null;
            this.moveCount++;

            // Animate removal
            UI.animateMatch(tileA.id, tileB.id, () => {
                // Actually remove in engine
                this.engine.removePair(tileA, tileB);

                // Combo
                this.combo++;
                clearTimeout(this.comboTimer);
                this.comboTimer = setTimeout(() => { this.combo = 0; }, 3000);

                if (this.combo > 1) {
                    UI.showCombo(this.combo);
                }

                // Check win
                if (this.engine.isWin()) {
                    this.onWin();
                    return;
                }

                // Check deadlock
                if (this.engine.isDeadlock()) {
                    UI.showDeadlockToast();
                    // Highlight shuffle button
                    const btnShuffle = document.getElementById('btnShuffle');
                    if (btnShuffle) {
                        btnShuffle.style.animation = 'hintPulse 0.8s ease-in-out 3';
                        setTimeout(() => { if (btnShuffle) btnShuffle.style.animation = ''; }, 2500);
                    }
                }

                // Re-render board
                this.renderBoard();
            });
        } else {
            // No match - switch selection
            this.selectedTile = tileB;
            this.renderBoard();
        }
    },

    // ===== 道具: 提示 =====
    useHint() {
        if (this.tools.hint <= 0 || this.state !== 'playing') return;

        const pair = this.engine.findHintPair();
        if (!pair) return;

        this.tools.hint--;
        this.selectedTile = null;
        this.hintTileIds = [pair[0].id, pair[1].id];

        UI.updateToolbar(this.tools);
        this.renderBoard();

        // Clear hint after 3s
        clearTimeout(this.hintTimer);
        this.hintTimer = setTimeout(() => {
            this.clearHint();
            this.renderBoard();
        }, 3000);
    },

    clearHint() {
        this.hintTileIds = [];
        clearTimeout(this.hintTimer);
    },

    // ===== 道具: 撤销 =====
    useUndo() {
        if (this.tools.undo <= 0 || this.state !== 'playing') return;

        const result = this.engine.undo();
        if (!result) return;

        this.tools.undo--;
        this.selectedTile = null;
        this.clearHint();
        this.moveCount = Math.max(0, this.moveCount - 1);

        UI.updateToolbar(this.tools);
        this.renderBoard();
    },

    // ===== 道具: 洗牌 (无限使用) =====
    useShuffle() {
        if (this.state !== 'playing') return;

        this.selectedTile = null;
        this.clearHint();

        this.engine.shuffle();

        // 洗牌不消耗次数，无限使用
        this.renderBoard();
    },

    // ===== 暂停 =====
    pauseGame() {
        if (this.state !== 'playing') return;
        this.state = 'paused';
        this.stopTimer();

        UI.showPauseModal(
            () => this.resumeGame(),
            () => this.restartLevel(),
            () => this.showMenu()
        );
    },

    pauseAndShowMenu() {
        this.pauseGame();
    },

    resumeGame() {
        this.state = 'playing';
        this.startTimer();
    },

    restartLevel() {
        if (this.currentLevel) {
            if (typeof this.currentLevel.id === 'number') {
                this.startLevel(this.currentLevel.id);
            } else {
                this.playDailyChallenge();
            }
        }
    },

    // ===== 计时器 =====
    startTimer() {
        this.startTime = Date.now() - this.elapsedSeconds * 1000;
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.state !== 'playing') return;
            this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
            const timerEl = document.getElementById('timerDisplay');
            if (timerEl) {
                timerEl.style.display = '';
                timerEl.textContent = this.formatTime(this.elapsedSeconds);
            }
        }, 1000);
    },

    stopTimer() {
        clearInterval(this.timerInterval);
    },

    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    },

    // ===== 胜利 =====
    onWin() {
        this.state = 'paused';
        this.stopTimer();

        const timeStr = this.formatTime(this.elapsedSeconds);

        // Calculate stars (based on moves efficiency)
        const totalPairs = this.currentLevel.pairs;
        const efficiency = totalPairs / Math.max(this.moveCount, 1);
        let stars = 1;
        if (efficiency > 0.9) stars = 3;
        else if (efficiency > 0.7) stars = 2;

        // Save progress
        const levelId = this.currentLevel.id;
        if (typeof levelId === 'number') {
            const prevStars = this.save.levelStars[levelId] || 0;
            this.save.levelStars[levelId] = Math.max(prevStars, stars);
            if (levelId >= this.save.currentLevel) {
                this.save.currentLevel = Math.min(levelId + 1, this.levels.length);
            }
            saveSave(this.save);
        }

        UI.showWinModal(
            levelId,
            stars,
            timeStr,
            this.moveCount,
            () => this.playNextLevel(),
            () => this.showMenu()
        );
    },

    playNextLevel() {
        const nextId = typeof this.currentLevel.id === 'number'
            ? this.currentLevel.id + 1
            : this.save.currentLevel;

        if (nextId <= this.levels.length) {
            this.elapsedSeconds = 0;
            this.startLevel(nextId);
        } else {
            this.showMenu();
        }
    },

    // ===== 关卡选择 =====
    showLevelSelect() {
        UI.showLevelSelectModal(
            this.levels,
            this.save,
            (levelId) => {
                this.elapsedSeconds = 0;
                this.startLevel(levelId);
            },
            () => {} // close - do nothing, menu is still behind
        );
    },

    // ===== 设置 =====
    showSettings() {
        UI.showSettingsModal(
            this.save.settings,
            (key, value) => {
                this.save.settings[key] = value;
                saveSave(this.save);
            },
            () => {}, // close
            () => this.clearAllData() // clear data
        );
    },

    // ===== 清除所有数据 =====
    clearAllData() {
        this.save = getDefaultSave();
        saveSave(this.save);
        this.showMenu();
    },
};

// ===== 窗口大小变化时重新渲染棋盘 =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (Game.state === 'playing') {
            Game.renderBoard();
        }
    }, 200);
});

// ===== 启动 =====
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
