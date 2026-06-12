# First Screen P0 Postprocess Report

Date: 2026-06-10

Scope:

- Only the current P0 small batch was processed.
- Raw originals in `asset_work/raw_generated/first_screen_p0` were preserved.
- Final assets were written to `asset_work/processed/first_screen_p0`.
- Tile symbols include a composite preview on `tile_base_ivory.png` for in-game scale QA.

Summary:

- Processed assets: 16
- Transparent assets: 14
- Opaque assets: 2
- Warning assets: 3

| File | Final Size | Visible BBox | Occupancy W x H | Warnings | Status |
| --- | --- | --- | --- | --- | --- |
| `bg_game_1080x2400.png` | `1080x2400` | `full canvas` | `1.00 x 1.00` | none | passed |
| `board_stage_bg.png` | `1080x1840` | `full canvas` | `1.00 x 1.00` | none | passed |
| `hud_top_frame.png` | `1080x188` | `(181, 4, 899, 184)` | `0.66 x 0.96` | none | passed |
| `icon_hint.png` | `88x88` | `(15, 9, 73, 79)` | `0.66 x 0.80` | none | passed |
| `icon_home.png` | `88x88` | `(9, 10, 79, 78)` | `0.80 x 0.77` | none | passed |
| `icon_pause.png` | `72x72` | `(12, 7, 60, 65)` | `0.67 x 0.81` | none | passed |
| `icon_shuffle.png` | `88x88` | `(9, 9, 78, 79)` | `0.78 x 0.80` | none | passed |
| `icon_undo.png` | `88x88` | `(15, 9, 73, 79)` | `0.66 x 0.80` | none | passed |
| `tile_base_ivory.png` | `168x201` | `(11, 6, 157, 195)` | `0.87 x 0.94` | none | passed |
| `tile_totem_01_sun_seed.png` | `96x96` | `(9, 7, 86, 88)` | `0.80 x 0.84` | none | passed |
| `tile_totem_07_water_wave.png` | `96x96` | `(7, 14, 88, 82)` | `0.84 x 0.71` | none | passed |
| `tile_totem_10_talking_drum.png` | `96x96` | `(20, 7, 76, 88)` | `0.58 x 0.84` | accepted_narrow_symbol | passed |
| `tile_totem_12_cowrie_shell.png` | `96x96` | `(19, 7, 76, 88)` | `0.59 x 0.84` | accepted_narrow_symbol | passed |
| `tile_totem_19_diamond_knot.png` | `96x96` | `(7, 7, 88, 88)` | `0.84 x 0.84` | none | passed |
| `tile_totem_28_mask_mark.png` | `96x96` | `(26, 7, 69, 88)` | `0.45 x 0.84` | accepted_narrow_symbol | passed |
| `tool_tray_panel.png` | `1080x374` | `(22, 50, 1057, 323)` | `0.96 x 0.73` | none | passed |

Warnings observed:

- `tile_totem_10_talking_drum.png`: accepted_narrow_symbol
- `tile_totem_12_cowrie_shell.png`: accepted_narrow_symbol
- `tile_totem_28_mask_mark.png`: accepted_narrow_symbol

Review sheet:

- `asset_work/review/first_screen_p0/review_contact_sheet.png`

Notes:

- `bg_game_1080x2400.png` and `board_stage_bg.png` were treated as opaque cover-fit assets.
- `transparent` assets were normalized by alpha bbox crop, then fit into exact target canvases with family-specific safe padding.
- Tile symbol scale was additionally QA-checked via composite previews on `tile_base_ivory.png`.