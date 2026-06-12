# First Screen P0 Acceptance

Date: 2026-06-11

Conclusion: `NEEDS_FIX_BEFORE_INTEGRATION`

Reason: the processed directory does not yet cover the full P0 required resource set from `FIRST_SCREEN_ASSET_SPEC.json`.

## Coverage

- Expected P0 assets from spec: 55
- Present in processed directory: 16
- Missing P0 assets: 39
- Extra files in processed directory: 0

## Blocking

1. Missing P0 resources. The following required assets are absent from `asset_work/processed/first_screen_p0_v2` and must be produced before integration:

- top_hud
  - `hud_btn_home_bg.png` `146x146` transparent=true
  - `hud_center_plate.png` `620x140` transparent=true
  - `icon_mask_level.png` `44x44` transparent=true
  - `icon_timer.png` `42x42` transparent=true
  - `hud_btn_pause_bg.png` `146x146` transparent=true
- board_tiles
  - `state_tile_shadow.png` `168x201` transparent=true
  - `state_tile_selected_glow.png` `180x213` transparent=true
  - `state_tile_blocked_overlay.png` `168x201` transparent=true
  - `state_tile_covered_overlay.png` `168x201` transparent=true
- tile_symbols
  - `tile_totem_02_twin_leaves.png` `96x96` transparent=true
  - `tile_totem_03_branch_cluster.png` `96x96` transparent=true
  - `tile_totem_04_flower_cross.png` `96x96` transparent=true
  - `tile_totem_05_palm_fan.png` `96x96` transparent=true
  - `tile_totem_06_rain_pair.png` `96x96` transparent=true
  - `tile_totem_08_mountain_chevron.png` `96x96` transparent=true
  - `tile_totem_09_star_blossom.png` `96x96` transparent=true
  - `tile_totem_11_round_shield.png` `96x96` transparent=true
  - `tile_totem_13_woven_basket.png` `96x96` transparent=true
  - `tile_totem_14_clay_pot.png` `96x96` transparent=true
  - `tile_totem_15_comb_pick.png` `96x96` transparent=true
  - `tile_totem_16_bronze_bell.png` `96x96` transparent=true
  - `tile_totem_17_spear_tip.png` `96x96` transparent=true
  - `tile_totem_18_gold_bead.png` `96x96` transparent=true
  - `tile_totem_20_zigzag_cloth.png` `96x96` transparent=true
  - `tile_totem_21_triple_triangle.png` `96x96` transparent=true
  - `tile_totem_22_spiral_sun.png` `96x96` transparent=true
  - `tile_totem_23_cross_weave.png` `96x96` transparent=true
  - `tile_totem_24_step_motif.png` `96x96` transparent=true
  - `tile_totem_25_ring_glyph.png` `96x96` transparent=true
  - `tile_totem_26_blue_stripe.png` `96x96` transparent=true
  - `tile_totem_27_green_lattice.png` `96x96` transparent=true
  - `tile_totem_29_baobab_tree.png` `96x96` transparent=true
  - `tile_totem_30_moon_bowl.png` `96x96` transparent=true
  - `tile_totem_31_fire_mark.png` `96x96` transparent=true
  - `tile_totem_32_water_drop.png` `96x96` transparent=true
  - `tile_totem_33_crown_token.png` `96x96` transparent=true
  - `tile_totem_34_heritage_knot.png` `96x96` transparent=true
- bottom_tray
  - `tool_btn_shell.png` `182x182` transparent=true
  - `badge_count_coin.png` `44x44` transparent=true

2. The current directory only contains the first 16 assets of the P0 batch, so the spec-defined P0 surface is incomplete.

## Non-blocking

1. For the assets that are present, size checks match the spec exactly.
2. Transparent resources that are present do have alpha.
3. Visible bbox normalization looks reasonable for the current batch; no hard failure was found in the checked files.
4. `tile_totem_28_mask_mark.png` remains intentionally narrow and is labeled `accepted_narrow_symbol`.

## Validation Summary

- Size mismatches: none
- Alpha missing on transparent assets: none
- Hard-fail metadata issues: none
- Soft warnings observed:
  - `tile_totem_28_mask_mark.png`: accepted_narrow_symbol

## Verdict Notes

- This is not an integration-ready P0 set yet because coverage is incomplete.
- Once the missing resources are added, rerun the same checks and this can be re-evaluated.

## References

- Spec: `FIRST_SCREEN_ASSET_SPEC.json`
- Processed assets: `asset_work/processed/first_screen_p0_v2`
- Review sheet: `asset_work\review\first_screen_p0_v2\review_contact_sheet.png`