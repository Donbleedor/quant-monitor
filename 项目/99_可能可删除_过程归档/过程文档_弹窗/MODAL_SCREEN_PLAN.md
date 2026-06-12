# Modal Screen Plan

Date: 2026-06-11

Project: Mahjong V2 reskin

## 1. Goal

Build the modal and overlay family for the reskin in the same West African / Nigerian-inspired visual language as the menu and gameplay layers.

Covered screen types:

- Pause modal
- Settings modal
- Win modal
- Level select modal

Constraints:

- Fixed production canvas: `1080x2400`
- Runtime shell: fixed `9:20`
- Minimal English text only
- No game code changes in this phase
- Final art must come from image generation or reference-based image editing
- Transparent assets must be generated on pure magenta `#FF00FF` before postprocess

## 2. Screen Family Summary

### Pause

Purpose:

- Suspend gameplay and let the player resume, restart, or return home.

Visual intent:

- Quiet dark-green modal shell
- Strong icon-led actions
- Short labels only if needed: `Resume`, `Restart`, `Home`

### Settings

Purpose:

- Configure sound, music, accessibility, and data reset options.

Visual intent:

- Dense utility panel
- Toggle rows with carved gold/ivory treatment
- English labels only

### Win

Purpose:

- Celebrate level completion and show performance stats.

Visual intent:

- More ornate than pause/settings
- Gold reward language
- Stars, score/stat chips, and next/home actions

### Level Select

Purpose:

- Let the player choose a level or chapter node.

Visual intent:

- Larger panel
- Grid of carved node buttons
- Locked/current/completed states must remain obvious at small size

## 3. 9:20 Layout Regions

The modal family should live inside the same fixed portrait shell as the gameplay and menu screens.

Recommended design regions on the `1080x2400` canvas:

- Full-screen overlay: `0,0,1080,2400`
- Upper breathing band: `0,0,1080,320`
- Main modal body: `90,360,900,1680`
- Action band: `120,1800,840,340`
- Bottom safe area: `0,2200,1080,200`

Modal-specific guidance:

- Pause and settings should feel compact and centered.
- Win may use a slightly taller body than pause.
- Level select may use the widest panel footprint of the family.

## 4. Shared Assets

These are shared with the menu / gameplay art language and should not be reinvented per modal:

- `bg_game_1080x2400.png`
- deep emerald woven background family
- antique gold trim language
- warm ivory carved stone material language
- rounded green/gold button shell language
- shared icon language

Important:

- `bg_game_1080x2400.png` is a shared reference layer, not a modal-specific dependency.
- Keep the modal system compatible with the future shared background path:
  `E:\参考图\麻将\项目\asset_work\processed\shared\bg_game_1080x2400.png`

## 5. Modal-Exclusive Assets

P0 focus:

- overlay dim layer
- reusable modal panel shell
- action icons
- primary and secondary action shells
- level node state assets
- settings toggle parts
- win stat chips

P1 follow-up:

- ornamental panel variants
- level state polish variants
- decorative separators
- win embellishment layers
- accessibility polish assets

## 6. Priority Rules

P0 means:

- Required for first usable modal closure
- Must be ready before any code integration pass
- Must read clearly on a `720x1600` device family

P1 means:

- Follow-up polish
- Alternate variants
- Decorative or state-refinement assets that are useful but not blocking

## 7. Modal-by-Modal Priority

### Pause

- P0: overlay, panel, resume/restart/home icons, button shells
- P1: ornamental header strip and decorative separators

### Settings

- P0: overlay, panel, toggle track and knob, close icon, data-reset icon
- P1: row plates, accessibility badges, subtle label ornaments

### Win

- P0: overlay, panel, next/home icons, star icon, stat chips
- P1: medal/emblem accents, confetti token art, score flourish

### Level Select

- P0: overlay, panel, node shells for open/current/locked, close icon, lock icon
- P1: completed badge, page/chapter ornament, level-count badge

## 8. Output Expectation For Later Production

When production starts, the workflow should be:

1. Generate a small batch of raw modal concept art and component assets.
2. Postprocess all transparent assets with magenta-key removal.
3. Normalize alpha bounding boxes and exact output sizes.
4. QA with contact sheets before acceptance.

