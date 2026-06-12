/**
 * main.js - 游戏主控制器
 * 状态管理、事件绑定、游戏流程
 */

const Game = {
    engine: null,
    levels: [],
    save: null,
    state: 'menu', // 菜单、游戏中、暂停

    // 当前对局状态
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

    // 工具状态
    tools: { hint: 3, undo: 3, shuffle: Infinity },

    getUiTools() {
        return {
            ...this.tools,
            shuffle: '∞',
        };
    },

    syncAppSettings() {
        const app = UI.app || document.getElementById('app');
        if (!app || !this.save || !this.save.settings) return;

        const settings = this.save.settings;
        app.classList.toggle('large-font', !!settings.largeFont);
        app.classList.toggle('high-contrast', !!settings.highContrast);
        app.dataset.largeFont = settings.largeFont ? 'true' : 'false';
        app.dataset.highContrast = settings.highContrast ? 'true' : 'false';
        app.dataset.sfxEnabled = settings.sfx ? 'true' : 'false';
        app.dataset.bgmEnabled = settings.bgm ? 'true' : 'false';
    },

    clearTransientGameState() {
        this.selectedTile = null;
        this.hintTileIds = [];
        this.combo = 0;
        clearTimeout(this.hintTimer);
        this.hintTimer = null;
        clearTimeout(this.comboTimer);
        this.comboTimer = null;
        this.stopTimer();
    },

    init() {
        UI.init();
        this.engine = new MahjongEngine();
        this.levels = generateLevelList();
        this.save = loadSave();
        this.syncAppSettings();
        this.showMenu();
    },

    // ===== 主菜单 =====
    showMenu() {
        this.state = 'menu';
        this.clearTransientGameState();
        this.syncAppSettings();
        UI.renderMenu(
            this.save,
            () => this.playCurrentLevel(),
            () => this.showLevelSelect(),
            () => this.playDailyChallenge(),
            () => this.showSettings()
        );
    },

    // ===== 继续当前关卡 =====
    playCurrentLevel() {
        this.startLevel(this.save.currentLevel);
    },

    // ===== 开始指定关卡 =====
    startLevel(levelId) {
        const levelConfig = this.levels.find(l => l.id === levelId);
        if (!levelConfig) return;

        this.currentLevel = levelConfig;
        this.clearTransientGameState();
        this.moveCount = 0;
        this.elapsedSeconds = 0;
        this.state = 'playing';
        this.syncAppSettings();

        // 按难度重置道具
        if (levelConfig.difficulty === 'easy') {
            this.tools = { hint: 3, undo: 3, shuffle: Infinity };
        } else if (levelConfig.difficulty === 'medium') {
            this.tools = { hint: 2, undo: 3, shuffle: Infinity };
        } else {
            this.tools = { hint: 2, undo: 2, shuffle: Infinity };
        }

        // 生成关卡
        this.engine.generateLevel(levelConfig);

        // 渲染游戏界面
        UI.renderGameScreen(levelId, this.getUiTools());
        UI.initBoardLayout(this.engine);
        this.renderBoard();
        this.bindGameEvents();
        this.startTimer();
    },

    // ===== 每日挑战 =====
    playDailyChallenge() {
        // 使用当天日期作为每日挑战种子
        const today = new Date().toISOString().slice(0, 10);
        // 简单的种子计算
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
        this.clearTransientGameState();
        this.moveCount = 0;
        this.elapsedSeconds = 0;
        this.tools = { hint: 2, undo: 2, shuffle: Infinity };
        this.state = 'playing';
        this.syncAppSettings();

        this.engine.generateLevel(dailyConfig);

        UI.renderGameScreen('DAILY', this.getUiTools());
        UI.initBoardLayout(this.engine);
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

        if (btnHome) btnHome.onclick = () => this.returnToMenuFromGame();
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
        // 清除提示
        this.clearHint();

        // 如果牌块不可自由点击，则晃动提示
        if (!tile.isFree) {
            UI.animateWrongShake(tile.id);
            return;
        }

        // 还没有选中牌
        if (!this.selectedTile) {
            this.selectedTile = tile;
            this.renderBoard();
            return;
        }

        // 同一张牌，取消选择
        if (this.selectedTile.id === tile.id) {
            this.selectedTile = null;
            this.renderBoard();
            return;
        }

        // 不同牌，检查是否可匹配
        const tileA = this.selectedTile;
        const tileB = tile;

        if (this.engine.canMatch(tileA, tileB)) {
            // 匹配成功
            this.selectedTile = null;
            this.moveCount++;

            // 播放移除动画
            UI.animateMatch(tileA.id, tileB.id, () => {
                // 真正从引擎中移除
                this.engine.removePair(tileA, tileB);

                // 连击
                this.combo++;
                clearTimeout(this.comboTimer);
                this.comboTimer = setTimeout(() => { this.combo = 0; }, 3000);

                if (this.combo > 1) {
                    UI.showCombo(this.combo);
                }

                // 检查胜利
                if (this.engine.isWin()) {
                    this.onWin();
                    return;
                }

                // 检查死局
                if (this.engine.isDeadlock()) {
                    UI.showDeadlockToast();
                    // 高亮洗牌按钮
                    const btnShuffle = document.getElementById('btnShuffle');
                    if (btnShuffle) {
                        btnShuffle.style.animation = 'hintPulse 0.8s ease-in-out 3';
                        setTimeout(() => { if (btnShuffle) btnShuffle.style.animation = ''; }, 2500);
                    }
                }

                // 重新渲染棋盘
                this.renderBoard();
            });
        } else {
            // 未匹配，切换选择
            this.selectedTile = tileB;
            this.renderBoard();
        }
    },

    // ===== 道具：提示 =====
    useHint() {
        if (this.tools.hint <= 0 || this.state !== 'playing') return;

        const pair = this.engine.findHintPair();
        if (!pair) return;

        this.tools.hint--;
        this.selectedTile = null;
        this.hintTileIds = [pair[0].id, pair[1].id];

        UI.updateToolbar(this.getUiTools());
        this.renderBoard();

        // 3 秒后清除提示
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

    // ===== 道具：撤销 =====
    useUndo() {
        if (this.tools.undo <= 0 || this.state !== 'playing') return;

        const result = this.engine.undo();
        if (!result) return;

        this.tools.undo--;
        this.selectedTile = null;
        this.clearHint();
        this.moveCount = Math.max(0, this.moveCount - 1);

        UI.updateToolbar(this.getUiTools());
        this.renderBoard();
    },

    // ===== 道具：洗牌（无限使用） =====
    useShuffle() {
        if (this.state !== 'playing') return;

        this.selectedTile = null;
        this.clearHint();

        this.engine.shuffle();

        // 洗牌不消耗次数，支持无限使用
        UI.updateToolbar(this.getUiTools());
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
            () => this.returnToMenuFromGame()
        );
    },

    returnToMenuFromGame() {
        this.clearTransientGameState();
        this.state = 'menu';
        this.currentLevel = null;
        this.syncAppSettings();
        this.showMenu();
    },

    resumeGame() {
        this.state = 'playing';
        this.syncAppSettings();
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

        // 根据步数效率计算星级
        const totalPairs = this.currentLevel.pairs;
        const efficiency = totalPairs / Math.max(this.moveCount, 1);
        let stars = 1;
        if (efficiency > 0.9) stars = 3;
        else if (efficiency > 0.7) stars = 2;

        // 保存进度
        const levelId = this.currentLevel.id;
        if (typeof levelId === 'number') {
            const prevStars = this.save.levelStars[levelId] || 0;
            this.save.levelStars[levelId] = Math.max(prevStars, stars);
            if (levelId >= this.save.currentLevel) {
                this.save.currentLevel = Math.min(levelId + 1, this.levels.length);
            }
            saveSave(this.save);
        }

        const winLevelLabel = typeof levelId === 'number' ? levelId : 'DAILY';

        UI.showWinModal(
            winLevelLabel,
            stars,
            timeStr,
            this.moveCount,
            () => this.playNextLevel(),
            () => this.returnToMenuFromGame()
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
            () => {} // 关闭后不处理，菜单仍在后方
        );
    },

    showSettings() {
        UI.showSettingsModal(
            this.save.settings,
            (key, value) => {
                this.save.settings[key] = value;
                saveSave(this.save);
                this.syncAppSettings();
            },
            () => {}, // 关闭
            () => this.clearAllData() // 清除数据
        );
    },

    // ===== 清除所有数据 =====
    clearAllData() {
        this.save = getDefaultSave();
        saveSave(this.save);
        this.syncAppSettings();
        this.showMenu();
    },
};

// ===== 窗口尺寸变化时重新渲染棋盘 =====
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
