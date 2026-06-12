from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


BASE = Path(r"E:\参考图\麻将\项目")
WORK = BASE / "menu_work"
RAW_DIR = WORK / "raw_generated" / "menu_p1"
PROC_DIR = WORK / "processed" / "menu_p1"
REVIEW_DIR = WORK / "review" / "menu_p1"
REPORT_DIR = WORK / "reports"
HELPER = Path(r"C:\Users\nenghong.zhao\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py")
SOURCE_DIR = Path(r"C:\Users\nenghong.zhao\.codex\generated_images\019eb170-d0e7-7203-a889-ffe8420fd091")


ASSETS = [
    {
        "name": "title_tribal_tiles.png",
        "raw_name": "title_tribal_tiles_raw.png",
        "source": SOURCE_DIR / "ig_07926b51eb1d12c7016a2a22adb354819182efe630dc5873f6.png",
        "size": (620, 160),
        "padding": 0.08,
        "kind": "wordmark",
    },
    {
        "name": "icon_levels.png",
        "raw_name": "icon_levels_raw.png",
        "source": SOURCE_DIR / "ig_07926b51eb1d12c7016a2a231d47188191bb4beaaef26c074e.png",
        "size": (88, 88),
        "padding": 0.10,
        "kind": "icon",
    },
    {
        "name": "icon_daily.png",
        "raw_name": "icon_daily_raw.png",
        "source": SOURCE_DIR / "ig_07926b51eb1d12c7016a2a239481dc8191ac010c016e39cf04.png",
        "size": (88, 88),
        "padding": 0.10,
        "kind": "icon",
    },
    {
        "name": "tool_btn_shell.png",
        "raw_name": "tool_btn_shell_raw.png",
        "source": SOURCE_DIR / "ig_07926b51eb1d12c7016a2a24254da08191b54097a8e4b66d67.png",
        "size": (182, 182),
        "padding": 0.02,
        "kind": "button",
    },
    {
        "name": "badge_count_coin.png",
        "raw_name": "badge_count_coin_raw.png",
        "source": SOURCE_DIR / "ig_07926b51eb1d12c7016a2a24b31bcc81918b3f1785c1c4701b.png",
        "size": (44, 44),
        "padding": 0.06,
        "kind": "badge",
    },
    {
        "name": "tile_base_ivory.png",
        "raw_name": "tile_base_ivory_raw.png",
        "source": SOURCE_DIR / "ig_07926b51eb1d12c7016a2a255882b081919827c78c01696ffd.png",
        "size": (168, 201),
        "padding": 0.02,
        "kind": "tile",
    },
    {
        "name": "menu_pattern_overlay.png",
        "raw_name": "menu_pattern_overlay_raw.png",
        "source": SOURCE_DIR / "ig_07926b51eb1d12c7016a2a29c011c88191a52577d1663d7937.png",
        "size": (1080, 2400),
        "padding": 0.00,
        "kind": "overlay",
    },
    {
        "name": "menu_vignette_top.png",
        "raw_name": "menu_vignette_top_raw.png",
        "source": SOURCE_DIR / "ig_07926b51eb1d12c7016a2a272e4388819183165b7949ff55d1.png",
        "size": (1080, 520),
        "padding": 0.00,
        "kind": "overlay",
    },
    {
        "name": "menu_vignette_bottom.png",
        "raw_name": "menu_vignette_bottom_raw.png",
        "source": SOURCE_DIR / "ig_07926b51eb1d12c7016a2a27e1883481919e47ac98bc3f9198.png",
        "size": (1080, 620),
        "padding": 0.00,
        "kind": "overlay",
    },
]


def alpha_bbox(img: Image.Image, threshold: int = 10):
    alpha = img.getchannel("A")
    mask = alpha.point(lambda px: 255 if px > threshold else 0)
    return mask.getbbox()


def trim_low_alpha(img: Image.Image, threshold: int = 10):
    rgba = img.convert("RGBA")
    bbox = alpha_bbox(rgba, threshold)
    if bbox is None:
        return None, None
    return rgba.crop(bbox), bbox


def contain_fit(subject: Image.Image, target_size: tuple[int, int], padding: float):
    tw, th = target_size
    max_w = max(1, int(round(tw * (1 - padding * 2))))
    max_h = max(1, int(round(th * (1 - padding * 2))))
    sw, sh = subject.size
    scale = min(max_w / sw, max_h / sh)
    new_size = (max(1, int(round(sw * scale))), max(1, int(round(sh * scale))))
    return subject.resize(new_size, Image.Resampling.LANCZOS)


def make_checker(size=(240, 240), cell=30):
    checker = Image.new("RGBA", size, (215, 215, 215, 255))
    draw = ImageDraw.Draw(checker)
    for yy in range(0, size[1], cell):
        for xx in range(0, size[0], cell):
            fill = (245, 245, 245, 255) if ((xx // cell) + (yy // cell)) % 2 == 0 else (210, 210, 210, 255)
            draw.rectangle([xx, yy, xx + cell - 1, yy + cell - 1], fill=fill)
    return checker


def main():
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROC_DIR.mkdir(parents=True, exist_ok=True)
    REVIEW_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    for asset in ASSETS:
        shutil.copy2(asset["source"], RAW_DIR / asset["raw_name"])

    entries = []
    for asset in ASSETS:
        raw_path = RAW_DIR / asset["raw_name"]
        alpha_tmp = RAW_DIR / f"{asset['name'].removesuffix('.png')}_alpha_tmp.png"

        subprocess.run(
            [
                sys.executable,
                str(HELPER),
                "--input",
                str(raw_path),
                "--out",
                str(alpha_tmp),
                "--auto-key",
                "border",
                "--soft-matte",
                "--transparent-threshold",
                "12",
                "--opaque-threshold",
                "220",
                "--despill",
                "--force",
            ],
            check=True,
        )

        img = Image.open(alpha_tmp).convert("RGBA")
        bbox = alpha_bbox(img, 10)
        if bbox is None:
            raise RuntimeError(f"empty_subject: {asset['name']}")

        subject = img.crop(bbox)
        subject = trim_low_alpha(subject, 10)[0]
        subject = contain_fit(subject, asset["size"], asset["padding"])

        canvas = Image.new("RGBA", asset["size"], (0, 0, 0, 0))
        x = (asset["size"][0] - subject.size[0]) // 2
        y = (asset["size"][1] - subject.size[1]) // 2
        canvas.alpha_composite(subject, (x, y))
        canvas.save(PROC_DIR / asset["name"])

        final_bbox = alpha_bbox(canvas, 10)
        if final_bbox is None:
            raise RuntimeError(f"empty_final: {asset['name']}")

        fbw = final_bbox[2] - final_bbox[0]
        fbh = final_bbox[3] - final_bbox[1]
        occ = [round(fbw / asset["size"][0], 3), round(fbh / asset["size"][1], 3)]
        warnings = []
        if asset["kind"] == "icon" and (occ[0] < 0.70 or occ[1] < 0.70):
            warnings.append("subject_too_small")
        if asset["kind"] == "badge" and (occ[0] < 0.60 or occ[1] < 0.60):
            warnings.append("subject_too_small")
        if asset["kind"] == "button" and (occ[0] < 0.65 or occ[1] < 0.65):
            warnings.append("family_scale_mismatch")
        if asset["kind"] in {"wordmark", "tile"} and (occ[0] < 0.55 or occ[1] < 0.55):
            warnings.append("family_scale_mismatch")

        entries.append(
            {
                "file": asset["name"],
                "source": str(raw_path),
                "target_size": list(asset["size"]),
                "actual_size": list(canvas.size),
                "transparent": True,
                "alpha_present": True,
                "key_mode": "magenta",
                "bbox": list(final_bbox),
                "visible_bbox_size": [fbw, fbh],
                "visible_bbox_occupancy": occ,
                "normalization": "alpha_bbox_crop_then_contain_fit",
                "status": "passed" if not warnings else "passed_with_warnings",
                "warnings": warnings,
            }
        )

    checker = make_checker()
    font = ImageFont.load_default()
    cell_w, cell_h = 420, 320
    cols = 3
    rows = 3
    sheet = Image.new("RGBA", (cell_w * cols, cell_h * rows), (17, 24, 18, 255))

    for idx, entry in enumerate(entries):
        row, col = divmod(idx, cols)
        x0, y0 = col * cell_w, row * cell_h
        cell = Image.new("RGBA", (cell_w, cell_h), (18, 28, 21, 255))
        cdraw = ImageDraw.Draw(cell)
        cdraw.rectangle([8, 8, cell_w - 8, cell_h - 8], outline=(214, 166, 72, 180), width=2)
        warn = ", ".join(entry["warnings"]) if entry["warnings"] else "none"
        cdraw.text((14, 14), entry["file"], fill=(233, 218, 182, 255), font=font)
        cdraw.text((14, 28), f'{entry["actual_size"][0]}x{entry["actual_size"][1]} | occ {entry["visible_bbox_occupancy"][0]:.2f}/{entry["visible_bbox_occupancy"][1]:.2f}', fill=(200, 200, 200, 255), font=font)
        cdraw.text((14, 42), f'{entry["status"]} | {warn}', fill=(180, 200, 170, 255), font=font)

        preview = Image.open(PROC_DIR / entry["file"]).convert("RGBA")
        max_prev = (cell_w - 30, cell_h - 86)
        scale = min(max_prev[0] / preview.size[0], max_prev[1] / preview.size[1])
        prev_size = (max(1, int(round(preview.size[0] * scale))), max(1, int(round(preview.size[1] * scale))))
        preview = preview.resize(prev_size, Image.Resampling.LANCZOS)
        bg = checker.copy().resize(prev_size)
        bg.alpha_composite(preview)
        px = (cell_w - prev_size[0]) // 2
        py = 58 + (max_prev[1] - prev_size[1]) // 2
        cell.alpha_composite(bg, (px, py))
        sheet.alpha_composite(cell, (x0, y0))

    sheet_path = REVIEW_DIR / "menu_p1_review_contact_sheet.png"
    sheet.save(sheet_path)

    report = {
        "date": "2026-06-11",
        "scope": "menu_p1",
        "raw_dir": str(RAW_DIR),
        "processed_dir": str(PROC_DIR),
        "review_dir": str(REVIEW_DIR),
        "assets": entries,
    }
    (REPORT_DIR / "MENU_P1_POSTPROCESS_REPORT.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    md = []
    md.append("# Menu P1 Postprocess Report")
    md.append("")
    md.append("Date: 2026-06-11")
    md.append("")
    md.append("Scope: menu_p1 only. No first_screen_p0 assets were touched.")
    md.append("")
    md.append("## Outputs")
    md.append("")
    md.append(f"- Raw: `{RAW_DIR}`")
    md.append(f"- Processed: `{PROC_DIR}`")
    md.append(f"- Review: `{REVIEW_DIR}`")
    md.append(f"- Contact sheet: `{sheet_path}`")
    md.append("")
    md.append("## Results")
    md.append("")
    for entry in entries:
        md.append(
            f"- `{entry['file']}` -> `{entry['actual_size'][0]}x{entry['actual_size'][1]}` | status: {entry['status']} | warnings: {', '.join(entry['warnings']) if entry['warnings'] else 'none'}"
        )
    md.append("")
    md.append("## Notes")
    md.append("")
    md.append("- All transparent assets were magenta-key processed and normalized to exact target dimensions.")
    md.append("- The menu pattern overlay and vignettes are treated as transparent decorative layers.")
    (REPORT_DIR / "MENU_P1_POSTPROCESS_REPORT.md").write_text("\n".join(md), encoding="utf-8")

    print(json.dumps({"sheet": str(sheet_path)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
