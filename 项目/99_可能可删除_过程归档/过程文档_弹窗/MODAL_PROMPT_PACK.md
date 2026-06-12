# Modal Prompt Pack

Date: 2026-06-11

## 1. Global Style Prefix

Use this prefix for every modal prompt:

```text
West African / Nigerian-inspired modern mobile game UI, dark emerald textile pattern background, antique gold carved trim, warm ivory stone tiles, clay orange and midnight blue accents, embossed geometric ornaments, readable at small mobile size, polished but low-cost implementable H5 game skin, icon-first interface, no Chinese mahjong characters, no emoji, no watermark.
```

## 2. Global Negative Prompt

```text
Chinese mahjong characters, bamboo/dot/character suits, emoji icons, photoreal human faces, sacred or religious symbols, national flags, watermarks, signatures, flat CSS-style vector mockup, neon cyberpunk colors, blurry details, thin-line UI, oversized empty margins, browser chrome, screenshots, text-heavy layout, green-screen spill on final visible art, unwanted button plate unless explicitly requested.
```

## 3. Raw Generation Rule For Transparent Assets

When the target asset is transparent, add this instruction:

```text
Render the subject only on a solid pure magenta #FF00FF background. The magenta background is only for chroma key removal and must not be part of the final asset. No button plate, no tile base, no rectangular backing unless the spec explicitly asks for it.
```

## 4. Full-Screen Effect Prompts

### Pause Modal Full Effect

```text
Create a full-screen 1080x2400 pause modal over a dark emerald game background. Center a carved stone-and-gold modal panel with a calm, premium West African / Nigerian-inspired mobile game feel. Use a strong icon-led resume button, a restart button, and a home button. Minimal English text only: Resume, Restart, Home. Keep the layout readable at 720x1600. The panel should feel grounded, with warm ivory, antique gold, deep green, and subtle geometric ornament. Avoid Chinese characters, emoji, neon, and busy decoration.
```

### Settings Modal Full Effect

```text
Create a full-screen 1080x2400 settings modal over the same dark emerald background. Use a carved green-and-gold panel with utility-row structure, clean toggles, and minimal English labels only: SFX, Music, Large Text, High Contrast. The design should feel dense, organized, and premium but low-cost. Keep icons thick and legible. Avoid clutter, Chinese text, emoji, and thin vector styling.
```

### Win Modal Full Effect

```text
Create a full-screen 1080x2400 win modal over the same dark emerald background. The panel should feel more celebratory than pause or settings, with antique gold trim, warm ivory stone, reward stars, a central medallion, and two stat chips for Time and Moves. Add a strong Next action and a Home action. Keep the composition elegant and readable on a 9:20 phone screen. Avoid excessive fireworks, photoreal confetti, Chinese text, emoji, and garish colors.
```

### Level Select Modal Full Effect

```text
Create a full-screen 1080x2400 level select modal over the same dark emerald background. Use a larger carved panel with a grid of level nodes that clearly show open, current, and locked states. The node language should feel like carved ivory or stone tokens with antique gold accents. Include a close button and keep the layout easy to scan. Minimal English only. Avoid tiny unreadable labels, Chinese text, emoji, and flat modern game-menu styling.
```

## 5. Component Prompts

### Modal Overlay

```text
Transparent modal overlay layer for a mobile game UI, dark emerald to black dim field with soft centered blur feel, subtle low-noise texture, no visible panel, no text, no icon, no border, transparent PNG output on magenta #FF00FF background for postprocess, designed for a 1080x2400 canvas.
```

### Standard Modal Panel

```text
Transparent carved modal panel for a West African / Nigerian-inspired mobile game UI, warm ivory inner surface, antique gold outer trim, deep emerald body, subtle bevel, centered composition, strong readable frame, no text, no icons, no buttons, transparent PNG output on magenta #FF00FF background for postprocess, designed for a 1080x2400 canvas.
```

### Large Modal Panel

```text
Transparent tall carved modal panel for a West African / Nigerian-inspired mobile game UI, warm ivory and deep emerald materials, antique gold trim, ornate but controlled, suitable for win modal or level select modal, no text, no icons, no buttons, transparent PNG output on magenta #FF00FF background for postprocess, designed for a 1080x2400 canvas.
```

### Primary Button Shell

```text
Transparent primary action button shell for a mobile game modal, rounded carved green-and-gold plaque, warm ivory highlight, antique gold border, strong depth, no text, no icon, no base plate, transparent PNG output on magenta #FF00FF background for postprocess, designed for a 1080x2400 canvas.
```

### Secondary Button Shell

```text
Transparent secondary action button shell for a mobile game modal, rounded carved dark green plaque with antique gold trim, smaller and quieter than the primary button, no text, no icon, no base plate, transparent PNG output on magenta #FF00FF background for postprocess, designed for a 1080x2400 canvas.
```

### Icon Prompts

```text
Transparent icon for a mobile game modal: thick silhouette, carved gold on dark green style, centered, readable at small size, no text, no emoji, no background plate, transparent PNG output on magenta #FF00FF background for postprocess, designed for a 1080x2400 canvas.
```

Use the same structure for:

- `icon_resume.png` -> play/resume glyph
- `icon_restart.png` -> replay/refresh glyph
- `icon_home.png` -> home glyph
- `icon_close.png` -> close/X glyph
- `icon_next.png` -> next arrow glyph
- `icon_star.png` -> reward star glyph
- `icon_lock.png` -> locked glyph

### Level Node Prompts

```text
Transparent carved level node for a mobile game level select screen, ivory stone or green-gold token style, clear open/current/locked state language, compact and readable, no text unless the spec explicitly says so, no icon plate, transparent PNG output on magenta #FF00FF background for postprocess, designed for a 1080x2400 canvas.
```

### Toggle Parts

```text
Transparent settings toggle part for a mobile game UI, carved green-gold track and rounded ivory knob, clean and legible, no text, no icon, transparent PNG output on magenta #FF00FF background for postprocess, designed for a 1080x2400 canvas.
```

### Win Stat Chips

```text
Transparent stat chip for a win modal, carved ivory and gold UI chip with subtle depth, compact label area for Time or Moves, no background scene, no emoji, transparent PNG output on magenta #FF00FF background for postprocess, designed for a 1080x2400 canvas.
```

## 6. Screen-Specific Prompt Notes

### Pause

- Keep the shell compact.
- Action order should feel like resume first, then restart, then home.

### Settings

- Favor dense utility rows.
- Toggles should read cleanly without extra labels baked into the art.

### Win

- Reward energy is welcome, but keep it controlled.
- Use stars and medal language, not fireworks overload.

### Level Select

- The node family must remain easy to scan.
- Locked, open, and current states should be visually distinct at thumbnail size.

