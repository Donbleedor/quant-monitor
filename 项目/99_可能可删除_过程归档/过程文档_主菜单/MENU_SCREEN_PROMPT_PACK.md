# Menu Screen Prompt Pack

Date: 2026-06-10

Purpose:

- Generate one full menu concept image first.
- Then generate menu brand and control assets only after the concept is approved.
- Keep every asset aligned to the same West African / Nigerian-inspired visual language used by gameplay.

## 1. Global Style Prefix

Use this prefix for every menu prompt:

```text
West African / Nigerian-inspired modern mobile game UI, dark emerald textile pattern background, antique gold carved trim, warm ivory stone tiles, clay orange and midnight blue accents, embossed geometric ornaments, readable at small mobile size, polished but low-cost implementable H5 game skin, icon-first interface, no Chinese mahjong characters, no emoji, no watermark.
```

## 2. Global Negative Prompt

```text
Chinese mahjong characters, traditional mahjong bamboo/dot/character suits, Chinese text, emoji, photorealistic human face, sacred religious symbols, national flags, official emblems, neon cyberpunk, purple gradient UI, flat placeholder art, thin unreadable lines, busy background, watermark, signature, blurry, cropped UI, unreadable icons, extra buttons, fake browser chrome.
```

## 3. Full Menu Concept Prompt

Use for the first and only full-screen raw concept.

```text
Create a full-screen vertical 9:20 mobile game main menu, 1080x2400 canvas, designed for Transsion mainstream 720x1600 Android phones.

Reference the current menu screenshot and the reviewed style reference boards. Keep the visual family consistent with the normal gameplay screen for the same game.

Game name: Tribal Tiles.
If needed, use Savanna Tiles as a softer fallback, but prioritize Tribal Tiles.

Scene: a main menu for a totem tile matching game. Keep the interface compact and elegant, with a strong brand focal point and minimal text.

Style: West African / Nigerian-inspired modern mobile game UI, dark emerald textile pattern background, antique gold carved trim, warm ivory stone tiles, clay orange and midnight blue accents, embossed geometric ornaments, readable at small mobile size, polished but low-cost implementable H5 game skin, icon-first interface.

Layout:
- small settings icon in the top-right corner
- centered logo / title lockup with a carved medallion feel
- one large primary play button
- two smaller secondary actions for Level and Daily
- keep the lower half airy and uncluttered
- use subtle texture and ornament, not busy illustration

Tone:
- premium but practical
- minimal English text
- symbol-led navigation
- clearly part of the same game family as the gameplay screen

Do not include Chinese mahjong characters, emoji, browser UI, watermark, or overly decorative clutter.
```

## 4. Logo / Title Prompt

Use for `logo_tribal_tiles.png`.

```text
Create a main brand lockup for a mobile game called Tribal Tiles.

Canvas: solid pure magenta #FF00FF background for chroma key removal.
The magenta background is not part of the asset.

Style: West African / Nigerian-inspired modern mobile game logo, carved ivory stone emblem, antique gold trim, deep emerald and clay orange accents, bold readable title treatment, premium but implementable H5 game branding.

Composition:
- one central emblem that feels like a carved tile medallion
- the words Tribal Tiles as the main readable title
- optional small subtitle treatment only if needed for balance
- keep the lockup wide enough for a 9:20 menu center zone

Rules:
- no button plate
- no menu controls
- no yellow backing plate
- no tile board
- no Chinese mahjong characters
- no watermark

Make the title readable at mobile size and avoid tiny decorative details.
```

## 5. Play Button Prompt

Use for `button_play_large.png`.

```text
Create a large primary play button for a mobile game menu.

Canvas: solid pure magenta #FF00FF background for chroma key removal.
The magenta background is not part of the asset.

Style: antique gold and deep emerald carved game button, West African / Nigerian-inspired geometric edge treatment, rounded but not bubbly, premium mobile puzzle game CTA, strong silhouette, readable at small mobile size.

Composition:
- one large centered button shell
- play triangle or play glyph as the focal point
- optional tiny PLAY text only if needed for clarity

Rules:
- no menu background
- no logo
- no extra controls
- no yellow backing plate
- no circular badge
- no watermark

Keep the button visually strong and easy to recognize on a dark emerald menu screen.
```

## 6. Level / Daily / Settings Icon Prompt

Use for `icon_levels.png`, `icon_daily.png`, and `icon_settings.png`.

```text
Create one mobile game menu icon on transparent background.

Icon: {ICON_NAME}
Meaning: {MEANING}

Canvas: solid pure magenta #FF00FF background for chroma key removal.
The magenta background is not part of the asset.

Style: antique gold symbol with subtle bevel, designed for a dark emerald menu button, West African / Nigerian-inspired geometric touch, thick readable silhouette, mobile game UI quality.

Rules:
- no text
- no emoji
- no button background
- no yellow backing plate
- no circular badge
- no watermark

Keep the icon bold enough to read at 88x88 or smaller.
```

Suggested meanings:

- `icon_levels.png`: level map / stacked tiles / chapter marker
- `icon_daily.png`: sun or calendar-inspired daily token
- `icon_settings.png`: gear / carved knob / control symbol

## 7. Optional Title-Only Prompt

Use for `title_tribal_tiles.png` if the logo lockup needs a smaller fallback.

```text
Create a title-only wordmark for Tribal Tiles.

Canvas: solid pure magenta #FF00FF background for chroma key removal.
The magenta background is not part of the asset.

Style: elegant carved display wordmark, warm ivory and antique gold, subtle West African / Nigerian-inspired ornament, clean readability, mobile game menu quality.

Rules:
- title only
- no logo emblem
- no button plate
- no watermark
- no busy decoration
```

## 8. Negative Constraints For All Menu Assets

Keep these out of every menu asset:

- Chinese mahjong characters
- traditional bamboo / dot / character suits
- extra borders or button plates unless the asset spec calls for them
- realistic faces
- sacred symbols
- flags or emblems
- neon gradients
- thin unreadable line art
- watermark or signature

