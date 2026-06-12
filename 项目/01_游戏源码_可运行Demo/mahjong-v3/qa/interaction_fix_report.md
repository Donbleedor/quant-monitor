# Interaction Fix Report

## Scope

- Updated `main.js` only.
- Did not touch `ui.js`, `data.js`, `engine.js`, `index.html`, `style.css`, or any PNG assets.

## Behavior Changes

### 1) Daily Victory Copy

- `main.js` now passes an explicit display label into `UI.showWinModal()` for Daily wins.
- Daily victory copy is stable as `DAILY complete` even when the raw level id is `D`.
- Numeric levels still pass through unchanged and continue to render as `Level N complete`.

### 2) Home vs Pause

- `Pause` still opens the pause modal through `pauseGame()`.
- `Home` now uses a separate return path, `returnToMenuFromGame()`, instead of reusing the pause flow.
- Home return clears:
  - `timerInterval`
  - `hintTimer`
  - `comboTimer`
  - current tile selection
  - hint highlights
  - combo counter
- Home returns directly to the menu without browser `confirm()` and without adding a cross-file API.

### 3) Shuffle / Tool Semantics

- Internal controller tool state now uses explicit infinite semantics:
  - `Game.tools.shuffle = Infinity`
- UI-facing tool state is normalized through `getUiTools()` so the shuffle badge still shows `∞`.
- `engine.shuffle()` behavior was not changed.

### 4) Settings DOM Contract

`main.js` now syncs settings onto `#app` on init, menu entry, game entry, and toggle changes.

Contract:

- Classes:
  - `#app.large-font`
  - `#app.high-contrast`
- Data attributes:
  - `#app[data-large-font="true|false"]`
  - `#app[data-high-contrast="true|false"]`
  - `#app[data-sfx-enabled="true|false"]`
  - `#app[data-bgm-enabled="true|false"]`

Notes:

- `largeFont` and `highContrast` are applied to the DOM state immediately.
- `sfx` and `bgm` are persisted and exposed via `data-*`, but this project still has no audio system, so no playback was added or faked.
- I did not change CSS; Agent B can key styles off the class/data contract above.

## Verification

- Confirmed `playDailyChallenge()` still resets `elapsedSeconds` to `0` before the level starts.
- Confirmed the Home / Pause split, unlimited shuffle badge contract, and settings `#app` DOM contract remain unchanged.
- Ran: `node --check main.js`
- Result: passed

## Residual Risk

- Visual changes for `large-font` / `high-contrast` depend on downstream CSS work.
- The audio toggles remain storage/state only until an audio layer exists.
