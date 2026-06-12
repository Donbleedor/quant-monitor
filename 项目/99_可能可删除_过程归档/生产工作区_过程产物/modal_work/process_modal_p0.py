import argparse
import json
from datetime import datetime
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont


ASSETS = [
    {"file": "modal_overlay_dark.png", "size": [1080, 2400], "transparent": False, "source": "modal_overlay_dark_raw.png"},
    {"file": "modal_panel_standard.png", "size": [860, 1120], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [131, 40, 710, 485], "pad": 0.015},
    {"file": "modal_panel_large.png", "size": [940, 1480], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [38, 513, 803, 1009], "pad": 0.015},
    {"file": "btn_modal_primary.png", "size": [520, 140], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [45, 1073, 394, 1204], "pad": 0.025},
    {"file": "btn_modal_secondary.png", "size": [520, 120], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [440, 1073, 782, 1204], "pad": 0.025},
    {"file": "icon_resume.png", "size": [88, 88], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [24, 1243, 144, 1366], "pad": 0.10},
    {"file": "icon_restart.png", "size": [88, 88], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [158, 1243, 279, 1366], "pad": 0.10},
    {"file": "icon_home.png", "size": [88, 88], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [291, 1243, 412, 1366], "pad": 0.10},
    {"file": "icon_close.png", "size": [88, 88], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [425, 1243, 545, 1366], "pad": 0.10},
    {"file": "icon_next.png", "size": [88, 88], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [558, 1243, 678, 1366], "pad": 0.10},
    {"file": "icon_star.png", "size": [72, 72], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [691, 1243, 812, 1366], "pad": 0.10},
    {"file": "icon_lock.png", "size": [72, 72], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [352, 1384, 467, 1502], "pad": 0.10},
    {"file": "level_node_open.png", "size": [132, 132], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [76, 1513, 255, 1691], "pad": 0.055},
    {"file": "level_node_current.png", "size": [132, 132], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [318, 1512, 499, 1694], "pad": 0.055},
    {"file": "level_node_locked.png", "size": [132, 132], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [567, 1513, 743, 1691], "pad": 0.055},
    {"file": "toggle_track.png", "size": [104, 60], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [33, 1737, 248, 1834], "pad": 0.04},
    {"file": "toggle_knob.png", "size": [52, 52], "transparent": True, "source": "modal_p0_asset_board_raw.png", "crop": [551, 1725, 665, 1839], "pad": 0.055},
]


def cover_fit(im, size):
    tw, th = size
    scale = max(tw / im.width, th / im.height)
    resized = im.resize((round(im.width * scale), round(im.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - tw) // 2
    top = (resized.height - th) // 2
    return resized.crop((left, top, left + tw, top + th)).convert("RGB")


def flood_key_magenta(im):
    rgba = im.convert("RGBA")
    arr = np.array(rgba)
    rgb = arr[:, :, :3].astype(np.int16)
    h, w = arr.shape[:2]
    key_candidate = (rgb[:, :, 0] > 180) & (rgb[:, :, 1] < 145) & (rgb[:, :, 2] > 180) & ((rgb[:, :, 0] - rgb[:, :, 1]) > 70) & ((rgb[:, :, 2] - rgb[:, :, 1]) > 70)
    visited = np.zeros((h, w), dtype=bool)
    bg = np.zeros((h, w), dtype=bool)
    stack = []
    for x in range(w):
        stack.append((x, 0))
        stack.append((x, h - 1))
    for y in range(h):
        stack.append((0, y))
        stack.append((w - 1, y))
    while stack:
        x, y = stack.pop()
        if x < 0 or y < 0 or x >= w or y >= h or visited[y, x]:
            continue
        visited[y, x] = True
        if not key_candidate[y, x]:
            continue
        bg[y, x] = True
        stack.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    alpha = arr[:, :, 3]
    alpha[bg] = 0
    # Extra safety for isolated pure/suspicious magenta that can remain after crop edges.
    loose_pink = (rgb[:, :, 0] > 220) & (rgb[:, :, 1] < 120) & (rgb[:, :, 2] > 220)
    alpha[loose_pink] = 0
    alpha_img = Image.fromarray(alpha, "L").filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.GaussianBlur(0.35))
    arr[:, :, 3] = np.array(alpha_img)
    arr[arr[:, :, 3] == 0, :3] = 0
    return Image.fromarray(arr, "RGBA")


def bbox_from_alpha(im):
    alpha = im.getchannel("A")
    return alpha.point(lambda p: 255 if p > 10 else 0).getbbox()


def contain_normalize(im, size, pad_ratio):
    tw, th = size
    bbox = bbox_from_alpha(im)
    if not bbox:
        return Image.new("RGBA", (tw, th), (0, 0, 0, 0)), None
    cropped = im.crop(bbox)
    pad_x = max(0, round(tw * pad_ratio))
    pad_y = max(0, round(th * pad_ratio))
    fit_w = max(1, tw - pad_x * 2)
    fit_h = max(1, th - pad_y * 2)
    scale = min(fit_w / cropped.width, fit_h / cropped.height)
    resized = cropped.resize((max(1, round(cropped.width * scale)), max(1, round(cropped.height * scale))), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    canvas.alpha_composite(resized, ((tw - resized.width) // 2, (th - resized.height) // 2))
    return remove_visible_pink(canvas), bbox


def remove_visible_pink(im):
    arr = np.array(im.convert("RGBA"))
    alpha = arr[:, :, 3]
    visible_pink = (alpha > 0) & (arr[:, :, 0] > 220) & (arr[:, :, 1] < 120) & (arr[:, :, 2] > 220)
    alpha[visible_pink] = 0
    arr[visible_pink, :3] = 0
    arr[:, :, 3] = alpha
    return Image.fromarray(arr, "RGBA")


def qa_image(path, expected, transparent):
    im = Image.open(path)
    rgba = im.convert("RGBA")
    arr = np.array(rgba)
    alpha = arr[:, :, 3]
    bbox = None
    visible_size = [0, 0]
    occ = [0, 0]
    if transparent:
        bbox = bbox_from_alpha(rgba)
        if bbox:
            visible_size = [bbox[2] - bbox[0], bbox[3] - bbox[1]]
            occ = [round(visible_size[0] / expected[0], 4), round(visible_size[1] / expected[1], 4)]
    else:
        bbox = [0, 0, expected[0], expected[1]]
        visible_size = expected[:]
        occ = [1.0, 1.0]
    visible = alpha > 10
    suspicious = visible & (arr[:, :, 0] > 220) & (arr[:, :, 1] < 120) & (arr[:, :, 2] > 220)
    exact = visible & (arr[:, :, 0] == 255) & (arr[:, :, 1] == 0) & (arr[:, :, 2] == 255)
    opaque_ratio = float((alpha > 250).sum()) / alpha.size
    coverage = float(visible.sum()) / alpha.size
    warnings = []
    status = "passed"
    if im.size != tuple(expected):
        status = "failed"
        warnings.append("wrong_dimensions")
    if transparent:
        if im.mode not in ("RGBA", "LA") and "transparency" not in im.info:
            status = "failed"
            warnings.append("missing_alpha")
        if not bbox or coverage < 0.01:
            status = "failed"
            warnings.append("blank_or_nearly_blank")
        if suspicious.sum() > max(6, alpha.size * 0.001):
            warnings.append("suspicious_pink_residual")
    else:
        if im.size != tuple(expected):
            status = "failed"
        if rgba.getchannel("A").getextrema()[0] < 255:
            warnings.append("nontransparent_asset_has_alpha_values")
    return {
        "actual_size": list(im.size),
        "alpha_present": transparent and (rgba.getchannel("A").getextrema()[0] < 255),
        "visible_bbox": list(bbox) if bbox else None,
        "visible_bbox_size": visible_size,
        "visible_bbox_occupancy": occ,
        "coverage": round(coverage, 6),
        "opaque_ratio": round(opaque_ratio, 6),
        "suspicious_pink_pixels": int(suspicious.sum()),
        "exact_ff00ff_visible_pixels": int(exact.sum()),
        "warnings": warnings,
        "status": status,
    }


def apply_bbox_policy(row):
    q = row["qa"]
    occ = q["visible_bbox_occupancy"]
    file = row["file"]
    if file == "modal_panel_large.png" and occ[1] < 0.60:
        q["status"] = "failed"
        q["warnings"].append("raw_component_not_tall_enough_for_large_panel_target")
    if file in {"btn_modal_primary.png", "btn_modal_secondary.png"} and occ[0] < 0.70:
        q["status"] = "failed"
        q["warnings"].append("raw_button_shell_too_narrow_for_target_bbox")
    return row


def make_contact_sheet(rows, out_path):
    thumbs = []
    cell_w, cell_h = 260, 240
    font = ImageFont.load_default()
    for row in rows:
        im = Image.open(row["output"]).convert("RGBA")
        bg = Image.new("RGBA", im.size, (42, 54, 50, 255))
        if row["transparent"]:
            checker = Image.new("RGBA", im.size, (0, 0, 0, 0))
            d = ImageDraw.Draw(checker)
            s = 16
            for y in range(0, im.height, s):
                for x in range(0, im.width, s):
                    c = (215, 215, 215, 255) if (x // s + y // s) % 2 else (245, 245, 245, 255)
                    d.rectangle([x, y, x + s - 1, y + s - 1], fill=c)
            bg = checker
        bg.alpha_composite(im)
        bg.thumbnail((cell_w - 20, cell_h - 62), Image.Resampling.LANCZOS)
        cell = Image.new("RGB", (cell_w, cell_h), (238, 236, 228))
        cell.paste(bg.convert("RGB"), ((cell_w - bg.width) // 2, 12))
        d = ImageDraw.Draw(cell)
        d.text((10, cell_h - 44), row["file"], fill=(20, 20, 20), font=font)
        occ = row["qa"]["visible_bbox_occupancy"]
        d.text((10, cell_h - 26), f'{row["target_size"][0]}x{row["target_size"][1]} occ {occ[0]:.2f},{occ[1]:.2f}', fill=(50, 50, 50), font=font)
        thumbs.append(cell)
    cols = 4
    sheet = Image.new("RGB", (cell_w * cols, cell_h * ((len(thumbs) + cols - 1) // cols)), (220, 216, 204))
    for i, thumb in enumerate(thumbs):
        sheet.paste(thumb, ((i % cols) * cell_w, (i // cols) * cell_h))
    sheet.save(out_path)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", required=True)
    args = ap.parse_args()
    root = Path(args.root)
    raw = root / "modal_work" / "raw_generated" / "modal_p0"
    out = root / "modal_work" / "processed" / "modal_p0"
    review = root / "modal_work" / "review" / "modal_p0"
    reports = root / "modal_work" / "reports"
    out.mkdir(parents=True, exist_ok=True)
    review.mkdir(parents=True, exist_ok=True)
    reports.mkdir(parents=True, exist_ok=True)

    rows = []
    for asset in ASSETS:
        src = raw / asset["source"]
        target = out / asset["file"]
        if asset["transparent"]:
            raw_im = Image.open(src).convert("RGB")
            cropped = raw_im.crop(tuple(asset["crop"]))
            keyed = flood_key_magenta(cropped)
            final, source_bbox = contain_normalize(keyed, asset["size"], asset["pad"])
            final.save(target)
            normalization = "crop_from_raw_board_magenta_key_alpha_bbox_contain_fit"
            key_mode = "magenta_edge_connected"
        else:
            final = cover_fit(Image.open(src).convert("RGB"), asset["size"])
            final.save(target)
            source_bbox = [0, 0, Image.open(src).width, Image.open(src).height]
            normalization = "cover_fit_center_crop"
            key_mode = "none_nontransparent_overlay"
        qa = qa_image(target, asset["size"], asset["transparent"])
        row = {
            "file": asset["file"],
            "source": str(src),
            "output": str(target),
            "target_size": asset["size"],
            "transparent": asset["transparent"],
            "source_crop": asset.get("crop"),
            "source_alpha_bbox_after_key": list(source_bbox) if source_bbox else None,
            "key_mode": key_mode,
            "normalization": normalization,
            "qa": qa,
        }
        row = apply_bbox_policy(row)
        rows.append(row)

    make_contact_sheet(rows, review / "modal_p0_review_contact_sheet.png")

    failures = [r for r in rows if r["qa"]["status"] != "passed"]
    large_pink = [r for r in rows if r["qa"]["suspicious_pink_pixels"] > max(6, r["target_size"][0] * r["target_size"][1] * 0.001)]
    accepted = len(rows) == 17 and not failures and not large_pink
    decision = "ACCEPTED_FOR_INTEGRATION" if accepted else "NEEDS_FIX_BEFORE_INTEGRATION"

    report = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "scope": "modal_p0_postprocess",
        "decision": decision,
        "processed_count": len(rows),
        "expected_count": 17,
        "source_policy": "raw modal_p0 sources only; no regeneration; no programmatic final art drawing",
        "outputs": {
            "processed_dir": str(out),
            "review_contact_sheet": str(review / "modal_p0_review_contact_sheet.png"),
        },
        "summary": {
            "failures": [r["file"] for r in failures],
            "large_pink_residual_files": [r["file"] for r in large_pink],
            "total_suspicious_pink_pixels": int(sum(r["qa"]["suspicious_pink_pixels"] for r in rows)),
            "total_exact_ff00ff_visible_pixels": int(sum(r["qa"]["exact_ff00ff_visible_pixels"] for r in rows)),
        },
        "assets": rows,
    }
    (reports / "MODAL_P0_POSTPROCESS_REPORT.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    lines = [
        "# Modal P0 Postprocess Report",
        "",
        f"Date: {report['date']}",
        f"Decision: `{decision}`",
        "",
        "## Scope",
        "",
        "- P0 only; no P1 assets generated.",
        "- Sources limited to `modal_work/raw_generated/modal_p0`.",
        "- Final art operations: crop, magenta key, alpha cleanup, bbox normalization, resize, QA.",
        "",
        "## Summary",
        "",
        f"- Processed: {len(rows)}/17",
        f"- Failures: {len(failures)}",
        f"- Files with large suspicious pink residual: {len(large_pink)}",
        f"- Total suspicious pink visible pixels: {report['summary']['total_suspicious_pink_pixels']}",
        f"- Total exact #FF00FF visible pixels: {report['summary']['total_exact_ff00ff_visible_pixels']}",
        f"- Contact sheet: `{review / 'modal_p0_review_contact_sheet.png'}`",
        "",
        "## Asset QA",
        "",
        "| File | Size | Alpha | Coverage | Visible BBox | Pink | Exact #FF00FF | Status | Warnings |",
        "| --- | --- | --- | ---: | --- | ---: | ---: | --- | --- |",
    ]
    for r in rows:
        q = r["qa"]
        lines.append(f"| `{r['file']}` | {q['actual_size'][0]}x{q['actual_size'][1]} | {q['alpha_present']} | {q['coverage']:.4f} | {q['visible_bbox_size'][0]}x{q['visible_bbox_size'][1]} | {q['suspicious_pink_pixels']} | {q['exact_ff00ff_visible_pixels']} | {q['status']} | {', '.join(q['warnings']) or '-'} |")
    (reports / "MODAL_P0_POSTPROCESS_REPORT.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    acc = [
        "# Modal P0 Acceptance",
        "",
        f"Decision: `{decision}`",
        "",
        "## Basis",
        "",
        f"- Required P0 files: 17",
        f"- Processed P0 files: {len(rows)}",
        f"- QA blocking failures: {len(failures)}",
        f"- Large suspicious pink residual files: {len(large_pink)}",
        "",
    ]
    if accepted:
        acc.extend([
            "## Verdict",
            "",
            "All 17 P0 files are present, exact-size, match transparent/non-transparent requirements, have reasonable visible bbox normalization, and do not show large magenta/pink background residuals.",
        ])
    else:
        acc.extend(["## Blocking Items", ""])
        for r in failures + large_pink:
            acc.append(f"- `{r['file']}`: {', '.join(r['qa']['warnings']) or r['qa']['status']}")
    (reports / "MODAL_P0_ACCEPTANCE.md").write_text("\n".join(acc) + "\n", encoding="utf-8")

    print(json.dumps({"decision": decision, "processed": len(rows), "contact_sheet": str(review / "modal_p0_review_contact_sheet.png")}, ensure_ascii=False))


if __name__ == "__main__":
    main()
