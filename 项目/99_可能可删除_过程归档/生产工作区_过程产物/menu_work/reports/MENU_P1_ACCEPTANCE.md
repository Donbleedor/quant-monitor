# Menu P1 Acceptance

Date: 2026-06-11

Decision: `ACCEPTED_FOR_INTEGRATION`

## Scope Checked

- `MENU_SCREEN_ASSET_SPEC.json`
- `menu_work/processed/menu_p1`
- `menu_work/review/menu_p1`
- `menu_work/reports/MENU_P1_POSTPROCESS_REPORT.md`
- `menu_work/reports/MENU_P1_POSTPROCESS_REPORT.json`

## P1 Coverage Check

The menu P1 closure batch covers the menu-specific follow-up assets from the spec:

- `title_tribal_tiles.png`
- `icon_levels.png`
- `icon_daily.png`
- `tool_btn_shell.png`
- `badge_count_coin.png`
- `tile_base_ivory.png`
- `menu_pattern_overlay.png`
- `menu_vignette_top.png`
- `menu_vignette_bottom.png`

No P1 menu asset required for this closure is missing.

## Size Check

All P1 outputs match their target dimensions exactly. The repaired `menu_vignette_bottom.png` is `1080x620`.

## Transparency And BBox Check

All P1 assets are transparent where required and alpha-normalized successfully. The repaired `menu_vignette_bottom.png` retains alpha and has visible bbox `[1, 265, 1079, 620]` with occupancy `[0.9981, 0.5726]`.

Soft note:

- `title_tribal_tiles.png` is slightly narrow relative to the fallback wordmark target, but still usable for integration.

## Hard Fail Check

No hard failures remain after the bottom vignette repair.

- `menu_vignette_bottom.png` suspicious pink: `496674` -> `0`
- `menu_vignette_bottom.png` exact `#FF00FF`: `37` -> `0`
- no missing required P1 menu asset
- no incorrect output dimensions
- no missing alpha on transparent assets
- no watermark or signature
- no wrong asset type
- no broken postprocess normalization

## Conclusion

`ACCEPTED_FOR_INTEGRATION`
