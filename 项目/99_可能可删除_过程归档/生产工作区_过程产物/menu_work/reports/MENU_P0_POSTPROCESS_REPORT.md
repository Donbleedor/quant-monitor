# Menu P0 Postprocess Report

Date: 2026-06-11

Scope: menu_p0 only. No first_screen_p0 assets were touched.

## Outputs

- Raw: `E:\参考图\麻将\项目\menu_work\raw_generated\menu_p0`
- Processed: `E:\参考图\麻将\项目\menu_work\processed\menu_p0`
- Review: `E:\参考图\麻将\项目\menu_work\review\menu_p0`
- Contact sheet: `E:\参考图\麻将\项目\menu_work\review\menu_p0\menu_p0_review_contact_sheet.png`

## Results

- `logo_tribal_tiles.png` -> `760x420` | status: passed | warnings: none
- `button_play_large.png` -> `780x260` | status: passed | warnings: none
- `icon_settings.png` -> `88x88` | status: passed | warnings: none

## Notes

- Alpha removal used the magenta chroma key helper and then normalized visible bounds to the final canvas size.
- All outputs landed on exact target dimensions from `MENU_SCREEN_ASSET_SPEC.json`.