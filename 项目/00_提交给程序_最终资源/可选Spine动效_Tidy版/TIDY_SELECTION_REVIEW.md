# Tidy Spine Selection Review

## Accepted For This V2 Package

### `box_broken`

Best gameplay elimination candidate.

The texture uses warm wooden fragments, which fits the current totem tile direction better than rainbow blocks or white glass fragments.

### `fireworke`

Good victory/final-clear light accent.

The texture is neutral and restrained: glow, star, and light streak. Low art-direction conflict.

### `EFF_Game_CardCollect_Card_bg`

Good subtle background glow/smoke layer for victory or final-clear.

Note: the animation name is `EFF_partypopper`, even though the file name is `EFF_Game_CardCollect_Card_bg`.

### `EFF_partypopper`

Kept as P1 optional only.

Useful for victory celebration, but color is bright and less aligned than the P0 Tidy choices.

### `combo`

Kept as P1 optional only.

Use for combo feedback if needed. Purple light and wing/star shapes need visual QA.

### `Node_hand`

Kept as utility only.

Only useful if tutorial or first-level guidance is added.

## Excluded

### `Rainbow_fragments`

Removed from recommendation. Too colorful and too close to block/candy effects.

### `ANI_Game_block_disapear`

Removed from recommendation. Technically small and easy to use, but visually too generic block-game.

### `break`

Not included in V2. Its white glass/ice fragments feel colder and less aligned than `box_broken`.

### `worldcup_break`

Excluded. It contains football and green block style.

### `football_interlude_p`

Excluded. Football theme is unrelated to this reskin.

### `MagicWand`

Excluded for now. It is useful for a magic-tool game, but the purple magic vortex and wand do not match the current first-pass totem skin.

### `timebox`

Excluded. Large texture and not relevant to current gameplay/UI needs.

## Non-Spine Reference

`EFF_eliminate_comman.prefab` is included under `reference_only`.

It is a Cocos `ParticleSystem2D` prefab, not a Spine asset. It is useful as a reference for a star/particle elimination feeling, but it is not directly usable in the current plain H5 project.
