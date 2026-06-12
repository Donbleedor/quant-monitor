# Final Art Recheck Report

Date: 2026-06-11
Decision: `ACCEPTED_FOR_ART_DELIVERY`

## Scope
- Rechecked `first_screen_p0_final_image`, `menu_p0`, `menu_p1`, and `modal_p0` after menu and modal?? closure.
- No image generation, no asset moves, no game code edits.
- This pass only reads assets, runs QA, and writes final recheck outputs.

## Summary
- First screen P0 required: `55`, found: `55`
- Menu required local assets: `12`, found: `12`
- Modal P0 required: `17`, found: `17`
- Menu vignette bottom fix: suspicious `0`, exact `0`
- Hard blocking issues remaining: `0`

## Batch Verdicts
- `first_screen_p0_final_image`: accepted.
- `menu_p0`: accepted.
- `menu_p1`: accepted; `menu_vignette_bottom.png` is clean after fix.
- `modal_p0`: accepted.

## Soft Warnings
- First screen still has low-count visible pink residues in a few transparent assets, but none exceed the hard-fail threshold.
- `hud_btn_home_bg.png`: suspicious=1, exact=0, bbox=[6, 5, 139, 141], occupancy=[0.911, 0.9315]
- `hud_center_plate.png`: suspicious=4, exact=1, bbox=[45, 2, 575, 138], occupancy=[0.8548, 0.9714]
- `state_tile_covered_overlay.png`: suspicious=8, exact=2, bbox=[12, 4, 156, 197], occupancy=[0.8571, 0.9602]
- `tile_totem_05_palm_fan.png`: suspicious=10, exact=2, bbox=[7, 5, 88, 91], occupancy=[0.8438, 0.8958]
- `tile_totem_09_star_blossom.png`: suspicious=1, exact=0, bbox=[5, 5, 90, 91], occupancy=[0.8854, 0.8958]
- `tile_totem_14_clay_pot.png`: suspicious=2, exact=0, bbox=[10, 5, 85, 91], occupancy=[0.7812, 0.8958]
- `tile_totem_15_comb_pick.png`: suspicious=2, exact=1, bbox=[21, 5, 74, 91], occupancy=[0.5521, 0.8958]
- `tile_totem_18_gold_bead.png`: suspicious=1, exact=0, bbox=[7, 5, 89, 91], occupancy=[0.8542, 0.8958]
- `tile_totem_21_triple_triangle.png`: suspicious=5, exact=1, bbox=[7, 12, 90, 84], occupancy=[0.8646, 0.75]
- `tile_totem_23_cross_weave.png`: suspicious=2, exact=2, bbox=[7, 5, 89, 91], occupancy=[0.8542, 0.8958]
- `tile_totem_26_blue_stripe.png`: suspicious=8, exact=3, bbox=[23, 14, 73, 62], occupancy=[0.5208, 0.5]
- `tile_totem_27_green_lattice.png`: suspicious=17, exact=6, bbox=[6, 11, 91, 84], occupancy=[0.8854, 0.7604]
- `tile_totem_29_baobab_tree.png`: suspicious=7, exact=5, bbox=[7, 10, 91, 85], occupancy=[0.875, 0.7812]
- `tile_totem_32_water_drop.png`: suspicious=5, exact=0, bbox=[5, 12, 91, 84], occupancy=[0.8958, 0.75]
- `tile_totem_33_crown_token.png`: suspicious=2, exact=0, bbox=[7, 5, 89, 91], occupancy=[0.8542, 0.8958]
- `tile_totem_34_heritage_knot.png`: suspicious=10, exact=1, bbox=[13, 11, 87, 84], occupancy=[0.7708, 0.7604]

## Notes
- P1 assets that are not delivered are treated as optional and do not block art delivery.
- `menu_vignette_bottom.png` now passes with suspicious pink `0` and exact `0`.
- Stale / rejected batches are excluded from delivery and the manifest only points to the final candidate or accepted integration directories.
