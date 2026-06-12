# Asset Production QA Checklist

Use this checklist before any future AI-generated game-art package is marked accepted.

## 1. Coverage

- P0 required files all exist.
- P1 optional files are clearly marked as delivered or not delivered.
- Missing P1 files do not block P0 delivery unless the spec says they do.
- Raw-only assets are not accepted.

## 2. Dimensions

- Every final PNG matches the spec exactly.
- Full-screen assets match the target canvas.
- Slot assets keep their full slot size.
- Do not auto-crop delivery PNGs if the programmer needs fixed slots.

## 3. Alpha

For transparent assets:

- alpha channel exists
- alpha is not fully opaque
- visible subject is not too small inside alpha canvas
- edge-connected background residue is removed

Important: alpha presence does not mean the cutout is clean.

## 4. Magenta / Pink / Purple Residue

Do not check only exact `#FF00FF`.

Use at least two detections:

```text
strict pink:
alpha > 10 and R > 220 and B > 220 and G < 120

broad pink/purple:
alpha > 10 and R > 140 and B > 120 and G < 140 and R + B > 3 * G
```

Broad detection catches visible purple/pink residue that exact magenta misses.

## 5. Edge-Connected Background

If pink, purple, green, black, or white background pixels are connected to the image edge and visible, this is usually a hard fail for transparent assets.

Exception:

- full-screen non-transparent backgrounds
- intentional full-slot UI overlays
- documented state effects

## 6. Visible BBox

Dimensions are not enough.

Record:

- bbox x/y/w/h
- visible bbox occupancy width/height
- warning label

Suggested guidance:

| Asset family | Normal visible occupancy | Notes |
| --- | --- | --- |
| Tile symbol `96x96` | roughly `0.65-0.95` in at least one dimension | Narrow symbols may be accepted if preview is good |
| Tile base `168x201` | roughly `0.80-0.96` | Should fill most of slot |
| HUD icon | roughly `0.65-0.90` | Tiny glyphs need manual review |
| Full-width HUD/tray | layout-specific | Do not auto-fail side margins |
| State overlay | family-specific | Must be tested on tile base |

## 7. Required Contact Sheets

Every transparent batch must include:

- white background view
- dark target-background view
- checkerboard view
- in-context preview

For tile symbols:

- also show symbol centered on tile base

For state overlays:

- also show overlay on tile base

Thumbnails must be large enough to inspect residue. Tiny overview sheets are not enough.

## 8. Style Consistency

Check:

- material, bevel, lighting, line weight
- no flat vector placeholder look
- no mixed procedural and image-generated family unless explicitly allowed
- no Chinese Mahjong symbols if the reskin removes Mahjong visuals
- no watermark/signature/emoji/browser chrome

## 9. Procedural Asset Rule

Allowed procedural outputs:

- masks
- contact sheets
- debug overlays
- simple utility overlays
- simple UI state layers if explicitly allowed

Not allowed as final art:

- tile symbols
- ornate icons
- logo/wordmark
- decorative UI shells
- anything that should carry art style

## 10. Acceptance Decision

Only mark accepted when all are true:

- coverage passes
- dimensions pass
- alpha passes
- broad residue passes
- bbox passes or warnings are justified
- contact sheets pass manual review
- stale/rejected folders are excluded
- delivery package has a clean README and manifest
