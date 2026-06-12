# Modal Spec Patch V1

Date: 2026-06-11

## 1. Patch Goal

This patch aligns the modal spec with the actual P0 integration scope.

Requested corrections:

- promote `modal_panel_large.png` to P0
- add `modal_divider_gold.png` to the JSON spec
- treat `modal_overlay_dark.png` as a non-transparent utility overlay

## 2. Applied Changes

### `modal_panel_large.png`

- changed from `P1` to `P0`
- reason: win and level select both need a formal P0 panel, not only the smaller standard panel

### `modal_divider_gold.png`

- added to `MODAL_ASSET_SPEC.json`
- priority: `P1`
- size: `720x24`
- transparency: `true`

### `modal_overlay_dark.png`

- changed to `transparent: false`
- usage now describes it as a dark textured overlay base
- intended usage: code controls opacity at integration time
- this is a utility overlay exception, not a transparent chroma-key asset

## 3. Updated P0 Scope

P0 modal assets now include:

- `modal_overlay_dark.png`
- `modal_panel_standard.png`
- `modal_panel_large.png`
- `btn_modal_primary.png`
- `btn_modal_secondary.png`
- `icon_resume.png`
- `icon_restart.png`
- `icon_home.png`
- `icon_close.png`
- `icon_next.png`
- `icon_star.png`
- `icon_lock.png`
- `level_node_open.png`
- `level_node_current.png`
- `level_node_locked.png`
- `toggle_track.png`
- `toggle_knob.png`

## 4. Revalidation

`MODAL_ASSET_SPEC.json` was re-parsed successfully after the patch.

Validation result:

- JSON parse: passed
- `modal_panel_large.png`: now P0
- `modal_divider_gold.png`: present in JSON
- `modal_overlay_dark.png`: non-transparent utility overlay

## 5. Follow-Up

Proceed to P0 generation using the revised P0 list only.

