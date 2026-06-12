# Menu Integration Handoff

Date: 2026-06-11

Scope:

- Menu assets only.
- No game code changes in this handoff.
- No edits to `first_screen_p0` source or processed directories.

## Integration Decision

The menu asset set is ready for a future `renderMenu()` integration pass.

Current status:

- `MENU_P0_ACCEPTANCE.md` -> `ACCEPTED_FOR_INTEGRATION`
- `MENU_P1_ACCEPTANCE.md` -> `ACCEPTED_FOR_INTEGRATION`

## Fixed Layout Rule

The menu must stay locked to a `9:20` portrait shell.

Do not let the browser window freely reshape the composition.

Recommended runtime behavior:

- keep the app shell aspect-ratio fixed at `9 / 20`
- scale the shell to fit the viewport
- preserve composition inside the shell
- pillarbox or letterbox outside the shell as needed

## Asset Source Policy

Menu assets are split into two source classes:

1. Menu-owned assets in `menu_work/processed/menu_p0` and `menu_work/processed/menu_p1`
2. Shared background reference currently sourced from the existing first-screen pipeline

Important:

- `bg_game_1080x2400.png` currently comes from `E:\参考图\麻将\项目\99_可能可删除_过程归档\生产工作区_过程产物\asset_work\processed\first_screen_p0\bg_game_1080x2400.png`
- treat it as a shared background reference for now
- do not make the menu depend on `first_screen_p0` as a long-term coupling point
- future preferred shared location: `E:\参考图\麻将\项目\99_可能可删除_过程归档\生产工作区_过程产物\asset_work\processed\shared\bg_game_1080x2400.png`

## Suggested `renderMenu()` Mapping

Current `renderMenu()` nodes map cleanly to the new asset set:

- `.menu-bg` -> full-screen shared background
- `.menu-settings` / `#btnSettings` -> `icon_settings.png`
- `.menu-logo` -> `logo_tribal_tiles.png` or `title_tribal_tiles.png`
- `.btn-play` -> `button_play_large.png`
- `.btn-levels` -> `tool_btn_shell.png` + `icon_levels.png`
- `.btn-daily` -> `tool_btn_shell.png` + `icon_daily.png`

## Recommended 1080x2400 Placement

These are the recommended design-canvas rectangles for the menu layout.

### Background

- `bg_game_1080x2400.png`
- Rect: `x=0, y=0, width=1080, height=2400`
- Purpose: full-screen base layer

### Settings

- `icon_settings.png`
- Rect: `x=938, y=48, width=88, height=88`
- Hit area: `x=914, y=24, width=136, height=136`
- Notes: keep small and quiet in the top-right corner

### Logo

- `logo_tribal_tiles.png`
- Rect: `x=160, y=150, width=760, height=420`
- Hit area: `x=160, y=150, width=760, height=420`
- Notes: wide brand lockup, centered in the upper-middle

### Title fallback

- `title_tribal_tiles.png`
- Rect: `x=230, y=190, width=620, height=160`
- Hit area: `x=230, y=190, width=620, height=160`
- Notes: use this when a tighter wordmark is needed

### Play button

- `button_play_large.png`
- Rect: `x=150, y=860, width=780, height=260`
- Hit area: `x=136, y=846, width=808, height=288`
- Notes: primary CTA, visually dominant

### Level control

- `tool_btn_shell.png` + `icon_levels.png`
- Button shell rect: `x=142, y=1180, width=300, height=300`
- Icon rect: `x=252, y=1256, width=88, height=88`
- Hit area: `x=142, y=1180, width=300, height=300`
- Notes: secondary action, label can sit below the shell

### Daily control

- `tool_btn_shell.png` + `icon_daily.png`
- Button shell rect: `x=638, y=1180, width=300, height=300`
- Icon rect: `x=748, y=1256, width=88, height=88`
- Hit area: `x=638, y=1180, width=300, height=300`
- Notes: mirror the level control

### Decorative top vignette

- `menu_vignette_top.png`
- Rect: `x=0, y=0, width=1080, height=520`
- Use: optional overlay above the background

### Decorative bottom vignette

- `menu_vignette_bottom.png`
- Rect: `x=0, y=1780, width=1080, height=620`
- Use: optional overlay under the secondary actions

### Pattern overlay

- `menu_pattern_overlay.png`
- Rect: `x=0, y=0, width=1080, height=2400`
- Use: subtle texture layer above the background

## Asset Notes

### P0

- `logo_tribal_tiles.png`
  - Path: `E:\参考图\麻将\项目\99_可能可删除_过程归档\生产工作区_过程产物\menu_work\processed\menu_p0\logo_tribal_tiles.png`
  - Size: `760x420`
  - Alpha: yes
  - Priority: `P0`
  - Purpose: primary brand lockup

- `button_play_large.png`
  - Path: `E:\参考图\麻将\项目\99_可能可删除_过程归档\生产工作区_过程产物\menu_work\processed\menu_p0\button_play_large.png`
  - Size: `780x260`
  - Alpha: yes
  - Priority: `P0`
  - Purpose: primary play CTA shell

- `icon_settings.png`
  - Path: `E:\参考图\麻将\项目\99_可能可删除_过程归档\生产工作区_过程产物\menu_work\processed\menu_p0\icon_settings.png`
  - Size: `88x88`
  - Alpha: yes
  - Priority: `P0`
  - Purpose: top-right settings control

### P1

- `title_tribal_tiles.png`
  - Path: `E:\参考图\麻将\项目\99_可能可删除_过程归档\生产工作区_过程产物\menu_work\processed\menu_p1\title_tribal_tiles.png`
  - Size: `620x160`
  - Alpha: yes
  - Priority: `P1`
  - Purpose: smaller fallback wordmark
  - Soft warning: width is slightly narrow for the wordmark family, but it is still acceptable for integration and can be used with `max-width` scaling

- `icon_levels.png`
  - Path: `E:\参考图\麻将\项目\99_可能可删除_过程归档\生产工作区_过程产物\menu_work\processed\menu_p1\icon_levels.png`
  - Size: `88x88`
  - Alpha: yes
  - Priority: `P1`
  - Purpose: level select icon

- `icon_daily.png`
  - Path: `E:\参考图\麻将\项目\99_可能可删除_过程归档\生产工作区_过程产物\menu_work\processed\menu_p1\icon_daily.png`
  - Size: `88x88`
  - Alpha: yes
  - Priority: `P1`
  - Purpose: daily challenge icon

- `tool_btn_shell.png`
  - Path: `E:\参考图\麻将\项目\99_可能可删除_过程归档\生产工作区_过程产物\menu_work\processed\menu_p1\tool_btn_shell.png`
  - Size: `182x182`
  - Alpha: yes
  - Priority: `P1`
  - Purpose: reusable round button shell

- `badge_count_coin.png`
  - Path: `E:\参考图\麻将\项目\99_可能可删除_过程归档\生产工作区_过程产物\menu_work\processed\menu_p1\badge_count_coin.png`
  - Size: `44x44`
  - Alpha: yes
  - Priority: `P1`
  - Purpose: small badge / counter coin

- `tile_base_ivory.png`
  - Path: `E:\参考图\麻将\项目\99_可能可删除_过程归档\生产工作区_过程产物\menu_work\processed\menu_p1\tile_base_ivory.png`
  - Size: `168x201`
  - Alpha: yes
  - Priority: `P1`
  - Purpose: shared carved stone material reference

- `menu_pattern_overlay.png`
  - Path: `E:\参考图\麻将\项目\99_可能可删除_过程归档\生产工作区_过程产物\menu_work\processed\menu_p1\menu_pattern_overlay.png`
  - Size: `1080x2400`
  - Alpha: yes
  - Priority: `P1`
  - Purpose: subtle background texture overlay

- `menu_vignette_top.png`
  - Path: `E:\参考图\麻将\项目\99_可能可删除_过程归档\生产工作区_过程产物\menu_work\processed\menu_p1\menu_vignette_top.png`
  - Size: `1080x520`
  - Alpha: yes
  - Priority: `P1`
  - Purpose: top ornamental lift

- `menu_vignette_bottom.png`
  - Path: `E:\参考图\麻将\项目\99_可能可删除_过程归档\生产工作区_过程产物\menu_work\processed\menu_p1\menu_vignette_bottom.png`
  - Size: `1080x620`
  - Alpha: yes
  - Priority: `P1`
  - Purpose: bottom ornamental grounding

## Hit Zone Guidance

Use slightly larger touch areas than the visible art:

- settings: at least `136x136`
- play: at least `808x288`
- level: at least `300x300`
- daily: at least `300x300`

Keep tap targets aligned to the visible affordance, but do not rely on the art bounds alone.

## Acceptance Notes

- P0 and P1 are both accepted for future integration.
- No further image generation is needed for the menu resource closure.
- No code changes are requested in this handoff.


