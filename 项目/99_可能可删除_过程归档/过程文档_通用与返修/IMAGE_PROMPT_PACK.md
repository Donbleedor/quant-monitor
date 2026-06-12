# Image Prompt Pack

Date: 2026-06-10

Purpose:

- Provide consistent prompts for concept images and asset production.
- Keep output aligned with the fixed Transsion `9:20` target.
- Prevent old mahjong symbols from leaking into the reskin.

## 1. Global Style Prefix

Use this prefix for all image generation:

```text
West African / Nigerian-inspired modern mobile game UI, dark emerald textile pattern background, antique gold carved trim, warm ivory stone tiles, clay orange and midnight blue accents, embossed geometric ornaments, readable at small mobile size, polished but low-cost implementable H5 game skin, icon-first interface, no Chinese mahjong characters, no emoji, no watermark.
```

## 2. Global Negative Prompt

```text
Chinese mahjong characters, traditional mahjong bamboo/dot/character suits, Chinese text, emoji, photorealistic human face, sacred religious symbols, national flags, official emblems, neon cyberpunk, purple gradient UI, flat placeholder art, thin unreadable lines, busy background, watermark, signature, blurry, cropped UI, unreadable icons, extra buttons, fake browser chrome.
```

## 3. Gameplay Concept A Prompt

Use for the conservative first concept.

```text
Create a full-screen vertical 9:20 mobile tile matching game screen, 1080x2400 canvas, designed for Transsion mainstream 720x1600 Android phones.

Scene: normal gameplay screen for a totem tile matching game. Keep the interaction structure of a mahjong-solitaire style board: top HUD, central stacked tile board, bottom tool tray.

Style: West African / Nigerian-inspired modern mobile game UI, dark emerald textile pattern background, antique gold carved trim, warm ivory stone tiles, clay orange and midnight blue accents, embossed geometric ornaments, readable at small mobile size, polished but low-cost implementable H5 game skin, icon-first interface.

Layout:
- slim top HUD with home icon on the left, level/time in the center/right, pause icon on the right
- central stacked board of ivory carved totem tiles, no Chinese mahjong symbols
- bottom tray with three tool buttons: hint, undo, mix/shuffle
- mostly icon-based UI, minimal English text

Tone: conservative, clear, easy to implement, strong tile readability, not too decorative.

Do not include Chinese mahjong characters, emoji, browser UI, watermark, or random safari animals.
```

## 4. Gameplay Concept B Prompt

Use for the more stylized first concept.

```text
Create a full-screen vertical 9:20 mobile tile matching game screen, 1080x2400 canvas, designed for Transsion mainstream 720x1600 Android phones.

Scene: normal gameplay screen for a totem tile matching game. Preserve a playable tile matching layout: top HUD, central stacked tile board, bottom tool tray.

Style: premium but implementable West African / Nigerian-inspired mobile puzzle game UI, deep emerald and black woven textile background, antique gold ornamental frame, carved dark green HUD, warm ivory stone totem tiles, clay orange and midnight blue accent families, subtle embossed geometric border details.

Layout:
- top HUD feels like a carved gold-trimmed strip
- central board has stacked ivory stone tiles with bold totem symbols
- bottom tool tray has round green/gold buttons for hint, undo, and mix
- selected tiles use gold glow, blocked tiles are dimmed but recognizable
- mostly icon-based UI, minimal English text

Tone: more stylized than concept A, closer to premium game reference art, but still practical for H5 implementation.

Do not include Chinese mahjong characters, emoji, browser UI, watermark, or realistic human faces.
```

## 5. Tile Base Prompt

```text
Create a single vertical rounded rectangular carved ivory stone game tile base.

Canvas: transparent background.
Aspect ratio: 5:6.
Target source size: 120x144 or larger same ratio.

Style: warm ivory stone or ceramic, subtle bevel, thin antique gold edge, small inner highlight from upper left, gentle lower-right depth shadow mostly inside the tile bounds.

No symbol, no text, no Chinese mahjong marks, no card background, no large external shadow, no watermark.
```

## 6. Tile Symbol Prompt Template

Use one symbol per asset.

```text
Create a single high-readability totem tile symbol for a mobile tile matching game.

Symbol: {SYMBOL_NAME}
Family: {FAMILY}
Accent color: {ACCENT}

Canvas: solid pure magenta #FF00FF background for chroma key removal.
The magenta background is not part of the asset.
The symbol will be placed on an ivory carved stone tile, so do not draw the tile base.

Style: West African / Nigerian-inspired modern game glyph, bold silhouette, clean carved edges, antique gold/deep green/clay orange/midnight blue accents as appropriate, readable at very small mobile size.

Rules:
- one dominant symbol only
- no text
- no Chinese mahjong characters
- no full card or tile background
- no button plate
- no yellow backing plate
- no circular badge
- no photorealistic human face
- no sacred/religious symbols
- no watermark
```

## 7. Tool Icon Prompt Template

```text
Create one mobile game tool icon on transparent background.

Icon: {ICON_NAME}
Meaning: {MEANING}

Canvas: solid pure magenta #FF00FF background for chroma key removal.
The magenta background is not part of the asset.

Style: antique gold symbol with subtle bevel, designed for a dark emerald circular game button, West African / Nigerian-inspired geometric touch, thick readable silhouette, mobile game UI quality.

No text, no emoji, no button background, no yellow backing plate, no circular badge, no watermark.
```

Tool icon list:

| File | Icon | Meaning |
| --- | --- | --- |
| `icon_home.png` | hut/home silhouette | return to menu |
| `icon_pause.png` | double vertical bars | pause |
| `icon_hint.png` | sun bead / light mark | hint |
| `icon_undo.png` | curved back arrow | undo |
| `icon_shuffle.png` | crossing path arrows | mix/shuffle |

## 8. UI Panel Prompt Template

```text
Create one mobile game UI panel asset.

Asset: {ASSET_NAME}
Use: {USE_CASE}
Canvas: transparent background.
Target aspect: {ASPECT_OR_SIZE}

Style: dark emerald carved panel, antique gold trim, subtle embossed West African-inspired geometric corner ornaments, low-noise texture, readable and practical for H5 game UI.

No text, no icons, no full screen background, no watermark.
```

## 9. Background Prompt

```text
Create a vertical 9:20 mobile game background, 1080x2400 canvas.

Style: dark emerald and black woven textile / carved geometric pattern, subtle West African / Nigerian-inspired motifs, very low contrast in the central gameplay area, gentle vignette behind the board, antique gold accents only near top and bottom edges.

No characters, no animals, no text, no Chinese mahjong symbols, no UI buttons, no watermark.
```

## 10. Batch Plan

Concept stage:

- Generate 2 full-screen gameplay concepts.
- Pick one direction.
- Do not cut assets before concept approval.

Asset stage 1:

- `bg_game_pattern.png`
- `tile_base_ivory.png`
- 6 sample tile symbols:
  - `sun_seed`
  - `talking_drum`
  - `diamond_knot`
  - `mask_mark`
  - `water_wave`
  - `cowrie_shell`
- 5 tool icons.

Postprocess stage 1:

- Run the raw images through `POSTPROCESS_PLAN.md`.
- Enforce exact target sizes from `FIRST_SCREEN_ASSET_SPEC.json`.
- Remove chroma background and output transparent PNGs for transparent assets.
- Build a review contact sheet.
- Do not integrate raw images into the game.

Asset stage 2:

- Full 34 tile symbols.
- Selected/blocked state refinements.
- Bottom and top panel refinements.

## 11. QA Prompt For Visual Review

Use this checklist after generation:

```text
Review this game UI asset batch for a Transsion 9:20 mobile H5 puzzle game.
Check: fixed 1080x2400 composition, no Chinese mahjong symbols, tile readability at small size, consistent West African-inspired style, no cultural/religious sensitive symbols, no text where icons should suffice, no watermark, no dirty transparent edges, consistent lighting direction, and whether the assets can be implemented with CSS/PNG in a simple H5 game.
```
