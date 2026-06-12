/**
 * ui.js - UI 渲染层
 * 主菜单 / 游戏页 / 4 个 modal / toast 与特效
 *
 * 美术换皮版:全部 emoji / Unicode 文字牌面已替换为 PNG 多层渲染。
 */

const ASSET = {
    gameplay: 'assets/gameplay/',
    menu:     'assets/menu/',
    modal:    'assets/modal/',
};

const UI = {
    app: null,

    init() {
        this.app = document.getElementById('app');
    },

    // ===== 主菜单 =====
    renderMenu(save, onPlay, onLevels, onDaily, onSettings) {
        this.app.innerHTML = `
            <div class="menu-screen">
                <div class="menu-vignette-top"></div>
                <div class="menu-vignette-bottom"></div>

                <div class="menu-settings">
                    <button class="btn-icon-only" id="btnSettings" aria-label="Settings">
                        <img src="${ASSET.menu}icon_settings.png" alt="">
                    </button>
                </div>

                <div class="menu-logo-wrap">
                    <img src="${ASSET.menu}logo_tribal_tiles.png" alt="Tribal Tiles">
                </div>

                <div class="menu-actions">
                    <button class="btn-play" id="btnPlay" aria-label="Play">PLAY</button>
                    <div class="menu-row">
                        <button class="btn-menu" id="btnLevels" aria-label="Levels">
                            <img class="btn-icon" src="${ASSET.menu}icon_levels.png" alt="">
                            <span class="btn-label">LEVELS</span>
                        </button>
                        <button class="btn-menu" id="btnDaily" aria-label="Daily">
                            <img class="btn-icon" src="${ASSET.menu}icon_daily.png" alt="">
                            <span class="btn-label">DAILY</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('btnPlay').onclick     = onPlay;
        document.getElementById('btnLevels').onclick   = onLevels;
        document.getElementById('btnDaily').onclick    = onDaily;
        document.getElementById('btnSettings').onclick = onSettings;
    },

    // ===== 游戏界面 =====
    renderGameScreen(levelId, tools) {
        const levelText = (typeof levelId === 'number') ? `Lv. ${levelId}` : levelId;
        this.app.innerHTML = `
            <div class="game-screen">
                <div class="top-bar">
                    <div class="top-bar-left">
                        <button class="btn-top btn-home" id="btnHome" aria-label="Home">
                            <img class="btn-top-icon" src="${ASSET.gameplay}icon_home.png" alt="">
                        </button>
                    </div>

                    <div class="hud-center">
                        <span class="hud-level">
                            <img class="hud-icon" src="${ASSET.gameplay}icon_mask_level.png" alt="">
                            <span id="levelLabel">${levelText}</span>
                        </span>
                        <span class="hud-timer">
                            <img class="hud-icon" src="${ASSET.gameplay}icon_timer.png" alt="">
                            <span class="timer-display" id="timerDisplay">0:00</span>
                        </span>
                    </div>

                    <div class="top-bar-right">
                        <button class="btn-top btn-pause" id="btnPause" aria-label="Pause">
                            <img class="btn-top-icon" src="${ASSET.gameplay}icon_pause.png" alt="">
                        </button>
                    </div>
                </div>

                <div class="board-area" id="boardArea">
                    <div class="board-container" id="boardContainer"></div>
                </div>

                <div class="bottom-bar">
                    <button class="tool-btn ${tools.hint <= 0 ? 'disabled' : ''}" id="btnHint" aria-label="Hint">
                        <img class="tool-icon" src="${ASSET.gameplay}icon_hint.png" alt="">
                        <span class="tool-label">HINT</span>
                        <span class="tool-badge" id="hintBadge">${tools.hint}</span>
                    </button>
                    <button class="tool-btn ${tools.undo <= 0 ? 'disabled' : ''}" id="btnUndo" aria-label="Undo">
                        <img class="tool-icon" src="${ASSET.gameplay}icon_undo.png" alt="">
                        <span class="tool-label">UNDO</span>
                        <span class="tool-badge" id="undoBadge">${tools.undo}</span>
                    </button>
                    <button class="tool-btn" id="btnShuffle" aria-label="Mix">
                        <img class="tool-icon" src="${ASSET.gameplay}icon_shuffle.png" alt="">
                        <span class="tool-label">MIX</span>
                        <span class="tool-badge" id="shuffleBadge">∞</span>
                    </button>
                </div>
            </div>
        `;
    },

    // 初始棋盘尺寸缓存（生成后固定，不随消除变化）
    _boardLayout: null,

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
        const availW = areaRect.width  - 16;
        const availH = areaRect.height - 16;

        const layout = this._boardLayout;
        if (!layout) return;

        const gridW = layout.gridW;
        const gridH = layout.gridH;
        const maxZ  = layout.maxZ;

        const zOffsetPx = 4;
        const totalZOffset = maxZ * zOffsetPx;

        // 5:6 tile aspect (matches tile_base_ivory 168x201)
        const tileWFromW = Math.floor((availW - totalZOffset) / gridW);
        const tileHFromH = Math.floor((availH - totalZOffset) / gridH);
        const tileW = Math.min(tileWFromW, Math.floor(tileHFromH * 168 / 201), 64);
        const finalTileW = Math.max(tileW, 36);
        const finalTileH = Math.round(finalTileW * 201 / 168);

        const boardW = gridW * finalTileW + maxZ * zOffsetPx;
        const boardH = gridH * finalTileH + maxZ * zOffsetPx;

        container.style.width  = boardW + 'px';
        container.style.height = boardH + 'px';
        container.innerHTML = '';

        const tiles = engine.getActiveTilesSorted();
        const hintSet = new Set(hintTileIds || []);

        for (const tile of tiles) {
            const px = (tile.x - layout.minX) * finalTileW + tile.z * zOffsetPx;
            const py = (tile.y - layout.minY) * finalTileH - tile.z * zOffsetPx;

            // depth shadow under each stacked tile
            if (tile.z > 0) {
                const depth = document.createElement('div');
                depth.className = 'tile-depth';
                depth.style.left   = (px - zOffsetPx) + 'px';
                depth.style.top    = (py + zOffsetPx) + 'px';
                depth.style.width  = finalTileW + 'px';
                depth.style.height = finalTileH + 'px';
                depth.style.zIndex = tile.z * 10 - 1;
                container.appendChild(depth);
            }

            const el = document.createElement('div');
            el.className = 'tile';
            el.dataset.tileId = tile.id;

            if (tile.isCovered) {
                el.classList.add('blocked', 'covered');
            } else if (tile.isFree) {
                el.classList.add('free');
            } else {
                el.classList.add('side-blocked');
            }

            if (tile.id === selectedTileId) el.classList.add('selected');
            if (hintSet.has(tile.id))       el.classList.add('hint-glow');

            el.style.left   = px + 'px';
            el.style.top    = py + 'px';
            el.style.width  = finalTileW + 'px';
            el.style.height = finalTileH + 'px';
            el.style.zIndex = tile.z * 10 + Math.floor(tile.y);

            // totem image layer
            const tileData = engine.getTileData(tile.typeId);
            if (tileData && tileData.imagePath) {
                const totem = document.createElement('img');
                totem.className = 'tile-totem';
                totem.src = tileData.imagePath;
                totem.alt = tileData.name || '';
                totem.draggable = false;
                el.appendChild(totem);
            }

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

    animateWrongShake(tileId) {
        const el = document.querySelector(`[data-tile-id="${tileId}"]`);
        if (el) {
            el.classList.add('wrong-shake');
            setTimeout(() => el.classList.remove('wrong-shake'), 400);
        }
        this.showTip("Can't move this tile");
    },

    showTip(text) {
        document.querySelectorAll('.tip-toast').forEach(t => t.remove());
        const el = document.createElement('div');
        el.className = 'tip-toast';
        el.textContent = text;
        (this.app || document.body).appendChild(el);
        setTimeout(() => el.remove(), 1500);
    },

    updateToolbar(tools) {
        const hintBadge    = document.getElementById('hintBadge');
        const undoBadge    = document.getElementById('undoBadge');
        const shuffleBadge = document.getElementById('shuffleBadge');
        const btnHint      = document.getElementById('btnHint');
        const btnUndo      = document.getElementById('btnUndo');
        const btnShuffle   = document.getElementById('btnShuffle');

        if (hintBadge)    hintBadge.textContent    = tools.hint;
        if (undoBadge)    undoBadge.textContent    = tools.undo;
        if (shuffleBadge) shuffleBadge.textContent = tools.shuffle ?? '∞';

        if (btnHint)    btnHint.classList.toggle('disabled',    tools.hint <= 0);
        if (btnUndo)    btnUndo.classList.toggle('disabled',    tools.undo <= 0);
        // shuffle is unlimited; never disabled
    },

    // ===== Modal: 暂停 =====
    showPauseModal(onResume, onRestart, onHome) {
        this._removeModal();
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'gameModal';
        overlay.innerHTML = `
            <div class="modal modal-compact">
                <div class="modal-content">
                    <h2>PAUSED</h2>
                    <p class="modal-sub">Take a breath</p>
                    <div class="modal-btns">
                        <button class="btn-modal primary" id="modalResume">
                            <img class="btn-modal-icon" src="${ASSET.modal}icon_resume.png" alt="">
                            RESUME
                        </button>
                        <button class="btn-modal secondary" id="modalRestart">
                            <img class="btn-modal-icon" src="${ASSET.modal}icon_restart.png" alt="">
                            RESTART
                        </button>
                        <button class="btn-modal secondary" id="modalHome">
                            <img class="btn-modal-icon" src="${ASSET.modal}icon_home.png" alt="">
                            HOME
                        </button>
                    </div>
                </div>
            </div>
        `;
        this.app.appendChild(overlay);

        document.getElementById('modalResume').onclick  = () => { this._removeModal(); onResume(); };
        document.getElementById('modalRestart').onclick = () => { this._removeModal(); onRestart(); };
        document.getElementById('modalHome').onclick    = () => { this._removeModal(); onHome(); };
    },

    // ===== Modal: 胜利 =====
    showWinModal(levelId, stars, timeStr, moves, onNext, onHome) {
        this._removeModal();

        let starsHTML = '';
        for (let i = 0; i < 3; i++) {
            const dim = i >= stars ? 'dim' : '';
            starsHTML += `<img class="${dim}" src="${ASSET.modal}icon_star.png" alt="">`;
        }

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'gameModal';
        overlay.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <h2>VICTORY</h2>
                    <p class="modal-sub">${typeof levelId === 'number' ? 'Level ' + levelId + ' complete' : levelId + ' complete'}</p>
                    <div class="stars-display">${starsHTML}</div>
                    <div class="stats-row">
                        <div class="stat-card">
                            <div class="stat-label">TIME</div>
                            <div class="stat-val">${timeStr}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">MOVES</div>
                            <div class="stat-val">${moves}</div>
                        </div>
                    </div>
                    <div class="modal-btns">
                        <button class="btn-modal primary" id="modalNext">
                            <img class="btn-modal-icon" src="${ASSET.modal}icon_next.png" alt="">
                            NEXT
                        </button>
                        <button class="btn-modal secondary" id="modalHome">
                            <img class="btn-modal-icon" src="${ASSET.modal}icon_home.png" alt="">
                            HOME
                        </button>
                    </div>
                </div>
            </div>
        `;
        this.app.appendChild(overlay);

        this.showConfetti();

        document.getElementById('modalNext').onclick = () => { this._removeModal(); onNext(); };
        document.getElementById('modalHome').onclick = () => { this._removeModal(); onHome(); };
    },

    // ===== Modal: 关卡选择 =====
    showLevelSelectModal(levels, save, onSelectLevel, onClose) {
        this._removeModal();
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'gameModal';

        let gridHTML = '';
        for (const level of levels) {
            const stars     = save.levelStars[level.id] || 0;
            const unlocked  = level.id <= save.currentLevel;
            const isCurrent = level.id === save.currentLevel;

            let cls = 'level-node';
            if (!unlocked)      cls += ' locked';
            else if (isCurrent) cls += ' current';
            else if (stars > 0) cls += ' completed';

            let starHTML = '';
            for (let i = 0; i < 3; i++) {
                if (i < stars) starHTML += `<img src="${ASSET.modal}icon_star.png" alt="">`;
            }

            gridHTML += `
                <button class="${cls}" data-level="${level.id}">
                    <img class="lock-icon" src="${ASSET.modal}icon_lock.png" alt="">
                    <span class="level-num">${level.id}</span>
                    <span class="level-stars">${starHTML}</span>
                </button>
            `;
        }

        overlay.innerHTML = `
            <div class="modal">
                <button class="modal-close" id="modalClose"><img src="${ASSET.modal}icon_close.png" alt=""></button>
                <div class="modal-content">
                    <h2>LEVELS</h2>
                    <p class="modal-sub">Choose a level</p>
                    <div class="level-grid">${gridHTML}</div>
                </div>
            </div>
        `;
        this.app.appendChild(overlay);

        overlay.querySelectorAll('.level-node:not(.locked)').forEach(node => {
            node.onclick = () => {
                const lvl = parseInt(node.dataset.level);
                this._removeModal();
                onSelectLevel(lvl);
            };
        });

        document.getElementById('modalClose').onclick = () => { this._removeModal(); onClose(); };
    },

    // ===== Modal: 设置 =====
    showSettingsModal(settings, onToggle, onClose, onClearData) {
        this._removeModal();
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'gameModal';
        overlay.innerHTML = `
            <div class="modal modal-compact">
                <button class="modal-close" id="modalClose"><img src="${ASSET.modal}icon_close.png" alt=""></button>
                <div class="modal-content">
                    <h2>SETTINGS</h2>
                    <div class="settings-list">
                        <div class="setting-row">
                            <span class="setting-label">SFX</span>
                            <button class="toggle ${settings.sfx ? 'on' : ''}" data-key="sfx"></button>
                        </div>
                        <div class="setting-row">
                            <span class="setting-label">Music</span>
                            <button class="toggle ${settings.bgm ? 'on' : ''}" data-key="bgm"></button>
                        </div>
                        <div class="setting-row">
                            <span class="setting-label">Large Text</span>
                            <button class="toggle ${settings.largeFont ? 'on' : ''}" data-key="largeFont"></button>
                        </div>
                        <div class="setting-row">
                            <span class="setting-label">Contrast</span>
                            <button class="toggle ${settings.highContrast ? 'on' : ''}" data-key="highContrast"></button>
                        </div>
                    </div>
                    <div class="modal-btns">
                        <button class="btn-modal secondary" id="modalClearData" style="color:#ff9b8a;">RESET PROGRESS</button>
                    </div>
                </div>
            </div>
        `;
        this.app.appendChild(overlay);

        overlay.querySelectorAll('.toggle').forEach(btn => {
            btn.onclick = () => {
                const key = btn.dataset.key;
                btn.classList.toggle('on');
                onToggle(key, btn.classList.contains('on'));
            };
        });

        document.getElementById('modalClose').onclick = () => { this._removeModal(); onClose(); };
        document.getElementById('modalClearData').onclick = () => {
            if (confirm('Reset all level progress and start over from level 1?')) {
                this._removeModal();
                if (onClearData) onClearData();
            }
        };
    },

    // ===== Toast: 连击 =====
    showCombo(count) {
        const el = document.createElement('div');
        el.className = 'combo-toast';
        el.textContent = `COMBO ×${count}`;
        (this.app || document.body).appendChild(el);
        setTimeout(() => el.remove(), 1000);
    },

    // ===== Toast: 死局 =====
    showDeadlockToast() {
        const el = document.createElement('div');
        el.className = 'deadlock-toast';
        el.textContent = 'No moves available — try MIX';
        (this.app || document.body).appendChild(el);
        setTimeout(() => el.remove(), 2600);
    },

    // ===== 撒花 =====
    showConfetti() {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        (this.app || document.body).appendChild(container);

        const colors = ['#F4C95D', '#D6A648', '#B65A22', '#2F7A4B', '#173650', '#E9DAB6'];
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

    _removeModal() {
        const existing = document.getElementById('gameModal');
        if (existing) existing.remove();
        document.querySelectorAll('.confetti-container').forEach(c => c.remove());
    },
};
