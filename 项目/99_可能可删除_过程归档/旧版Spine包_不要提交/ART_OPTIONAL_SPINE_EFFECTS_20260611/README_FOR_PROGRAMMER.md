# Optional Spine Effects Delivery - SUPERSEDED

Date: 2026-06-11

Status: `SUPERSEDED_DO_NOT_SUBMIT`

This package has been superseded by:

```text
E:\参考图\麻将\项目\ART_OPTIONAL_SPINE_EFFECTS_20260611_TIDY_V2
```

Use the Tidy V2 package for programmer handoff. This older package contains `Rainbow_fragments` and `ANI_Game_block_disapear`, which were rejected during visual review because they do not fit the current totem art direction well enough.

This package contains curated Spine animation assets that can be tested as optional effect layers for the Mahjong V2 reskin.

Use the fixed PNG art package as the required P0 art delivery:

```text
E:\参考图\麻将\项目\ART_DELIVERY_TO_PROGRAMMER_20260611_V2_FIXED
```

This Spine package is optional. It should not replace or block integration of the PNG package.

## Package Path

```text
E:\参考图\麻将\项目\ART_OPTIONAL_SPINE_EFFECTS_20260611
```

## Contents

Each effect folder contains:

- `.json` Spine skeleton data
- `.png` texture atlas
- `.atlas.txt` original atlas file
- `.atlas` compatibility copy of the atlas file

The package intentionally excludes Cocos `.meta` files and Unity `.asset/.mat` files.

File counts:

- 9 Spine effect folders
- 9 `.json`
- 9 `.png`
- 9 `.atlas.txt`
- 9 `.atlas`

## Recommended First Trial

Start with only these two assets:

```text
assets/p0_try_first/gameplay_tile_disappear/
assets/p0_try_first/win_ribbon/
```

If those run correctly, add:

```text
assets/p0_try_first/gameplay_rainbow_fragments/
assets/p0_try_first/win_partypopper/
```

## Important Notes

- Current `mahjong-v2` is a plain H5 DOM/CSS/JS project and does not include a Spine runtime.
- These files cannot be used by copying them into the game alone.
- The programmer needs either a Web Spine runtime or an offline export step to spritesheets / frame sequences.
- Runtime target remains fixed portrait `9:20`, with design canvas `1080x2400`.
- Any Spine overlay should scale with the same fixed game shell as the PNG UI.

## Docs

```text
SPINE_EFFECTS_MANIFEST.json
SPINE_INTEGRATION_GUIDE.md
SPINE_SELECTION_NOTES.md
```

## Recommended Decision

Treat this as a P1/P2 visual enhancement package.

P0 integration should remain:

1. Integrate the V2 fixed PNG package.
2. Verify gameplay and all UI states.
3. Add optional Spine effects only after the static reskin is stable.
