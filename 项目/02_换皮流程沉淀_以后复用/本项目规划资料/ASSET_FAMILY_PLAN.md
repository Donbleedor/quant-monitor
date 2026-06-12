# Asset Family Plan

Date: 2026-06-10

This plan replaces the old traditional mahjong asset plan with a totem tile system.

## 1. Directory Recommendation

Inside project:

```text
mahjong-v2/
  assets/
    generated/
      tiles/
      ui/
      backgrounds/
      review/
```

Planning and reports stay outside the game project:

```text
E:\参考图\麻将\项目\
  RESKIN_BRIEF.md
  SCREEN_INVENTORY.md
  FIRST_SCREEN_PIPELINE.md
  ASSET_FAMILY_PLAN.md
  INTEGRATION_RISK_NOTES.md
```

## 2. Canvas And Export Rules

All screen-level design and asset production must target a fixed Transsion mainstream 9:20 portrait canvas.

Canonical sizes:

| Use | Size |
| --- | --- |
| Full screen concept | `1080x2400` |
| Full screen background | `1080x2400` |
| Runtime app shell | `9 / 20` aspect ratio |
| Low-end device reference | `720x1600` |
| Tile source | `120x144` or higher same 5:6 ratio |

Rules:

- Do not generate full-screen assets based on the old `842x1670` screenshots.
- Do not design UI that depends on very tall phone space.
- Keep top HUD, board, bottom tray, and modals inside the 9:20 safe composition.
- Outside the game shell, the browser may show a dark/patterned matte, but no gameplay UI should appear there.

## 3. Asset Families

### Gameplay Tiles

Priority: P0

Purpose:

- Replace all visible traditional mahjong tile content.

Files:

```text
tile_base_ivory.png
tile_base_blocked.png
tile_base_selected.png
tile_totem_01_sun_seed.png
...
tile_totem_34_ancestral_mark.png
```

Recommended source size:

- `120x144`, inherited only as a useful size from the old spec.

Runtime display:

- Current CSS scales tiles between roughly `42x50` and `60x72`.
- New source should remain sharp after downscaling.
- Final display size should be computed from the fixed 9:20 game shell, not arbitrary browser height.

Transparency:

- Tile face icons should be transparent PNG.
- Tile base may be transparent PNG or CSS/image background.

Notes:

- Generate tile base once.
- Generate symbols as transparent overlays if possible.
- This allows selected/blocked states to remain CSS-driven.

### HUD And Bars

Priority: P0 for gameplay, P1 for full project.

Files:

```text
bg_game_pattern.png
panel_top_hud.png
panel_bottom_tools.png
ornament_corner_gold.png
badge_count_gold.png
```

Recommended approach:

- First pass: use CSS panels with background texture and generated icon PNGs.
- Later pass: add sliced panel PNGs if CSS cannot match concept quality.
- Bars should be designed to fit a 9:20 shell. Avoid heights that only work on arbitrary browser shapes.

### Tool Icons

Priority: P0

Files:

```text
icon_home.png
icon_pause.png
icon_hint.png
icon_undo.png
icon_shuffle.png
```

Style:

- Gold symbol on deep green round button.
- Use thick readable shapes.
- Avoid emoji.

Suggested meanings:

- Home: simple hut / house silhouette.
- Pause: two gold vertical bars.
- Hint: small sun/light bead.
- Undo: curved arrow.
- Shuffle: crossing path arrows.

### Modal Panels

Priority: P1

Files:

```text
panel_modal_large.png
panel_modal_small.png
button_primary.png
button_secondary.png
button_icon_round.png
```

Use cases:

- pause
- win
- level select
- settings

First-pass plan:

- The pause modal can be restyled with CSS after gameplay pass.
- Generate panel PNG only if concept needs richer carved frame.

### Menu Branding

Priority: P1

Files:

```text
logo_tribal_tiles.png
title_tribal_tiles.png
icon_levels.png
icon_daily.png
button_play_large.png
```

Notes:

- Prefer a symbol/logo over heavy title text.
- English title is acceptable.
- Keep title as live text if possible for easier edits.

### Level Select

Priority: P1

Files:

```text
node_level_current.png
node_level_unlocked.png
node_level_locked.png
icon_lock.png
icon_star_full.png
icon_star_empty.png
```

First-pass plan:

- Use CSS nodes and generated icons.
- Do not build a full chapter map until gameplay reskin is validated.

### Feedback And Effects

Priority: P2

Files:

```text
fx_match_glow.png
fx_hint_glow.png
fx_gold_spark.png
toast_panel.png
```

First-pass plan:

- Keep current CSS animations.
- Retint glow colors to gold/green.
- Defer complex particle assets.

## 4. New Tile Metadata Contract

Recommended `TILE_TYPES` structure after approval:

```js
const TILE_TYPES = [
  {
    id: 0,
    family: 'nature',
    code: 'sun_seed',
    name: 'Sun Seed',
    shortMark: '1',
    asset: 'assets/generated/tiles/tile_totem_01_sun_seed.png',
    accent: '#c77a2a'
  }
];
```

Required fields:

- `id`: must remain `0-33`.
- `asset`: image path used by `ui.js`.
- `name`: semantic name, useful for debugging.
- `shortMark`: optional small number/dot marker for recognition.
- `accent`: optional CSS state color.

Deprecated fields:

- `suit`
- `num` as mahjong rank
- Chinese `name` as visible label
- `SUIT_LABELS`

## 5. Old Spec Mapping

| Old family | New interpretation |
| --- | --- |
| `tile_wan_1..9` | Totem nature set 1-9 |
| `tile_tong_1..9` | Totem craft set 10-18 |
| `tile_tiao_1..9` | Totem pattern set 19-27 |
| `tile_feng_*` | Special set 28-31 |
| `tile_jian_*` | Special set 32-34 |

This is only a logical migration map. The final art should not look like the old family names.

## 6. Generation Prompt Direction

Use for a single tile face symbol:

```text
Create a single high-readability West African inspired totem symbol for a mobile tile matching game.
Transparent background.
The symbol will be placed on an ivory carved stone tile.
Use bold silhouette, clean carved edges, antique gold/deep green/clay orange/midnight blue accents.
No text, no Chinese mahjong characters, no full card background, no extra objects.
Readable at very small mobile size.
```

Use for tile base:

```text
Create one vertical rounded rectangular carved ivory stone game tile base.
Aspect ratio 5:6, transparent background.
Subtle bevel, warm stone texture, thin antique gold edge, soft lower-right shadow.
No symbol, no text, no background scene.
```

Use for gameplay screen concept:

```text
Vertical 9:20 mobile tile matching game screen, 1080x2400 canvas, West African / Nigerian inspired UI.
Designed for Transsion mainstream 720x1600 / 20:9 portrait Android phones.
Dark emerald patterned textile background, antique gold carved HUD, ivory stone totem tiles stacked in a mahjong-solitaire layout, bottom tool tray with gold icons.
No Chinese mahjong characters.
Mostly icon-based UI, minimal English text.
High readability, low-cost implementable game UI.
```

## 7. First Batch Checklist

Before code integration, the first asset batch must have:

- exact file names
- transparent background where required
- no visible white/black fringe
- consistent lighting direction
- readable at `42x50`
- matching family palette
- no Chinese text
- no watermark
- correct 9:20 screen canvas for screen-level assets

## 8. Batch Expansion Order

1. Gameplay tile base and 6 sample symbols.
2. Full 34 tile symbols.
3. Tool icons and top/bottom panels.
4. Pause modal panel and buttons.
5. Menu logo and play button.
6. Level select nodes.
7. Win/settings/toast/effects.

## 9. Review Package Recommendation

Create a simple review HTML after generation:

```text
assets/generated/review/gameplay_asset_review.html
```

It should show:

- each tile symbol at source size
- each tile symbol at actual in-game size
- free/blocked/selected tile mockups
- all tool icons
- screenshot mock placement
