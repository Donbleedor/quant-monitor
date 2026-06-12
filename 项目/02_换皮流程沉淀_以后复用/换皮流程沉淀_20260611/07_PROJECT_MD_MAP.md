# Project Markdown Map

This is a high-level map of the Markdown files in `E:\参考图\麻将\项目`.

The folder contains planning docs, specs, production reports, acceptance reports, delivery packages, and repair notes. Do not treat every `.md` as current truth. Some are historical evidence.

## 1. Current Reusable Playbook

```text
RESKIN_WORKFLOW_PLAYBOOK_20260611/
```

Use this folder to guide future projects.

## 2. Current Programmer Delivery

```text
ART_DELIVERY_TO_PROGRAMMER_20260611_V2_FIXED/
```

Important docs:

- `README_FOR_PROGRAMMER.md`
- `reports/final_after_visual_fix/FINAL_DELIVERY_STATUS_AFTER_VISUAL_FIX.md`
- `reports/final_after_visual_fix/PROGRAMMER_DELIVERY_MANIFEST.json`
- `reports/gameplay_visual_fix/GAMEPLAY_VISUAL_ACCEPTANCE.md`

## 3. Revoked Delivery Package

```text
ART_DELIVERY_TO_PROGRAMMER_20260611/
```

This package is historical evidence only.

Important docs:

- `DO_NOT_USE_VISUAL_QA_REOPENED.md`
- `README_FOR_PROGRAMMER.md`

Do not give this package to programmers.

## 4. Core Planning Docs

```text
RESKIN_BRIEF.md
SCREEN_INVENTORY.md
STYLE_BIBLE.md
ASSET_FAMILY_PLAN.md
FIRST_SCREEN_PIPELINE.md
FIRST_SCREEN_LAYOUT_SPEC.md
TOTEM_TILE_MAP.md
INTEGRATION_RISK_NOTES.md
```

These explain the design goal, screen inventory, style rules, and runtime constraints.

## 5. First Screen Docs

```text
FIRST_SCREEN_ASSET_SPEC.md/json
FIRST_SCREEN_CUTTING_PLAN.md
FIRST_SCREEN_COMPLETION_CORRECTION_PROMPT.md
FIRST_SCREEN_P0_GENERATION_REPORT.md
PROCESS_FIRST_SCREEN_ASSETS_SCRIPT_SPEC.md
VISUAL_QA_REOPENED_FIRST_SCREEN_P0.md
```

Use these for gameplay asset scope and postprocess lessons.

## 6. Menu Docs

```text
MENU_SCREEN_PLAN.md
MENU_SCREEN_ASSET_SPEC.md/json
MENU_SCREEN_PROMPT_PACK.md
MENU_SCREEN_EFFECT_REVIEW.md
menu_work/reports/*.md
```

Notable pitfall:

- `MENU_VIGNETTE_BOTTOM_FIX_REPORT.md` records a major magenta-residue repair.

## 7. Modal Docs

```text
MODAL_SCREEN_PLAN.md
MODAL_ASSET_SPEC.md/json
MODAL_PROMPT_PACK.md
MODAL_CUTTING_PLAN.md
MODAL_SPEC_PATCH_V1.md
modal_work/reports/*.md
```

Notable pitfall:

- modal raw-only was not deliverable
- three modal components needed regeneration

## 8. QA / Acceptance Docs

```text
asset_acceptance_work/*.md
asset_acceptance_work/final_recheck/*.md
```

These are useful evidence, but the original final acceptance was later superseded by manual visual QA and the V2 fixed delivery.

## 9. How To Read Historical Reports

Use this priority order:

1. Current V2 delivery README and manifest
2. This playbook
3. Repair reports
4. Final recheck reports
5. Original specs/plans
6. Old acceptance reports

If documents conflict, later visual-fix and V2 delivery docs override earlier acceptance reports.
