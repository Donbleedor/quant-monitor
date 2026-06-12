# Screen Inventory And Code Scan

Date: 2026-06-10

## 1. Project Shape

Project path:

- `E:\参考图\麻将\项目\01_游戏源码_可运行Demo\mahjong-v2`

Files:

| File | Purpose | Notes |
| --- | --- | --- |
| `index.html` | App entry | Loads `data.js`, `engine.js`, `ui.js`, `main.js` |
| `style.css` | All current visual styling | No external image assets except inline SVG data URI pattern |
| `ui.js` | DOM rendering for screens, board, modals, toasts | Primary reskin target |
| `main.js` | Game state and event wiring | Should remain mostly unchanged |
| `data.js` | Tile types, level config, layouts, save model | Tile identity remapping target |
| `engine.js` | Match logic, layout generation, free-tile checks | Do not touch for first pass |
| `debug.html` | Logic test/debug page | Not a product-facing screen |

Important finding:

- The current project has no image asset directory.
- UI is built from CSS, DOM nodes, text, and emoji.
- Therefore the reskin should add an asset system rather than replace existing image files.

Important display finding:

- Current `#app` uses `width: 100%`, `max-width: 480px`, and `height: 100dvh`.
- This means the game composition follows browser height and device shape.
- New requirement: replace this with a fixed Transsion mainstream 9:20 game shell. The shell scales to fit the viewport, but its internal composition must remain 9:20.

## 2. Product Screens Found In Code

### Main Menu

Render entry:

- `ui.js`: `renderMenu(save, onPlay, onLevels, onDaily, onSettings)`

Current visible elements:

- background pattern
- settings button
- mahjong emoji logo
- Chinese title
- English subtitle
- play button
- level select button
- daily challenge button

Reskin priority:

- P1 after gameplay screen.

Expected new direction:

- Replace title with `Tribal Tiles` or `Savanna Tiles`.
- Replace mahjong logo with a totem tile / gold medallion logo.
- Reduce text; use large play symbol plus small optional title.

### Normal Gameplay

Render entry:

- `ui.js`: `renderGameScreen(levelId, tools)`
- `ui.js`: `renderBoard(engine, selectedTileId, hintTileIds)`

Main event wiring:

- `main.js`: `bindGameEvents()`
- `main.js`: `bindTileClicks()`

Current visible elements:

- top bar
- home button
- level label
- timer
- pause button
- board area
- stacked tile DOM nodes
- bottom toolbar
- hint / undo / shuffle buttons
- numeric badges

Reskin priority:

- P0. This is the first screen to run end to end.

Expected new direction:

- Dark patterned textile or carved background.
- Gold-edged top HUD.
- Stone/ivory totem tiles.
- Bottom tool tray with round gold/green buttons.
- Replace emoji icons with generated PNG icons.
- Keep timer and level text small; later can reduce text further.
- Design all placements on a `1080x2400` concept canvas and map them to a 9:20 runtime shell.

### Daily Challenge Gameplay

Render entry:

- `main.js`: `playDailyChallenge()`
- Uses `UI.renderGameScreen('每日挑战', this.tools)`

Current visible elements:

- Same gameplay layout as normal game.
- Different level label.
- Different tool counts.

Reskin priority:

- P1 after normal gameplay.

Expected new direction:

- Reuse normal gameplay assets.
- Change label to compact English, e.g. `DAILY`.
- Optional daily icon badge later.

### Pause Modal

Render entry:

- `ui.js`: `showPauseModal(onResume, onRestart, onHome)`

Current visible elements:

- blurred dark overlay
- panel
- title
- subtitle
- resume / restart / home buttons

Reskin priority:

- P1 because it appears from the first gameplay screen.

Expected new direction:

- Reuse modal panel family.
- Prefer icon-led buttons: play, replay, home.
- Keep short English labels if needed: `Resume`, `Restart`, `Home`.

### Win Modal

Render entry:

- `ui.js`: `showWinModal(levelId, stars, timeStr, moves, onNext, onHome)`

Current visible elements:

- title
- stars
- time/moves stat cards
- next/home buttons
- confetti

Reskin priority:

- P2 for first pass; P1 for full project completion.

Expected new direction:

- Gold celebratory panel.
- Star/medal assets.
- Keep stats in English: `Time`, `Moves`.

### Level Select Modal

Render entry:

- `ui.js`: `showLevelSelectModal(levels, save, onSelectLevel, onClose)`

Current visible elements:

- modal panel
- title/subtitle
- scrollable 5-column level grid
- locked/current/completed states
- close button

Reskin priority:

- P1 because it is accessible from the menu.

Expected new direction:

- Convert into chapter/map-style panel later.
- For low-cost validation, keep grid but reskin nodes as carved stone/gold level tokens.

### Settings Modal

Render entry:

- `ui.js`: `showSettingsModal(settings, onToggle, onClose, onClearData)`

Current visible elements:

- settings list
- toggles
- clear data button

Reskin priority:

- P2. Not required for first gameplay pass.

Expected new direction:

- Reuse modal panel, toggle, icon button families.
- Labels can be English: `SFX`, `Music`, `Large Text`, `Contrast`.

### Toasts And Effects

Render entries:

- `ui.js`: `showTip(text)`
- `ui.js`: `showCombo(count)`
- `ui.js`: `showDeadlockToast()`
- `ui.js`: `showConfetti()`

Reskin priority:

- P2.

Expected new direction:

- Keep CSS-only for first pass.
- Later replace confetti colors with gold/clay/green particles.

## 3. Core Gameplay Assets To Preserve

These are gameplay constraints, not visuals:

- `engine.js` checks matches by `typeId`.
- `TILE_TYPES.length` is 34.
- Current levels generate pairs from those 34 IDs.
- Tile positions use `x`, `y`, `z` and fixed board bounds.
- UI class names `free`, `blocked`, `side-blocked`, `selected`, `hint-glow`, `matched`, `wrong-shake` drive state visuals.

Do not change in first pass:

- `canMatch()`
- `removePair()`
- `undo()`
- `shuffle()`
- `findHintPair()`
- free-tile logic
- level layout generation

Display behavior to change:

- Replace arbitrary viewport filling with a 9:20 app shell.
- Keep board layout centered inside the 9:20 shell.
- Allow tile size to be computed from the fixed shell area, not from full browser height when browser ratio is not 9:20.

## 4. First-Pass Code Entry Points

Likely files to edit after visual approval:

| File | Why |
| --- | --- |
| `data.js` | Replace traditional tile metadata with totem tile metadata while keeping IDs |
| `ui.js` | Render tile icons/image paths instead of Chinese text/suit labels |
| `style.css` | Add generated asset backgrounds, update layout, states, HUD, and fixed 9:20 app shell |
| `index.html` | Optional title update and cache version bump |

Likely new files/directories:

| Path | Purpose |
| --- | --- |
| `assets/generated/tiles/` | 34 totem tile face PNGs and tile state assets |
| `assets/generated/ui/` | top bar, bottom bar, modal, button, icon assets |
| `assets/generated/generatedAssets.js` | Optional mapping table if we choose a structured asset registry |

## 5. Screenshot Coverage

Provided screenshots map to:

| Screenshot | Screen |
| --- | --- |
| `截图\1.png` | Main menu |
| `截图\2.png` | Normal gameplay |
| `截图\3.png` | Pause modal over gameplay |
| `截图\4.png` | Level select modal |
| `截图\5.png` | Daily challenge gameplay |

Not provided but found in code:

- Win modal.
- Settings modal.
- Toasts/combo/deadlock states.
- Debug page, which is not part of product reskin.

