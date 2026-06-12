# Spine 动画资源全景图

> 生成日期：2026-06-11
> 扫描范围：5 个项目（bubblepop / blockh5 / git / TidyCocos / Tiny）
> 目标：新项目复用现有 Spine 动画资源，重点关注反馈特效和结算特效

---

## 目录

1. [项目总览](#1-项目总览)
2. [D:\bubblepop — 泡泡龙 (Cocos Creator)](#2-dbubblepop--泡泡龙)
3. [E:\blockh5 — 世界杯消消乐 (Cocos Creator)](#3-eblockh5--世界杯消消乐)
4. [E:\git — WoodBlock (Unity)](#4-egit--woodblock)
5. [E:\TidyCocos — 整理消除 (Cocos Creator)](#5-etidycocos--整理消除)
6. [E:\Tiny — GoodsTriple (Unity)](#6-etiny--goodstriple)
7. [跨项目可复用资源推荐](#7-跨项目可复用资源推荐)
8. [动画绑定映射速查](#8-动画绑定映射速查)

---

## 1. 项目总览

| 项目 | 引擎 | Spine 版本 | 骨骼数量 | 纹理数量 | 关联 Prefab | 代码引用 |
|------|------|-----------|---------|---------|------------|---------|
| **bubblepop** | Cocos Creator 2.x | 3.8.99 | 34 | 21 | 30+ | 12 |
| **blockh5** | Cocos Creator 3.x | 3.8.99 | 10+2 | 10+2 | 11 | 19 |
| **git (WoodBlock)** | Unity | 3.8 / 3.8.99 | 26 | 26 | 21+ | 13+ |
| **TidyCocos** | Cocos Creator 3.x | — | 11 | 11 | 13 | 9 |
| **Tiny** | Unity | — | 0 | 0 | 0 | 0 |

**Tiny 项目无任何 Spine 资源。**

---

## 2. D:\bubblepop — 泡泡龙

引擎：Cocos Creator 2.x | Spine 版本：3.8.99

### 2.1 结算/胜负特效 (Win / Fail) ★ 重点复用

**路径：** `assets/game/spine/win_fail/worldcup_gameDlgSpine/`

| 资源名 | 文件 | 大小 | 说明 |
|--------|------|------|------|
| **世界冠军杯结算-胜利** | `worldcup_jiesuan_xx.json` + `.atlas.txt` + `.png` | 74 KB | 胜利结算星星动画，包含胜利感叹节奏 |
| **世界冠军杯结算-失败** | `worldcup_jiesuan_xx_lose.json` + `.atlas.txt` + `.png` | 41 KB | 失败结算动画，叉号 + 文字 |
| **世界冠军杯结算-皇冠** | `worldcup_jiesuan_huangguan.json` + `.atlas.txt` + `.png` | 334 KB | 皇冠旋转 + 光效，动画: `in` → `idle` |
| **结算彩带** | `jiesuan_caidai.json` + `.atlas.txt` + `.png` | 100 KB | 胜利/失败两侧彩带，动画: `win_in` → `win_idle` / `lose` |
| **排行榜列表** | `ranking_list.json` + `.atlas.txt` + `.png` | 227 KB | 排行榜滚动列表动画 |
| **世界冠军杯星星目标** | `worldcup_Starget.json` + `.atlas.txt` + `.png` | 194 KB | 关卡目标星星动画 |
| **世界冠军杯-炸弹** | `worldcup_zhadan.json` + `.atlas.txt` + `.png` | 110 KB | 炸弹道具的世界杯皮 |
| **世界冠军杯-火箭** | `worldcup_huojian.json` + `.atlas.txt` + `.png` | 238 KB | 火箭道具的世界杯皮 |
| **世界冠军杯-道具反馈** | `worldcup_djfk.json` + `.atlas.txt` + `.png` | 616 KB | 道具使用反馈的世界杯皮 |
| **世界冠军杯-BZ** | `worldcup_bz.json` + `.atlas.txt` + `.png` | 522 KB | 爆炸效果的世界杯皮 |
| **世界冠军杯-泡泡结构消除** | `worldcup_bubble_jgxc.json` + `.atlas.txt` + `.png` | 348 KB | 泡泡消除效果的世界杯皮 |
| **豆豆开关** | `doudoukaiguan.json` + `.atlas.txt` + `.png` | 17 KB | 开关按钮动画 |

**使用场景：**
- `GameVictoryWin.ts` — `spine_huangguan`(皇冠), `spine_caidan`(彩带), `spine_star`(星星)
- `GameFailedWin.ts` — `spine_lose`, `spine_caidan`
- `GameVictoryWin.prefab` — spine_huangguan, spine_caidan, spine_box
- `GameFailedWin.prefab` — spine_caidan, spine_lose
- `GameRankWin.prefab` — spine_star

### 2.2 宝箱/奖励特效 (Gift Box)

**路径：** `assets/game/spine/giftBox/`

| 资源名 | 文件 | 大小 | 说明 |
|--------|------|------|------|
| **宝箱** | `box.json` + `.atlas` + `winGiftSpine.png`(共享) | 455 KB | 宝箱动画，动画: `idle1`, `idle2`, `open_idle` |
| **礼物** | `gift.json` + `.atlas` + `winGiftSpine.png`(共享) | 448 KB | 大礼包弹出，动画: `xialuo`(下落), `daiji`(待机), `dakaijinbi`(打开金币), `dakaidaoju`(打开道具) |
| **纹理图集** | `winGiftSpine.png` | 422 KB | 共享纹理 (2048×2048) |

**使用场景：**
- `GameVictoryWin.ts` — `spine_box`, `spine_gift`
- `OnlineAwardWin.prefab` — 在线奖励宝箱
- `OnlineAwardBtn.ts` — `skel_box`

### 2.3 签到特效 (Sign)

**路径：** `assets/game/spine/sign/`

| 资源名 | 文件 | 大小 | 说明 |
|--------|------|------|------|
| **标题** | `lb.json` + `.atlas` + shared texture | 132 KB | 签到标题栏动画 |
| **嘟嘟花** | `dhdh.json` + `.atlas` + shared texture | 44 KB | 签到装饰花动画 |
| **宝箱** | `chest.json` + `.atlas` + shared texture | 22 KB | 签到宝箱动画 |
| **纹理图集** | `cutomDailyDlgSpine.png` | 164 KB | 共享纹理 (1024×2048) |

**使用场景：** `SignWin.ts` — spine_title, dhdh; `SignWin.prefab` — 17 处 sp.Skeleton

### 2.4 道具特效 (Prop)

**路径：** `assets/game/spine/prop/`

| 资源名 | 文件 | 大小 | 说明 |
|--------|------|------|------|
| **炸弹** | `zhadan.json` + `.atlas` | 159 KB | 炸弹道具动画 |
| **闪电** | `shandian.json` + `.atlas` | 66 KB | 闪电道具动画 |
| **火箭** | `huojian.json` + `.atlas` | 106 KB | 火箭道具动画 |
| **花** | `hua.json` + `.atlas` | 11 KB | 花道具动画 |
| **道具反馈** | `djfk.json` + `.atlas` | 137 KB | 道具使用反馈 |
| **纹理图集** | `gamePropSpine.png` (1024×1024) | 151 KB | 炸弹/闪电/火箭/花 共享 |
| **纹理图集** | `gamePropBaodianSpine.png` (2048×1024) | 670 KB | 道具反馈专用 ⚠️ 无对应 json/atlas |

### 2.5 道具到达特效 (PropArrive)

**路径：** `assets/game/spine/propArrive/`

| 资源名 | 文件 | 大小 | 说明 |
|--------|------|------|------|
| **特效-通用** | `tsxc.json` + `gamePropArrive2.png` | 7 KB | 道具到达通用特效 |
| **特效-橙色** | `csxc.json` + `gamePropArrive.png` | 16 KB | 道具到达橙色特效 |
| **爆炸** | `bz.json` + `gamePropArrive.png` | 31 KB | 爆炸到达特效 |
| **泡泡结构消除** | `bubble_jgxc.json` + `gamePropArrive.png` | 52 KB | 泡泡结构消除到达效果 |
| **泡泡消除** | `bubble_hxc.json` + `gamePropArrive.png` | 51 KB | 泡泡消除到达效果 |
| **纹理图集** | `gamePropArrive.png` (2048×2048) | 542 KB | csxc/bz/bubble 共享 |
| **纹理图集** | `gamePropArrive2.png` (2048×1024) | 297 KB | tsxc 专用 |

**使用场景：** `EffectGetItem.prefab` 通过 `EffectHelper.ts` 动态加载

### 2.6 球处理特效 (BallDeal)

**路径：** `assets/game/spine/ballDeal/`

| 资源名 | 文件 | 大小 | 说明 |
|--------|------|------|------|
| **雾** | `wu.json` + `.atlas` | 26 KB | 雾效 |
| **鼓励词** | `gulici.json` + `.atlas` | 59 KB | 鼓励文字动画 |
| **彩球2** | `cq2.json` + `.atlas` | 20 KB | 彩色球效果 |
| **颜色2** | `color2.json` + `.atlas` | 64 KB | 颜色匹配效果 |
| **云** | `cloud.json` + `.atlas` | 22 KB | 云效果 |
| **纹理图集** | `gameBallDealSpine.png` (2048×1024) | 389 KB | 全部共享 |

**使用场景：** `EffectBallExp.prefab` — 泡泡消除/匹配时的特效

### 2.7 通用动画 (Animation)

**路径：** `assets/game/spine/Animation/`

| 资源名 | 文件 | 大小 | 说明 |
|--------|------|------|------|
| **下落** | `fall.json` + `.atlas.txt` + `.png` | 25 KB | 下落粒子效果 |
| **星星目标** | `Starget.json` + `.atlas.txt` + `.png` | 52 KB | 关卡星星目标，3星动画 |

**使用场景：** `Starget.prefab`, `Starget1.prefab`, `LevelItem.prefab` — 关卡目标和关卡选择

### 2.8 动态效果 Prefab（引用 Spine）

| Prefab | 路径 | Spine 用途 |
|--------|------|-----------|
| `EffectRocketExp.prefab` | `prefab/game/` | 火箭爆炸 |
| `EffectBombExp.prefab` | `prefab/game/` | 炸弹爆炸 |
| `EffectRainBowExp.prefab` | `prefab/game/` | 彩虹爆炸 |
| `EffectLightingExp.prefab` | `prefab/game/` | 闪电效果 |
| `EffectCircle.prefab` | `prefab/game/` | 光圈效果 |
| `EffectBreak.prefab` | `prefab/game/` | 破裂效果 |
| `EffectGetItem.prefab` | `prefab/game/` | 获取道具效果 |
| `EffectGoodTip.prefab` | `prefab/game/` | 好评提示 |
| `EffectBallExp.prefab` | `prefab/game/` | 泡泡爆炸 |
| `EffectChainBreak.prefab` | `prefab/game/` | 连锁破裂（粒子，非 Spine） |

**代码入口：** `EffectHelper.ts` — `createLightingEffect`, `createBombEffect`, `createRainBowEffect`, `createRocketEffect`, `createGetItemEffect`, `createBreakEffect`, `createItemEffect`

### 2.9 Art 目录原始备份

| 版本路径 | 内容 |
|----------|------|
| `art/1.0.2.1/` | 排行榜旗帜 spine、排行榜结算 |
| `art/1.0.2.0.1_h5/` | 世界杯 Starget、结算动画、宝典纹理 |
| `art/1.0.1.8/` | fall 动画、Starget 动画 |

---

## 3. E:\blockh5 — 世界杯消消乐

引擎：Cocos Creator 3.x | Spine 版本：3.8.99 | 路径：`assets/res/game/spine/`

### 3.1 结算/评价/反馈特效 ★ 重点复用

| # | 资源名 | 文件夹 | JSON | PNG | 动画名 | 使用场景 |
|---|--------|--------|------|-----|--------|---------|
| 1 | **World Cup 完成祝贺** | `worldcup_welldone/` | 9 KB | 93 KB | `worldcup_welldone` | 关卡胜利过渡动画（足球门将+足球） |
| 2 | **评价文字** | `worldcup_evaluation_anm/` | 154 KB | 386 KB | `good` / `great` / `surprise` / `unbelievable` / `prefect` | 游戏中连击评价反馈 |
| 3 | **NewBest 新纪录** | `worldcup_NewbestFxopt/` | 479 KB | 1.1 MB | `NewbestFxopt` / `BestScore` | 新纪录庆祝（皇冠+光效+麦穗） |
| 4 | **结算彩带** | `worldcup_NewbestFxopt/` | 113 KB | 11 KB | — | 胜利结算彩带（红黄蓝绿） |
| 5 | **连续每日胜利** | `worldcup_consecutive_daily_victorie/` | 6 KB | 92 KB | — | 每日连胜徽章 |
| 6 | **背景闲游** | `worldcup_bg_idle/` | 15 KB | 13 KB | `worldcup_bg_idle` | 背景环境动画 |
| 7 | **Welcome Back** | `worldcup_welcome_back/` | 366 KB | 593 KB | — | 大厅欢迎动画（角色+气泡） |
| 8 | **彩虹碎片** | `worldcup_Rainbow_fragments/` | 61 KB | 129 KB | `Rainbow_fragments` | 彩虹消除特效 |
| 9 | **方块消失** | `worldcup_ANI_Game_block_disapear/` | 19 KB | 8 KB | `ANI_Game_block_disapear` | 消除方块消失特效 |
| 10 | **动画BlockLogo** | `blocklogo/` | 49 KB | 170 KB | `blocklogo_master` | 游戏胜利 LOGO 动画 |
| 11 | **WellDone Ribbon** | `Welldone_Ribbone/` | 70 KB | 4 KB | `welldone_ribbone_1` | 完成彩带装饰 |

### 3.2 Spine Prefab 引用

| Prefab | 路径 | Spine 资源 |
|--------|------|-----------|
| `StartUI.prefab` | `lobby/uiPrefabs/` | `worldcup_welcome_back` |
| `BestScoreUI.prefab` | `game/uiPrefabs/` | `worldcup_NewbestFxopt` |
| `AdventureVictoryTransitionUI.prefab` | `game/uiPrefabs/` | `worldcup_welldone` + `Welldone_Ribbone` |
| `GameWinUI.prefab` | `game/uiPrefabs/` | `blocklogo` |
| `PEF_soccer_rainbow_eliminate.prefab` | `game/effects/` | `Rainbow_fragments` |
| `PEF_soccer_eliminate.prefab` | `game/effects/` | `ANI_Game_block_disapear` |
| `NewBestFx.prefab` | `game/effects/` | `worldcup_NewbestFxopt` |
| `EFF_worldcup_bg_idle.prefab` | `game/effects/` | `worldcup_bg_idle` |
| `EFF_comments.prefab` | `game/effects/` | `evaluation_anm` |

### 3.3 代码引用

| 文件 | Spine 用法 |
|------|-----------|
| `SpineController.ts` | 通用 Spine 控制器 |
| `AdventureVictoryTransitionUI.ts` | 控制 `wellDoneSpine`, `colorRibbon` |
| `GameWinUI.ts` | 控制 `logoSkeleton` |
| `StartUI.ts` | 控制 `welcomeMan` |
| `CommentSystem.ts` | `CommentType` → `good/great/surprise/unbelievable/prefect` |
| `GameEffectSystemExtension.ts` | 动态播放评价动画 |
| `RainbowEliminateEffectCtr.ts` | 彩虹消除 |
| `SoccerEliminateEffectCtr.ts` | 足球消除 |

---

## 4. E:\git — WoodBlock

引擎：Unity | Spine 版本：3.8 / 3.8.99 | 路径：`Assets/RawAsset/Spine/`

### 4.1 完整 Spine 骨骼清单（26个骨骼动画）

#### 4.1.1 结算/胜负类 ★ 重点复用

| 资源名 | 文件夹 | JSON | PNG | 使用场景 |
|--------|--------|------|-----|---------|
| **胜利** | `victory/` | 221 KB | 222 KB | 胜利烟花+奖杯动画，Prefab: `VictorySpine.prefab` |
| **NewBest** | `NewbestFxopt/` | 463 KB | 864 KB | 新纪录庆祝（麦穗+皇冠+分数），Prefab: `NewBestFx.prefab` |
| **结算彩带** | `NewbestFxopt/` | 113 KB | 11 KB | 结算彩带动画 |
| **WellDone Ribbon** | `welldone/` | 70 KB | 4 KB | 完成彩带，Prefab: `PEF_Welldone_colorribbone_spine.prefab` |
| **ClearScreen 全清** | `ClearScreenEfx/` | 101 KB | 43 KB | 全屏清空特效，Prefab: `ClearScreenEfx.prefab` |
| **恭喜文字** | `praise/` | 9 KB | 96 KB | 表扬文字，Prefab: `PraiseEfx.prefab` |

#### 4.1.2 游戏特效类

| 资源名 | 文件夹 | JSON | PNG | 使用场景 |
|--------|--------|------|-----|---------|
| **方块出现** | `ANI_blockap_new/` | 14 KB | 26 KB | 方块出现粒子效果 |
| **方块消失** | `ANI_Game_block_disapear/` | 19 KB | 7 KB | 方块消失动画 |
| **彩色方块消失** | `PEF_block_disapear_color/` | 80 KB | 99 KB | 彩色方块消失双重动画 |
| **彩虹碎片** | `Rainbow_fragments/` | 56 KB | 105 KB | 彩虹拖尾消除 |
| **到达消除** | `reach_elimination/` | 76 KB | 57 KB | 消除前高亮闪烁 |
| **棋盘眩光** | `Chessboard Glare/` | 68 KB | 81 KB | 棋盘颜色眩光效果 |
| **世界杯-方块消失** | `worldcup/worldcup_ANI_Game_block_disapear/` | 19 KB | 8 KB | 世界杯皮方块消失 |
| **世界杯-彩虹碎片** | `worldcup/worldcup_Rainbow_fragments/` | 61 KB | 129 KB | 世界杯皮彩虹消除 |

#### 4.1.3 UI 辅助类

| 资源名 | 文件夹 | JSON | PNG | 使用场景 |
|--------|--------|------|-----|---------|
| **光标** | `cursor/` | 10 KB | 3 KB | 关卡选择光标，Prefab: `LevelTile.prefab` |
| **BlockLogo** | `blocklogo/` | 34 KB | 148 KB | 游戏胜利 LOGO 动画，Prefab: `Logo.prefab` |
| **评价文字** | `evaluation_anm/` | 119 KB | 278 KB | 评价文字(amazing/great/good)，Prefab: `Comments.prefab`, `BoardEffect.prefab` |
| **连续每日胜利** | `consecutive_daily_victories/` | 6 KB | 51 KB | 每日连胜徽章 |
| **欢迎回来** | `welcome_back/` | 76 KB | 152 KB | 大厅欢迎动画 |
| **世界杯-背景闲游** | `worldcup/worldcup_bg_idle/` | 15 KB | 13 KB | 背景环境动画 |
| **世界杯-评价文字** | `worldcup/worldcup_evaluation_anm/` | 154 KB | 386 KB | 世界杯皮评价文字 |
| **世界杯-NewBest** | `worldcup/worldcup_NewbestFxopt/` | 479 KB | 1,097 KB | 世界杯皮新纪录 |
| **世界杯-每日连胜** | `worldcup/worldcup_consecutive_daily_victorie/` | 6 KB | 92 KB | 世界杯皮每日连胜 |
| **世界杯-WelcomeBack** | `worldcup/worldcup_welcome_back/` | 366 KB | 611 KB | 世界杯皮欢迎动画 |
| **世界杯-WellDone** | `worldcup/worldcup_welldone/` | 9 KB | 93 KB | 世界杯皮完成祝贺 |

### 4.2 Prefab 引用

| Prefab | 路径 | Spine 资源 |
|--------|------|-----------|
| `VictorySpine.prefab` | `Game/Prefabs/` | `victory` |
| `NewBestFx.prefab` | `Game/Prefabs/` | `NewbestFxopt` |
| `PEF_Welldone_colorribbone_spine.prefab` | `Game/Prefabs/` | `Welldone_Ribbone` |
| `ClearScreenEfx.prefab` | `Game/Prefabs/` | `ClearScreenEfx` |
| `PraiseEfx.prefab` | `Game/Prefabs/` | `praise` |
| `Comments.prefab` | `Game/Prefabs/` | `evaluation_anm` |
| `BoardEffect.prefab` | `Game/Prefabs/` | `evaluation_anm` |
| `fx_rainbow_line_spine.prefab` | `Game/Prefabs/` | `Rainbow_fragments` |
| `fx_reach_elimination_spine.prefab` | `Game/Prefabs/` | `reach_elimination` |
| `PEF_block_disapear_color_spine.prefab` | `Game/Prefabs/` | `PEF_block_disapear_color` |
| `LevelTile.prefab` | `Game/Prefabs/` | `cursor` |
| `Logo.prefab` | `Game/Prefabs/` | `blocklogo` |
| `ScoreOver.prefab` | `Game/Prefabs/` | `NewbestFxopt` |
| `NewBest.prefab` | `Game/Prefabs/` | `NewbestFxopt` |

### 4.3 C# 代码引用

| 文件 | 用途 |
|------|------|
| `SpineAnimationSystem.cs` (1146行) | 核心 Spine 管理系统，负责池化、播放队列、SkeletonAnimation/SkeletonGraphic |
| `SpineAnimationHandle.cs` (600行) | 动画控制句柄，封装播放/停止/回调 |
| `MultiSpineAnimationQueue.cs` (400行) | 多动画队列顺序播放 |
| `LobbyScreenView.cs` | WelcomeSpine, ConsecutiveSpine, WorldCupWelcomeSpine |
| `GameWinUIACtrl.cs` | blocklogo / blocklogo_boom |
| `AdventureVictoryTransitionUIAView.cs` | WelldoneColorribbone, Victory, WorldcupWelldone |
| `GameEffectSystem.cs` | 动态加载 ClearScreenEfx, BoardEffect |
| `LevelTile.cs` | cursor 光标动画 |
| `EffectController.cs` | SkAnimationDictionary 动画映射 |

---

## 5. E:\TidyCocos — 整理消除

引擎：Cocos Creator 3.x | 路径：`assets/bundle/game/animations/spine/`

### 5.1 Spine 骨骼清单（11个）

| 资源名 | JSON | PNG | 使用场景 |
|--------|------|-----|---------|
| **break** (消除) | 193 KB | 143 KB | 方块消除破裂动画，Prefab: `Break.prefab` |
| **combo** (连击) | 71 KB | 130 KB | 连击数字动画，UI: `InGameUI.prefab` |
| **EFF_Game_CardCollect_Card_bg** (卡片收集背景) | 109 KB | 46 KB | 关卡完成卡片收集背景，Prefab: `EFF_Game_CardCollect_Card_bg.prefab` |
| **EFF_partypopper** (派对拉炮) | 65 KB | 142 KB | 庆祝纸花特效，Prefab: `EFF_partypopper.prefab` |
| **MagicWand** (魔法棒) | 41 KB | 334 KB | 魔法棒道具动画，UI: `InGamePropsUI.prefab` |
| **Node_hand** (手指) | 15 KB | 33 KB | 新手引导手指动画，Prefab: `FingerItem.prefab` |
| **worldcup_break** (世界杯消除) | 175 KB | 63 KB | 世界杯主题消除破裂动画，代码动态设 `animName` |
| **timebox** (时间盒) | 109 KB | 816 KB | 时间倒计时/时间盒动画 |
| **football_interlude_p** (足球插页) | 27 KB | 27 KB | 加载过渡页足球动画，Prefab: `LoadingUI.prefab` |
| **fireworke** (烟花) | 269 KB | 16 KB | 烟花庆祝特效，Prefab: `LevelComplete.prefab`, `ChallengeLevelSettlementInterface.prefab` |
| **box_broken** (盒子破裂) | 8 KB | 102 KB | 货柜盒子破裂动画，Prefab: `BoxBroken.prefab` |

### 5.2 代码引用

| 文件 | 用途 |
|------|------|
| `InGameUI.ts` | comboSpine 连击动画 |
| `LevelCompleteUI.ts` | 卡片收集背景 Spine |
| `FingerGuideView.ts` | 手指引导动画 |
| `InGamePropsUI.ts` | 魔法棒动画 |
| `BreakEffect.ts` | 消除破裂动画控制 |
| `ResLoader.ts` | 通用 Spine 资源加载器 |
| `ItemSystem.ts` | `worldcup_break` — CBreak 消除动画 |
| `LoadingUI.ts` | `football_interlude_p` — 加载页足球动画（appear/disappear） |
| `ContainerSystem.ts` | `box_broken` — 货柜盒子破裂动画 |

---

## 6. E:\Tiny — GoodsTriple

**无 Spine 资源。** 该项目为 Unity GoodsTriple（三消游戏），未使用 Spine 技术。

---

## 7. 跨项目可复用资源推荐

### 7.1 结算特效（最推荐）

| 优先级 | 资源 | 来源项目 | 说明 | 动画内容 |
|--------|------|---------|------|---------|
| ⭐⭐⭐ | `victory` | git | 胜利烟花+奖杯+彩纸 | 通用性强，尺寸 222KB |
| ⭐⭐⭐ | `NewbestFxopt` | git / blockh5 | 新纪录皇冠+光效+麦穗 | 两个项目都有 |
| ⭐⭐⭐ | `Welldone_Ribbone` | git / blockh5 | 完成彩带 | 仅 4KB 纹理，极高性价比 |
| ⭐⭐⭐ | `worldcup_welldone` | git / blockh5 | 足球门将式完成 | 带角色元素 |
| ⭐⭐ | `ClearScreenEfx` | git | 全屏清空爆发 | 适合消除类结算 |
| ⭐⭐ | `fireworke` | TidyCocos | 烟花庆祝特效 | PNG 仅 16KB，高性价比 |
| ⭐⭐ | `jiesuan_caidai` | bubblepop | 结算两侧彩带 | Cocos 格式，可直接引用 |
| ⭐⭐ | `worldcup_jiesuan_huangguan` | bubblepop | 皇冠旋转结算 | 73 KB，高性价比 |
| ⭐ | `praise` | git | 表扬文字弹出 | 简单文字动画 |

### 7.2 反馈特效（推荐）

| 优先级 | 资源 | 来源项目 | 说明 |
|--------|------|---------|------|
| ⭐⭐⭐ | `evaluation_anm` | git / blockh5 | 评价文字 amazing/great/good，多个项目验证 |
| ⭐⭐⭐ | `ANI_Game_block_disapear` | git / blockh5 | 方块消失通用特效 |
| ⭐⭐⭐ | `Rainbow_fragments` | git / blockh5 | 彩虹拖尾消除 |
| ⭐⭐ | `PEF_block_disapear_color` | git | 彩色方块消失（双重动画） |
| ⭐⭐ | `reach_elimination` | git | 消除前闪烁高亮 |
| ⭐⭐ | `combo` | TidyCocos | 连击数字动画 |
| ⭐⭐ | `break` | TidyCocos | 破裂消失效果 |
| ⭐⭐ | `worldcup_break` | TidyCocos | 世界杯主题破裂（break的世界杯皮） |
| ⭐⭐ | `box_broken` | TidyCocos | 盒子破裂（货柜消除反馈） |
| ⭐⭐ | `EFF_partypopper` | TidyCocos | 派对拉炮庆祝 |
| ⭐⭐ | `gameBallDealSpine` (球处理) | bubblepop | 泡泡消除雾/鼓励词/云效果 |

### 7.3 道具动画（可参考）

| 资源 | 来源项目 | 说明 |
|------|---------|------|
| `zhadan` / `shandian` / `huojian` / `hua` | bubblepop | 炸弹/闪电/火箭/花道具 |
| `box` / `gift` | bubblepop | 宝箱/礼物打开动画 |
| `MagicWand` | TidyCocos | 魔法棒道具 |
| `worldcup_zhadan` / `worldcup_huojian` | bubblepop | 世界杯皮炸弹/火箭 |

### 7.4 UI 辅助（可参考）

| 资源 | 来源项目 | 说明 |
|------|---------|------|
| `cursor` | git | 关卡选择光标 |
| `Node_hand` | TidyCocos | 手指引导 |
| `football_interlude_p` | TidyCocos | 加载过渡页足球动画 |
| `timebox` | TidyCocos | 时间倒计时盒 |
| `blocklogo` | git / blockh5 | 游戏 LOGO 动画 |
| `consecutive_daily_victories` | git / blockh5 | 每日连胜徽章 |
| `welcome_back` | git | 欢迎回来动画 |
| `worldcup_bg_idle` | git / blockh5 | 背景环境动画 |

---

## 8. 动画绑定映射速查

### 8.1 结算/胜负动画绑定

| 窗口 | 组件名 | Spine 资源 | 动画名 | 项目 |
|------|--------|-----------|--------|------|
| 胜利面板 | `spine_huangguan` | `worldcup_jiesuan_huangguan` | in → idle | bubblepop |
| 胜利面板 | `spine_caidan` | `jiesuan_caidai` | win_in → win_idle | bubblepop |
| 胜利面板 | `spine_star` | `worldcup_Starget` | xing1-3 → saoguang1-3 | bubblepop |
| 胜利面板 | `spine_gift` | `gift` | xialuo → daiji → dakaijinbi/daoju | bubblepop |
| 胜利面板 | `spine_box` | `box` | idle1/idle2/open_idle | bubblepop |
| 失败面板 | `spine_lose` | `worldcup_jiesuan_xx_lose` | — | bubblepop |
| 失败面板 | `spine_caidan` | `jiesuan_caidai` | lose | bubblepop |
| VictoryUI | `wellDoneSpine` | `worldcup_welldone` | worldcup_welldone | blockh5 |
| VictoryUI | `Welldone_Ribbone` | `Welldone_Ribbone` | welldone_ribbone_1 | blockh5/git |
| GameWinUI | `logoSkeleton` | `blocklogo` | blocklogo_master | blockh5/git |
| NewBest | `worldcup_NewbestFxopt` | `NewbestFxopt` | NewbestFxopt / BestScore | blockh5/git |
| VictorySpine | — | `victory` | victory | git |

### 8.2 游戏反馈动画绑定

| 触发条件 | Spine 资源 | 动画名 | 项目 |
|---------|-----------|--------|------|
| 连击评价 good | `evaluation_anm` | good | git/blockh5 |
| 连击评价 great | `evaluation_anm` | great | git/blockh5 |
| 连击评价 surprise | `evaluation_anm` | surprise | git/blockh5 |
| 连击评价 unbelievable | `evaluation_anm` | unbelievable | git/blockh5 |
| 连击评价 prefect | `evaluation_anm` | prefect | git/blockh5 |
| 方块消失 | `ANI_Game_block_disapear` | ANI_Game_block_disapear | git/blockh5 |
| 彩虹消除 | `Rainbow_fragments` | Rainbow_fragments | git/blockh5 |
| 消除高亮 | `reach_elimination` | reach_elimination_h | git |
| 方块出现 | `ANI_blockap_new` | — | git |
| 连击数字 | `combo` | — | TidyCocos |
| 卡片收集 | `EFF_Game_CardCollect_Card_bg` | — | TidyCocos |

### 8.3 道具动画绑定

| 道具 | Spine 资源 | 项目 |
|------|-----------|------|
| 炸弹 | `zhadan` | bubblepop |
| 闪电 | `shandian` | bubblepop |
| 火箭 | `huojian` | bubblepop |
| 花 | `hua` | bubblepop |
| 魔法棒 | `MagicWand` | TidyCocos |
| 宝箱(盒子) | `box` | bubblepop |
| 宝箱(礼物) | `gift` | bubblepop |

---

> 注：bubblepop 和 blockh5 均为 Cocos Creator 项目，Spine 3.8 格式可直接复用。
> git (WoodBlock) 为 Unity 项目，Spine JSON/PNG 源文件可直接拷贝，需适配引擎运行时。
> TidyCocos 为 Cocos Creator 3.x 项目，Spine 3.8 格式可直接复用。
> Tiny 无 Spine 资源。
