# Stale and Rejected Batches

## Stale / Superseded
- `asset_work/processed/first_screen_p0`
- `asset_work/processed/first_screen_p0_v2`
- `asset_work/processed/first_screen_p0_image_completion`
- `asset_work/processed/first_screen_p0_final`

## Rejected Placeholder
- `asset_work/processed/first_screen_p0_completion`
  - legacy reports contain `vector_render_magenta_fill` / programmatic fill traces
  - treat as rejected placeholder, not delivery art

## Pending Process
- `modal_work/raw_generated/modal_p0`
  - raw source only
  - no `modal_work/processed/modal_p0` directory exists yet

## Needs Fix
- `menu_work/processed/menu_p1`
  - `menu_vignette_bottom.png` hard-fails pink residual QA
