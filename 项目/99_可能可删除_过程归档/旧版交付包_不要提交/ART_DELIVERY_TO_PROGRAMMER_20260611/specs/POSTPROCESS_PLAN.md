# Postprocess Plan

Date: 2026-06-10

Purpose:

- Image generation is only the raw visual source.
- Raw images are not final assets.
- Final game assets must be produced by a local postprocess pass that enforces pixel size, alpha transparency, crop, safe padding, and QA.

This plan applies to the first-screen P0 batch first, then can be reused for all later UI assets.

## 1. Problems This Solves

### Problem A: Image generation cannot guarantee exact pixel dimensions

Raw images can be any actual size even if the prompt requested an aspect ratio.

Solution:

- Read target size from `FIRST_SCREEN_ASSET_SPEC.json`.
- Crop/resize/center every raw asset into the exact target size.
- Only files in `asset_work/processed/first_screen_p0` are considered usable.

### Problem B: Image generation cannot directly produce alpha PNG

Raw images may have a solid chroma background or a decorative plate behind the symbol.

Solution:

- For transparent assets, use chroma-key removal plus cleanup.
- Preferred key color for future generations: pure magenta `#FF00FF`.
- Existing green-screen outputs can be processed as a temporary fallback, but they carry higher risk because this art style uses green.

### Problem C: Some icons include unwanted button/tile backing

Examples:

- Tool icon generated with yellow button plate.
- Tile symbol generated with full tile/card base when the spec asks for symbol only.

Solution:

- Treat unwanted backing as a semantic QA failure.
- Prefer regeneration with stricter prompt over aggressive manual masking.
- If the backing is clearly separable, postprocess may crop the foreground symbol, but the asset should be marked `warning_semantic_backing_removed`.

### Problem D: Missing assets are filled with programmatic placeholder graphics

Programmatic drawings made with Pillow, Canvas, CSS, SVG, or simple geometric primitives are acceptable only for:

- QA masks.
- Temporary layout placeholders.
- Contact sheet labels.
- Utility overlays.

They are not acceptable final art for this reskin unless the specific asset is explicitly defined as a procedural helper, such as a simple alpha overlay.

Reason:

- The target art direction is image-generated, reference-driven, semi-real carved game UI.
- Programmatic geometric icons visibly break style consistency.
- They may satisfy dimensions but fail art direction.

Required correction:

- Missing P0 visual assets must be generated from the approved visual direction or regenerated with image prompts.
- Postprocess scripts may clean, resize, crop, key, composite, and QA images, but must not invent final symbol/icon art from code.
- If a script-generated placeholder exists in `processed`, it must be marked `placeholder_reject` and excluded from `ACCEPTED_FOR_INTEGRATION`.

## 2. Directory Contract

```text
E:\参考图\麻将\项目\asset_work\
  raw_generated\
    first_screen_p0\
      ...
  processed\
    first_screen_p0\
      ...
  rejected\
    first_screen_p0\
      ...
  review\
    first_screen_p0\
      review_contact_sheet.png
      review_report.html
  reports\
    first_screen_p0_postprocess_report.md
    first_screen_p0_postprocess_report.json
```

Rules:

- `raw_generated` may contain any names and any dimensions.
- `processed` must contain exact final filenames from `FIRST_SCREEN_ASSET_SPEC.json`.
- `rejected` stores raw images that failed hard QA.
- `review` stores visual contact sheets.
- `reports` stores machine and human-readable logs.

## 3. Source Of Truth

Primary spec:

- `FIRST_SCREEN_ASSET_SPEC.json`

Supporting specs:

- `FIRST_SCREEN_CUTTING_PLAN.md`
- `STYLE_BIBLE.md`
- `IMAGE_PROMPT_PACK.md`
- `TOTEM_TILE_MAP.json`

Required fields from JSON:

- `file`
- `size.width`
- `size.height`
- `transparent`
- `priority`
- `group`

## 4. Generation Prompt Adjustment

For any asset where `transparent: true`, future raw generation should use:

```text
Render the subject only on a solid pure magenta #FF00FF background. The magenta background is only for chroma key removal and must not be part of the asset. No button plate, no tile base, no circular badge, no rectangular backing unless the asset spec explicitly asks for it.
```

Avoid green-screen backgrounds going forward:

```text
Do not use green background.
```

Reason:

- Many target assets include emerald green, leaf green, or dark green accents.
- A global green key may erase parts of the subject.

## 5. Chroma Key Strategy

Preferred key:

- Magenta `#FF00FF`.

Legacy fallback:

- Green `#00FF00` is accepted only for the already-generated sample batch.
- Use edge-connected background removal, not global color deletion.

Algorithm for transparent assets:

1. Load raw image as RGB/RGBA.
2. Detect dominant key color from image corners and border samples.
3. If corners are near magenta, set key mode `magenta`.
4. Else if corners are near green, set key mode `green_legacy`.
5. Flood-fill only from the image borders/corners using color tolerance.
6. Convert the connected background mask to alpha `0`.
7. Preserve subject pixels even if they contain similar colors internally.
8. Clean the alpha mask:
   - remove tiny isolated specks
   - close small holes
   - feather edge by `0.5-1.0` px if needed
9. Crop to alpha bounding box.
10. Scale into target box with safe padding.
11. Center on transparent canvas.

Hard fail:

- No key background detected on a transparent asset.
- Background is gradient/patterned and cannot be separated.
- Subject is fused with a button plate or tile base and cannot be separated.

## 6. Resize Rules

### Transparent Assets

Use contain-fit:

- Crop alpha bbox.
- Preserve aspect ratio.
- Fit inside target size minus safe padding.
- Center on exact target canvas.
- Output RGBA PNG.

Important:

- A PNG can have the correct target dimensions and still look too small in-game if the visible subject occupies only a small part of the alpha canvas.
- Therefore postprocess must normalize the visible alpha bounding box, not only the outer image dimensions.
- Raw or intermediate files with large transparent margins must be cropped to their alpha bbox and then scaled back into the final target canvas with controlled safe padding.
- Do not simply resize the whole transparent PNG as-is.

Safe padding defaults:

| Asset type | Padding |
| --- | --- |
| Tile symbol `tile_totem_*` | 8% |
| Tool icon `icon_*` | 10% |
| Small HUD icons | 8% |
| Tile base/state overlays | 2-4% |
| Button/panel shells | 0-2% |

Target visible occupancy after postprocess:

| Asset type | Target visible bbox | Notes |
| --- | --- | --- |
| Tile symbol `tile_totem_*` | about `76-88%` of canvas height or width, depending on symbol shape | Tall objects such as masks, shells, drums may be narrower, but should still fill most height |
| Tool icon `icon_*` | about `70-84%` of button/icon canvas | Keep enough breathing room for button placement |
| `tile_base_ivory.png` | about `84-94%` of canvas height | Tile base should not look inset or tiny |
| State overlays | match tile base size closely | Do not change apparent tile size |
| HUD/tray panels | use designed bounds | Transparent side margins are allowed only if they align with layout |

Alpha margin warnings:

- For symbols/icons, if visible bbox is under `65%` in both dimensions, treat it as too small.
- For tall symbols/icons, width may be under `65%`, but height should usually be `80%+`.
- If an asset is intentionally narrow, the report must mark it as `accepted_narrow_symbol`.
- If visible subject looks small because of accidental transparent padding, reprocess; do not regenerate unless the subject itself is semantically wrong.

### Non-Transparent Assets

Use cover-fit:

- Resize to cover target size.
- Center crop to exact target size.
- Output RGB/RGBA PNG as appropriate.

Examples:

- `bg_game_1080x2400.png`: exact cover crop to `1080x2400`.
- `board_stage_bg.png`: exact cover crop to `1080x1840`.

## 7. QA Rules

Hard failures:

- output file missing
- output dimensions do not match spec exactly
- transparent asset lacks alpha
- transparent asset remains mostly opaque background
- non-transparent asset has wrong dimensions
- asset is blank or nearly blank
- asset has watermark/signature
- wrong asset type, e.g. icon contains a button plate when spec asks icon only
- Chinese mahjong character or old suit mark appears
- final art is a programmatic placeholder instead of image-generated/reference-style art
- asset style is visibly inconsistent with the approved concept and existing accepted assets

Soft warnings:

- subject too small
- subject too close to edge
- slight edge fringe
- style differs from selected concept
- green-screen legacy input used
- semantic uncertainty, e.g. `mask_mark` versus `cowrie_shell`
- visible bbox occupancy inconsistent with same asset family
- transparent margin too large after final resize
- asset may need image regeneration rather than script repair

Placeholder rejection signals:

- flat single-color primitives
- visibly hand-coded geometric shapes
- no texture, bevel, material, or lighting consistent with accepted assets
- inconsistent line thickness across the tile set
- icon looks like CSS/SVG mockup instead of game art
- contact sheet shows mixed image-generated and procedural styles

## 8. Report Fields

For each processed asset:

```json
{
  "file": "icon_hint.png",
  "source": "raw_generated/first_screen_p0/icon_hint_raw.png",
  "target_size": [88, 88],
  "actual_size": [88, 88],
  "transparent": true,
  "alpha_present": true,
  "key_mode": "magenta",
  "bbox": [12, 8, 490, 503],
  "visible_bbox_size": [478, 495],
  "visible_bbox_occupancy": [0.78, 0.86],
  "normalization": "alpha_bbox_crop_then_contain_fit",
  "status": "passed",
  "warnings": []
}
```

## 9. Script Design

Suggested script:

```text
E:\参考图\麻将\项目\asset_work\scripts\process_first_screen_assets.py
```

Inputs:

```text
--spec E:\参考图\麻将\项目\FIRST_SCREEN_ASSET_SPEC.json
--raw E:\参考图\麻将\项目\asset_work\raw_generated\first_screen_p0
--out E:\参考图\麻将\项目\asset_work\processed\first_screen_p0
--report E:\参考图\麻将\项目\asset_work\reports
--priority P0
```

Recommended Python libraries:

- Pillow for image IO, resize, alpha, contact sheets.
- OpenCV optional for morphology and connected components.

No online background-removal service is required for the first pass.

## 10. Current Batch Guidance

The current raw batch includes green backgrounds.

Action:

- Continue collecting the 6 representative assets if they are visually good.
- Do not treat them as final.
- Process with `green_legacy` edge-connected keying.
- If any subject contains green and the key removes part of the subject, regenerate that asset on magenta `#FF00FF`.

Important:

- Do not rename uncertain raw assets into final names until `mask_mark` and `cowrie_shell` are visually confirmed.
- Once confirmed, final processed files must use the exact spec filenames.
- If a generated/cut PNG already has alpha but the visible subject is too small, rerun the postprocess normalization on that PNG: alpha bbox crop -> contain fit -> exact target canvas.
- Correct dimensions alone are not enough for approval. The visible subject scale must also match its asset family.
- Correct dimensions and alpha are still not enough if the art itself is procedural placeholder art. Art direction consistency is a blocking requirement.
