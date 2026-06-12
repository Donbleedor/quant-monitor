/**
 * ui.js - UI渲染层
 * 主界面、游戏界面、弹窗、特效
 */

const UI = {
    app: null,

    init() {
        this.app = document.getElementById('app');
    },

    // ===== 主界面 =====
    renderMenu(save, onPlay, onLevels, onDaily, onSettings) {
        this.app.innerHTML = `
            <div class="menu-screen">
                <div class="menu-bg"></div>
                <div class="menu-settings">
                    <button class="btn-icon-only" id="btnSettings">⚙️</button>
                </div>
                <div class="menu-logo">🀄</div>
                <div class="menu-title">麻将消除</div>
                <div class="menu-subtitle">Mahjong Tiles</div>
                <div class="menu-actions">
                    <button class="btn-play" id="btnPlay">开始游戏</button>
                    <div class="menu-row">
                        <button class="btn-menu" id="btnLevels">
                            <span class="btn-icon">🗺️</span>
                            <span class="btn-label">关卡选择</span>
                        </button>
                        <button class="btn-menu" id="btnDaily">
                            <span class="btn-icon">📅</span>
                            <span class="btn-label">每日挑战</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('btnPlay').onclick = onPlay;
        document.getElementById('btnLevels').onclick = onLevels;
        document.getElementById('btnDaily').onclick = onDaily;
        document.getElementById('btnSettings').onclick = onSettings;
    },

    // ===== 游戏界面 =====
    renderGameScreen(levelId, tools) {
        this.app.innerHTML = `
            <div class="game-screen">
                <div class="top-bar">
                    <div class="top-bar-left">
                        <button class="btn-top" id="btnHome">🏠</button>
                    </div>
                    <div class="top-bar-center">
                        <span id="levelLabel">Level ${levelId}</span>
                    </div>
                    <div class="top-bar-right">
                        <span class="timer-display" id="timerDisplay" style="display:none;">0:00</span>
                        <button class="btn-top" id="btnPause">⏸</button>
                    </div>
                </div>
                <div class="board-area" id="boardArea">
                    <div class="board-container" id="boardContainer"></div>
                </div>
                <div class="bottom-bar">
                    <button class="tool-btn ${tools.hint <= 0 ? 'disabled' : ''}" id="btnHint">
                        <span class="tool-icon">💡</span>
                        <span class="tool-label">提示</span>
                        <span class="tool-badge" id="hintBadge">${tools.hint}</span>
                    </button>
                    <button class="tool-btn ${tools.undo <= 0 ? 'disabled' : ''}" id="btnUndo">
                        <span class="tool-icon">↩️</span>
                        <span class="tool-label">撤销</span>
                        <span class="tool-badge" id="undoBadge">${tools.undo}</span>
                    </button>
                    <button class="tool-btn" id="btnShuffle">
                        <span class="tool-icon">🔄</span>
                        <span class="tool-label">洗牌</span>
                        <span class="tool-badge" id="shuffleBadge">∞</span>
                    </button>
                </div>
            </div>
        `;
    },

    // 初始棋盘尺寸缓存（生成后固定，不随消除变化）
    _boardLayout: null,

    // 初始化棋盘布局（只在关卡开始时调用一次）
    initBoardLayout(engine) {
        const bounds = engine.getInitialBounds();
        this._boardLayout = {
            minX: bounds.minX,
            minY: bounds.minY,
            maxX: bounds.maxX,
            maxY: bounds.maxY,
            maxZ: bounds.maxZ,
            gridW: bounds.maxX - bounds.minX,
            gridH: bounds.maxY - bounds.minY,
        };
    },

    // ===== 棋盘渲染 =====
    renderBoard(engine, selectedTileId, hintTileIds) {
        const container = document.getElementById('boardContainer');
        const boardArea = document.getElementById('boardArea');
        if (!container || !boardArea) return;

        const areaRect = boardArea.getBoundingClientRect();
        const availW = areaRect.width - 16;
        const availH = areaRect.height - 16;

        // 使用固定的初始布局尺寸
        const layout = this._boardLayout;
        if (!layout) return;

        const gridW = layout.gridW;
        const gridH = layout.gridH;
        const maxZ = layout.maxZ;

        // Calculate tile size to fit
        const zOffsetPx = 4;
        const totalZOffset = maxZ * zOffsetPx;

        const tileW = Math.min(
            Math.floor((availW - totalZOffset) / gridW),
            Math.floor((availH - totalZOffset) / gridH * 0.82),
            60
        );
        const tileH = Math.floor(tileW * 1.2);

        const finalTileW = Math.max(tileW, 42);
        const finalTileH = Math.max(tileH, 50);

        const boardW = gridW * finalTileW + maxZ * zOffsetPx;
        const boardH = gridH * finalTileH + maxZ * zOffsetPx;

        container.style.width = boardW + 'px';
        container.style.height = boardH + 'px';
        container.innerHTML = '';

        const tiles = engine.getActiveTilesSorted();
        const hintSet = new Set(hintTileIds || []);

        for (const tile of tiles) {
            // 使用固定的初始 minX/minY 作为偏移基准
            const px = (tile.x - layout.minX) * finalTileW + tile.z * zOffsetPx;
            const py = (tile.y - layout.minY) * finalTileH - tile.z * zOffsetPx;

            // Depth shadow element
            if (tile.z > 0) {
                const depth = document.createElement('div');
                depth.className = 'tile-depth';
                depth.style.left = (px - zOffsetPx) + 'px';
                depth.style.top = (py + zOffsetPx) + 'px';
                depth.style.width = finalTileW + 'px';
                depth.style.height = finalTileH + 'px';
                depth.style.zIndex = tile.z * 10 - 1;
                container.appendChild(depth);
            }

            // Tile element
            const el = document.createElement('div');
            el.className = 'tile';
            el.dataset.tileId = tile.id;

            if (tile.isCovered) {
                // 被上方牌压住 -> 置灰
                el.classList.add('blocked');
            } else if (tile.isFree) {
                // 可操作
                el.classList.add('free');
            } else {
                // 左右被阻挡但未被压住 -> 正常显示，不置灰
                el.classList.add('side-blocked');
            }

            if (tile.id === selectedTileId) {
                el.classList.add('selected');
            }

            if (hintSet.has(tile.id)) {
                el.classList.add('hint-glow');
            }

            el.style.left = px + 'px';
            el.style.top = py + 'px';
            el.style.width = finalTileW + 'px';
            el.style.height = finalTileH + 'px';
            el.style.zIndex = tile.z * 10 + Math.floor(tile.y);
            el.style.fontSize = Math.max(finalTileW * 0.5, 16) + 'px';

            // Render tile face with color
            const tileData = engine.getTileData(tile.typeId);
            const face = document.createElement('span');
            face.className = 'tile-face';

            if (tileData && tileData.num > 0) {
                // Numbered suit: number on top, suit label below
                face.innerHTML = `<span class="tile-num" style="color:${tileData.color}">${tileData.num}</span><span class="tile-suit" style="color:${tileData.color}">${SUIT_LABELS[tileData.suit]}</span>`;
            } else if (tileData) {
                // Honor tile: single character
                face.innerHTML = `<span class="tile-honor" style="color:${tileData.color}">${tileData.name}</span>`;
            } else {
                face.textContent = '?';
            }

            el.appendChild(face);

            container.appendChild(el);
        }
    },

    // ===== 牌消除动画 =====
    animateMatch(tileIdA, tileIdB, callback) {
        const elA = document.querySelector(`[data-tile-id="${tileIdA}"]`);
        const elB = document.querySelector(`[data-tile-id="${tileIdB}"]`);

        if (elA) elA.classList.add('matched');
        if (elB) elB.classList.add('matched');

        setTimeout(() => {
            if (elA) elA.remove();
            if (elB) elB.remove();
            if (callback) callback();
        }, 400);
    },

    // ===== 错误晃动 + 提示 =====
    animateWrongShake(tileId) {
        const el = document.querySelector(`[data-tile-id="${tileId}"]`);
        if (el) {
            el.classList.add('wrong-shake');
            setTimeout(() => el.classList.remove('wrong-shake'), 400);
        }
        // 显示"无法移动此棋子"提示
        this.showTip('无法移动此棋子');
    },

    // ===== 轻量提示 =====
    showTip(text) {
        // 移除已有的tip
        document.querySelectorAll('.tip-toast').forEach(t => t.remove());
        const el = document.createElement('div');
        el.className = 'tip-toast';
        el.textContent = text;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1500);
    },

    // ===== 更新工具栏 =====
    updateToolbar(tools) {
        const hintBadge = document.getElementById('hintBadge');
        const undoBadge = document.getElementById('undoBadge');
        const shuffleBadge = document.getElementById('shuffleBadge');
        const btnHint = document.getElementById('btnHint');
        const btnUndo = document.getElementById('btnUndo');
        const btnShuffle = document.getElementById('btnShuffle');

        if (hintBadge) hintBadge.textContent = tools.hint;
        if (undoBadge) undoBadge.textContent = tools.undo;
        if (shuffleBadge) shuffleBadge.textContent = tools.shuffle;

        if (btnHint) btnHint.classList.toggle('disabled', tools.hint <= 0);
        if (btnUndo) btnUndo.classList.toggle('disabled', tools.undo <= 0);
        if (btnShuffle) btnShuffle.classList.toggle('disabled', tools.shuffle <= 0);
    },

    // ===== 弹窗: 暂停 =====
    showPauseModal(onResume, onRestart, onHome) {
        this._removeModal();
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'gameModal';
        overlay.innerHTML = `
            <div class="modal">
                <h2>⏸ 游戏暂停</h2>
                <p class="modal-sub">休息一下吧</p>
                <div class="modal-btns">
                    <button class="btn-modal primary" id="modalResume">继续游戏</button>
                    <button class="btn-modal secondary" id="modalRestart">重新开始</button>
                    <button class="btn-modal secondary" id="modalHome">返回主页</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('modalResume').onclick = () => { this._removeModal(); onResume(); };
        document.getElementById('modalRestart').onclick = () => { this._removeModal(); onRestart(); };
        document.getElementById('modalHome').onclick = () => { this._removeModal(); onHome(); };
    },

    // ===== 弹窗: 胜利 =====
    showWinModal(levelId, stars, timeStr, moves, onNext, onHome) {
        this._removeModal();
        const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'gameModal';
        overlay.innerHTML = `
            <div class="modal">
                <h2>🎉 恭喜过关!</h2>
                <p class="modal-sub">Level ${levelId} 完成</p>
                <div class="stars-display">${starStr}</div>
                <div class="stats-row">
                    <div class="stat-card">
                        <div class="stat-label">用时</div>
                        <div class="stat-val">${timeStr}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">步数</div>
                        <div class="stat-val">${moves}</div>
                    </div>
                </div>
                <div class="modal-btns">
                    <button class="btn-modal primary" id="modalNext">下一关</button>
                    <button class="btn-modal secondary" id="modalHome">返回主页</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Confetti!
        this.showConfetti();

        document.getElementById('modalNext').onclick = () => { this._removeModal(); onNext(); };
        document.getElementById('modalHome').onclick = () => { this._removeModal(); onHome(); };
    },

    // ===== 弹窗: 关卡选择 =====
    showLevelSelectModal(levels, save, onSelectLevel, onClose) {
        this._removeModal();
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'gameModal';

        let gridHTML = '';
        for (const level of levels) {
            const stars = save.levelStars[level.id] || 0;
            const unlocked = level.id <= save.currentLevel;
            const isCurrent = level.id === save.currentLevel;

            let cls = 'level-node';
            if (!unlocked) cls += ' locked';
            else if (isCurrent) cls += ' current';
            else if (stars > 0) cls += ' completed';

            const starStr = stars > 0 ? '⭐'.repeat(stars) : '';

            gridHTML += `
                <div class="${cls}" data-level="${level.id}">
                    <span>${unlocked ? level.id : '🔒'}</span>
                    <span class="level-stars">${starStr}</span>
                </div>
            `;
        }

        overlay.innerHTML = `
            <div class="modal" style="max-width: 380px; width: 92%;">
                <h2>🗺️ 关卡选择</h2>
                <p class="modal-sub">选择关卡开始游戏</p>
                <div class="level-grid">${gridHTML}</div>
                <div class="modal-btns">
                    <button class="btn-modal secondary" id="modalClose">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Bind level clicks
        overlay.querySelectorAll('.level-node:not(.locked)').forEach(node => {
            node.onclick = () => {
                const lvl = parseInt(node.dataset.level);
                this._removeModal();
                onSelectLevel(lvl);
            };
        });

        document.getElementById('modalClose').onclick = () => { this._removeModal(); onClose(); };
    },

    // ===== 弹窗: 设置 =====
    showSettingsModal(settings, onToggle, onClose, onClearData) {
        this._removeModal();
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'gameModal';
        overlay.innerHTML = `
            <div class="modal">
                <h2>⚙️ 设置</h2>
                <div class="settings-list">
                    <div class="setting-row">
                        <span class="setting-label">🔊 音效</span>
                        <button class="toggle ${settings.sfx ? 'on' : ''}" data-key="sfx"></button>
                    </div>
                    <div class="setting-row">
                        <span class="setting-label">🎵 音乐</span>
                        <button class="toggle ${settings.bgm ? 'on' : ''}" data-key="bgm"></button>
                    </div>
                    <div class="setting-row">
                        <span class="setting-label">🔤 超大字体</span>
                        <button class="toggle ${settings.largeFont ? 'on' : ''}" data-key="largeFont"></button>
                    </div>
                    <div class="setting-row">
                        <span class="setting-label">🌓 高对比度</span>
                        <button class="toggle ${settings.highContrast ? 'on' : ''}" data-key="highContrast"></button>
                    </div>
                </div>
                <div class="modal-btns">
                    <button class="btn-modal primary" id="modalClose">完成</button>
                    <button class="btn-modal secondary" id="modalClearData" style="color:#ff6b6b; border-color:rgba(255,107,107,0.3);">🗑️ 清除数据（重新开始）</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelectorAll('.toggle').forEach(btn => {
            btn.onclick = () => {
                const key = btn.dataset.key;
                btn.classList.toggle('on');
                onToggle(key, btn.classList.contains('on'));
            };
        });

        document.getElementById('modalClose').onclick = () => { this._removeModal(); onClose(); };
        document.getElementById('modalClearData').onclick = () => {
            if (confirm('确定要清除所有关卡数据吗？这将重置所有进度，从第1关重新开始。')) {
                this._removeModal();
                if (onClearData) onClearData();
            }
        };
    },

    // ===== Toast: 连击 =====
    showCombo(count) {
        const el = document.createElement('div');
        el.className = 'combo-toast';
        el.textContent = `🔥 ${count} 连击!`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    },

    // ===== Toast: 死局提示 =====
    showDeadlockToast() {
        const el = document.createElement('div');
        el.className = 'deadlock-toast';
        el.textContent = '😅 没有可移动的牌了，试试洗牌吧！';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2600);
    },

    // ===== 撒花特效 =====
    showConfetti() {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        const colors = ['#ffd700', '#ff6b6b', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'];
        for (let i = 0; i < 40; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = Math.random() * 0.8 + 's';
            piece.style.animationDuration = (1.5 + Math.random()) + 's';
            container.appendChild(piece);
        }

        setTimeout(() => container.remove(), 3000);
    },

    // ===== 移除弹窗 =====
    _removeModal() {
        const existing = document.getElementById('gameModal');
        if (existing) existing.remove();
        // Also remove confetti
        document.querySelectorAll('.confetti-container').forEach(c => c.remove());
    },
};
