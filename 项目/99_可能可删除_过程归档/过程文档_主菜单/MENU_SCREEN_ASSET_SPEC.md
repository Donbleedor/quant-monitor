# Menu Screen Asset Spec

Date: 2026-06-10

Scope:

- Main menu / home screen only.
- Fixed `1080x2400` canvas.
- Reuses the gameplay screen's material language and only adds menu-specific brand assets.

## 1. Priority Definition

- `P0`: required for first menu concept and first integration pass
- `P1`: follow-up polish or lightweight alternate assets

## 2. Asset Groups

### Group: shared_style_reuse

These are reused from the gameplay asset family and should not drift stylistically.

| File | Size | Transparent | Usage | Attach | Priority |
| --- | --- | --- | --- | --- | --- |
| `bg_game_1080x2400.png` | `1080x2400` | `false` | Full-screen dark emerald woven background for the menu. | `body > #app > .menu-screen` | `P0` |
| `tile_base_ivory.png` | `168x201` | `true` | Shared carved stone material language for the logo or menu motif if needed. | `logo / brand emblem area` | `P1` |
| `tool_btn_shell.png` | `182x182` | `true` | Reusable round green/gold button shell language. | `menu action buttons` | `P1` |
| `badge_count_coin.png` | `44x44` | `true` | Small coin badge language if any count badge or notification dot is added later. | `menu secondary badges` | `P1` |
| `icon_home.png` | `88x88` | `true` | Shared icon style reference for the menu settings/home family. | `icon style reference` | `P1` |
| `icon_pause.png` | `72x72` | `true` | Shared icon style reference for the menu settings/home family. | `icon style reference` | `P1` |

### Group: menu_branding

| File | Size | Transparent | Usage | Attach | Priority |
| --- | --- | --- | --- | --- | --- |
| `logo_tribal_tiles.png` | `760x420` | `true` | Main brand lockup with emblem plus title. | `#app .menu-screen .menu-logo` | `P0` |
| `title_tribal_tiles.png` | `620x160` | `true` | Title-only wordmark variant for smaller layouts or fallback. | `brand/title slot` | `P1` |

### Group: menu_primary_action

| File | Size | Transparent | Usage | Attach | Priority |
| --- | --- | --- | --- | --- | --- |
| `button_play_large.png` | `780x260` | `true` | Primary play CTA shell, symbol-first and highly legible. | `#app .menu-screen .btn-play` | `P0` |
| `icon_play.png` | `120x120` | `true` | Optional inner play glyph if the button is split into shell and icon layers. | `center of play button` | `P1` |

### Group: menu_secondary_actions

| File | Size | Transparent | Usage | Attach | Priority |
| --- | --- | --- | --- | --- | --- |
| `icon_settings.png` | `88x88` | `true` | Top-right settings control. | `#app .menu-screen .btn-settings` | `P0` |
| `icon_levels.png` | `88x88` | `true` | Level select control. | `#app .menu-screen .btn-levels` | `P1` |
| `icon_daily.png` | `88x88` | `true` | Daily challenge control. | `#app .menu-screen .btn-daily` | `P1` |

### Group: menu_supporting_texture

| File | Size | Transparent | Usage | Attach | Priority |
| --- | --- | --- | --- | --- | --- |
| `menu_pattern_overlay.png` | `1080x2400` | `true` | Optional low-contrast textile overlay to deepen the menu background. | `above bg_game_1080x2400.png` | `P1` |
| `menu_vignette_top.png` | `1080x520` | `true` | Optional top vignette to push the brand forward. | `top band` | `P1` |
| `menu_vignette_bottom.png` | `1080x620` | `true` | Optional bottom vignette to ground the CTA and secondary actions. | `bottom band` | `P1` |

## 3. Layout Notes

- The logo should sit above the play button and stay readable at small-screen scale.
- The play button should be the strongest object on the page.
- Secondary actions should look lighter than the play CTA.
- Keep the center area open enough that the screen still feels spacious.

## 4. Production Notes

- Use the same `9:20` app shell as gameplay.
- Keep the menu background and brand textures aligned to the same deep emerald / antique gold palette.
- Do not introduce a second font family unless the title variant needs it.
- Do not add busy decoration behind the CTA.

