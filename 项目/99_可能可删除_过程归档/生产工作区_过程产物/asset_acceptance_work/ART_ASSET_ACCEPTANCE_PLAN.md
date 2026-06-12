# ART Asset Acceptance Plan

Date: 2026-06-11

Scope:
- Independent read-only QA of current art asset batches.
- No source image edits, no moves, no overwrites.
- Output is confined to `asset_acceptance_work`.

Checks:
1. Read the three baseline specs.
2. Enumerate raw/processed/review/reports directories.
3. Validate spec coverage, sizes, alpha, bbox, and pink residuals.
4. Classify batches as FINAL_CANDIDATE / ACCEPTED / NEEDS_FIX / PENDING_PROCESS / STALE / REJECTED_PLACEHOLDER.
5. Generate contact sheets and decision docs.

Final decision rule:
- Any hard pink residual in final candidates or an incomplete modal batch blocks ACCEPTED_FOR_ART_DELIVERY.
