/**
 * engine.js - 核心游戏引擎
 * 棋盘管理、自由牌判定、关卡生成、死局校验、消除逻辑
 */

class MahjongEngine {
    constructor() {
        this.tiles = [];       // Array of tile objects { id, typeId, x, y, z, isFree, removed }
        this.nextTileId = 0;
        this.moveHistory = []; // For undo: [{ tileA, tileB }]
    }

    _hasHorizontal3Run(positions) {
        if (!positions || positions.length < 3) return false;
        let topZ = -Infinity;
        for (const p of positions) {
            if (p.z > topZ) topZ = p.z;
        }
        const rows = new Map();
        for (const p of positions) {
            if (p.z !== topZ) continue;
            const z2 = Math.round(p.z * 2);
            const y2 = Math.round(p.y * 2);
            const x2 = Math.round(p.x * 2);
            const key = `${z2}:${y2}`;
            if (!rows.has(key)) rows.set(key, new Set());
            rows.get(key).add(x2);
        }
        for (const xs of rows.values()) {
            for (const x2 of xs) {
                if (xs.has(x2 + 2) && xs.has(x2 + 4)) return true;
            }
        }
        return false;
    }

    // ===== 关卡生成 =====
    generateLevel(levelConfig) {
        const { totalTiles, layoutIndex } = levelConfig;
        const template = LAYOUT_TEMPLATES[layoutIndex % LAYOUT_TEMPLATES.length];

        const baseTotal = Math.floor(totalTiles / 2) * 2;
        const maxTotal = Math.floor(baseTotal * 1.2 / 2) * 2;

        let desiredTotal = baseTotal;
        let positions = template.generate(desiredTotal);
        let layoutAttempts = 0;
        while (!this._hasHorizontal3Run(positions) && layoutAttempts < 60) {
            layoutAttempts++;
            positions = template.generate(desiredTotal);
            if (!this._hasHorizontal3Run(positions) && layoutAttempts % 15 === 0 && desiredTotal + 2 <= maxTotal) {
                desiredTotal += 2;
            }
        }

        // 确保位置数量是偶数
        if (positions.length % 2 !== 0) {
            positions.pop();
        }

        const pairCount = positions.length / 2;

        // 使用反向放置法生成保证可解的牌局
        let genAttempts = 0;
        let success = false;
        while (!success && genAttempts < 20) {
            genAttempts++;
            success = this._generateSolvableLayout(positions, pairCount);
        }

        // 如果反向放置失败，使用传统方法 + 回溯验证
        if (!success) {
            const typeIds = this._generatePairs(pairCount);
            this._shuffleArray(typeIds);
            this.tiles = [];
            this.nextTileId = 0;
            this.moveHistory = [];
            for (let i = 0; i < positions.length; i++) {
                this.tiles.push({
                    id: this.nextTileId++,
                    typeId: typeIds[i],
                    x: positions[i].x,
                    y: positions[i].y,
                    z: positions[i].z,
                    isFree: false,
                    removed: false,
                });
            }
            this.updateAllFreeStatus();
        }

        // 确保相邻层有跨层配对
        this._ensureCrossLayerPairs();
        this.updateAllFreeStatus();

        return this.tiles;
    }

    // 反向放置法：从空棋盘开始，每次找两个"可自由"的位置放同类型牌
    // 这样保证生成的牌局一定有解
    _generateSolvableLayout(positions, pairCount) {
        this.tiles = [];
        this.nextTileId = 0;
        this.moveHistory = [];

        // 创建所有位置的牌（先不分配类型）
        for (let i = 0; i < positions.length; i++) {
            this.tiles.push({
                id: i,
                typeId: -1,
                x: positions[i].x,
                y: positions[i].y,
                z: positions[i].z,
                isFree: false,
                removed: true, // 开始时全部"已移除"
            });
        }
        this.nextTileId = positions.length;

        // 按z从高到低、从外到内的顺序放置牌对
        // 先对位置排序：高层优先，同层则边缘优先
        const cx = 2.5, cy = 3.5;
        const sortedIndices = this.tiles.map((t, i) => i);
        sortedIndices.sort((a, b) => {
            const ta = this.tiles[a], tb = this.tiles[b];
            if (ta.z !== tb.z) return tb.z - ta.z; // 高层优先
            const distA = Math.abs(ta.x - cx) + Math.abs(ta.y - cy);
            const distB = Math.abs(tb.x - cx) + Math.abs(tb.y - cy);
            return distB - distA; // 边缘优先
        });

        const typeCount = TILE_TYPES.length;
        let typeIndex = 0;
        const placed = []; // 记录放置顺序（用于验证）

        // 逐对放置
        let remaining = [...sortedIndices];

        while (remaining.length >= 2) {
            // 找当前状态下的"自由位置"（如果放上去，该牌是自由的）
            // 即：没有更高层的牌压着它，且左右至少一侧开放
            const freePositions = [];
            for (const idx of remaining) {
                const tile = this.tiles[idx];
                tile.removed = false; // 临时放上
                // 检查是否自由
                const active = this.tiles.filter(t => !t.removed);
                const isFree = this._isTileFree(tile, active);
                tile.removed = true; // 恢复
                if (isFree) {
                    freePositions.push(idx);
                }
            }

            if (freePositions.length < 2) {
                // 无法找到2个自由位置，放置失败
                return false;
            }

            // 随机选2个自由位置
            this._shuffleArray(freePositions);
            const idx1 = freePositions[0];
            const idx2 = freePositions[1];

            const typeId = typeIndex % typeCount;
            typeIndex++;

            this.tiles[idx1].typeId = typeId;
            this.tiles[idx1].removed = false;
            this.tiles[idx2].typeId = typeId;
            this.tiles[idx2].removed = false;

            placed.push([idx1, idx2]);

            remaining = remaining.filter(i => i !== idx1 && i !== idx2);
        }

        // 所有牌都放置完毕
        this.updateAllFreeStatus();
        return true;
    }

    // Generate N pairs of tile types
    // Ensures adjacent layers share at least 2 matching pairs among free tiles
    _generatePairs(pairCount) {
        const typeCount = TILE_TYPES.length; // 34
        const typeIds = [];

        for (let i = 0; i < pairCount; i++) {
            const typeId = i % typeCount;
            typeIds.push(typeId, typeId); // pair
        }

        return typeIds;
    }

    // 确保每层有足够的可消除组数
    // 层数定义：最上层=1层，往下+1
    // 每层可消除组数 = max(5 - 层号, 1)
    _ensureCrossLayerPairs() {
        const active = this.tiles.filter(t => !t.removed);
        const layers = {};
        active.forEach(t => {
            layers[t.z] = layers[t.z] || [];
            layers[t.z].push(t);
        });

        // z值从高到低排序，最高z = 第1层
        const zLevels = Object.keys(layers).map(Number).sort((a, b) => b - a);

        for (let layerIdx = 0; layerIdx < zLevels.length; layerIdx++) {
            const z = zLevels[layerIdx];
            const layerNum = layerIdx + 1; // 最上层=1, 往下+1
            const requiredPairs = Math.max(5 - layerNum, 1);

            // 找该层的自由牌
            const freeTiles = layers[z].filter(t => t.isFree);
            
            // 统计该层自由牌中已有的配对数
            const typeCount = {};
            freeTiles.forEach(t => {
                typeCount[t.typeId] = (typeCount[t.typeId] || 0) + 1;
            });
            
            let existingPairs = 0;
            for (const count of Object.values(typeCount)) {
                existingPairs += Math.floor(count / 2);
            }

            // 如果配对数不够，调整牌型
            if (existingPairs < requiredPairs && freeTiles.length >= requiredPairs * 2) {
                const needed = requiredPairs - existingPairs;
                // 找没有配对的自由牌
                const unpaired = [];
                const pairedTypes = new Set();
                const typeGroups = {};
                freeTiles.forEach(t => {
                    typeGroups[t.typeId] = typeGroups[t.typeId] || [];
                    typeGroups[t.typeId].push(t);
                });
                
                for (const [typeId, tiles] of Object.entries(typeGroups)) {
                    if (tiles.length === 1) {
                        unpaired.push(tiles[0]);
                    }
                }

                // 将未配对的牌两两配对
                for (let n = 0; n + 1 < unpaired.length && n / 2 < needed; n += 2) {
                    unpaired[n + 1].typeId = unpaired[n].typeId;
                }
            }
        }

        // 同时确保相邻层之间有跨层配对
        for (let i = 0; i < zLevels.length - 1; i++) {
            const zHigh = zLevels[i];
            const zLow = zLevels[i + 1];

            const freeLow = (layers[zLow] || []).filter(t => t.isFree);
            const freeHigh = (layers[zHigh] || []).filter(t => t.isFree);

            if (freeLow.length === 0 || freeHigh.length === 0) continue;

            let crossPairs = 0;
            const usedLow = new Set();
            const usedHigh = new Set();

            for (const tl of freeLow) {
                if (usedLow.has(tl.id)) continue;
                for (const th of freeHigh) {
                    if (usedHigh.has(th.id)) continue;
                    if (tl.typeId === th.typeId) {
                        crossPairs++;
                        usedLow.add(tl.id);
                        usedHigh.add(th.id);
                        break;
                    }
                }
            }

            if (crossPairs < 2) {
                const needed = 2 - crossPairs;
                const unmatchedLow = freeLow.filter(t => !usedLow.has(t.id));
                const unmatchedHigh = freeHigh.filter(t => !usedHigh.has(t.id));

                for (let n = 0; n < needed && n < unmatchedLow.length && n < unmatchedHigh.length; n++) {
                    unmatchedHigh[n].typeId = unmatchedLow[n].typeId;
                }
            }
        }
    }

    // Reshuffle tile types on existing positions (keep positions, change types)
    _reshuffleTileTypes() {
        const activeTiles = this.tiles.filter(t => !t.removed);
        const types = activeTiles.map(t => t.typeId);
        this._shuffleArray(types);
        activeTiles.forEach((t, i) => { t.typeId = types[i]; });
    }

    // ===== 自由牌判定 (Free Tile Logic) =====
    // A tile is "free" if:
    // 1. No tile on top (z+) overlaps it
    // 2. Left side OR right side is clear (no adjacent tile in same z)

    updateAllFreeStatus() {
        const active = this.tiles.filter(t => !t.removed);
        for (const tile of active) {
            tile.isFree = this._isTileFree(tile, active);
            tile.isCovered = this._isCoveredFromAbove(tile, active);
        }
    }

    // Check if tile is covered by any tile from above (for visual dimming only)
    _isCoveredFromAbove(tile, activeTiles) {
        const EPS = 1e-6;
        const overlapLen = (a0, a1, b0, b1) => Math.min(a1, b1) - Math.max(a0, b0);
        return activeTiles.some(other => {
            if (other === tile || other.removed) return false;
            if (other.z <= tile.z) return false;
            return (
                overlapLen(tile.x, tile.x + 1, other.x, other.x + 1) > EPS &&
                overlapLen(tile.y, tile.y + 1, other.y, other.y + 1) > EPS
            );
        });
    }

    _isTileFree(tile, activeTiles) {
        const EPS = 1e-6;
        const overlapLen = (a0, a1, b0, b1) => Math.min(a1, b1) - Math.max(a0, b0);
        const overlaps = (a, b) => (
            overlapLen(a.x, a.x + 1, b.x, b.x + 1) > EPS &&
            overlapLen(a.y, a.y + 1, b.y, b.y + 1) > EPS
        );

        const hasTileOnTop = activeTiles.some(other => {
            if (other === tile || other.removed) return false;
            if (other.z <= tile.z) return false;
            return overlaps(tile, other);
        });
        if (hasTileOnTop) return false;

        const yOverlaps = (a, b) => overlapLen(a.y, a.y + 1, b.y, b.y + 1) > EPS;

        const hasLeftNeighbor = activeTiles.some(other => {
            if (other === tile || other.removed) return false;
            if (other.z !== tile.z) return false;
            if (!yOverlaps(tile, other)) return false;
            return other.x < tile.x && other.x + 1 > tile.x - EPS;
        });

        const hasRightNeighbor = activeTiles.some(other => {
            if (other === tile || other.removed) return false;
            if (other.z !== tile.z) return false;
            if (!yOverlaps(tile, other)) return false;
            return other.x > tile.x && other.x < tile.x + 1 + EPS;
        });

        return !hasLeftNeighbor || !hasRightNeighbor;
    }

    // ===== 匹配与消除 =====
    canMatch(tileA, tileB) {
        if (!tileA || !tileB) return false;
        if (tileA.id === tileB.id) return false;
        if (tileA.removed || tileB.removed) return false;
        if (!tileA.isFree || !tileB.isFree) return false;
        return tileA.typeId === tileB.typeId;
    }

    removePair(tileA, tileB) {
        if (!this.canMatch(tileA, tileB)) return false;

        // Save to history for undo
        this.moveHistory.push({
            tileA: { ...tileA },
            tileB: { ...tileB },
        });

        tileA.removed = true;
        tileB.removed = true;

        // Recalculate free status
        this.updateAllFreeStatus();

        return true;
    }

    // ===== 撤销 =====
    undo() {
        if (this.moveHistory.length === 0) return null;

        const move = this.moveHistory.pop();

        // Restore tiles
        const tileA = this.tiles.find(t => t.id === move.tileA.id);
        const tileB = this.tiles.find(t => t.id === move.tileB.id);

        if (tileA) {
            tileA.removed = false;
            tileA.typeId = move.tileA.typeId;
        }
        if (tileB) {
            tileB.removed = false;
            tileB.typeId = move.tileB.typeId;
        }

        this.updateAllFreeStatus();
        return { tileA, tileB };
    }

    // ===== 洗牌 (Shuffle) =====
    shuffle() {
        // 使用反向放置法重新分配牌型，保证可解
        const active = this.tiles.filter(t => !t.removed);
        if (active.length < 2) return;

        // 确保剩余牌数是偶数
        const positions = active.map(t => ({ x: t.x, y: t.y, z: t.z, id: t.id }));
        
        // 保存当前状态
        const savedTypes = active.map(t => t.typeId);
        
        // 尝试反向放置法
        const tempTiles = positions.map((p, i) => ({
            id: p.id,
            typeId: -1,
            x: p.x,
            y: p.y,
            z: p.z,
            isFree: false,
            removed: true,
        }));

        const cx = 2.5, cy = 3.5;
        const typeCount = TILE_TYPES.length;
        let typeIndex = Math.floor(Math.random() * typeCount); // 随机起始类型
        let remaining = tempTiles.map((_, i) => i);
        
        // 按高层优先、边缘优先排序
        remaining.sort((a, b) => {
            const ta = tempTiles[a], tb = tempTiles[b];
            if (ta.z !== tb.z) return tb.z - ta.z;
            const distA = Math.abs(ta.x - cx) + Math.abs(ta.y - cy);
            const distB = Math.abs(tb.x - cx) + Math.abs(tb.y - cy);
            return distB - distA;
        });

        let success = true;
        const pairs = [];

        while (remaining.length >= 2) {
            const freePositions = [];
            for (const idx of remaining) {
                const tile = tempTiles[idx];
                tile.removed = false;
                const actv = tempTiles.filter(t => !t.removed);
                const isFree = this._isTileFree(tile, actv);
                tile.removed = true;
                if (isFree) freePositions.push(idx);
            }

            if (freePositions.length < 2) {
                success = false;
                break;
            }

            this._shuffleArray(freePositions);
            const idx1 = freePositions[0];
            const idx2 = freePositions[1];

            const typeId = typeIndex % typeCount;
            typeIndex++;

            tempTiles[idx1].typeId = typeId;
            tempTiles[idx1].removed = false;
            tempTiles[idx2].typeId = typeId;
            tempTiles[idx2].removed = false;

            pairs.push([idx1, idx2]);
            remaining = remaining.filter(i => i !== idx1 && i !== idx2);
        }

        if (success && remaining.length === 0) {
            // 应用新的类型分配
            for (let i = 0; i < active.length; i++) {
                const matchTile = tempTiles.find(t => t.id === active[i].id);
                if (matchTile) active[i].typeId = matchTile.typeId;
            }
        } else {
            // 回退：简单洗牌
            this._shuffleArray(savedTypes);
            active.forEach((t, i) => { t.typeId = savedTypes[i]; });
        }

        this.updateAllFreeStatus();
        this._ensureCrossLayerPairs();
        this.updateAllFreeStatus();
    }

    // ===== 提示 (Hint) =====
    findHintPair() {
        const freeTiles = this.tiles.filter(t => !t.removed && t.isFree);

        for (let i = 0; i < freeTiles.length; i++) {
            for (let j = i + 1; j < freeTiles.length; j++) {
                if (freeTiles[i].typeId === freeTiles[j].typeId) {
                    return [freeTiles[i], freeTiles[j]];
                }
            }
        }
        return null;
    }

    // ===== 死局检测 =====
    isDeadlock() {
        return this.findHintPair() === null && this.getRemainingCount() > 0;
    }

    // ===== 胜利检测 =====
    isWin() {
        return this.getRemainingCount() === 0;
    }

    getRemainingCount() {
        return this.tiles.filter(t => !t.removed).length;
    }

    // ===== 回溯求解器 (验证是否有解) =====
    _hasSolution() {
        // Quick check: is there at least one matching free pair?
        return this.findHintPair() !== null;
    }

    // Full solver (backtracking) - used during generation
    _fullSolve(tiles) {
        const active = tiles.filter(t => !t.removed);
        if (active.length === 0) return true;

        // Find all free tiles
        const free = active.filter(t => this._isTileFree(t, active));

        // Find matching pairs among free tiles
        const pairs = [];
        for (let i = 0; i < free.length; i++) {
            for (let j = i + 1; j < free.length; j++) {
                if (free[i].typeId === free[j].typeId) {
                    pairs.push([free[i], free[j]]);
                }
            }
        }

        if (pairs.length === 0) return false;

        // Try each pair
        for (const [a, b] of pairs) {
            a.removed = true;
            b.removed = true;

            // Recalc free for remaining
            const remaining = tiles.filter(t => !t.removed);
            remaining.forEach(t => { t.isFree = this._isTileFree(t, remaining); });

            if (this._fullSolve(tiles)) {
                // Restore for caller
                a.removed = false;
                b.removed = false;
                remaining.forEach(t => { t.isFree = this._isTileFree(t, tiles.filter(tt => !tt.removed)); });
                return true;
            }

            a.removed = false;
            b.removed = false;
        }

        // Restore free status
        active.forEach(t => { t.isFree = this._isTileFree(t, active); });
        return false;
    }

    // ===== 获取牌面信息 =====
    getTileData(typeId) {
        if (typeId >= 0 && typeId < TILE_TYPES.length) {
            return TILE_TYPES[typeId];
        }
        return null;
    }

    getTileFace(typeId) {
        const data = this.getTileData(typeId);
        if (!data) return '?';
        // For numbered suits (wan/tong/tiao): show number + suit label
        if (data.num > 0) {
            return data.num + SUIT_LABELS[data.suit];
        }
        // For honor tiles: show the character name
        return data.name;
    }

    // ===== 工具函数 =====
    _shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    // Get tile by id
    getTileById(id) {
        return this.tiles.find(t => t.id === id) || null;
    }

    // Get active (non-removed) tiles sorted for rendering (low z first)
    getActiveTilesSorted() {
        return this.tiles
            .filter(t => !t.removed)
            .sort((a, b) => {
                if (a.z !== b.z) return a.z - b.z;
                if (a.y !== b.y) return a.y - b.y;
                return a.x - b.x;
            });
    }

    // Get board bounds for rendering (dynamic, based on remaining tiles)
    getBounds() {
        const active = this.tiles.filter(t => !t.removed);
        if (active.length === 0) return { minX: 0, maxX: 6, minY: 0, maxY: 8, maxZ: 0 };

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let maxZ = 0;

        for (const t of active) {
            if (t.x < minX) minX = t.x;
            if (t.x > maxX) maxX = t.x;
            if (t.y < minY) minY = t.y;
            if (t.y > maxY) maxY = t.y;
            if (t.z > maxZ) maxZ = t.z;
        }

        return { minX, maxX: maxX + 1, minY, maxY: maxY + 1, maxZ };
    }

    // Get initial board bounds (based on ALL tiles, called once at level start)
    getInitialBounds() {
        const all = this.tiles;
        if (all.length === 0) return { minX: 0, maxX: 6, minY: 0, maxY: 8, maxZ: 0 };

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let maxZ = 0;

        for (const t of all) {
            if (t.x < minX) minX = t.x;
            if (t.x > maxX) maxX = t.x;
            if (t.y < minY) minY = t.y;
            if (t.y > maxY) maxY = t.y;
            if (t.z > maxZ) maxZ = t.z;
        }

        return { minX, maxX: maxX + 1, minY, maxY: maxY + 1, maxZ };
    }
}
