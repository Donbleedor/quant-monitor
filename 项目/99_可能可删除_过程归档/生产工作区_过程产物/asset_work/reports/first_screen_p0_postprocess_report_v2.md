# First Screen P0 Postprocess Report V2

Date: 2026-06-10

Scope:

- Reprocessed the current P0 small batch with tighter alpha-bbox normalization.
- Raw originals were preserved.
- Final assets were written to `asset_work/processed/first_screen_p0_v2`.
- Tile symbols still include composited previews on `tile_base_ivory.png`.

| File | Final Size | Visible BBox | Occupancy W x H | Warnings | Status |
| --- | --- | --- | --- | --- | --- |
| `bg_game_1080x2400.png` | `1080x2400` | `full canvas` | `1.00 x 1.00` | none | passed |
| `board_stage_bg.png` | `1080x1840` | `full canvas` | `1.00 x 1.00` | none | passed |
| `hud_top_frame.png` | `1080x188` | `(173, 2, 907, 186)` | `0.68 x 0.98` | none | passed |
| `icon_hint.png` | `88x88` | `(11, 4, 77, 83)` | `0.75 x 0.90` | none | passed |
| `icon_home.png` | `88x88` | `(4, 5, 83, 82)` | `0.90 x 0.88` | none | passed |
| `icon_pause.png` | `72x72` | `(9, 3, 63, 68)` | `0.75 x 0.90` | none | passed |
| `icon_shuffle.png` | `88x88` | `(5, 4, 83, 83)` | `0.89 x 0.90` | none | passed |
| `icon_undo.png` | `88x88` | `(11, 4, 77, 83)` | `0.75 x 0.90` | none | passed |
| `tile_base_ivory.png` | `168x201` | `(9, 4, 158, 197)` | `0.89 x 0.96` | none | passed |
| `tile_totem_01_sun_seed.png` | `96x96` | `(4, 2, 92, 94)` | `0.92 x 0.96` | none | passed |
| `tile_totem_07_water_wave.png` | `96x96` | `(2, 9, 94, 86)` | `0.96 x 0.80` | none | passed |
| `tile_totem_10_talking_drum.png` | `96x96` | `(16, 2, 80, 94)` | `0.67 x 0.96` | none | passed |
| `tile_totem_12_cowrie_shell.png` | `96x96` | `(15, 2, 80, 94)` | `0.68 x 0.96` | none | passed |
| `tile_totem_19_diamond_knot.png` | `96x96` | `(2, 2, 94, 94)` | `0.96 x 0.96` | none | passed |
| `tile_totem_28_mask_mark.png` | `96x96` | `(23, 2, 72, 94)` | `0.51 x 0.96` | accepted_narrow_symbol | passed |
| `tool_tray_panel.png` | `1080x374` | `(12, 47, 1068, 326)` | `0.98 x 0.75` | none | passed |

Warnings observed:

- `tile_totem_28_mask_mark.png`: accepted_narrow_symbol

Review sheet:

- `asset_work/review/first_screen_p0_v2/review_contact_sheet.png`