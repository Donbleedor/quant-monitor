# Global Asset Location Map

## Directories

- `asset_work/raw_generated`
- `asset_work/processed`
- `asset_work/review`
- `asset_work/reports`
- `menu_work/raw_generated`
- `menu_work/processed`
- `menu_work/review`
- `menu_work/reports`
- `modal_work/raw_generated`
- `modal_work/reports`

## Batch Map

| Batch | Location | Status |
| --- | --- | --- |
| first_screen_p0 | `asset_work/processed/first_screen_p0` | STALE |
| first_screen_p0_v2 | `asset_work/processed/first_screen_p0_v2` | STALE |
| first_screen_p0_image_completion | `asset_work/processed/first_screen_p0_image_completion` | STALE |
| first_screen_p0_completion | `asset_work/processed/first_screen_p0_completion` | REJECTED_PLACEHOLDER |
| first_screen_p0_final | `asset_work/processed/first_screen_p0_final` | STALE |
| first_screen_p0_final_image | `asset_work/processed/first_screen_p0_final_image` | FINAL_CANDIDATE |
| menu_p0 | `menu_work/processed/menu_p0` | ACCEPTED |
| menu_p1 | `menu_work/processed/menu_p1` | NEEDS_FIX |
| modal_p0 raw | `modal_work/raw_generated/modal_p0` | PENDING_PROCESS |

## Delivery Priority

1. `asset_work/processed/first_screen_p0_final_image`
2. `menu_work/processed/menu_p0`
3. `menu_work/processed/menu_p1` if fixed
4. `modal_work/processed/modal_p0` once created
5. `modal_work/raw_generated/modal_p0` is source only
