# Visual QA Reopened - First Screen P0

Date: 2026-06-11

Decision: `REVOKED_NEEDS_VISUAL_FIX`

## Follow-Up

The issue documented here was later repaired inside the V2 programmer delivery package:

```text
E:\参考图\麻将\项目\ART_DELIVERY_TO_PROGRAMMER_20260611_V2_FIXED
```

For future projects, the reusable process has been distilled into:

```text
E:\参考图\麻将\项目\RESKIN_WORKFLOW_PLAYBOOK_20260611\03_ASSET_PRODUCTION_QA_CHECKLIST.md
E:\参考图\麻将\项目\RESKIN_WORKFLOW_PLAYBOOK_20260611\04_KNOWN_FAILURE_MODES.md
E:\参考图\麻将\项目\RESKIN_WORKFLOW_PLAYBOOK_20260611\05_DELIVERY_PACKAGE_STANDARD.md
```

## Why The Previous Acceptance Failed

The previous QA relied too heavily on dimensions, alpha presence, exact `#FF00FF` counts, and a strict pink threshold.

Manual review showed visible failures that those checks did not catch:

- visible magenta/pink residue where the raw background was not fully removed
- state effects rendered as bright magenta/pink instead of game-usable overlays
- assets with visually excessive empty canvas or weak visible occupancy

## Confirmed Blocking Files

These files must be repaired before programming integration:

```text
ART_DELIVERY_TO_PROGRAMMER_20260611/assets/gameplay/first_screen_p0/state_tile_selected_glow.png
ART_DELIVERY_TO_PROGRAMMER_20260611/assets/gameplay/first_screen_p0/state_tile_shadow.png
ART_DELIVERY_TO_PROGRAMMER_20260611/assets/gameplay/first_screen_p0/tile_totem_21_triple_triangle.png
ART_DELIVERY_TO_PROGRAMMER_20260611/assets/gameplay/first_screen_p0/tile_totem_27_green_lattice.png
ART_DELIVERY_TO_PROGRAMMER_20260611/assets/gameplay/first_screen_p0/tile_totem_29_baobab_tree.png
ART_DELIVERY_TO_PROGRAMMER_20260611/assets/gameplay/first_screen_p0/tile_totem_32_water_drop.png
ART_DELIVERY_TO_PROGRAMMER_20260611/assets/gameplay/first_screen_p0/tile_totem_34_heritage_knot.png
```

Likely additional review candidates:

```text
tile_totem_05_palm_fan.png
tile_totem_23_cross_weave.png
tile_totem_26_blue_stripe.png
hud_top_frame.png
icon_mask_level.png
icon_timer.png
```

## Revised QA Requirements

Future QA must include:

- broad pink/purple detection, not only exact or strict magenta
- manual review of all state overlays
- manual review on checkerboard, white, dark green, and in-game tile-base backgrounds
- alpha bbox/visible occupancy thresholds by asset family
- contact sheets large enough to inspect 96x96 symbols, not tiny overview thumbnails

Do not mark the art package as accepted until these issues are repaired and rechecked.
