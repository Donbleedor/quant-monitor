/**
 * data.js - 牌型定义、关卡配置、布局模板
 */

// ===== 牌型定义 (34种) =====
// 使用 HTML 渲染牌面，确保所有平台可见
const TILE_TYPES = [
    // 万 (Characters) 1-9 - 红色
    { id: 0,  suit: 'wan',  num: 1, name: '一万', color: '#c41e3a' },
    { id: 1,  suit: 'wan',  num: 2, name: '二万', color: '#c41e3a' },
    { id: 2,  suit: 'wan',  num: 3, name: '三万', color: '#c41e3a' },
    { id: 3,  suit: 'wan',  num: 4, name: '四万', color: '#c41e3a' },
    { id: 4,  suit: 'wan',  num: 5, name: '五万', color: '#c41e3a' },
    { id: 5,  suit: 'wan',  num: 6, name: '六万', color: '#c41e3a' },
    { id: 6,  suit: 'wan',  num: 7, name: '七万', color: '#c41e3a' },
    { id: 7,  suit: 'wan',  num: 8, name: '八万', color: '#c41e3a' },
    { id: 8,  suit: 'wan',  num: 9, name: '九万', color: '#c41e3a' },
    // 筒 (Dots) 1-9 - 蓝色
    { id: 9,  suit: 'tong', num: 1, name: '一筒', color: '#1a6fb5' },
    { id: 10, suit: 'tong', num: 2, name: '二筒', color: '#1a6fb5' },
    { id: 11, suit: 'tong', num: 3, name: '三筒', color: '#1a6fb5' },
    { id: 12, suit: 'tong', num: 4, name: '四筒', color: '#1a6fb5' },
    { id: 13, suit: 'tong', num: 5, name: '五筒', color: '#1a6fb5' },
    { id: 14, suit: 'tong', num: 6, name: '六筒', color: '#1a6fb5' },
    { id: 15, suit: 'tong', num: 7, name: '七筒', color: '#1a6fb5' },
    { id: 16, suit: 'tong', num: 8, name: '八筒', color: '#1a6fb5' },
    { id: 17, suit: 'tong', num: 9, name: '九筒', color: '#1a6fb5' },
    // 条 (Bamboo) 1-9 - 绿色
    { id: 18, suit: 'tiao', num: 1, name: '一条', color: '#2d8a4e' },
    { id: 19, suit: 'tiao', num: 2, name: '二条', color: '#2d8a4e' },
    { id: 20, suit: 'tiao', num: 3, name: '三条', color: '#2d8a4e' },
    { id: 21, suit: 'tiao', num: 4, name: '四条', color: '#2d8a4e' },
    { id: 22, suit: 'tiao', num: 5, name: '五条', color: '#2d8a4e' },
    { id: 23, suit: 'tiao', num: 6, name: '六条', color: '#2d8a4e' },
    { id: 24, suit: 'tiao', num: 7, name: '七条', color: '#2d8a4e' },
    { id: 25, suit: 'tiao', num: 8, name: '八条', color: '#2d8a4e' },
    { id: 26, suit: 'tiao', num: 9, name: '九条', color: '#2d8a4e' },
    // 字牌 (Honors)
    { id: 27, suit: 'feng', num: 0, name: '东', color: '#1a1a2e' },
    { id: 28, suit: 'feng', num: 0, name: '南', color: '#1a1a2e' },
    { id: 29, suit: 'feng', num: 0, name: '西', color: '#1a1a2e' },
    { id: 30, suit: 'feng', num: 0, name: '北', color: '#1a1a2e' },
    { id: 31, suit: 'jian', num: 0, name: '中', color: '#c41e3a' },
    { id: 32, suit: 'jian', num: 0, name: '发', color: '#2d8a4e' },
    { id: 33, suit: 'jian', num: 0, name: '白', color: '#666666' },
];

// 花色符号映射
const SUIT_LABELS = {
    wan:  '万',
    tong: '筒',
    tiao: '条',
    feng: '',
    jian: '',
};

// Emoji fallback (for systems that don't render mahjong unicode well)
const TILE_EMOJI_FALLBACK = [
    '🍎','🍊','🍋','🍇','🍉','🍓','🍒','🍑','🥝',
    '🌸','🌺','🌻','🌹','🌷','💐','🌼','🪷','🌿',
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨',
    '⭐','🌙','☀️','🔥','💧','❄️','🌈',
];

// ===== 关卡难度配置 =====
const LEVEL_CONFIGS = {
    // 简单: 30-35组 (60-70张牌)
    easy:   { minPairs: 30, maxPairs: 35, maxLayers: 3, label: '简单' },
    // 中等: 36-42组 (72-84张牌)
    medium: { minPairs: 36, maxPairs: 42, maxLayers: 4, label: '中等' },
    // 困难: 43-50组 (86-100张牌)
    hard:   { minPairs: 43, maxPairs: 50, maxLayers: 4, label: '困难' },
};

// 关卡列表 (50关 MVP)
function generateLevelList() {
    const levels = [];
    for (let i = 1; i <= 50; i++) {
        let diff;
        if (i <= 15) diff = 'easy';
        else if (i <= 35) diff = 'medium';
        else diff = 'hard';

        const cfg = LEVEL_CONFIGS[diff];
        const t = (i - 1) / 49; // 0~1 progression
        const pairs = Math.round(cfg.minPairs + (cfg.maxPairs - cfg.minPairs) * Math.min(t * 2, 1));

        levels.push({
            id: i,
            difficulty: diff,
            pairs: pairs,
            totalTiles: pairs * 2,
            layoutIndex: i % LAYOUT_TEMPLATES.length,
        });
    }
    return levels;
}

// ===== 布局模板 =====
// 每个模板定义了各层的牌位坐标 (x, y, z)
// x: 0~5.5, y: 0~7.5, z: 0~3
// 上层牌相对下层有 ±0.5 偏移

const LAYOUT_TEMPLATES = [
    // Template 0: 经典金字塔 (适合简单关)
    {
        name: 'pyramid',
        generate(totalTiles) {
            return generatePyramidLayout(totalTiles);
        }
    },
    // Template 1: 十字形
    {
        name: 'cross',
        generate(totalTiles) {
            return generateCrossLayout(totalTiles);
        }
    },
    // Template 2: 龟壳形
    {
        name: 'turtle',
        generate(totalTiles) {
            return generateTurtleLayout(totalTiles);
        }
    },
    // Template 3: 菱形
    {
        name: 'diamond',
        generate(totalTiles) {
            return generateDiamondLayout(totalTiles);
        }
    },
];

// ===== 布局生成函数 =====

function generatePyramidLayout(totalTiles) {
    const positions = [];

    // Layer 0: 6x8 full grid (48 tiles)
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 6; x++) {
            positions.push({ x, y, z: 0 });
        }
    }

    // Layer 1: 4x6 centered with 0.5 offset (24 tiles)
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 4; x++) {
            positions.push({ x: x + 1.5, y: y + 1.5, z: 1 });
        }
    }

    // Layer 2: 2x4 centered (8 tiles)
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 2; x++) {
            positions.push({ x: x + 2.5, y: y + 2.5, z: 2 });
        }
    }

    // Layer 3: top cap (include horizontal run candidates)
    for (const y of [3.5, 4.5]) {
        for (let x = 1.5; x <= 4.5; x += 1) {
            positions.push({ x, y, z: 3 });
        }
    }

    // Trim to totalTiles (remove from outer edges of lower layers)
    return trimPositions(positions, totalTiles);
}

function generateCrossLayout(totalTiles) {
    const positions = [];

    // Layer 0: cross shape
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 6; x++) {
            const inVertical = x >= 1 && x <= 4;
            const inHorizontal = y >= 2 && y <= 5;
            if (inVertical || inHorizontal) {
                positions.push({ x, y, z: 0 });
            }
        }
    }

    // Layer 1: smaller cross
    for (let y = 1; y < 7; y++) {
        for (let x = 0.5; x < 5.5; x += 1) {
            const inVertical = x >= 1.5 && x <= 3.5;
            const inHorizontal = y >= 2.5 && y <= 4.5;
            if (inVertical || inHorizontal) {
                positions.push({ x, y: y + 0.5, z: 1 });
            }
        }
    }

    // Layer 2: center block (widen to allow horizontal 3-run on top layer)
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            positions.push({ x: x + 1, y: y + 3, z: 2 });
        }
    }

    return trimPositions(positions, totalTiles);
}

function generateTurtleLayout(totalTiles) {
    const positions = [];

    // Layer 0: rounded rectangle
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 6; x++) {
            // Skip corners
            const isCorner = (x === 0 || x === 5) && (y === 0 || y === 7);
            if (!isCorner) {
                positions.push({ x, y, z: 0 });
            }
        }
    }

    // Layer 1: 4x6 with offset
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 4; x++) {
            positions.push({ x: x + 1.5, y: y + 1.5, z: 1 });
        }
    }

    // Layer 2: 2x3
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 2; x++) {
            positions.push({ x: x + 2.5, y: y + 3, z: 2 });
        }
    }

    // Layer 3: top cap (include horizontal run candidates)
    for (const y of [4, 4.5]) {
        for (let x = 1.5; x <= 4.5; x += 1) {
            positions.push({ x, y, z: 3 });
        }
    }

    return trimPositions(positions, totalTiles);
}

function generateDiamondLayout(totalTiles) {
    const positions = [];
    const cx = 2.5, cy = 3.5;

    // Layer 0: diamond shape
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 6; x++) {
            const dist = Math.abs(x - cx) / 3 + Math.abs(y - cy) / 4;
            if (dist <= 1.0) {
                positions.push({ x, y, z: 0 });
            }
        }
    }

    // Layer 1: smaller diamond
    for (let y = 1; y < 7; y++) {
        for (let x = 0.5; x <= 4.5; x += 1) {
            const dist = Math.abs(x - cx) / 2.5 + Math.abs(y + 0.5 - cy) / 3.5;
            if (dist <= 0.85) {
                positions.push({ x, y: y + 0.5, z: 1 });
            }
        }
    }

    // Layer 2: tiny diamond
    for (let y = 2; y < 6; y++) {
        for (let x = 1; x <= 4; x += 1) {
            const dist = Math.abs(x - cx) / 2 + Math.abs(y - cy) / 3;
            if (dist <= 0.6) {
                positions.push({ x: x + 0.5, y: y + 0.5, z: 2 });
            }
        }
    }

    return trimPositions(positions, totalTiles);
}

// Trim positions to exact count (must be even), removing from highest z first then outer edges
function trimPositions(positions, targetCount) {
    let target = Math.floor(targetCount / 2) * 2;
    if (target > positions.length) target = Math.floor(positions.length / 2) * 2;

    const cx = 2.5, cy = 3.5;
    const scored = positions.map((p, i) => ({
        ...p,
        idx: i,
        dist: Math.abs(p.x - cx) + Math.abs(p.y - cy),
    }));

    scored.sort((a, b) => {
        if (a.z !== b.z) return a.z - b.z;
        if (a.dist !== b.dist) return a.dist - b.dist;
        return a.idx - b.idx;
    });

    const keyOf = (p) => `${p.x},${p.y},${p.z}`;

    const pickWeighted = (cands, count, selectedKeys) => {
        const pool = cands.filter(p => !selectedKeys.has(keyOf(p)));
        const picked = [];
        while (picked.length < count && pool.length > 0) {
            let total = 0;
            const weights = new Array(pool.length);
            for (let i = 0; i < pool.length; i++) {
                const w = Math.exp(-pool[i].dist * 0.85) * (1 / (1 + pool[i].z));
                weights[i] = w;
                total += w;
            }
            let r = Math.random() * total;
            let idx = 0;
            for (; idx < weights.length; idx++) {
                r -= weights[idx];
                if (r <= 0) break;
            }
            if (idx >= pool.length) idx = pool.length - 1;
            const chosen = pool.splice(idx, 1)[0];
            const k = keyOf(chosen);
            if (!selectedKeys.has(k)) {
                selectedKeys.add(k);
                picked.push(chosen);
            }
        }
        return picked;
    };

    const getTopHorizontalRuns = (cands) => {
        let maxZ = -Infinity;
        for (const p of cands) {
            if (p.z > maxZ) maxZ = p.z;
        }
        const top = cands.filter(p => p.z === maxZ);

        const byRow = new Map();
        for (const p of top) {
            const y2 = Math.round(p.y * 2);
            const x2 = Math.round(p.x * 2);
            const key = String(y2);
            if (!byRow.has(key)) byRow.set(key, new Map());
            byRow.get(key).set(x2, p);
        }

        const runs = [];
        for (const xs of byRow.values()) {
            const xList = Array.from(xs.keys()).sort((a, b) => a - b);
            for (const x2 of xList) {
                const a = xs.get(x2);
                const b = xs.get(x2 + 2);
                const c = xs.get(x2 + 4);
                if (a && b && c) runs.push([a, b, c]);
            }
        }
        return runs;
    };

    const selectedKeys = new Set();
    const selected = [];

    const topRuns = getTopHorizontalRuns(scored);
    if (topRuns.length > 0 && target >= 3) {
        const run = topRuns[Math.floor(Math.random() * topRuns.length)];
        for (const p of run) {
            const k = keyOf(p);
            if (!selectedKeys.has(k)) {
                selectedKeys.add(k);
                selected.push(p);
            }
        }
    }

    if (selected.length < target) {
        selected.push(...pickWeighted(scored, target - selected.length, selectedKeys));
    }

    return selected.slice(0, target).map(p => ({ x: p.x, y: p.y, z: p.z }));
}

// ===== 存档系统 =====
const SAVE_KEY = 'mahjong_v2_save';

function loadSave() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return getDefaultSave();
}

function saveSave(data) {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {}
}

function getDefaultSave() {
    return {
        currentLevel: 1,
        levelStars: {},   // { "1": 3, "2": 2, ... }
        settings: {
            sfx: true,
            bgm: true,
            largeFont: true,
            highContrast: false,
        },
        dailySeed: null,
        dailyDate: null,
    };
}
