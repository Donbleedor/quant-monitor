# Mahjong V2 Art Delivery For Programmer

## DO NOT USE - Visual QA Reopened

This package was previously marked `ACCEPTED_FOR_ART_DELIVERY`, but visual QA was reopened after manual review on 2026-06-11.

Do not integrate this package until the gameplay `first_screen_p0` assets are repaired and a new delivery package is created.

Known blocking issues:

- visible magenta/pink residue in several gameplay tile symbols
- incorrect magenta/pink state effects
- some assets need stricter visual bbox review before integration

Date: 2026-06-11

Previous art decision: `ACCEPTED_FOR_ART_DELIVERY`

Current art decision: `REVOKED_NEEDS_VISUAL_FIX`

This package contains only the accepted processed PNG assets and the reports/specs needed for code integration. Do not integrate files from the old raw, stale, or rejected working directories.

## Runtime Target

- Design canvas: `1080x2400`
- Runtime aspect ratio: fixed `9:20`
- Reference device family: Transsion mainstream portrait phones, `720x1600`
- The game should scale inside a fixed 9:20 shell instead of freely reflowing to browser size.

## Asset Folders

Use these folders for integration:

```text
assets/gameplay/first_screen_p0/
assets/menu/p0/
assets/menu/p1/
assets/modal/p0/
```

Folder contents:

- `assets/gameplay/first_screen_p0/`: 55 accepted gameplay/HUD/tile assets.
- `assets/menu/p0/`: 3 accepted required menu assets.
- `assets/menu/p1/`: 9 accepted menu polish/shared assets.
- `assets/modal/p0/`: 17 accepted modal assets.

## Key Reports

Start here:

```text
reports/final_recheck/FINAL_ART_DELIVERY_DECISION.md
reports/final_recheck/FINAL_DELIVERY_MANIFEST.json
reports/final_recheck/FINAL_SPEC_COVERAGE_RECHECK.md
reports/final_recheck/FINAL_MAGENTA_ALPHA_RECHECK.md
review/final_delivery_contact_sheet.png
```

The manifest is the source of truth for accepted paths, dimensions, alpha expectations, and QA notes.

## Specs

Specs are copied into:

```text
specs/
```

Important files:

- `FIRST_SCREEN_ASSET_SPEC.json`
- `MENU_SCREEN_ASSET_SPEC.json`
- `MODAL_ASSET_SPEC.json`
- `FIRST_SCREEN_LAYOUT_SPEC.md`
- `STYLE_BIBLE.md`
- `POSTPROCESS_PLAN.md`

## Do Not Use

Do not integrate these old or intermediate batches:

```text
asset_work/processed/first_screen_p0
asset_work/processed/first_screen_p0_v2
asset_work/processed/first_screen_p0_completion
asset_work/processed/first_screen_p0_final
asset_work/processed/first_screen_p0_image_completion
raw_generated/
rejected/
```

Reason: those folders contain stale versions, partial batches, or batches with procedural/placeholder risk. The final accepted gameplay package is already copied into `assets/gameplay/first_screen_p0/`.

## Integration Notes

- Transparent PNGs already include alpha.
- Newly fixed menu `menu_vignette_bottom.png` has `suspicious pink = 0` and `exact #FF00FF = 0`.
- Modal P0 is now accepted. The repaired files are:
  - `modal_panel_large.png`
  - `btn_modal_primary.png`
  - `btn_modal_secondary.png`
- First screen has only minor soft warnings in the QA report; no blocking art issue remains.

## Suggested Integration Order

1. Add the fixed `9:20` runtime shell.
2. Integrate shared/gameplay background and board assets.
3. Integrate menu assets.
4. Integrate gameplay tile/HUD/tool assets.
5. Integrate modal P0 assets.
6. Run screenshot QA against `review/final_delivery_contact_sheet.png` and the final specs.
