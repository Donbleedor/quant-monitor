# AI Game Reskin Workflow Playbook

Date: 2026-06-11

Source project: `E:\参考图\麻将\项目`

This folder distills the Mahjong V2 reskin run into reusable rules for future AI-assisted game-art projects.

The key lesson: an asset can pass dimensions, alpha, and JSON validation while still being visually unusable. Future agents must combine machine checks, contact sheets, and manual visual QA before delivery.

## Recommended Reading Order

1. `01_END_TO_END_CASE_REVIEW.md`
2. `02_AGENT_ORCHESTRATION_RULES.md`
3. `03_ASSET_PRODUCTION_QA_CHECKLIST.md`
4. `04_KNOWN_FAILURE_MODES.md`
5. `05_DELIVERY_PACKAGE_STANDARD.md`
6. `06_FUTURE_AGENT_PROMPTS.md`
7. `07_PROJECT_MD_MAP.md`

## Final Delivery From This Case

The usable programmer handoff package is:

```text
E:\参考图\麻将\项目\ART_DELIVERY_TO_PROGRAMMER_20260611_V2_FIXED
```

Do not use the older package:

```text
E:\参考图\麻将\项目\ART_DELIVERY_TO_PROGRAMMER_20260611
```

It was intentionally marked as revoked after manual visual QA found gameplay asset issues.

## Core Principles

- Split agents by narrow responsibility.
- Never trust `ACCEPTED` reports without visual contact sheet review.
- Raw image generation is not a final asset.
- Exact dimensions and alpha presence are necessary, not sufficient.
- Broad pink/purple residue detection is required, not only exact `#FF00FF`.
- Final packages must be clean V2 handoff directories, not working folders.
- Integration docs must tell programmers not to auto-crop fixed-slot transparent PNGs.
