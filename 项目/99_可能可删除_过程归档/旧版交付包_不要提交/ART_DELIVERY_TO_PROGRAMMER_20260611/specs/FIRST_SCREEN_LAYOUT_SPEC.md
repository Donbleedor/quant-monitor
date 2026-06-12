# First Screen Layout Spec

Date: 2026-06-10

Screen: normal gameplay.

## 1. Coordinate System

Design in logical coordinates:

- Logical canvas: `360x800`.
- Export multiplier: `3x`.
- Production canvas: `1080x2400`.
- Runtime aspect ratio: `9 / 20`.

All measurements below use logical CSS-like pixels first. Multiply by `3` for production image coordinates.

## 2. Screen Regions

| Region | Logical Y | Export Y | Purpose |
| --- | --- | --- | --- |
| Top HUD | `0-58` | `0-174` | Home, level, timer, pause |
| Top breathing gap | `58-70` | `174-210` | Visual separation |
| Board area | `70-676` | `210-2028` | Tile stack and board focus |
| Bottom tray | `676-800` | `2028-2400` | Hint, undo, shuffle |

These are starting targets. The implementation can tune them after the first concept, but should not break the 9:20 shell.

## 3. Safe Margins

Logical:

- Left/right safe margin: `12`.
- Top safe margin: `8`.
- Bottom safe margin: `10`.

Production:

- Left/right safe margin: `36`.
- Top safe margin: `24`.
- Bottom safe margin: `30`.

No important UI should sit outside these margins.

## 4. Top HUD

Logical target:

```text
x: 12-348
y: 8-54
height: 46
```

Structure:

| Element | Logical box | Notes |
| --- | --- | --- |
| Home button | `18,12,40,40` | icon-only |
| Level label | center `120-240`, y `18-42` | `Lv. 1` or `Level 1` |
| Timer | `252-300`, y `18-42` | tabular text |
| Pause button | `306,12,40,40` | icon-only |

Visual rules:

- Top HUD should feel light enough not to steal board attention.
- Home/pause touch boxes must remain at least `40x40` logical px.
- Timer can remain live text.

## 5. Board Area

Logical target:

```text
x: 8-352
y: 70-676
width: 344
height: 606
```

Board container:

- Centered in board area.
- Recommended max logical width: `330`.
- Recommended max logical height: `520`.
- Leave room for tile depth and selected glow.

Current code computes tile size dynamically. For the fixed 9:20 shell, target:

| Tile state | Logical display size | Production equivalent |
| --- | --- | --- |
| Normal tile | `48x58` to `56x67` | `144x174` to `168x201` |
| Smallest acceptable | `42x50` | `126x150` |
| Source PNG | `120x144` minimum | Can upscale source later |

Tile source:

- Keep source `120x144` for first validation.
- If tile symbol detail suffers, upgrade source to `180x216` and downscale in CSS.

Stacking:

- `zOffsetPx` target: `4-5` logical px.
- Avoid baked shadows larger than `2-3` logical px outside the tile.

## 6. Bottom Tool Tray

Logical target:

```text
x: 0-360
y: 676-800
height: 124
```

Tray surface:

- Full-width dark green/gold panel.
- Top border or ornamental strip at `y=676`.
- Slight vignette behind buttons.

Tool buttons:

| Button | Logical box | Notes |
| --- | --- | --- |
| Hint | `72,700,64,74` | icon + badge |
| Undo | `148,700,64,74` | icon + badge |
| Mix | `224,700,64,74` | icon + infinity/number badge |

Badge:

- Logical size: `18x18`.
- Position: top-right corner of button.
- Gold coin style.

Labels:

- Prefer icon-only.
- If text is needed, use tiny English labels: `Hint`, `Undo`, `Mix`.

## 7. Background Composition

The background is a full-screen `1080x2400` image or CSS texture.

Composition:

- Darker behind the board center.
- Subtle geometric pattern.
- Low contrast at tile area.
- Slight gold/green ornamenting near top/bottom is allowed.

Do not place important art behind dynamic tile positions.

## 8. Modal Overlay Compatibility

Even though the first pass is gameplay, modal positioning should already respect the same shell.

Pause modal target:

- Logical box: `50,260,260,250`.
- Export box: `150,780,780,750`.

Level select modal target:

- Logical box: `36,120,288,600`.
- Export box: `108,360,864,1800`.

## 9. Runtime CSS Direction

Recommended shell:

```css
body {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  overflow: hidden;
}

#app {
  aspect-ratio: 9 / 20;
  width: min(100vw, calc(100dvh * 9 / 20));
  height: min(100dvh, calc(100vw * 20 / 9));
  position: relative;
  overflow: hidden;
}
```

Optional logical sizing:

```css
#app {
  font-size: calc(min(100vw / 360, 100dvh / 800) * 16);
}
```

This is optional; fixed CSS px inside a scaled shell may be enough for first pass.

## 10. Verification Viewports

Test after integration:

| Viewport | Expected |
| --- | --- |
| `360x800` | Exact logical target |
| `720x1600` | Physical Transsion reference |
| `1080x2400` | Production reference |
| Desktop wide | Pillarboxed centered shell |
| Desktop short | Letterboxed/contained shell |

Pass condition:

- The app shell keeps `9:20`.
- No UI appears outside the shell.
- Internal UI does not reflow due to browser shape.
- Board remains centered and clickable.

