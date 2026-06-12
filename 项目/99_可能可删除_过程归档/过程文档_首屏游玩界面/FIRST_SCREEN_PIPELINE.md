# First Screen Pipeline

Date: 2026-06-10

First screen: normal gameplay.

Reason:

- It contains the core product experience.
- It exercises the most important asset family: totem tiles.
- It also includes top HUD, bottom tools, timers, states, and clickable gameplay.
- If this screen works, the rest of the project can reuse the same system.

Display rule:

- The concept and implementation must use a fixed Transsion mainstream 9:20 portrait canvas.
- Concept image size: `1080x2400`.
- Browser resize should scale the whole game shell, not change the game composition.

## 1. Current Gameplay Screen Anatomy

DOM structure from `ui.js`:

```text
game-screen
  top-bar
    btnHome
    levelLabel
    timerDisplay
    btnPause
  board-area
    board-container
      tile-depth
      tile
        tile-face
  bottom-bar
    btnHint
    btnUndo
    btnShuffle
```

Important CSS states:

```text
tile
tile.free
tile.blocked
tile.side-blocked
tile.selected
tile.hint-glow
tile.matched
tile.wrong-shake
tile-depth
tool-btn.disabled
```

## 2. Concept Generation Plan

Generate 2 full-screen gameplay concepts before cutting assets.

Both concepts must be composed at `1080x2400` and keep these 9:20 zones:

```text
0-160 px       top HUD / safe top visual space
160-1860 px    board and gameplay focus
1860-2400 px   bottom tools / safe bottom visual space
```

These pixel bands are concept guidelines, not final hard code. The goal is to target the Transsion common `720x1600` / `1080x2400` family instead of arbitrary browser proportions.

### Concept A: Conservative

Purpose:

- Minimize integration risk.
- Preserve approximate existing layout and tile scale.

Visual:

- Dark green patterned background.
- Cleaner gold-edged top bar.
- Ivory stone totem tiles with simple embossed symbols.
- Bottom tray similar to current structure, but with rounder carved buttons.
- Composition fits a strict 9:20 canvas with mild pillar/letterbox tolerance outside the app shell.

Use this if:

- Tile readability is most important.
- We want the fastest path to code integration.

### Concept B: Stylized

Purpose:

- Push closer to the provided reference art.

Visual:

- Richer textile pattern background.
- Strong gold UI frame and ornamental edges.
- More sculpted tile depth.
- Bottom tool buttons closer to premium mobile game UI.
- Composition still keeps fixed 9:20 constraints; stronger styling should not rely on arbitrary browser height.

Use this if:

- The overall style needs stronger transformation from the demo.
- Slightly more code/CSS adjustment is acceptable.

## 3. Asset Extraction From Approved Concept

Once one concept is approved, extract only the gameplay assets needed for first pass.

P0:

- `bg_game_pattern.png`
- `panel_top_hud.png` or CSS/pseudo + texture equivalent
- `panel_bottom_tools.png` or CSS/pseudo + texture equivalent
- `tile_base_ivory.png`
- `tile_depth_shadow.png` or CSS depth style
- `tile_selected_glow.png` or CSS glow style
- `icon_home.png`
- `icon_pause.png`
- `icon_hint.png`
- `icon_undo.png`
- `icon_shuffle.png`
- 34 totem tile faces or a staged subset plus fallback mapping

P1:

- `badge_count.png`
- `toast_panel.png`
- `modal_panel_pause.png`

## 4. Recommended First Asset Batch

For a low-cost validation, do not immediately generate every decorative flourish.

Batch 1 should include:

| Asset | Target | Notes |
| --- | --- | --- |
| Game background | full app background | Use `1080x2400`; no 842x1670 dependency |
| Tile base | scalable by CSS | Use 120x144 source ratio from old spec |
| Tile face icons | 34 logical IDs | Start with generated PNGs; if generation cost is high, make 12-16 first and duplicate temporarily only for visual test |
| Home icon | top left | Replace emoji |
| Pause icon | top right | Replace emoji |
| Hint icon | bottom tool | Replace emoji |
| Undo icon | bottom tool | Replace emoji |
| Shuffle icon | bottom tool | Replace emoji |
| Bottom tray | bottom bar | Can be CSS with texture, PNG optional |

## 5. Tile System Plan

Keep 34 engine IDs, but reinterpret them as totem identities.

Suggested 34 identities:

### Nature Set 1-9

1. Sun seed
2. Twin leaves
3. Branch cluster
4. Flower cross
5. Palm fan
6. Rain drop pair
7. Wave mark
8. Mountain chevron
9. Star blossom

### Craft Set 10-18

10. Drum
11. Shield
12. Cowrie shell
13. Woven basket
14. Clay pot
15. Comb
16. Bell
17. Spear tip
18. Gold bead

### Pattern Set 19-27

19. Diamond knot
20. Zigzag cloth
21. Triple triangle
22. Spiral sun
23. Cross weave
24. Step motif
25. Ring glyph
26. Blue stripe glyph
27. Green lattice glyph

### Special Set 28-34

28. Mask mark
29. Baobab tree
30. Moon bowl
31. Fire mark
32. Water mark
33. Crown token
34. Ancestral tile mark, abstract only

Readability rules:

- Each tile face must be recognizable at approximately 42x50 CSS display size.
- Use thick silhouette, not thin detail.
- Each identity must have one dominant symbol.
- A small corner number or dot marker can remain for accessibility and easy matching.

## 6. Code Integration Plan After Approval

Step 1: Add assets.

```text
mahjong-v2/assets/generated/tiles/
mahjong-v2/assets/generated/ui/
```

Step 2: Update `data.js`.

- Keep IDs `0-33`.
- Replace `suit`, `num`, `name`, `color` with totem metadata.
- Add fields such as `asset`, `family`, `shortCode`, `accent`.

Example:

```js
{ id: 0, family: 'nature', shortCode: 'sun', name: 'Sun Seed', asset: 'assets/generated/tiles/tile_totem_sun_seed.png', accent: '#c77a2a' }
```

Step 3: Update `ui.js` board rendering.

- Replace the current `tile-num/tile-suit/tile-honor` text HTML with:

```html
<img class="tile-symbol" src="..." alt="">
<span class="tile-mark">1</span>
```

- Keep `.tile` container and data attributes.
- Keep click binding unchanged.

Step 4: Update `style.css`.

- Update tile base to use image background or CSS texture.
- Add `.tile-symbol`, `.tile-mark`.
- Tune board padding and tile size caps.
- Restyle top/bottom bars and tool icons.
- Replace fluid app sizing with a fixed 9:20 shell:

```css
body {
  min-height: 100dvh;
  display: grid;
  place-items: center;
}

#app {
  aspect-ratio: 9 / 20;
  width: min(100vw, calc(100dvh * 9 / 20));
  height: min(100dvh, calc(100vw * 20 / 9));
  overflow: hidden;
}
```

- If a maximum desktop display size is wanted, add it without breaking `9 / 20`.

Step 5: Verify.

- Open `index.html`.
- Play Level 1.
- Click free tile, blocked tile, hint, undo, shuffle, pause, home.
- Confirm no missing images.

## 7. Acceptance Criteria

Visual:

- No traditional mahjong symbols remain in gameplay.
- Tile pairs are easy to identify.
- Top and bottom UI belong to the same visual system as the tiles.
- Background does not compete with tile readability.

Technical:

- Existing match logic still works.
- Existing event IDs still work.
- Tile state classes still work.
- No console errors.
- No asset 404s.
- Browser resize preserves 9:20 game composition.
- UI is not stretched, compressed, or reflowed outside the fixed ratio.

Process:

- First screen result creates reusable asset and code patterns for menu, modals, and daily challenge.
