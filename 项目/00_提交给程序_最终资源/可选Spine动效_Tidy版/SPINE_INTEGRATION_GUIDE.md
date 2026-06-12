# Tidy V2 Spine Integration Guide

This package is optional and should be evaluated after the static PNG package is integrated.

## Current Game Constraint

`mahjong-v2` is plain H5 DOM/CSS/JS. It has no Spine runtime.

The programmer has two possible paths:

1. Offline export Spine animations to spritesheets / frame sequences.
2. Add a compatible Web Spine runtime and play the skeletons directly.

For this lightweight H5 game, offline spritesheets are still the safer path.

## First Test

Start with:

```text
assets/p0_try_first/gameplay_box_broken_eliminate/
animation: box_broken
```

Suggested use:

- Trigger when a matched pair is removed.
- Position at each matched tile center, or at the midpoint between two matched tiles.
- Scale down aggressively at first; avoid covering adjacent tiles.
- Play once and destroy/recycle the instance after completion.

## Victory / Final-Clear Test

Then test:

```text
assets/p0_try_first/win_fireworke_light/
animations: fireworks_appear, fireworks_idle

assets/p0_try_first/win_card_collect_light_bg/
animation: EFF_partypopper
```

Suggested use:

- `fireworks_appear`: play once when the win modal opens.
- `fireworks_idle`: optional subtle loop behind the modal.
- `EFF_Game_CardCollect_Card_bg`: background glow/smoke behind the victory panel.

## Optional Effects

```text
assets/p1_optional/win_partypopper/
```

Use only if stronger celebration is needed. Its colors are brighter and may need opacity tuning.

```text
assets/p1_optional/combo_light/
```

Use only for combo feedback, not for every pair.

```text
assets/p1_optional/guide_hand/
```

Use only if tutorial guidance is added.

## Reference-Only Particle Prefab

```text
reference_only/cocos_particle_prefabs/EFF_eliminate_comman.prefab
```

This is not a Spine asset. It is a Cocos `ParticleSystem2D` prefab.

It is included because its small star/particle behavior is visually closer to the desired elimination feedback. It cannot be dropped directly into plain H5. Use it only as a reference for recreating a lightweight DOM/canvas particle effect.

## Fixed 9:20 Rule

All effects must align to the same fixed game shell:

```text
design canvas: 1080x2400
aspect ratio: 9:20
```

Do not position effects relative to the full browser window if the game shell is letterboxed.

## Removed From Recommendation

Do not prioritize these older candidates:

```text
Rainbow_fragments
ANI_Game_block_disapear
break
worldcup_break
```

Reason: visual mismatch with the current African totem tile skin.

## Acceptance Checklist

- Spine JSON loads with the selected runtime or exports cleanly to spritesheet.
- The listed animation name plays correctly.
- Atlas texture path resolves.
- Effect aligns with the fixed 9:20 shell.
- Effect does not block tile clicks.
- Effect is destroyed or pooled after playback.
- Visual QA confirms it does not fight the PNG art direction.
