# Menu P1 Postprocess Report

Date: 2026-06-11

Scope: menu_p1 only. No first_screen_p0, menu_p0, or unrelated menu_p1 assets were touched during the vignette??.

Decision: `ACCEPTED_FOR_INTEGRATION`

## Outputs

- Raw: `menu_work/raw_generated/menu_p1`
- Processed: `menu_work/processed/menu_p1`
- Review: `menu_work/review/menu_p1`
- Before-fix evidence: `menu_work/review/menu_p1/menu_vignette_bottom_before_fix.png`
- Fix comparison: `menu_work/review/menu_p1/menu_vignette_bottom_fix_compare.png`

## Results

- `title_tribal_tiles.png` -> `620x160` | status: passed_with_warnings | warnings: family_scale_mismatch
- `icon_levels.png` -> `88x88` | status: passed | warnings: none
- `icon_daily.png` -> `88x88` | status: passed | warnings: none
- `tool_btn_shell.png` -> `182x182` | status: passed | warnings: none
- `badge_count_coin.png` -> `44x44` | status: passed | warnings: none
- `tile_base_ivory.png` -> `168x201` | status: passed | warnings: none
- `menu_pattern_overlay.png` -> `1080x2400` | status: passed | warnings: none
- `menu_vignette_top.png` -> `1080x520` | status: passed | warnings: none
- `menu_vignette_bottom.png` -> `1080x620` | status: passed | warnings: none | pink 496674 -> 0 | exact #FF00FF 37 -> 0

## Vignette Bottom Fix

- Target file: `menu_work/processed/menu_p1/menu_vignette_bottom.png`
- Method: processed chroma-key cleanup; pixels matching `alpha > 10 and R > 220 and B > 220 and G < 120` were converted to transparent alpha.
- Before: suspicious pink = `496674`, exact `#FF00FF` = `37`.
- After: suspicious pink = `0`, exact `#FF00FF` = `0`.
- Size: `1080x620`.
- Alpha present: `true`.

## Notes

- Original failing file was preserved before cleanup.
- The bottom vignette remains a transparent decorative layer and now passes the magenta/alpha hard-fail check.
