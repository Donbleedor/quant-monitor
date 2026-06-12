# process_first_screen_assets.py Spec

Date: 2026-06-10

This is a design spec for the postprocess script. It is not required to implement the script before the current raw generation finishes, but all final assets should eventually pass through it.

## 1. Responsibilities

The script must:

1. Read `FIRST_SCREEN_ASSET_SPEC.json`.
2. Flatten all assets from all `asset_groups`.
3. Filter by priority, default `P0`.
4. Match raw image files to expected output filenames.
5. Remove chroma backgrounds for transparent assets.
6. Resize/crop/center to exact target size.
7. Normalize the visible alpha bbox so assets do not look too small inside correct-size PNGs.
8. Write final PNGs.
9. Generate reports and a review sheet.

The script must not:

- Generate final tile symbols or UI icons procedurally.
- Fill missing art with geometric placeholder icons.
- Convert placeholder art into accepted production art merely because it has correct dimensions.

Procedural output is only allowed for helper images such as checkerboards, contact sheets, masks, debug overlays, or explicitly requested state overlays.

## 2. Asset Matching

Accepted raw naming:

```text
icon_hint.png
icon_hint_raw.png
raw_icon_hint.png
tile_totem_01_sun_seed_v1.png
tile_totem_01_sun_seed.png
```

Matching priority:

1. Exact final filename.
2. Filename contains final stem, e.g. `tile_totem_01_sun_seed`.
3. Manual manifest mapping file if present:

```text
asset_work/raw_generated/first_screen_p0/raw_manifest.json
```

Manifest example:

```json
{
  "tile_totem_28_mask_mark.png": "maybe_mask_mark_candidate_a.png",
  "tile_totem_12_cowrie_shell.png": "cowrie_shell_candidate_b.png"
}
```

If multiple candidates match:

- Mark as `ambiguous_source`.
- Do not silently choose unless one is exact.

## 3. Transparent Processing Pseudocode

```python
img = load_image(path).convert("RGBA")
rgb = np.array(img)[..., :3]
existing_alpha = np.array(img)[..., 3]

key_mode = detect_key_from_border(rgb)
if key_mode is None and existing_alpha.min() == 255:
    fail("no_key_background")

if key_mode is not None:
    bg_mask = flood_fill_from_edges(rgb, key_color, tolerance)
    bg_mask = clean_mask(bg_mask)
    alpha = np.where(bg_mask, 0, existing_alpha)
else:
    # Already transparent. Still normalize by alpha bbox.
    alpha = existing_alpha

rgba = apply_alpha(img, alpha)

bbox = alpha_bbox(alpha, threshold=10)
if bbox is None:
    fail("empty_subject")

subject = crop(rgba, bbox)
subject = trim_low_alpha(subject)
subject = resize_contain(subject, target_w, target_h, padding)
canvas = transparent_canvas(target_w, target_h)
paste_center(canvas, subject)
save_png(canvas)
```

Key point:

- Even if the input image already has an alpha channel, the script must still crop to alpha bbox and rescale to the target visible occupancy.
- Never resize a transparent image by its outer canvas only.

## 4. Key Detection

Border sample:

- Use all pixels from a 3-5 px border plus the four corners.
- Compute median color.

Magenta detection:

```text
R > 220, G < 60, B > 220
```

Green detection:

```text
R < 60, G > 220, B < 60
```

Tolerance:

- Magenta: `40-60` RGB distance.
- Green legacy: `35-45` RGB distance and edge-connected only.

Never delete all green pixels globally.

## 5. Output Padding

Use filename/class heuristics:

```text
tile_totem_*           8%
icon_*                 10%
badge_*                6%
tile_base_*            2%
state_tile_*           0-4%
hud_*_bg / *_frame     0%
tool_*_panel/shell     0-2%
bg_* / board_stage_bg  cover crop, no alpha key
```

Visible occupancy checks:

```text
tile_totem_*:
  preferred visible height or width: 76-88%
  tall/narrow exceptions allowed if height >= 80%

icon_*:
  preferred visible height or width: 70-84%

tile_base_*:
  preferred visible height: 84-94%

panel/frame/tray:
  bbox rules are layout-specific; report bbox but do not auto-fail on side margins.
```

Warnings:

```text
subject_too_small
large_alpha_margin
accepted_narrow_symbol
family_scale_mismatch
```

## 6. Report Outputs

Markdown:

```text
asset_work/reports/first_screen_p0_postprocess_report.md
```

JSON:

```text
asset_work/reports/first_screen_p0_postprocess_report.json
```

Review sheet:

```text
asset_work/review/first_screen_p0/review_contact_sheet.png
```

The contact sheet should display:

- final output at actual size
- visible bbox percentage
- warning labels
- checkerboard behind transparent assets
- filename
- status/warnings

For tile symbols, include a second preview composited onto `tile_base_ivory.png` if available. This catches the "correct PNG size but visually too small in-game" problem early.

## 7. Stop Conditions

The script should exit non-zero if:

- any hard-fail P0 asset exists
- a required P0 source is missing
- JSON spec cannot be parsed
- a final output dimension mismatch occurs
- placeholder or procedural art is detected in required P0 assets

Soft warnings should not stop the script but must appear in the report.

## 8. Placeholder Policy

If a required asset is missing:

- Mark it as `missing_source`.
- Do not synthesize a final replacement from code.
- Ask for image generation/regeneration.

If a file exists but looks like a procedural placeholder:

- Mark it as `placeholder_reject`.
- Keep it out of the final accepted directory.
- Include it in the review sheet only under a rejected section.

Accepted final art must come from:

- approved full-screen concept crops,
- image-generated raw assets,
- reference-edit outputs,
- or manually provided art assets.
