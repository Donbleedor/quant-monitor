# Magenta / Alpha Issues

Thresholds used:
- suspicious pink = alpha > 10 and R > 220, B > 220, G < 120
- exact magenta = RGB 255,0,255 with alpha > 10
- hard fail if suspicious pink pixels exceed 20 in a transparent asset

## First-screen final image
- `hud_btn_home_bg.png`: suspicious=1, exact=0, occupancy=[0.911, 0.9315], hard_fail=False
- `hud_center_plate.png`: suspicious=4, exact=1, occupancy=[0.8548, 0.9714], hard_fail=False
- `state_tile_covered_overlay.png`: suspicious=8, exact=2, occupancy=[0.8571, 0.9602], hard_fail=False
- `tile_totem_05_palm_fan.png`: suspicious=10, exact=2, occupancy=[0.8438, 0.8958], hard_fail=False
- `tile_totem_09_star_blossom.png`: suspicious=1, exact=0, occupancy=[0.8854, 0.8958], hard_fail=False
- `tile_totem_14_clay_pot.png`: suspicious=2, exact=0, occupancy=[0.7812, 0.8958], hard_fail=False
- `tile_totem_15_comb_pick.png`: suspicious=2, exact=1, occupancy=[0.5521, 0.8958], hard_fail=False
- `tile_totem_18_gold_bead.png`: suspicious=1, exact=0, occupancy=[0.8542, 0.8958], hard_fail=False
- `tile_totem_21_triple_triangle.png`: suspicious=5, exact=1, occupancy=[0.8958, 0.75], hard_fail=False
- `tile_totem_23_cross_weave.png`: suspicious=2, exact=2, occupancy=[0.8542, 0.8958], hard_fail=False
- `tile_totem_26_blue_stripe.png`: suspicious=8, exact=3, occupancy=[0.8958, 0.6979], hard_fail=False
- `tile_totem_27_green_lattice.png`: suspicious=17, exact=6, occupancy=[0.8958, 0.7604], hard_fail=False
- `tile_totem_29_baobab_tree.png`: suspicious=7, exact=5, occupancy=[0.8958, 0.7812], hard_fail=False
- `tile_totem_32_water_drop.png`: suspicious=5, exact=0, occupancy=[0.8958, 0.75], hard_fail=False
- `tile_totem_33_crown_token.png`: suspicious=2, exact=0, occupancy=[0.8542, 0.8958], hard_fail=False
- `tile_totem_34_heritage_knot.png`: suspicious=10, exact=1, occupancy=[0.8958, 0.7604], hard_fail=False

## Menu P1
- `menu_pattern_overlay.png`: suspicious=1, exact=0, occupancy=[1.0, 0.6754], hard_fail=False
- `menu_vignette_bottom.png`: suspicious=496674, exact=37, occupancy=[0.9981, 1.0], hard_fail=True
- `menu_vignette_bottom.png` is the blocking issue and should be regenerated or postprocessed again.

## Alpha Notes
- All transparent assets in the first-screen final candidate have alpha present.
- Modal raw assets are still source-only and should not be treated as delivered transparent assets.
