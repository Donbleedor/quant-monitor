# Mahjong V2 Art Delivery For Programmer - V2 Fixed

Date: 2026-06-11

Status: `READY_FOR_PROGRAMMER_INTEGRATION`

This V2 package replaces the previous `ART_DELIVERY_TO_PROGRAMMER_20260611` package.

Use this folder only:

```text
E:\参考图\麻将\项目\00_提交给程序_最终资源\静态美术主包_PNG_必须接入
```

## Runtime Target

- Design canvas: `1080x2400`
- Runtime aspect ratio: fixed `9:20`
- Reference device family: `720x1600` portrait phones
- The game should scale inside a fixed 9:20 shell instead of freely reflowing to browser size.

## Asset Folders

```text
assets/gameplay/first_screen_p0/
assets/menu/p0/
assets/menu/p1/
assets/modal/p0/
```

Asset counts:

- Gameplay first screen P0: 55 PNG
- Menu P0: 3 PNG
- Menu P1: 9 PNG
- Modal P0: 17 PNG
- Total: 84 PNG

## Important Integration Rule

Do not auto-crop transparent PNG bounds during integration.

Many assets are designed as fixed slots:

- `tile_base_ivory.png`: render as `168x201`
- `tile_totem_*.png`: render as `96x96`, centered on the tile base
- `state_tile_selected_glow.png`: render as `180x213`, centered over the selected tile
- `state_tile_shadow.png`: render as `168x201`, under the tile
- `hud_top_frame.png`: render as `1080x188`
- `tool_tray_panel.png`: render as `1080x374`

Some symbols are intentionally narrow shapes. Keep the full `96x96` symbol slot and center them; do not crop and re-scale per symbol.

## Visual Fix Notes

The previous package was reopened because gameplay assets had visible magenta/pink residue. This V2 package includes the gameplay visual fix.

The repaired gameplay files include:

- `state_tile_selected_glow.png`
- `state_tile_shadow.png`
- `tile_totem_21_triple_triangle.png`
- `tile_totem_27_green_lattice.png`
- `tile_totem_29_baobab_tree.png`
- `tile_totem_32_water_drop.png`
- `tile_totem_34_heritage_knot.png`

Review these visual QA sheets if needed:

```text
review/gameplay_visual_fix/white_dark_checker_compare_sheet.png
review/gameplay_visual_fix/tile_on_base_preview_sheet.png
```

## Reports

Start here:

```text
reports/final_after_visual_fix/FINAL_DELIVERY_STATUS_AFTER_VISUAL_FIX.md
reports/final_after_visual_fix/PROGRAMMER_DELIVERY_MANIFEST.json
reports/gameplay_visual_fix/GAMEPLAY_VISUAL_ACCEPTANCE.md
reports/gameplay_visual_fix/GAMEPLAY_VISUAL_FIX_REPORT.md
reports/final_recheck/FINAL_ART_DELIVERY_DECISION.md
```

## Do Not Use

Do not integrate files from:

```text
ART_DELIVERY_TO_PROGRAMMER_20260611/
asset_work/processed/first_screen_p0
asset_work/processed/first_screen_p0_v2
asset_work/processed/first_screen_p0_completion
asset_work/processed/first_screen_p0_final
asset_work/processed/first_screen_p0_image_completion
raw_generated/
rejected/
```

The only intended programmer handoff folder is this V2 fixed package.

## Optional Spine Effects

There is an additional optional animation package:

```text
E:\参考图\麻将\项目\00_提交给程序_最终资源\可选Spine动效_Tidy版
```

This Spine package is not required for P0 static art integration. Treat it as P1/P2 effect polish after this PNG package is already stable in-game.

