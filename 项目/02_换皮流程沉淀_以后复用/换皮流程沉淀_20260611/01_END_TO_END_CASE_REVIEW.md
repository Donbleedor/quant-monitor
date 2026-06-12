# End-To-End Case Review

This document summarizes the Mahjong V2 reskin run from planning to programmer delivery.

## 1. Brief And Constraints

The project started with a fully AI-generated H5 Mahjong demo. The goal was not to keep a traditional Mahjong look, but to turn it into a West African / Nigerian-inspired totem tile matching game.

Confirmed constraints:

- Gameplay logic stays unchanged.
- Mahjong tiles become totem matching tiles.
- UI uses minimal text; English only if text is unavoidable.
- Runtime target is a fixed portrait shell, `9:20`, with `1080x2400` art canvas and `720x1600` reference device.
- Assets must be image-generated or reference-edited final art, not programmatic placeholders.

Main planning documents:

- `RESKIN_BRIEF.md`
- `SCREEN_INVENTORY.md`
- `STYLE_BIBLE.md`
- `TOTEM_TILE_MAP.md`
- `FIRST_SCREEN_LAYOUT_SPEC.md`
- `POSTPROCESS_PLAN.md`

## 2. First Screen Production

The first usable gameplay screen was selected as the pipeline proving ground.

Created:

- `FIRST_SCREEN_ASSET_SPEC.md/json`
- `FIRST_SCREEN_CUTTING_PLAN.md`
- `IMAGE_PROMPT_PACK.md`
- `PROCESS_FIRST_SCREEN_ASSETS_SCRIPT_SPEC.md`

Important production lessons:

- The first image-generated batch only covered part of the P0 set.
- A later agent hallucinated a completion batch using programmatic/vector-like art. This was rejected because style consistency and image-generation provenance matter.
- The accepted gameplay set eventually came from `first_screen_p0_final_image`, then needed one more manual visual fix inside the programmer delivery package.

## 3. Menu Production

Menu assets were produced in P0 and P1 batches.

Accepted reports:

- `MENU_P0_ACCEPTANCE.md`
- `MENU_P1_ACCEPTANCE.md`
- `MENU_INTEGRATION_HANDOFF.md`

Pitfall:

- `menu_vignette_bottom.png` initially passed earlier checks but had massive visible magenta residue.
- It was fixed from `496674` suspicious pink pixels to `0`.

## 4. Modal Production

Modal P0 initially had raw images only. A raw-only state is not delivery-ready.

Modal P0 also had three bad components:

- `modal_panel_large.png`
- `btn_modal_primary.png`
- `btn_modal_secondary.png`

These were regenerated and accepted.

Lesson:

- If raw source geometry is wrong, postprocess cannot fully save it.
- Regenerate small failed components instead of forcing crop/resize to pass.

## 5. First Final Acceptance Failed

The first final acceptance concluded:

```text
ACCEPTED_FOR_ART_DELIVERY
```

That conclusion was wrong.

Manual review found obvious gameplay issues:

- visible magenta/pink residue on tile symbols
- state overlays rendered as bright magenta/pink
- alpha canvas looked correct but visible content was not clean

The delivery package was revoked with:

- `DO_NOT_USE_VISUAL_QA_REOPENED.md`
- `VISUAL_QA_REOPENED_FIRST_SCREEN_P0.md`

## 6. Gameplay Visual Fix

The gameplay folder was repaired in-place inside the delivery package.

Fixed examples:

- `state_tile_selected_glow.png`
- `state_tile_shadow.png`
- `tile_totem_21_triple_triangle.png`
- `tile_totem_27_green_lattice.png`
- `tile_totem_29_baobab_tree.png`
- `tile_totem_32_water_drop.png`
- `tile_totem_34_heritage_knot.png`

Required visual checks:

- white background
- dark emerald background
- checkerboard background
- tile-on-base preview

## 7. Final Programmer Handoff

The final clean package is:

```text
ART_DELIVERY_TO_PROGRAMMER_20260611_V2_FIXED
```

It contains:

- gameplay P0: 55 PNG
- menu P0: 3 PNG
- menu P1: 9 PNG
- modal P0: 17 PNG
- total: 84 PNG

Final status:

```text
READY_FOR_PROGRAMMER_INTEGRATION
```

## 8. What Must Be Reused

Future projects should reuse:

- fixed-ratio runtime planning
- P0/P1 scope discipline
- image-generation-only final art rule
- strict stale/rejected directory isolation
- visual QA before delivery
- V2 clean package after any revoked delivery
