# ART Asset QA Report

Decision: `NEEDS_FIX_BEFORE_ART_DELIVERY`

## Key Findings
- First-screen final candidate: 55/62 assets found in the merged final directory.
- Menu P0 coverage: 12/14.
- Modal P0: raw-only; no processed modal batch exists yet.
- Menu P1 suspicious pink files: 2.

## Hard Issues
- `menu_work/processed/menu_p1/menu_vignette_bottom.png` contains a large visible pink residual and is a hard fail.
- Modal P0 has no processed acceptance batch; raw generation only.

## Batch Status
- `asset_work/processed/first_screen_p0`: `STALE`
- `asset_work/processed/first_screen_p0_v2`: `STALE`
- `asset_work/processed/first_screen_p0_image_completion`: `STALE`
- `asset_work/processed/first_screen_p0_completion`: `REJECTED_PLACEHOLDER`
- `asset_work/processed/first_screen_p0_final`: `STALE`
- `asset_work/processed/first_screen_p0_final_image`: `FINAL_CANDIDATE`
- `menu_work/processed/menu_p0`: `ACCEPTED`
- `menu_work/processed/menu_p1`: `NEEDS_FIX`
- `modal_work/raw_generated/modal_p0`: `PENDING_PROCESS`
- `modal_work/processed/modal_p0`: `PENDING_PROCESS`

## Notes
- `first_screen_p0_completion` shows historical `vector_render_magenta_fill` traces in the legacy reports and is treated as rejected/stale, not a final art source.
- `first_screen_p0_final_image` is the only first-screen batch treated as final-candidate here.
