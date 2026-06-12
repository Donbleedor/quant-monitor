# Browser Gate Report 20260612

Scope: Task 10 final browser retest for `mahjong-v3`.

Server:
- PASS: reused the existing `127.0.0.1:8765` process untouched.
- PASS: no extra local server was left running at the end of the retest.

Replaced screenshots:
- `qa/browser_gate_20260612/360_menu.png`
- `qa/browser_gate_20260612/360_game_normal.png`
- `qa/browser_gate_20260612/360_pause_modal.png`
- `qa/browser_gate_20260612/360_levels_modal.png`
- `qa/browser_gate_20260612/360_settings_before.png`
- `qa/browser_gate_20260612/360_settings_large_text.png`
- `qa/browser_gate_20260612/360_settings_contrast.png`
- `qa/browser_gate_20260612/360_reset_confirm.png`
- `qa/browser_gate_20260612/720_menu.png`
- `qa/browser_gate_20260612/720_game_normal.png`
- `qa/browser_gate_20260612/720_pause_modal.png`
- `qa/browser_gate_20260612/720_levels_modal.png`
- `qa/browser_gate_20260612/720_settings_before.png`
- `qa/browser_gate_20260612/720_settings_large_text.png`
- `qa/browser_gate_20260612/720_settings_contrast.png`
- `qa/browser_gate_20260612/720_reset_confirm.png`

## 360x800
- PASS Menu. Menu screenshot taken after waiting for every DOM `img` to satisfy `complete && naturalWidth > 0`. Logo, Play, Levels, Daily, and Settings are present and readable.
- PASS Normal Game. After waiting for all images, the game board and the three tool icons are visible; DOM snapshot shows `Hint`, `Undo`, and `Mix` with the expected semantics, and the HUD reads `LV. 1` / `0:00`.
- PASS Pause. The pause modal was captured only after the transition settled; final modal check reported `opacity: 1`, `animationName: fadeIn`, and the screenshot center hit a modal child (`BUTTON.btn-modal.primary`).
- PASS Levels. The levels modal was captured only after the transition settled; final modal check reported `opacity: 1`, `animationName: fadeIn`, and the grid resolved to `repeat(4, ...)` with 50 nodes. The center hit `.level-grid`.
- PASS Settings. The settings modal shows `Large Text`, `Contrast`, and `RESET PROGRESS` only. `SFX` / `Music` are absent. `Large Text` toggles the app to `large-font` and changes the heading size from `24px` to `27px`. `Contrast` toggles the app to `large-font high-contrast` and changes the overlay palette.
- PASS Reset Confirm. `CANCEL` and `RESET` are vertical, fully inside the panel, and do not use the browser `confirm()` flow. Measured widths stayed inside the modal content area.

## 720x1600
- PASS Menu. Menu screenshot taken after waiting for every DOM `img` to satisfy `complete && naturalWidth > 0`.
- PASS Normal Game. The game board and the three tool icons are visible; DOM snapshot shows `Hint`, `Undo`, and `Mix` with the expected semantics, and the HUD reads `LV. 1` / `0:00`.
- PASS Pause. Final modal check reported `opacity: 1`, `animationName: fadeIn`, and the screenshot center hit a modal child (`BUTTON.btn-modal.primary`).
- PASS Levels. Final modal check reported `opacity: 1`, `animationName: fadeIn`, and the grid resolved to `repeat(4, ...)` with 50 nodes. The center hit `.level-grid`.
- PASS Settings. The settings modal shows only `Large Text`, `Contrast`, and `RESET PROGRESS`; `SFX` / `Music` are absent. `Large Text` changed the app to `large-font` and the heading size to `54px`. `Contrast` changed the app to `large-font high-contrast` and updated the overlay palette.
- PASS Reset Confirm. `CANCEL` and `RESET` are vertical, fully inside the panel, and not clipped. Measured widths stayed inside the modal content area.

## Console / Images
- PASS: browser console logs returned no error or warning entries for the retest tab.
- PASS: final image health check reported `allComplete: true` and no broken images.

## Task 8 Hard-Failure Recheck
- PASS: menu inlet did not collapse back into the upper half.
- PASS: modal width was not locked to the old `460px` cap.
- PASS: Levels rendered as four columns at both `360x800` and `720x1600`.
- PASS: Reset text and buttons stayed inside the modal panel.
- PASS: `SFX` / `Music` were not shown as usable settings.
- PASS: `Large Text` / `Contrast` produced visible state changes.
- PASS: toolbar icon semantics stayed aligned with `Hint` / `Undo` / `Mix`.
- PASS: no browser `confirm()` dialog appeared during Reset verification.

Conclusion: `BROWSER_ACCEPTED`
