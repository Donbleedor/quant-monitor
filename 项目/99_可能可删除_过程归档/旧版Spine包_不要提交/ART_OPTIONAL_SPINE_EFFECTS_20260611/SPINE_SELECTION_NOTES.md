# Spine Selection Notes

## Selection Principle

The current game has already been reskinned with PNG assets in an African totem direction. Spine assets were selected only if they were:

- Generic enough to reuse.
- Useful for feedback or settlement effects.
- Not dependent on Cocos/Unity prefab logic.
- Not obviously World Cup, football, logo, text, or character driven.
- Reasonably small for optional H5 use.

## Included P0 Trial Assets

### gameplay_tile_disappear

Best first gameplay trial.

Use for matched tile disappearance. Small texture and single animation make it the lowest-risk runtime test.

### gameplay_rainbow_fragments

Use for combo or stronger feedback. It is visually richer, so it should not play on every tap unless the screen remains readable.

### win_ribbon

Best first settlement trial.

Use on the win modal as a small ribbon flourish.

### win_partypopper

Use for win celebration if `win_ribbon` feels too subtle. Larger and brighter than `win_ribbon`.

## Included P1 Optional Assets

### gameplay_break_heavy

Alternative heavier tile break effect. Useful only if the small disappear effect feels too weak.

### guide_hand

Useful for tutorial guidance. Not needed if the product does not add onboarding.

### level_cursor

Useful for current-level highlight in the level selection modal.

### clear_screen_burst

Useful after final match or board clear, but could compete with the win modal.

### settlement_side_ribbons

Alternative settlement ribbon. Duplicates the role of `win_ribbon`, so only one should be selected after visual testing.

## Excluded Asset Types

The following were intentionally not copied into this handoff package:

- Football / World Cup themed characters and goal effects.
- Logo animations from other games.
- Text-heavy evaluation effects such as `good/great/amazing`, because this project prefers minimal text.
- Cocos `.meta` files and Unity `.asset/.mat` files.
- Raw source project prefab files, because the current project is plain H5.

## Main Risk

These Spine assets come from Cocos Creator and Unity projects. They are valid Spine JSON assets, but the current project has no Spine runtime.

So the practical question is not whether the files are complete. They are complete. The question is whether the programmer chooses:

1. offline export to spritesheets, or
2. a Web Spine runtime integration.

For this project, offline spritesheets remain the safer recommendation.
