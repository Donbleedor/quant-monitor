# Integration Risk Notes

Date: 2026-06-10

## 1. Current Architecture Risk

The game is simple, but the UI is not asset-based yet.

Current state:

- `ui.js` creates HTML strings and DOM nodes.
- `style.css` owns nearly all visual design.
- `data.js` owns tile identity.
- `engine.js` owns gameplay logic.

Risk:

- A careless visual rewrite could accidentally break event IDs, state classes, or tile matching.

Rule:

- Preserve IDs, class hooks, and data attributes unless a deliberate migration is documented.

New display rule:

- The app must no longer stretch to arbitrary browser proportions.
- Runtime should use a fixed Transsion mainstream 9:20 shell and scale that shell to fit the viewport.

## 2. Do Not Touch First

Avoid touching these in the first implementation pass:

- `engine.js`
- `MahjongEngine.canMatch`
- `MahjongEngine.removePair`
- `MahjongEngine.shuffle`
- `MahjongEngine.findHintPair`
- `MahjongEngine.updateAllFreeStatus`
- layout template generation

Reason:

- The requested reskin is visual. The engine already supports 34 logical tile types and pair matching by `typeId`.

## 3. High-Risk UI Hooks

Must preserve:

```text
id="btnHome"
id="btnPause"
id="btnHint"
id="btnUndo"
id="btnShuffle"
id="boardArea"
id="boardContainer"
data-tile-id
class="tile"
class="tile-face"
class="modal-overlay"
id="gameModal"
```

Tile click binding depends on:

```js
e.target.closest('.tile')
parseInt(tileEl.dataset.tileId)
```

Therefore:

- Images inside tiles must not consume events in a way that blocks `.tile`.
- Add `pointer-events: none` to symbol images.

## 4. Tile Size Risk

Current tile dimensions are computed dynamically in `ui.js`:

```text
tileW = min(width-fit, height-fit, 60)
tileH = tileW * 1.2
minimum tileW = 42
minimum tileH = 50
zOffsetPx = 4
```

Risk:

- If generated tile art contains wide shadows or large transparent padding, stacked tiles may visually overlap badly.

Mitigation:

- Source tile art should fit inside a strict 5:6 ratio.
- Keep visual shadow mostly inside the tile bounding box.
- Use CSS for depth shadow rather than baking large shadows into each tile image.

## 5. Layout Risk

The board uses mathematical positions from `x/y/z`.

Risk:

- Changing tile aspect ratio or z offset can cause dense layouts to collide or exceed viewport.

Mitigation:

- Keep tile aspect ratio close to current `1 : 1.2`.
- Adjust only:
  - board padding
  - max tile width
  - z offset
  - top/bottom bar height

Avoid:

- Changing layout templates during first pass.

## 6. Fixed 9:20 Display Risk

Current CSS:

```text
#app width: 100%
#app max-width: 480px
#app height: 100dvh
```

This produces different game compositions on different viewport ratios.

Required behavior:

- `#app` must preserve `aspect-ratio: 9 / 20`.
- `#app` must fit inside the viewport using contain-style scaling.
- Any extra browser space should become outer matte/pillarbox/letterbox.
- All screens should live inside the same fixed shell:
  - menu
  - gameplay
  - daily challenge
  - pause modal
  - level select
  - win modal
  - settings modal

Recommended CSS direction:

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

Risks:

- Some mobile browsers handle `100dvh` differently when address bars appear.
- If `#app` size changes on browser chrome show/hide, the game remains 9:20 but may scale slightly.
- If old `max-width: 480px` is left in place, desktop preview may be smaller than desired but still valid if height is tied to ratio.

Mitigation:

- Test at desktop wide, desktop narrow, `360x800`, `720x1600`, and `1080x2400`.
- Validate that the internal layout does not reflow except by uniform scale.

## 7. Text And Encoding Risk

Current files are UTF-8 and contain Chinese text and emoji.

Reskin goal:

- Remove most Chinese gameplay labels.
- Replace emoji UI icons with PNG or icon assets.
- Use short English only where necessary.

Risk:

- If text is blindly replaced, some state descriptions may become unclear.

Mitigation:

- Gameplay first pass:
  - Top label: `Lv. 1` or `Level 1`
  - Tools: icon-first, optional tiny labels `Hint`, `Undo`, `Mix`
  - Pause modal later: `Resume`, `Restart`, `Home`

## 8. Asset Loading Risk

There is currently no preload system.

Risk:

- Tile images may flicker or show broken icons on first render.

Mitigation options:

Option A, low complexity:

- Use normal `<img>` paths.
- Browser caches after first load.
- Accept minor first-load flicker for validation.

Option B, recommended after first pass:

- Add an asset preloader before `Game.init()`.
- Only start UI after required images resolve or time out.

First pass recommendation:

- Use Option A unless missing image flicker becomes distracting.

## 9. Missing Asset Fallback

Add fallback behavior in `ui.js` when `tileData.asset` is missing:

```text
Show shortMark or name initials.
Do not show old Chinese mahjong text.
```

This helps during staged generation.

## 10. Full Project Expansion Risk

After gameplay screen, additional screens reuse assets but have their own risks:

| Screen | Risk |
| --- | --- |
| Menu | Branding may need a new title/logo direction |
| Level select | Scroll grid and locked states need careful contrast |
| Pause modal | Button labels can be reduced, but actions must remain obvious |
| Win modal | Star/score states need readable reward hierarchy |
| Settings | Labels may still need English text for clarity |
| Daily challenge | Reuses game screen but label should not overflow |

## 11. Verification Checklist

Manual browser checks:

- Open `index.html`.
- Start normal level.
- Select a free tile.
- Try selecting a blocked tile.
- Use hint.
- Use undo.
- Use shuffle.
- Pause and resume.
- Return home.
- Open level select.
- Open settings.

Technical checks:

- No console errors.
- No missing image icons.
- No 404 if served through a local server.
- No text overflow in top/bottom bars.
- Board remains centered after resize.
- Game shell remains 9:20 after browser resize.
- No gameplay UI appears outside the shell.

## 12. Rollback Plan

Before implementation:

- If the project is not under git, create a backup copy or keep edits scoped enough to revert manually.

During first pass:

- Keep all new generated assets under `assets/generated`.
- Keep tile mapping changes in `data.js`.
- Keep visual rendering changes in `ui.js` and `style.css`.
- Do not scatter hard-coded image paths across multiple unrelated files.

If something breaks:

1. Revert `ui.js` tile rendering first.
2. Revert `style.css` visual changes second.
3. Keep generated assets intact for reuse.
4. Do not modify `engine.js` to fix visual issues.
