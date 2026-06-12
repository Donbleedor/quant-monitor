# Known Failure Modes

These are the actual pits hit during the Mahjong V2 reskin.

## 1. Accepted Report Was Wrong

Problem:

- A final QA agent wrote `ACCEPTED_FOR_ART_DELIVERY`.
- Manual visual review later found obvious magenta residue and bad state overlays.

Cause:

- The agent over-relied on dimensions, alpha presence, and strict `#FF00FF` detection.

Prevention:

- Require manual contact-sheet review.
- Use broad pink/purple detection.
- Open representative PNGs directly before packaging.

## 2. Exact Magenta Detection Missed Purple Residue

Problem:

- Files had visible pink/purple residue, but exact `#FF00FF` count was low or zero.

Examples:

- `tile_totem_27_green_lattice.png`
- `tile_totem_29_baobab_tree.png`
- `tile_totem_32_water_drop.png`

Prevention:

- Add broad pink/purple rules.
- Review on white, dark, and checkerboard backgrounds.

## 3. Alpha Exists But Cutout Is Dirty

Problem:

- PNG had alpha channel.
- Background residue remained visible.

Prevention:

- Treat alpha presence as a technical baseline only.
- Inspect visible pixels and edge-connected residue.

## 4. Correct Outer Size But Subject Looks Too Small

Problem:

- Image dimensions matched spec.
- Visible subject occupied too little of the canvas.

Cause:

- Raw generation cannot guarantee exact subject size.
- Postprocess resized the outer image but did not normalize the visible bbox.

Prevention:

- Crop to alpha bbox, then contain-fit back to target canvas with controlled padding.
- Report visible occupancy.
- Preview in actual slot.

## 5. Some Alpha Padding Is Intentional

Problem:

- Large transparent area looked suspicious in file explorer.

Reality:

- Some assets are fixed slots and must not be auto-cropped by programmers.

Examples:

- `tile_totem_*.png` are `96x96` symbol slots.
- `state_tile_selected_glow.png` is `180x213`, larger than the tile.
- `hud_top_frame.png` is `1080x188`, but the ornament is centered.

Prevention:

- Delivery README must say: do not auto-crop alpha bounds.
- Include slot-size integration notes.

## 6. Programmatic Placeholder Hallucination

Problem:

- A production agent filled missing gameplay assets with flat programmatic/vector-like graphics.

Impact:

- Dimensions could pass.
- Style was wrong.

Prevention:

- Final art must come from image generation or reference edit unless the asset is explicitly procedural.
- Mark placeholder batches as `REJECTED_PLACEHOLDER`.

## 7. Raw-Only Was Mistaken For Progress

Problem:

- Modal assets existed only as raw boards.
- Raw images are not delivery assets.

Prevention:

- Require `processed`, `review`, `reports`, and `acceptance`.
- Raw-only state is `PENDING_POSTPROCESS`.

## 8. Stale Directory Confusion

Problem:

- Multiple gameplay directories existed:
  - `first_screen_p0`
  - `first_screen_p0_v2`
  - `first_screen_p0_completion`
  - `first_screen_p0_final`
  - `first_screen_p0_final_image`

Risk:

- Wrong folder can be delivered.

Prevention:

- Final manifest must list exact accepted source directories.
- Delivery package should copy accepted files into a new clean folder.
- Old folders must be explicitly excluded.

## 9. Delivery Package Was Revoked But Still Looked Official

Problem:

- The first package had a polished README but later needed revocation.

Prevention:

- If revoked, write `DO_NOT_USE` in the package.
- After repair, create a new V2 clean package instead of editing the revoked package into acceptance.

## 10. Agent Context Became Too Long

Problem:

- Long-running agents stalled or became confused.

Prevention:

- Spawn short-context repair agents.
- Use narrow file ownership.
- Close completed agents immediately.

## 11. State Effects Need Special Rules

Problem:

- `state_tile_selected_glow.png` and `state_tile_shadow.png` originally became magenta/pink effects.

Prevention:

- State overlays must be reviewed on tile base.
- Procedural repair may be acceptable for simple shadows/glows, but not for decorative symbols.

## 12. File Explorer Thumbnails Are Useful Smoke Tests

Problem:

- Automated reports missed what was visible in Windows Explorer thumbnails.

Prevention:

- Treat thumbnail review as an early smoke test.
- If thumbnails show obvious residue, reopen QA immediately.
