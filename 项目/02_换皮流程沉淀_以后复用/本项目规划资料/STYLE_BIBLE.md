# Style Bible

Date: 2026-06-10

Project: Mahjong V2 reskin to a West African / Nigerian-inspired totem tile matching game.

## 1. Canonical Canvas

Primary target:

- Device family: Transsion mainstream Android phones.
- Common physical resolution: `720x1600`.
- Production canvas: `1080x2400`.
- Runtime shell ratio: `9 / 20`.
- Logical design grid: `360x800`, exported at `3x`.

All full-screen concepts and background assets must be made for `1080x2400`.

## 2. Art Direction

The visual target is a readable, low-cost validation skin with premium hints:

- Dark emerald textile-like background.
- Antique gold carved UI frames.
- Warm ivory carved stone gameplay tiles.
- Clay orange, bronze, deep blue, and green accents.
- Bold totem symbols with high small-size recognition.
- Mostly icon-based UI, minimal English text.

This is inspired by West African and Nigerian visual language, but should avoid pretending to be a literal cultural artifact. Treat the references as a modern game UI style guide, not as documentary cultural reproduction.

## 3. Palette

Core colors:

| Role | Hex | Usage |
| --- | --- | --- |
| Deep emerald | `#0E2A1D` | Main background, panels |
| Forest green | `#17462E` | Button faces, HUD panels |
| Antique gold | `#D6A648` | Borders, active states, icons |
| Bright gold | `#F4C95D` | Highlights, rewards |
| Warm ivory | `#E9DAB6` | Tile face/base |
| Stone shadow | `#8A7856` | Tile side/depth |
| Clay orange | `#B65A22` | Craft family accents |
| Midnight blue | `#173650` | Pattern family accents |
| Leaf green | `#2F7A4B` | Nature family accents |
| Dark matte | `#07120D` | Outside shell / modal overlay |

Avoid:

- Neon saturation.
- Pure flat primary colors.
- Purple-blue gradient dominance.
- Large beige-only surfaces without green/gold contrast.

## 4. Material Rules

Background:

- Dark woven textile, engraved geometric pattern, or carved wall texture.
- Low contrast pattern. It must not compete with tile symbols.
- No literal photo collage.

Panels:

- Dark green base.
- Antique gold outer trim.
- Very subtle inner bevel.
- Optional geometric corner ornaments.
- Radius should feel game-like but not bubbly.

Tiles:

- Warm ivory stone / bone / ceramic feel.
- Rounded rectangle, aspect ratio `5:6`.
- Subtle bevel, small inner highlight, grounded depth.
- Symbol is either engraved, inlaid, or painted flat with carved edge.
- Do not bake oversized external shadows into symbol PNGs.

Icons:

- Gold or ivory icon on dark green circular/rounded button.
- Thick silhouette, no thin line icon style.
- No emoji.

## 5. Typography

Text should be minimized.

Allowed English text:

- `Tribal Tiles` or `Savanna Tiles`
- `Level`
- `Daily`
- `Resume`
- `Restart`
- `Home`
- `Time`
- `Moves`

Gameplay tools can use icon-only buttons with tiny fallback labels:

- `Hint`
- `Undo`
- `Mix`

Text style:

- Use clean, bold UI sans-serif for live text.
- Optional title display can use engraved serif-like style, but keep it readable.
- Do not use Chinese text in the reskinned gameplay UI.

## 6. Totem Symbol Rules

Each tile symbol must:

- Be recognizable at `42x50` CSS pixels.
- Use one dominant object or pattern.
- Have a thick silhouette.
- Keep details inside the tile safe area.
- Use consistent light direction: upper-left light, lower-right shadow.
- Include no Chinese mahjong characters.
- Include no realistic human face.
- Avoid sacred/religious-looking marks.
- Avoid national flags, official emblems, or specific tribal identifiers.

Allowed motif families:

- Nature: sun, leaf, branch, flower, rain, wave, mountain, star.
- Craft: drum, shield, shell, basket, clay pot, comb, bell, spear tip, bead.
- Pattern: diamond, zigzag, triangles, spiral, weave, step, ring, stripes, lattice.
- Special: abstract mask mark, baobab, moon bowl, fire, water, crown token, heritage knot.

## 7. UI Component Rules

Top HUD:

- Slim, readable, not heavy.
- Home icon left, level/time center/right, pause icon right.
- Should feel like a carved green/gold strip.

Board:

- Primary focus of the screen.
- Tile stack must remain clearly readable.
- Background pattern should darken behind board center.

Bottom tools:

- Three tools: hint, undo, shuffle/mix.
- Use icon-first treatment.
- Count badge should be gold coin-like circle.
- Disabled state should be dimmed, not recolored randomly.

Modals:

- Reuse dark green/gold panel family.
- Use icon-led actions.
- Keep short English labels only where needed.

## 8. State Rules

Free tile:

- Normal brightness.
- Slight top highlight.

Covered tile:

- Darker and less saturated.
- Still recognizable enough to see board structure.

Side-blocked tile:

- Normal tile visual but not clickable.
- Do not make it look broken.

Selected tile:

- Gold glow or bright edge.
- Must be obvious at small size.

Hint tile:

- Green-gold pulse.
- Should not look identical to selected state.

Matched tile:

- Scale/fade animation can remain CSS-driven.

## 9. Negative Style List

Do not generate:

- Chinese mahjong characters.
- Mahjong bamboo/dot/character suits.
- Emoji-like UI.
- Random safari animals as the main UI language.
- Photorealistic human faces.
- Sacred/religious symbols.
- Flags or political/national emblems.
- Watermarks or signatures.
- Blurry small details.
- Busy full-screen illustration behind the board.

## 10. Master Prompt Seed

Use this as a style prefix:

```text
West African / Nigerian-inspired modern mobile game UI, dark emerald textile pattern background, antique gold carved trim, warm ivory stone tiles, clay orange and midnight blue accents, embossed geometric ornaments, readable at small mobile size, polished but low-cost implementable H5 game skin, icon-first interface, no Chinese mahjong characters, no emoji, no watermark.
```

