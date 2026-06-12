# Asset Spec Coverage Report

## FIRST_SCREEN_ASSET_SPEC.json
- Expected: 62
- Found: 55
- Missing: 7
- Wrong size: 0
- Missing alpha on transparent assets: 0
- Interpretation: the current first-screen delivery candidate covers the full P0 batch; the 7 missing files are P1 follow-up assets only.
- Missing files:
- `bg_game_texture_variant.png`
- `board_edge_vignette.png`
- `state_tool_disabled.png`
- `tool_label_strip.png`
- `state_tile_highlight.png`
- `state_match_burst.png`
- `modal_panel_dark_gold.png`

## MENU_SCREEN_ASSET_SPEC.json
- Expected: 14
- Found: 12
- Missing: 2
- Wrong size: 0
- Missing alpha on transparent assets: 0
- Interpretation: menu P0 is covered via the shared `bg_game_1080x2400.png` from the first-screen batch plus the three local P0 menu files; the missing files are one optional P1 play glyph and the shared background reused from first-screen.
- Missing files:
- `bg_game_1080x2400.png`
- `icon_play.png`

## MODAL_ASSET_SPEC.json
- Expected: 27
- Found: 2
- Missing: 27
- Wrong size: 0
- Missing alpha on transparent assets: 0
- Status: pending processed modal batch
- Interpretation: this is raw source only; there is no processed modal delivery batch yet, so modal assets remain PENDING_PROCESS.
