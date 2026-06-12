# Spine Integration Guide

This guide is for integrating optional Spine effects into `mahjong-v2`.

## Current Project Reality

`mahjong-v2` is a plain H5 project:

```text
index.html
data.js
engine.js
ui.js
main.js
style.css
```

There is no Cocos, Pixi, Phaser, Three.js, or Spine runtime in the current codebase. The current effects are CSS/DOM based.

## Recommended Integration Strategy

Use a two-step rollout:

1. Integrate the required PNG package first.
2. Add this Spine package only as optional P1/P2 polish.

The safest first trial is:

```text
gameplay_tile_disappear
win_ribbon
```

These two are small, generic, and low risk.

## Runtime Options

### Option A: Offline Export To Spritesheets

Recommended for this lightweight H5 demo.

Pros:

- No new Spine runtime dependency in the game.
- Easier to cache and play with regular `<canvas>` or DOM sprites.
- Lower integration risk for low-end phones.
- Matches the existing PNG-based art pipeline.

Expected workflow:

1. Open each Spine asset in a compatible Spine editor/runtime tool.
2. Export selected animations as PNG/WebP sequence or spritesheet.
3. Compress spritesheets.
4. Play frames in a lightweight effect layer.

### Option B: Add Web Spine Runtime

Use this only if the programmer wants true runtime skeleton playback.

Required work:

- Add a Spine runtime compatible with JSON `3.8` / `3.8.99`.
- Test every selected asset, because sources come from Cocos/Unity projects.
- Load `.json + .atlas/.atlas.txt + .png`.
- Create a full-screen effect layer above the fixed 9:20 game shell.
- Destroy or pool completed animation instances.

## Fixed 9:20 Coordinate Rule

The game should render inside a fixed `9:20` shell.

Recommended design coordinate system:

```text
designWidth = 1080
designHeight = 2400
scale = actualShellWidth / 1080
```

Spine positions should be mapped to the same shell, not the whole browser window.

For DOM tile positions:

1. Get tile DOM rect.
2. Get fixed shell rect.
3. Convert tile center into shell-local pixels.
4. Convert shell-local pixels to 1080x2400 design coordinates if the Spine layer uses design units.

## Suggested Hook Points

### Matched Tile

Current code:

```text
UI.animateMatch(tileA.id, tileB.id, callback)
```

Suggested effect:

```text
assets/p0_try_first/gameplay_tile_disappear/
animation: ANI_Game_block_disapear
```

Play once at each matched tile center, then remove tiles.

### Strong Match / Combo

Current code:

```text
UI.showCombo(count)
```

Suggested effect:

```text
assets/p0_try_first/gameplay_rainbow_fragments/
animation: Rainbow_fragments or Rainbow_fragments2
```

Use only for combo or special feedback to avoid visual noise.

### Win Modal

Current code:

```text
UI.showWinModal(...)
UI.showConfetti()
```

Suggested effects:

```text
assets/p0_try_first/win_ribbon/
animation: welldone_ribbone_1

assets/p0_try_first/win_partypopper/
animation: EFF_partypopper
```

Use these to replace or supplement the current CSS confetti.

### Tutorial / Guidance

Suggested effect:

```text
assets/p1_optional/guide_hand/
animations: Node_hand_01, Node_hand_02, Node_hand_03
```

Only integrate if a tutorial or first-level hint flow is added.

## Performance Rules

- Do not keep invisible Spine instances alive.
- Prefer pooling only after one effect is proven useful.
- Avoid playing multiple large effects at the same time.
- On low-end phones, test at least: tile match spam, win modal, level restart, orientation/browser resize.
- If frame rate drops, use offline spritesheets instead of runtime skeletons.

## Visual Rules

- Do not use text-heavy Spine effects unless the text is localized or replaced.
- Avoid World Cup / football / trophy / crown themed effects unless intentionally accepted by art direction.
- Keep Spine effects secondary to the African totem art skin.
- Tune opacity and scale. Some source effects are brighter than the current UI.

## Acceptance Before Shipping

Before enabling a Spine effect in production:

- It plays in the target browser.
- The animation name matches the manifest.
- The texture atlas loads without path issues.
- It is aligned in the fixed 9:20 shell.
- It does not block clicks.
- It is destroyed after playback.
- It does not visibly clash with the final PNG art skin.
