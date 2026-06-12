# Optional Spine Effects Delivery - Tidy V2

Date: 2026-06-11

Status: `OPTIONAL_FOR_PROGRAMMER_EVALUATION`

This V2 package replaces:

```text
E:\参考图\麻将\项目\ART_OPTIONAL_SPINE_EFFECTS_20260611
```

Use this folder for optional Spine effect evaluation:

```text
E:\参考图\麻将\项目\00_提交给程序_最终资源\可选Spine动效_Tidy版
```

## Why V2

The previous optional package included `Rainbow_fragments` and `ANI_Game_block_disapear`. Those effects are technically usable, but their style is too close to block/candy/rainbow effects and does not match the African totem tile art well enough.

This V2 package uses TidyCocos assets only, with a stronger preference for wood fragments, neutral light, and restrained celebration effects.

## Package Contents

Each Spine effect folder contains:

- `.json` Spine skeleton data
- `.png` texture atlas
- `.atlas.txt` original atlas file
- `.atlas` compatibility copy

File counts:

- 6 Spine effect folders
- 6 `.json`
- 6 `.png`
- 6 `.atlas.txt`
- 6 `.atlas`
- 1 Cocos reference-only particle prefab

## Recommended First Trial

Start with:

```text
assets/p0_try_first/gameplay_box_broken_eliminate/
```

This is the best current candidate for tile-matching elimination. It uses warm wood-fragment shapes and is much closer to the current totem/wood/gold/ivory art direction than the removed rainbow/block effects.

Then test:

```text
assets/p0_try_first/win_fireworke_light/
assets/p0_try_first/win_card_collect_light_bg/
```

These are neutral light / smoke / star effects for victory or final-clear feedback.

## Reference Only

```text
reference_only/cocos_particle_prefabs/EFF_eliminate_comman.prefab
```

This is not Spine. It is a Cocos `ParticleSystem2D` prefab. It is included only as a visual/parameter reference if the programmer wants to recreate a similar lightweight H5 particle effect.

## Do Not Use From Previous Optional Package

Do not prioritize these old-package assets:

```text
Rainbow_fragments
ANI_Game_block_disapear
break
worldcup_break
```

Reason: style mismatch with the current totem art direction.

## Required Static Art Package

The required static PNG package remains:

```text
E:\参考图\麻将\项目\00_提交给程序_最终资源\静态美术主包_PNG_必须接入
```

This Spine package is optional P1/P2 polish after the PNG package is stable in-game.

