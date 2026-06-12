# First Screen Cutting Plan

Date: 2026-06-10

## Reusable Lessons Added After Delivery

The first-screen pipeline later exposed several reusable pitfalls. Before using this cutting plan for a new project, read:

```text
E:\参考图\麻将\项目\RESKIN_WORKFLOW_PLAYBOOK_20260611\01_END_TO_END_CASE_REVIEW.md
E:\参考图\麻将\项目\RESKIN_WORKFLOW_PLAYBOOK_20260611\03_ASSET_PRODUCTION_QA_CHECKLIST.md
E:\参考图\麻将\项目\RESKIN_WORKFLOW_PLAYBOOK_20260611\04_KNOWN_FAILURE_MODES.md
```

Key update:

- Do not accept a cut asset only because its outer PNG size and alpha channel are correct.
- Review visible residue and visible bbox in actual gameplay context.
- For tile symbols, generate tile-on-base preview sheets before acceptance.
- Some transparent padding is intentional for fixed slots; document it for programmers instead of auto-cropping delivery PNGs.

Scope:

- Only the normal gameplay screen.
- Fixed canvas: `1080x2400`, `9:20`.
- No code changes in this round.
- No other screens, dialogs, or menus.

## 1. Cut Order

### Step 1. Preserve the full composition

- Keep the selected effect image as the reference master.
- Use it as the source for all first-round crop boundaries.
- Do not redesign the layout during cutting.

### Step 2. Cut the full-screen background

- Asset: `bg_game_1080x2400.png`
- Role: entire full-bleed base layer.
- Notes: keep the woven texture, vignette, and dark central playfield tone.

### Step 3. Cut the top HUD family

- Asset: `hud_top_frame.png`
- Asset: `hud_btn_home_bg.png`
- Asset: `icon_home.png`
- Asset: `hud_center_plate.png`
- Asset: `icon_mask_level.png`
- Asset: `icon_timer.png`
- Asset: `hud_btn_pause_bg.png`
- Asset: `icon_pause.png`

### Step 4. Cut the board-stage family

- Asset: `board_stage_bg.png`
- Asset: `tile_base_ivory.png`
- Asset: `state_tile_shadow.png`
- Asset: `state_tile_selected_glow.png`
- Asset: `state_tile_blocked_overlay.png`
- Asset: `state_tile_covered_overlay.png`

### Step 5. Cut the tile symbol set

- Asset family: `tile_totem_01_*` to `tile_totem_34_*`
- Each symbol should be transparent and centered.
- Keep the symbol only, not the tile body.

### Step 6. Cut the bottom tray family

- Asset: `tool_tray_panel.png`
- Asset: `tool_btn_shell.png`
- Asset: `icon_hint.png`
- Asset: `icon_undo.png`
- Asset: `icon_shuffle.png`
- Asset: `badge_count_coin.png`

## 2. Suggested Canvas Boundaries

These boundaries are for resource planning, not a code layout rewrite.

| Region | Suggested Crop Area on 1080x2400 | Notes |
| --- | --- | --- |
| Top HUD | `x: 0-1080, y: 0-188` | Gold/wood header strip |
| Board stage | `x: 0-1080, y: 188-2026` | Central gameplay field |
| Bottom tray | `x: 0-1080, y: 2026-2400` | Tool panel strip |

The tile stack itself is inside the board-stage region and does not need a separate background crop.

## 3. P0 vs P1

### P0

Must ship first:

- Full-screen background
- Top HUD frame and controls
- Board-stage backdrop
- Tile base
- Tile shadow
- Selected glow
- Covered and blocked overlays
- 34 tile symbols
- Bottom tray
- Three tool buttons
- Count badge

### P1

Can be added after the first pass works:

- Texture variant layers
- Hover / hint sweep
- Match burst effect
- Disabled tool tint
- Tiny fallback label strip
- Modal panel family

## 4. Resource Naming Convention

Use this exact naming pattern:

```text
bg_game_1080x2400.png
hud_top_frame.png
hud_btn_home_bg.png
icon_home.png
hud_center_plate.png
icon_mask_level.png
icon_timer.png
hud_btn_pause_bg.png
icon_pause.png
board_stage_bg.png
tile_base_ivory.png
state_tile_shadow.png
state_tile_selected_glow.png
state_tile_blocked_overlay.png
state_tile_covered_overlay.png
tile_totem_01_sun_seed.png
...
tile_totem_34_heritage_knot.png
tool_tray_panel.png
tool_btn_shell.png
icon_hint.png
icon_undo.png
icon_shuffle.png
badge_count_coin.png
```

## 5. 接入位置

- `#app .game-shell` receives the full-screen background.
- `#app .top-hud` receives the top HUD assets.
- `#app .board-stage` receives the central playfield backdrop.
- `#app .board-stage .tile` receives the tile base plus symbol plus state overlays.
- `#app .bottom-tray` receives the bottom panel and tool buttons.

## 6. Cutting Rules

- Keep transparent edges clean.
- Do not bake large drop shadows into symbol PNGs.
- Keep tile symbols readable at small mobile size.
- Do not include Chinese mahjong text or old suit marks anywhere.
- Do not include browser chrome, watermark, or stray UI.
- Treat generated images as raw input only. Do not use raw image output directly as final game assets.
- All transparent assets must pass through the postprocess plan in `POSTPROCESS_PLAN.md`.
- Final PNG dimensions must exactly match `FIRST_SCREEN_ASSET_SPEC.json`.
- Future raw generation for transparent assets should use pure magenta `#FF00FF` background for chroma key removal, not green.
- Existing green-background raw samples may be processed as legacy inputs, but must be QA checked for green subject damage.
- Correct outer PNG dimensions are not sufficient. Transparent assets must also have normalized visible subject size.
- If a file has large alpha padding after background removal, postprocess must crop to alpha bbox and scale the subject back into the target canvas with controlled safe padding.
- For tile symbols, preview them composited on `tile_base_ivory.png`; judge final in-game scale from that composite, not from file dimensions alone.
- Do not use programmatic drawings as final first-screen P0 art. Pillow/CSS/SVG/Canvas-generated shapes are placeholders only unless the asset is explicitly a simple state overlay.
- Any procedural placeholder found in `processed` must be rejected and regenerated through image generation or reference-based editing.
- The full tile set must match the accepted sample assets in material, bevel, lighting, line thickness, and visual density.

## 7. Handoff Notes

- This spec only covers the normal gameplay page.
- It is ready for later asset generation or manual cutting.
- The next step after approval would be asset production, not code integration.
- Asset production has two stages: raw generation, then postprocess into exact final assets.
- Only `asset_work/processed/first_screen_p0` should be treated as integration-ready.

## 8. Postprocess Handoff

Read next:

- `POSTPROCESS_PLAN.md`
- `PROCESS_FIRST_SCREEN_ASSETS_SCRIPT_SPEC.md`

Required output after raw generation:

```text
asset_work/reports/first_screen_p0_postprocess_report.md
asset_work/reports/first_screen_p0_postprocess_report.json
asset_work/review/first_screen_p0/review_contact_sheet.png
```

Acceptance cannot be based on dimensions/alpha alone. The final acceptance report must include an art-direction consistency check against:

- selected gameplay effect image,
- `STYLE_BIBLE.md`,
- accepted sample assets from `first_screen_p0_v2`,
- and `TOTEM_TILE_MAP.md`.
