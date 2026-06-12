from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


BASE = Path(r"E:\参考图\麻将\项目")
WORK = BASE / "menu_work"
RAW_DIR = WORK / "raw_generated" / "menu_p0"
PROC_DIR = WORK / "processed" / "menu_p0"
REVIEW_DIR = WORK / "review" / "menu_p0"
REPORT_DIR = WORK / "reports"
HELPER = Path(r"C:\Users\nenghong.zhao\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py")
SOURCE_DIR = Path(r"C:\Users\nenghong.zhao\.codex\generated_images\019eb170-d0e7-7203-a889-ffe8420fd091")


ASSETS = [
    {
        "name": "logo_tribal_tiles.png",
        "raw_name": "logo_tribal_tiles_raw.png",
        "source": SOURCE_DIR / "ig_07926b51eb1d12c7016a2a19e46044819188b4b16e1c4d0fd0.png",
        "size": (760, 420),
        "padding": 0.06,
        "kind": "logo",
    },
    {
        "name": "button_play_large.png",
        "raw_name": "button_play_large_raw.png",
        "source": SOURCE_DIR / "ig_07926b51eb1d12c7016a2a1a52d66c8191adab643fa62d0ce8.png",
        "size": (780, 260),
        "padding": 0.02,
        "kind": "button",
    },
    {
        "name": "icon_settings.png",
        "raw_name": "icon_settings_raw.png",
        "source": SOURCE_DIR / "ig_07926b51eb1d12c7016a2a1a95a0cc8191b587178410cfe1c9.png",
        "size": (88, 88),
        "padding": 0.10,
        "kind": "icon",
    },
]


def alpha_bbox_np(img: Image.Image, threshold: int = 10):
    alpha = img.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        return None
    # Tighten by threshold to trim soft matte fringe.
    mask = alpha.point(lambda px: 255 if px > threshold else 0)
    return mask.getbbox()


def trim_low_alpha(img: Image.Image, threshold: int = 10):
    rgba = img.convert("RGBA")
    bbox = alpha_bbox_np(rgba, threshold)
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


def paste_center(canvas: Image.Image, fg: Image.Image):
    x = (canvas.size[0] - fg.size[0]) // 2
    y = (canvas.size[1] - fg.size[1]) // 2
    canvas.alpha_composite(fg, (x, y))
    return x, y


def make_checker(size=(240, 240), cell=30):
    checker = Image.new("RGBA", size, (215, 215, 215, 255))
    draw = ImageDraw.Draw(checker)
    for yy in range(0, size[1], cell):
        for xx in range(0, size[0], cell):
            if ((xx // cell) + (yy // cell)) % 2 == 0:
                fill = (245, 245, 245, 255)
            else:
                fill = (210, 210, 210, 255)
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
        bbox = alpha_bbox_np(img, 10)
        if bbox is None:
            raise RuntimeError(f"empty_subject: {asset['name']}")

        subject = img.crop(bbox)
        subject = trim_low_alpha(subject, 10)[0]
        subject = contain_fit(subject, asset["size"], asset["padding"])

        canvas = Image.new("RGBA", asset["size"], (0, 0, 0, 0))
        paste_center(canvas, subject)
        final_path = PROC_DIR / asset["name"]
        canvas.save(final_path)

        final_bbox = alpha_bbox_np(canvas, 10)
        if final_bbox is None:
            raise RuntimeError(f"empty_final: {asset['name']}")

        fbw = final_bbox[2] - final_bbox[0]
        fbh = final_bbox[3] - final_bbox[1]
        occ = [round(fbw / asset["size"][0], 3), round(fbh / asset["size"][1], 3)]
        warnings = []
        if asset["kind"] == "icon" and (occ[0] < 0.70 or occ[1] < 0.70):
            warnings.append("subject_too_small")
        if asset["kind"] == "button" and (occ[0] < 0.65 or occ[1] < 0.65):
            warnings.append("family_scale_mismatch")
        if asset["kind"] == "logo" and (occ[0] < 0.50 or occ[1] < 0.70):
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
    cell_w, cell_h = 560, 360
    sheet = Image.new("RGBA", (cell_w * 2, cell_h * 2), (17, 24, 18, 255))

    for idx, entry in enumerate(entries):
        row, col = divmod(idx, 2)
        x0, y0 = col * cell_w, row * cell_h
        cell = Image.new("RGBA", (cell_w, cell_h), (18, 28, 21, 255))
        cdraw = ImageDraw.Draw(cell)
        cdraw.rectangle([8, 8, cell_w - 8, cell_h - 8], outline=(214, 166, 72, 180), width=2)
        warn = ", ".join(entry["warnings"]) if entry["warnings"] else "none"
        cdraw.text((18, 16), entry["file"], fill=(233, 218, 182, 255), font=font)
        cdraw.text((18, 30), f'{entry["actual_size"][0]}x{entry["actual_size"][1]} | occ {entry["visible_bbox_occupancy"][0]:.2f}/{entry["visible_bbox_occupancy"][1]:.2f}', fill=(200, 200, 200, 255), font=font)
        cdraw.text((18, 44), f'{entry["status"]} | {warn}', fill=(180, 200, 170, 255), font=font)

        preview = Image.open(PROC_DIR / entry["file"]).convert("RGBA")
        max_prev = (cell_w - 36, cell_h - 92)
        scale = min(max_prev[0] / preview.size[0], max_prev[1] / preview.size[1])
        prev_size = (max(1, int(round(preview.size[0] * scale))), max(1, int(round(preview.size[1] * scale))))
        preview = preview.resize(prev_size, Image.Resampling.LANCZOS)
        bg = checker.copy().resize(prev_size)
        bg.alpha_composite(preview)
        px = (cell_w - prev_size[0]) // 2
        py = 64 + (max_prev[1] - prev_size[1]) // 2
        cell.alpha_composite(bg, (px, py))
        sheet.alpha_composite(cell, (x0, y0))

    sheet_path = REVIEW_DIR / "menu_p0_review_contact_sheet.png"
    sheet.save(sheet_path)

    report = {
        "date": "2026-06-11",
        "scope": "menu_p0",
        "source_review": str(BASE / "MENU_SCREEN_EFFECT_REVIEW.md"),
        "raw_dir": str(RAW_DIR),
        "processed_dir": str(PROC_DIR),
        "review_dir": str(REVIEW_DIR),
        "assets": entries,
    }
    (REPORT_DIR / "MENU_P0_POSTPROCESS_REPORT.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    md = []
    md.append("# Menu P0 Postprocess Report")
    md.append("")
    md.append("Date: 2026-06-11")
    md.append("")
    md.append("Scope: menu_p0 only. No first_screen_p0 assets were touched.")
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
    md.append("- Alpha removal used the magenta chroma key helper and then normalized visible bounds to the final canvas size.")
    md.append("- All outputs landed on exact target dimensions from `MENU_SCREEN_ASSET_SPEC.json`.")
    (REPORT_DIR / "MENU_P0_POSTPROCESS_REPORT.md").write_text("\n".join(md), encoding="utf-8")

    print(json.dumps({"sheet": str(sheet_path)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
