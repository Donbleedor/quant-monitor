# Modal Cutting Plan

Date: 2026-06-11

## 1. Purpose

This plan defines the future raw-generation and postprocess workflow for the modal screen family.

It does not produce assets yet. It only sets the pipeline for later P0 generation after user confirmation.

## 2. Working Directories

Use a dedicated modal workspace:

```text
E:\参考图\麻将\项目\modal_work\
  raw_generated\
    modal_p0\
    modal_p1\
  processed\
    modal_p0\
    modal_p1\
  rejected\
    modal_p0\
    modal_p1\
  review\
    modal_p0\
    modal_p1\
  reports\
```

## 3. Input Sources

Primary sources:

- `RESKIN_BRIEF.md`
- `STYLE_BIBLE.md`
- `SCREEN_INVENTORY.md`
- `POSTPROCESS_PLAN.md`
- `MODAL_SCREEN_PLAN.md`
- `MODAL_ASSET_SPEC.md`
- `MODAL_ASSET_SPEC.json`
- `MODAL_PROMPT_PACK.md`

Visual references:

- current gameplay and menu style family
- existing accepted menu assets
- current gameplay background reference

## 4. Raw Generation Rules

### Full-screen concept art

Generate one or more raw 1080x2400 concept sheets for:

- pause modal
- settings modal
- win modal
- level select modal

Do not batch-produce the whole final asset set before concept approval.

### Transparent component art

For any transparent asset:

- use pure magenta `#FF00FF` background
- do not bake in unintended plates or tiles
- avoid green-screen backgrounds for new modal work

## 5. Postprocess Rules

Every raw transparent asset must go through:

1. Chroma-key removal
2. Alpha cleanup
3. Visible bbox normalization
4. Exact resize to the target spec
5. Centering onto the final canvas
6. QA contact sheet review

The final usable asset is always the processed PNG, not the raw image.

## 6. QA Rules

Hard failures:

- missing file
- wrong dimensions
- missing alpha on a transparent asset
- visible subject too small because of accidental padding
- wrong art language
- watermark or signature
- programmatic placeholder art
- Chinese mahjong characters or unwanted suit symbols

Soft warnings:

- slightly narrow icon or wordmark
- mild edge fringe after keying
- transparent occupancy below the expected family range
- decorative complexity that may need simplification later

## 7. Suggested P0 Batch Shape

P0 should cover the first usable modal closure, not the full polish set.

Recommended P0 production order:

1. `modal_overlay_dark.png`
2. `modal_panel_standard.png`
3. `btn_modal_primary.png`
4. `btn_modal_secondary.png`
5. `icon_resume.png`
6. `icon_restart.png`
7. `icon_home.png`
8. `icon_close.png`
9. `icon_next.png`
10. `icon_star.png`
11. `icon_lock.png`
12. `level_node_open.png`
13. `level_node_current.png`
14. `level_node_locked.png`
15. `toggle_track.png`
16. `toggle_knob.png`

## 8. Suggested P1 Batch Shape

P1 should extend the modal family with polish and optional variants:

- `modal_panel_large.png`
- `modal_title_strip.png`
- `modal_divider_gold.png`
- `level_star_small.png`
- `level_badge_completed.png`
- `settings_row_plate.png`
- `stat_chip_time.png`
- `stat_chip_moves.png`
- `win_medal_center.png`
- `win_confetti_piece.png`

## 9. Review Artifacts

Each batch should produce:

- raw contact sheet
- processed contact sheet
- JSON postprocess report
- human-readable postprocess report
- acceptance note with a clear pass/fail decision

## 10. Acceptance Criteria

The batch is ready for integration only when:

- all P0 assets from the spec are present
- all target sizes match exactly
- transparent assets have alpha
- visible bbox normalization looks correct
- there are no hard failures
- the family is visually consistent with the accepted menu and gameplay direction

