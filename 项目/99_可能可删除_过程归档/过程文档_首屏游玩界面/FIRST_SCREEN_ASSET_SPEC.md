# First Screen Asset Spec

Date: 2026-06-10

Scope:

- Only the normal gameplay screen.
- Canvas: `1080x2400`, fixed `9:20` portrait.
- Reference source: the selected conservative gameplay effect image.
- Goal: split the first-round reusable UI and gameplay assets for later generation/cutting.

## 1. Layer Structure

1. Full-screen background.
2. Top HUD frame and controls.
3. Central board stage and tile stack.
4. Bottom tool tray and tool buttons.
5. Tile base, tile symbols, and tile state overlays.

The current visual is mostly baked into one composite image, but the asset plan below separates the reusable runtime pieces.

## 2. Naming Rules

- Use ASCII snake_case only.
- Prefix by category:
  - `bg_` for backgrounds
  - `hud_` for top bar assets
  - `board_` for board-stage assets
  - `tile_` for tile assets
  - `tool_` for bottom tool assets
  - `icon_` for standalone icons
  - `state_` for overlays and effects

## 3. P0 Must-Have Assets

| ID | Asset Name | Suggested File Name | Size | Transparent | Use | Attach / Position | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P0-01 | Full screen game background | `bg_game_1080x2400.png` | `1080x2400` | No | Dark emerald woven background with low-contrast pattern and vignette | `body > #app > .game-shell` full bleed | P0 |
| P0-02 | Top HUD frame | `hud_top_frame.png` | `1080x188` | Yes, around frame only | Gold/wood carved top strip | `#app .top-hud` | P0 |
| P0-03 | Home button shell | `hud_btn_home_bg.png` | `146x146` | Yes | Left control button container | `#app .top-hud .btn-home` | P0 |
| P0-04 | Home icon | `icon_home.png` | `88x88` | Yes | Return/home action | Centered inside home button shell | P0 |
| P0-05 | Center HUD plate | `hud_center_plate.png` | `620x140` | Yes | Level and timer carrier plate | `#app .top-hud .hud-center` | P0 |
| P0-06 | Level glyph / badge icon | `icon_mask_level.png` | `44x44` | Yes | Small decorative marker next to level | Left of `Lv. 12` in HUD center | P0 |
| P0-07 | Timer icon | `icon_timer.png` | `42x42` | Yes | Timer indicator | Left of time text in HUD center | P0 |
| P0-08 | Pause button shell | `hud_btn_pause_bg.png` | `146x146` | Yes | Right control button container | `#app .top-hud .btn-pause` | P0 |
| P0-09 | Pause icon | `icon_pause.png` | `72x72` | Yes | Pause action | Centered inside pause button shell | P0 |
| P0-10 | Board stage backdrop | `board_stage_bg.png` | `1080x1840` | No | Darkened central playfield area behind tiles | `#app .board-stage` | P0 |
| P0-11 | Tile base | `tile_base_ivory.png` | `168x201` | Yes | Main carved tile body | `#app .board-stage .tile` base layer | P0 |
| P0-12 | Tile shadow / depth | `state_tile_shadow.png` | `168x201` | Yes | Soft depth under tile stack | Under each tile in board stack | P0 |
| P0-13 | Tile selected outline | `state_tile_selected_glow.png` | `180x213` | Yes | Gold selected-state glow | Overlay on active tile | P0 |
| P0-14 | Tile blocked dim overlay | `state_tile_blocked_overlay.png` | `168x201` | Yes | Dimmed non-clickable state | Overlay on blocked tile | P0 |
| P0-15 | Tile covered overlay | `state_tile_covered_overlay.png` | `168x201` | Yes | Slightly darkened covered tile state | Overlay on lower stack tiles | P0 |
| P0-16 | Tile symbol set 01-34 | `tile_totem_01_*` to `tile_totem_34_*` | `96x96` each minimum | Yes | All totem tile face marks used by gameplay | Centered on tile base | P0 |
| P0-17 | Bottom tray panel | `tool_tray_panel.png` | `1080x374` | Yes | Wood/gold bottom bar | `#app .bottom-tray` | P0 |
| P0-18 | Tool button shell | `tool_btn_shell.png` | `182x182` | Yes | Circular green/gold button container | Used by hint / undo / shuffle | P0 |
| P0-19 | Hint icon | `icon_hint.png` | `88x88` | Yes | Hint action | Centered in hint button | P0 |
| P0-20 | Undo icon | `icon_undo.png` | `88x88` | Yes | Undo action | Centered in undo button | P0 |
| P0-21 | Shuffle icon | `icon_shuffle.png` | `88x88` | Yes | Mix / shuffle action | Centered in shuffle button | P0 |
| P0-22 | Count badge coin | `badge_count_coin.png` | `44x44` | Yes | Small tool count badge | Top-right of each tool button | P0 |

## 4. P1 Can-Add-Later Assets

| ID | Asset Name | Suggested File Name | Size | Transparent | Use | Attach / Position | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1-01 | Background texture variant | `bg_game_texture_variant.png` | `1080x2400` | No | Alternate paper/textile noise layer | Under `bg_game_1080x2400.png` | P1 |
| P1-02 | Tile highlight sweep | `state_tile_highlight.png` | `168x201` | Yes | Hover / hint sweep | Over tile face | P1 |
| P1-03 | Match burst effect | `state_match_burst.png` | `240x240` | Yes | Match feedback sparkle | Around matched pair | P1 |
| P1-04 | Disabled tool tint | `state_tool_disabled.png` | `182x182` | Yes | Disabled tool visual | Over tool button shell | P1 |
| P1-05 | Board edge vignette | `board_edge_vignette.png` | `1080x1840` | Yes | Extra depth around playfield | Above `board_stage_bg` | P1 |
| P1-06 | Icon fallback label strip | `tool_label_strip.png` | `120x30` | Yes | Tiny English fallback label zone | Under tool buttons if needed | P1 |
| P1-07 | Modal panel family | `modal_panel_dark_gold.png` | `864x720` | Yes | Reserved for future pause/restart dialogs | Not used on this first screen | P1 |

## 5. Tile Symbol Set

The first gameplay screen should support the full 34 logical tile identities already defined in `TOTEM_TILE_MAP.md`.

Recommended symbol filenames:

```text
tile_totem_01_sun_seed.png
tile_totem_02_twin_leaves.png
tile_totem_03_branch_cluster.png
tile_totem_04_flower_cross.png
tile_totem_05_palm_fan.png
tile_totem_06_rain_pair.png
tile_totem_07_water_wave.png
tile_totem_08_mountain_chevron.png
tile_totem_09_star_blossom.png
tile_totem_10_talking_drum.png
tile_totem_11_round_shield.png
tile_totem_12_cowrie_shell.png
tile_totem_13_woven_basket.png
tile_totem_14_clay_pot.png
tile_totem_15_comb_pick.png
tile_totem_16_bronze_bell.png
tile_totem_17_spear_tip.png
tile_totem_18_gold_bead.png
tile_totem_19_diamond_knot.png
tile_totem_20_zigzag_cloth.png
tile_totem_21_triple_triangle.png
tile_totem_22_spiral_sun.png
tile_totem_23_cross_weave.png
tile_totem_24_step_motif.png
tile_totem_25_ring_glyph.png
tile_totem_26_blue_stripe.png
tile_totem_27_green_lattice.png
tile_totem_28_mask_mark.png
tile_totem_29_baobab_tree.png
tile_totem_30_moon_bowl.png
tile_totem_31_fire_mark.png
tile_totem_32_water_drop.png
tile_totem_33_crown_token.png
tile_totem_34_heritage_knot.png
```

All tile symbols are transparent overlay assets. The tile body is shared through `tile_base_ivory.png`.

## 6. Recommended Screen Attachment Map

- `bg_game_1080x2400.png` fills the whole canvas.
- `hud_top_frame.png` anchors to `y: 0`.
- `board_stage_bg.png` spans the middle playfield.
- `tool_tray_panel.png` anchors to the bottom.
- `tile_base_ivory.png` and `tile_totem_*.png` compose every board tile.
- `tool_btn_shell.png`, `icon_hint.png`, `icon_undo.png`, `icon_shuffle.png`, and `badge_count_coin.png` compose the three bottom controls.

## 7. Acceptance Notes

- No Chinese mahjong text or old suit visuals.
- No menu or modal assets in this first-screen scope.
- All listed P0 assets are required to reproduce the selected gameplay page.
- P1 assets are optional polish and can be added after the basic first pass is working.

