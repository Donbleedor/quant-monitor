# Final Magenta / Alpha Recheck

Date: 2026-06-11
Thresholds:
- suspicious pink = alpha > 10 and R > 220, B > 220, G < 120
- exact #FF00FF = RGB 255,0,255 with alpha > 10
- hard fail if suspicious pink pixels exceed 20 in a transparent asset

## First Screen P0 Final Candidate
- Required P0 assets with any visible pink residue: `16`
- Required P0 hard fails: `0`
- Required P0 alpha missing: `0`
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

## Menu
- Required local assets with any visible pink residue: `1`
- Required local hard fails: `0`
- `menu_vignette_bottom.png`: suspicious `0`, exact `0`
- `menu_pattern_overlay.png`: suspicious=1, exact=0, bbox=[0, 389, 1080, 2010], occupancy=[1.0, 0.6754]

## Modal P0
- Required P0 assets with any visible pink residue: `0`
- Required P0 hard fails: `0`
- Required P0 alpha missing: `0`
- none

## Conclusion
- No hard pink/alpha blockers remain in the delivered first-screen P0, menu required local assets, or modal P0 batches.
- The few visible pink pixels in first screen are soft warnings only and remain under threshold.
