# Menu Screen Plan

Date: 2026-06-10

Scope:

- Main menu / home screen only.
- Fixed `1080x2400` production canvas with `9:20` runtime composition.
- Matches the West African / Nigerian-inspired style used by the normal gameplay screen.
- Does not change game logic or touch `first_screen_p0` assets.

## 1. Screen Goal

The menu should feel like the same game family as the gameplay screen, but quieter and more brand-led.

Core goals:

- reinforce the game name `Tribal Tiles` first, `Savanna Tiles` as a fallback
- keep the UI mostly symbol-based
- keep text minimal and in English only
- reuse the same deep green, antique gold, and ivory stone language
- avoid building a second visual system for the menu

## 2. 9:20 Layout Zones

Use the same fixed portrait shell logic as gameplay.

Logical composition guide:

- `0-120`: top breathing zone and optional settings affordance
- `120-430`: brand zone with logo / title medallion
- `430-780`: visual pause zone, can hold a small emblem or ambient motif
- `780-1120`: primary play CTA
- `1120-1460`: secondary actions row for `Level` and `Daily`
- `1460-2200`: open negative space with subtle textile pattern
- `2200-2400`: bottom vignette or footer ornament

Placement intent:

- keep the brand in the upper-middle third
- keep the play action visually dominant
- keep secondary actions smaller and lighter
- do not crowd the board area because the gameplay screen needs that space later

## 3. Interface Structure

Top-right:

- settings icon only
- small, quiet, not dominant

Brand stack:

- carved logo or medallion mark
- title lockup: `Tribal Tiles`
- optional smaller subtitle only if the logo needs support

Primary action:

- large play button
- symbol-first, with optional tiny `PLAY` text only if needed

Secondary actions:

- `Level`
- `Daily`

These can be icon buttons with short English fallback labels or symbol-only chips.

Background:

- same dark emerald textile / carved pattern family as gameplay
- subtle gold accents
- the center should remain clean so the logo and button read clearly

## 4. Shared Assets With Gameplay

Reuse the same visual language and, where useful, the same assets:

- `bg_game_1080x2400.png`
- `tile_base_ivory.png`
- `tool_btn_shell.png`
- `badge_count_coin.png`
- `icon_home.png`
- `icon_pause.png`
- `modal_panel_dark_gold.png`

Shared style rules:

- deep emerald base
- antique gold trim
- warm ivory carved stone
- low-noise woven texture
- bold icon silhouettes

## 5. Menu-Only Assets

Menu-specific assets should be limited to branding and entry controls:

- logo / wordmark lockup
- play button
- settings icon
- level icon
- daily icon
- optional title-only variant if the lockup needs to split on small screens

## 6. Priority

Project-wide priority:

- menu is `P1` because gameplay first screen work is already the main validation path

Within the menu:

- `P0`: full menu concept, logo/title lockup, play button, settings icon
- `P1`: level icon, daily icon, alternate title-only lockup, light polish variants

## 7. First Review Gate

The first menu review should answer only these questions:

1. Does the menu clearly belong to the same game family as gameplay?
2. Is `Tribal Tiles` readable and memorable?
3. Does the play action feel dominant without using lots of text?
4. Do the level and daily controls stay lightweight and icon-led?

