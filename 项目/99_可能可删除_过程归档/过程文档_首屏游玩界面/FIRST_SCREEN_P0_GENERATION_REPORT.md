# First Screen P0 Generation Report

Date: 2026-06-10

Scope:

- Only P0 assets for the normal gameplay screen.
- No P1 assets were generated.
- No game code was changed.
- No assets were cut into the project directory itself; outputs were written to the raw generation workspace.

Output directory:

- `E:\参考图\麻将\项目\asset_work\raw_generated\first_screen_p0`

Generated assets:

| File | Size | Notes |
| --- | --- | --- |
| `bg_game_1080x2400.png` | `1080x2400` | opaque background |
| `board_stage_bg.png` | `1080x1840` | opaque background |
| `hud_top_frame.png` | `1080x188` | transparent cutout |
| `tool_tray_panel.png` | `1080x374` | transparent cutout |
| `tile_base_ivory.png` | `168x201` | transparent cutout |
| `icon_home.png` | `88x88` | transparent cutout |
| `icon_pause.png` | `72x72` | transparent cutout |
| `icon_hint.png` | `88x88` | transparent cutout |
| `icon_undo.png` | `88x88` | transparent cutout |
| `icon_shuffle.png` | `88x88` | transparent cutout |
| `tile_totem_01_sun_seed.png` | `96x96` | transparent cutout |
| `tile_totem_10_talking_drum.png` | `96x96` | transparent cutout |
| `tile_totem_19_diamond_knot.png` | `96x96` | transparent cutout |
| `tile_totem_28_mask_mark.png` | `96x96` | transparent cutout |
| `tile_totem_07_water_wave.png` | `96x96` | transparent cutout |
| `tile_totem_12_cowrie_shell.png` | `96x96` | transparent cutout |

Included in this small batch:

- Background and board-stage base layers
- Top HUD frame
- Bottom tool tray panel
- Tile base
- Six representative totem symbols only: `sun_seed`, `talking_drum`, `diamond_knot`, `mask_mark`, `water_wave`, `cowrie_shell`
- Core icons: home, pause, hint, undo, shuffle

Not generated in this batch:

- Full 34-tile symbol set
- P1 polish assets
- Count badge, disabled tint, highlight sweep, match burst, modal family

Notes:

- The transparent assets were chroma-key removed from flat green backgrounds and then resized or centered into the target canvas sizes.
- The result is a first-pass P0 batch suitable for integration testing and follow-up asset expansion.