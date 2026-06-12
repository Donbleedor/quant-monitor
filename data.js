/**
 * data.js - 牌型定义、关卡配置、布局模板
 *
 * 牌面已从传统麻将换皮为 West African / Nigerian-inspired 图腾。
 * 引擎仅使用 typeId 做配对,共 34 个 typeId,顺序映射到 34 张图腾 PNG。
 */

const TILE_ASSET_DIR = 'assets/gameplay/';

// ===== 图腾牌定义 (34 种,与图腾 PNG 一一对应) =====
const TILE_TYPES = [
    { id: 0,  key: 'sun_seed',         name: 'Sun Seed',          image: 'tile_totem_01_sun_seed.png' },
    { id: 1,  key: 'twin_leaves',      name: 'Twin Leaves',       image: 'tile_totem_02_twin_leaves.png' },
    { id: 2,  key: 'branch_cluster',   name: 'Branch Cluster',    image: 'tile_totem_03_branch_cluster.png' },
    { id: 3,  key: 'flower_cross',     name: 'Flower Cross',      image: 'tile_totem_04_flower_cross.png' },
    { id: 4,  key: 'palm_fan',         name: 'Palm Fan',          image: 'tile_totem_05_palm_fan.png' },
    { id: 5,  key: 'rain_pair',        name: 'Rain Pair',         image: 'tile_totem_06_rain_pair.png' },
    { id: 6,  key: 'water_wave',       name: 'Water Wave',        image: 'tile_totem_07_water_wave.png' },
    { id: 7,  key: 'mountain_chevron', name: 'Mountain Chevron',  image: 'tile_totem_08_mountain_chevron.png' },
    { id: 8,  key: 'star_blossom',     name: 'Star Blossom',      image: 'tile_totem_09_star_blossom.png' },
    { id: 9,  key: 'talking_drum',     name: 'Talking Drum',      image: 'tile_totem_10_talking_drum.png' },
    { id: 10, key: 'round_shield',     name: 'Round Shield',      image: 'tile_totem_11_round_shield.png' },
    { id: 11, key: 'cowrie_shell',     name: 'Cowrie Shell',      image: 'tile_totem_12_cowrie_shell.png' },
    { id: 12, key: 'woven_basket',     name: 'Woven Basket',      image: 'tile_totem_13_woven_basket.png' },
    { id: 13, key: 'clay_pot',         name: 'Clay Pot',          image: 'tile_totem_14_clay_pot.png' },
    { id: 14, key: 'comb_pick',        name: 'Comb Pick',         image: 'tile_totem_15_comb_pick.png' },
    { id: 15, key: 'bronze_bell',      name: 'Bronze Bell',       image: 'tile_totem_16_bronze_bell.png' },
    { id: 16, key: 'spear_tip',        name: 'Spear Tip',         image: 'tile_totem_17_spear_tip.png' },
    { id: 17, key: 'gold_bead',        name: 'Gold Bead',         image: 'tile_totem_18_gold_bead.png' },
    { id: 18, key: 'diamond_knot',     name: 'Diamond Knot',      image: 'tile_totem_19_diamond_knot.png' },
    { id: 19, key: 'zigzag_cloth',     name: 'Zigzag Cloth',      image: 'tile_totem_20_zigzag_cloth.png' },
    { id: 20, key: 'triple_triangle',  name: 'Triple Triangle',   image: 'tile_totem_21_triple_triangle.png' },
    { id: 21, key: 'spiral_sun',       name: 'Spiral Sun',        image: 'tile_totem_22_spiral_sun.png' },
    { id: 22, key: 'cross_weave',      name: 'Cross Weave',       image: 'tile_totem_23_cross_weave.png' },
    { id: 23, key: 'step_motif',       name: 'Step Motif',        image: 'tile_totem_24_step_motif.png' },
    { id: 24, key: 'ring_glyph',       name: 'Ring Glyph',        image: 'tile_totem_25_ring_glyph.png' },
    { id: 25, key: 'blue_stripe',      name: 'Blue Stripe',       image: 'tile_totem_26_blue_stripe.png' },
    { id: 26, key: 'green_lattice',    name: 'Green Lattice',     image: 'tile_totem_27_green_lattice.png' },
    { id: 27, key: 'mask_mark',        name: 'Mask Mark',         image: 'tile_totem_28_mask_mark.png' },
    { id: 28, key: 'baobab_tree',      name: 'Baobab Tree',       image: 'tile_totem_29_baobab_tree.png' },
    { id: 29, key: 'moon_bowl',        name: 'Moon Bowl',         image: 'tile_totem_30_moon_bowl.png' },
    { id: 30, key: 'fire_mark',        name: 'Fire Mark',         image: 'tile_totem_31_fire_mark.png' },
    { id: 31, key: 'water_drop',       name: 'Water Drop',        image: 'tile_totem_32_water_drop.png' },
    { id: 32, key: 'crown_token',      name: 'Crown Token',       image: 'tile_totem_33_crown_token.png' },
    { id: 33, key: 'heritage_knot',    name: 'Heritage Knot',     image: 'tile_totem_34_heritage_knot.png' },
];

// 给每个 TILE_TYPES 项预拼好可直接喂给 <img src> 的完整路径
TILE_TYPES.forEach(t => { t.imagePath = TILE_ASSET_DIR + t.image; });

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
