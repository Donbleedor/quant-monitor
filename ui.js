/**
 * ui.js - UI 渲染层
 * 主菜单 / 游戏页 / 4 个 modal / toast 与特效
 * 视觉层只负责渲染与交互状态，不碰主逻辑。
 */
const ASSET = {
    gameplay: 'assets/gameplay/',
    menu:     'assets/menu/',
    modal:    'assets/modal/',
};

const UI = {
    app: null,
    _resizeObserver: null,
    _boundSyncScale: null,
    _resizeBound: false,

    init() {
        this.app = document.getElementById('app');
        if (!this.app) return;

        if (!this._boundSyncScale) {
            this._boundSyncScale = () => this._syncScale();
        }

        this._syncScale();

        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }

        if (typeof ResizeObserver !== 'undefined') {
            this._resizeObserver = new ResizeObserver(() => this._syncScale());
            this._resizeObserver.observe(this.app);
        }

        if (!this._resizeBound) {
            window.addEventListener('resize', this._boundSyncScale, { passive: true });
            window.addEventListener('orientationchange', this._boundSyncScale, { passive: true });
            this._resizeBound = true;
        }
    },

    _syncScale() {
        if (!this.app) return 1;
        const width = this.app.getBoundingClientRect().width || this.app.clientWidth || 360;
        const scale = Math.max(width / 360, 0.5);
        this.app.style.setProperty('--ui-scale', scale.toString());
        return scale;
    },

    _toolCountText(value) {
        const numeric = Number(value);
        return Number.isFinite(numeric) ? String(numeric) : String.fromCharCode(0x221e);
    },

    _setToggleState(button, on) {
        if (!button) return;
        button.classList.toggle('on', on);
        button.setAttribute('aria-pressed', on ? 'true' : 'false');
    },

    _makeToast(className, text) {
        document.querySelectorAll(`.${className}`).forEach(t => t.remove());
        const el = document.createElement('div');
        el.className = className;
        el.setAttribute('role', 'status');
        el.setAttribute('aria-live', 'polite');
        el.setAttribute('aria-atomic', 'true');
        el.textContent = text;
        (this.app || document.body).appendChild(el);
        return el;
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
                    <button class="btn-play" id="btnPlay" aria-label="Play">
                        <img class="btn-play-art" src="${ASSET.menu}button_play_large.png" alt="">
                    </button>
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
        this._syncScale();
        const levelText = (typeof levelId === 'number') ? `LV. ${levelId}` : levelId;
        this.app.innerHTML = `
            <div class="game-screen">
                <div class="top-bar">
                    <button class="btn-top btn-home" id="btnHome" aria-label="Home">
                        <img class="btn-top-icon" src="${ASSET.gameplay}icon_home.png" alt="">
                    </button>

                    <div class="hud-main" aria-label="Level and timer status">
                        <span class="hud-slot hud-slot-level" aria-hidden="true">
                            <img class="hud-icon" src="${ASSET.gameplay}icon_mask_level.png" alt="">
                        </span>
                        <div class="hud-readout">
                            <span id="levelLabel">${levelText}</span>
                            <span class="timer-display" id="timerDisplay">0:00</span>
                        </div>
                        <span class="hud-slot hud-slot-timer" aria-hidden="true">
                            <img class="hud-icon" src="${ASSET.gameplay}icon_timer.png" alt="">
                        </span>
                    </div>

                    <button class="btn-top btn-pause" id="btnPause" aria-label="Pause">
                        <img class="btn-top-icon" src="${ASSET.gameplay}icon_pause.png" alt="">
                    </button>
                </div>

                <div class="board-area" id="boardArea">
                    <div class="board-container" id="boardContainer"></div>
                </div>

                <div class="bottom-bar">
                    <button class="tool-btn ${tools.hint <= 0 ? 'disabled' : ''}" id="btnHint" aria-label="Hint">
                        <img class="tool-icon" src="${ASSET.gameplay}icon_undo.png" alt="">
                        <span class="tool-badge" id="hintBadge">${tools.hint}</span>
                    </button>
                    <button class="tool-btn ${tools.undo <= 0 ? 'disabled' : ''}" id="btnUndo" aria-label="Undo">
                        <img class="tool-icon" src="${ASSET.gameplay}icon_shuffle.png" alt="">
                        <span class="tool-badge" id="undoBadge">${tools.undo}</span>
                    </button>
                    <button class="tool-btn" id="btnShuffle" aria-label="Mix">
                        <img class="tool-icon" src="${ASSET.gameplay}tile_totem_23_cross_weave.png" alt="">
                        <span class="tool-badge" id="shuffleBadge">${this._toolCountText(tools.shuffle)}</span>
                    </button>
                </div>
            </div>
        `;
    },
    // 初始棋盘尺寸缓存，生成后固定，不随消除变化
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
        const scale = this._syncScale();
        const boardPadding = 16 * scale;
        const availW = areaRect.width  - boardPadding;
        const availH = areaRect.height - boardPadding;

        const layout = this._boardLayout;
        if (!layout) return;

        const gridW = layout.gridW;
        const gridH = layout.gridH;
        const maxZ  = layout.maxZ;

        const zOffsetPx = 4 * scale;
        const totalZOffset = maxZ * zOffsetPx;

        // 5:6 tile aspect (matches tile_base_ivory 168x201)
        const finalTileW = Math.max(1, Math.floor(Math.min(
            (availW - totalZOffset) / gridW,
            ((availH - totalZOffset) / gridH) * 168 / 201
        )));
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
        const el = this._makeToast('tip-toast', text);
        setTimeout(() => el.remove(), 1500);
    },

    updateToolbar(tools) {
        const hintBadge    = document.getElementById('hintBadge');
        const undoBadge    = document.getElementById('undoBadge');
        const shuffleBadge = document.getElementById('shuffleBadge');
        const btnHint      = document.getElementById('btnHint');
        const btnUndo      = document.getElementById('btnUndo');
        const btnShuffle   = document.getElementById('btnShuffle');

        if (hintBadge)    hintBadge.textContent    = this._toolCountText(tools.hint);
        if (undoBadge)    undoBadge.textContent    = this._toolCountText(tools.undo);
        if (shuffleBadge) shuffleBadge.textContent = this._toolCountText(tools.shuffle);

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
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
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
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
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
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');

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
                <button class="${cls}" data-level="${level.id}" type="button" aria-label="Level ${level.id}">
                    <img class="lock-icon" src="${ASSET.modal}icon_lock.png" alt="">
                    <span class="level-num">${level.id}</span>
                    <span class="level-stars">${starHTML}</span>
                </button>
            `;
        }

        overlay.innerHTML = `
            <div class="modal">
                <button class="modal-close" id="modalClose" type="button" aria-label="Close"><img src="${ASSET.modal}icon_close.png" alt=""></button>
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
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.innerHTML = `
            <div class="modal modal-compact settings-modal">
                <button class="modal-close" id="modalClose" type="button" aria-label="Close"><img src="${ASSET.modal}icon_close.png" alt=""></button>
                <div class="modal-content settings-content"></div>
            </div>
        `;
        this.app.appendChild(overlay);

        const content = overlay.querySelector('.modal-content');

        const renderSettingsView = () => {
            content.className = 'modal-content settings-content';
            content.innerHTML = `
                <h2>SETTINGS</h2>
                <div class="settings-list">
                    <div class="setting-row">
                        <span class="setting-label">Large Text</span>
                        <button class="toggle ${settings.largeFont ? 'on' : ''}" data-key="largeFont" type="button" aria-label="Large Text" aria-pressed="${settings.largeFont ? 'true' : 'false'}"></button>
                    </div>
                    <div class="setting-row">
                        <span class="setting-label">Contrast</span>
                        <button class="toggle ${settings.highContrast ? 'on' : ''}" data-key="highContrast" type="button" aria-label="Contrast" aria-pressed="${settings.highContrast ? 'true' : 'false'}"></button>
                    </div>
                </div>
                <div class="modal-btns">
                    <button class="btn-modal secondary reset-trigger" id="modalClearData" type="button">RESET PROGRESS</button>
                </div>
            `;

            content.querySelectorAll('.toggle').forEach(btn => {
                btn.onclick = () => {
                    const key = btn.dataset.key;
                    const nextState = !btn.classList.contains('on');
                    this._setToggleState(btn, nextState);
                    onToggle(key, nextState);
                };
            });

            const resetBtn = content.querySelector('#modalClearData');
            if (resetBtn) {
                resetBtn.onclick = () => renderResetView();
            }
        };

        const renderResetView = () => {
            content.className = 'modal-content reset-confirm-content';
            content.innerHTML = `
                <h2>RESET?</h2>
                <p class="modal-sub">All level progress will be cleared.</p>
                <div class="modal-btns reset-actions">
                    <button class="btn-modal secondary" id="resetCancel" type="button">CANCEL</button>
                    <button class="btn-modal primary danger" id="resetConfirm" type="button">RESET</button>
                </div>
            `;

            const cancelBtn = content.querySelector('#resetCancel');
            if (cancelBtn) {
                cancelBtn.onclick = () => renderSettingsView();
            }

            const confirmBtn = content.querySelector('#resetConfirm');
            if (confirmBtn) {
                confirmBtn.onclick = () => {
                    this._removeModal();
                    if (onClearData) onClearData();
                };
            }
        };

        renderSettingsView();

        document.getElementById('modalClose').onclick = () => { this._removeModal(); onClose(); };
    },

    // ===== Toast: 连击 =====
    showCombo(count) {
        const el = this._makeToast('combo-toast', `COMBO x${count}`);
        setTimeout(() => el.remove(), 1000);
    },

    // ===== Toast: 死局 =====
    showDeadlockToast() {
        const el = this._makeToast('deadlock-toast', 'No moves available - try MIX');
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
