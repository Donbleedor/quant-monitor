# Modal Asset Spec

Date: 2026-06-11

## 1. Scope

This spec covers pause / settings / win / level select modal assets only.

The assets below are organized for later image generation and postprocess. No code changes are included here.

## 2. Shared Assets

| Group | File | Size | Transparent | Usage | Attach | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| shared | `bg_game_1080x2400.png` | `1080x2400` | No | Shared full-screen background reference | full-screen base layer | P0 |

## 3. Overlay And Panel Family

| Group | File | Size | Transparent | Usage | Attach | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| modal_overlay | `modal_overlay_dark.png` | `1080x2400` | No | Dark textured overlay base for all modals; code should control opacity | overlay above background | P0 |
| modal_panel | `modal_panel_standard.png` | `860x1120` | Yes | Base panel for pause and settings | centered modal body | P0 |
| modal_panel | `modal_panel_large.png` | `940x1480` | Yes | Taller panel for win and level select | centered modal body | P0 |
| modal_panel | `modal_title_strip.png` | `620x120` | Yes | Small gold/ivory title strip | top of modal body | P1 |
| modal_panel | `modal_divider_gold.png` | `720x24` | Yes | Thin divider or separator line | between modal sections | P1 |

## 4. Action Buttons And Icons

| Group | File | Size | Transparent | Usage | Attach | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| action_button | `btn_modal_primary.png` | `520x140` | Yes | Main action shell | modal action row | P0 |
| action_button | `btn_modal_secondary.png` | `520x120` | Yes | Secondary action shell | modal action row | P0 |
| action_icon | `icon_resume.png` | `88x88` | Yes | Resume / play glyph | pause modal primary action | P0 |
| action_icon | `icon_restart.png` | `88x88` | Yes | Restart / replay glyph | pause modal action | P0 |
| action_icon | `icon_home.png` | `88x88` | Yes | Home glyph | pause / win modal action | P0 |
| action_icon | `icon_close.png` | `88x88` | Yes | Close glyph | top-right modal close button | P0 |
| action_icon | `icon_next.png` | `88x88` | Yes | Next glyph | win modal action | P0 |
| action_icon | `icon_star.png` | `72x72` | Yes | Reward star | win modal stars / badge | P0 |
| action_icon | `icon_lock.png` | `72x72` | Yes | Locked state glyph | level select locked node | P0 |

## 5. Level Select Assets

| Group | File | Size | Transparent | Usage | Attach | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| level_node | `level_node_open.png` | `132x132` | Yes | Unlocked level node shell | level grid node | P0 |
| level_node | `level_node_current.png` | `132x132` | Yes | Current level node shell | level grid node | P0 |
| level_node | `level_node_locked.png` | `132x132` | Yes | Locked level node shell | level grid node | P0 |
| level_node | `level_star_small.png` | `28x28` | Yes | Small completion star | under level node | P1 |
| level_node | `level_badge_completed.png` | `44x44` | Yes | Completed marker | completed node overlay | P1 |

## 6. Settings Assets

| Group | File | Size | Transparent | Usage | Attach | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| settings | `toggle_track.png` | `104x60` | Yes | Toggle track body | setting row | P0 |
| settings | `toggle_knob.png` | `52x52` | Yes | Toggle thumb | setting row | P0 |
| settings | `settings_row_plate.png` | `760x112` | Yes | Optional row plate | setting row background | P1 |

## 7. Win Assets

| Group | File | Size | Transparent | Usage | Attach | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| win | `stat_chip_time.png` | `320x108` | Yes | Time stat chip | win modal stats | P1 |
| win | `stat_chip_moves.png` | `320x108` | Yes | Moves stat chip | win modal stats | P1 |
| win | `win_medal_center.png` | `180x180` | Yes | Decorative reward medallion | win modal header | P1 |
| win | `win_confetti_piece.png` | `28x28` | Yes | Small confetti token | win celebration layer | P1 |

## 8. Notes On Transparency

All transparent assets must be generated on pure magenta `#FF00FF` and then postprocessed into alpha PNGs.

The final deliverable is the processed PNG in exact target size, not the raw generation output.

## 9. Implementation Attachment Guidance

Suggested modal family mapping:

- `showPauseModal()` -> `modal_panel_standard.png`, `icon_resume.png`, `icon_restart.png`, `icon_home.png`
- `showSettingsModal()` -> `modal_panel_standard.png`, `toggle_track.png`, `toggle_knob.png`, `icon_close.png`
- `showWinModal()` -> `modal_panel_large.png`, `icon_next.png`, `icon_home.png`, `icon_star.png`, `stat_chip_time.png`, `stat_chip_moves.png`
- `showLevelSelectModal()` -> `modal_panel_large.png`, `level_node_open.png`, `level_node_current.png`, `level_node_locked.png`, `icon_lock.png`, `icon_close.png`
