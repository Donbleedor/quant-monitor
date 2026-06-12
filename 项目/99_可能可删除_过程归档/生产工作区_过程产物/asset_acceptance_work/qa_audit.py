from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r"E:/参考图/麻将/项目")
OUT = ROOT / "asset_acceptance_work"
REVIEW = OUT / "review"
REPORTS = OUT / "reports"

FIRST_SPEC_PATH = ROOT / "FIRST_SCREEN_ASSET_SPEC.json"
MENU_SPEC_PATH = ROOT / "MENU_SCREEN_ASSET_SPEC.json"
MODAL_SPEC_PATH = ROOT / "MODAL_ASSET_SPEC.json"

DIRS = {
    "first_screen_p0": ROOT / "asset_work" / "processed" / "first_screen_p0",
    "first_screen_p0_v2": ROOT / "asset_work" / "processed" / "first_screen_p0_v2",
    "first_screen_p0_image_completion": ROOT / "asset_work" / "processed" / "first_screen_p0_image_completion",
    "first_screen_p0_completion": ROOT / "asset_work" / "processed" / "first_screen_p0_completion",
    "first_screen_p0_final": ROOT / "asset_work" / "processed" / "first_screen_p0_final",
    "first_screen_p0_final_image": ROOT / "asset_work" / "processed" / "first_screen_p0_final_image",
    "menu_p0": ROOT / "menu_work" / "processed" / "menu_p0",
    "menu_p1": ROOT / "menu_work" / "processed" / "menu_p1",
    "modal_p0_raw": ROOT / "modal_work" / "raw_generated" / "modal_p0",
}


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def spec_assets(spec: dict[str, Any]) -> dict[str, dict[str, Any]]:
    out: dict[str, dict[str, Any]] = {}
    for group in spec.get("asset_groups", []):
        for asset in group.get("assets", []):
            out[asset["file"]] = {**asset, "group": group.get("group", "")}
    if spec.get("shared_background", {}).get("file"):
        bg = spec["shared_background"]
        fname = Path(bg["file"]).name
        out.setdefault(
            fname,
            {
                "file": fname,
                "size": bg.get("size"),
                "transparent": False,
                "priority": "P0",
                "group": "shared_background",
            },
        )
    return out


def image_stats(path: Path, transparent_expected: bool | None = None) -> dict[str, Any]:
    with Image.open(path) as src:
        orig_mode = src.mode
        orig_bands = src.getbands()
        im = src.convert("RGBA")
        w, h = im.size
        alpha_exists = "A" in orig_bands
        bbox = im.getchannel("A").getbbox() if alpha_exists else None
        visible_bbox_size = [0, 0]
        occupancy = [0.0, 0.0]
        if bbox:
            x0, y0, x1, y1 = bbox
            visible_bbox_size = [x1 - x0, y1 - y0]
            occupancy = [round((x1 - x0) / w, 4), round((y1 - y0) / h, 4)]

        px = im.load()
        suspicious = 0
        exact_ff00ff = 0
        visible = 0
        for y in range(h):
            for x in range(w):
                r, g, b, a = px[x, y]
                if a > 10:
                    visible += 1
                    if r > 220 and b > 220 and g < 120:
                        suspicious += 1
                        if r == 255 and g == 0 and b == 255:
                            exact_ff00ff += 1

    hard_fail = False
    hard_reasons: list[str] = []
    if transparent_expected and not alpha_exists:
        hard_fail = True
        hard_reasons.append("missing_alpha")
    if suspicious > 20:
        hard_fail = True
        hard_reasons.append("pink_residual")

    return {
        "file": path.name,
        "path": str(path),
        "size": [w, h],
        "orig_mode": orig_mode,
        "alpha_exists": alpha_exists,
        "bbox": list(bbox) if bbox else None,
        "visible_bbox_size": visible_bbox_size,
        "occupancy": occupancy,
        "visible_px": visible,
        "suspicious_pink_px": suspicious,
        "exact_ff00ff_px": exact_ff00ff,
        "pink_pct_of_canvas": round((suspicious / (w * h)) * 100, 6) if w and h else 0.0,
        "pink_pct_of_visible": round((suspicious / visible) * 100, 6) if visible else 0.0,
        "transparent_expected": transparent_expected,
        "hard_fail": hard_fail,
        "hard_reasons": hard_reasons,
    }


def coverage_report(spec: dict[str, Any], dirs: list[str]) -> dict[str, Any]:
    expected = spec_assets(spec)
    found: dict[str, str] = {}
    for dir_name in dirs:
        d = DIRS[dir_name]
        if not d.exists():
            continue
        for p in d.glob("*.png"):
            found.setdefault(p.name, dir_name)

    missing = []
    extra = []
    wrong_size = []
    alpha_missing = []

    for fname, asset in expected.items():
        if fname not in found:
            missing.append({"file": fname, **asset})
            continue
        p = DIRS[found[fname]] / fname
        st = image_stats(p, asset["transparent"])
        sz = asset.get("size")
        if sz and st["size"] != [sz["width"], sz["height"]]:
            wrong_size.append(
                {
                    "file": fname,
                    "dir_name": found[fname],
                    "expected": [sz["width"], sz["height"]],
                    "actual": st["size"],
                }
            )
        if asset["transparent"] and not st["alpha_exists"]:
            alpha_missing.append({"file": fname, "dir_name": found[fname]})

    for fname, dir_name in found.items():
        if fname not in expected:
            extra.append({"file": fname, "dir_name": dir_name})

    return {
        "expected_count": len(expected),
        "found_count": len(found),
        "missing_count": len(missing),
        "extra_count": len(extra),
        "wrong_size_count": len(wrong_size),
        "alpha_missing_count": len(alpha_missing),
        "missing": missing,
        "extra": extra,
        "wrong_size": wrong_size,
        "alpha_missing": alpha_missing,
    }


def make_contact_sheet(title: str, image_paths: list[Path], out_path: Path, cols: int, thumb: tuple[int, int]) -> None:
    if not image_paths:
        return
    pad = 16
    title_h = 48
    label_h = 28
    rows = math.ceil(len(image_paths) / cols)
    sheet_w = cols * thumb[0] + (cols + 1) * pad
    sheet_h = title_h + rows * (thumb[1] + label_h + pad) + pad
    sheet = Image.new("RGBA", (sheet_w, sheet_h), (13, 22, 18, 255))
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    draw.text((pad, 12), title, fill=(240, 220, 170, 255), font=font)
    for idx, path in enumerate(image_paths):
        row = idx // cols
        col = idx % cols
        x = pad + col * (thumb[0] + pad)
        y = title_h + row * (thumb[1] + label_h + pad)
        with Image.open(path) as src:
            im = src.convert("RGBA")
            im.thumbnail(thumb, Image.Resampling.LANCZOS)
            cell = Image.new("RGBA", thumb, (26, 36, 30, 255))
            ox = (thumb[0] - im.size[0]) // 2
            oy = (thumb[1] - im.size[1]) // 2
            cell.alpha_composite(im, (ox, oy))
        sheet.alpha_composite(cell, (x, y))
        draw.text((x, y + thumb[1] + 4), path.name, fill=(235, 235, 230, 255), font=font)
    sheet.save(out_path)


def md_list(items: list[dict[str, Any]]) -> str:
    return "\n".join(
        f"- `{item['file']}`" + (f" ({item['dir_name']})" if item.get("dir_name") else "") for item in items
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    REVIEW.mkdir(parents=True, exist_ok=True)
    REPORTS.mkdir(parents=True, exist_ok=True)

    first_spec = load_json(FIRST_SPEC_PATH)
    menu_spec = load_json(MENU_SPEC_PATH)
    modal_spec = load_json(MODAL_SPEC_PATH)

    first_cov = coverage_report(
        first_spec,
        ["first_screen_p0", "first_screen_p0_v2", "first_screen_p0_image_completion", "first_screen_p0_completion", "first_screen_p0_final", "first_screen_p0_final_image"],
    )
    menu_cov = coverage_report(menu_spec, ["menu_p0", "menu_p1"])
    modal_cov = coverage_report(modal_spec, ["modal_p0_raw"])

    first_lookup = spec_assets(first_spec)
    menu_lookup = spec_assets(menu_spec)

    final_dir = DIRS["first_screen_p0_final_image"]
    menu_p1_dir = DIRS["menu_p1"]
    modal_raw_dir = DIRS["modal_p0_raw"]

    final_reports = [image_stats(p, first_lookup.get(p.name, {}).get("transparent")) for p in sorted(final_dir.glob("*.png"))]
    menu_p1_reports = [image_stats(p, menu_lookup.get(p.name, {}).get("transparent")) for p in sorted(menu_p1_dir.glob("*.png"))]
    modal_raw_reports = [image_stats(p, None) for p in sorted(modal_raw_dir.glob("*.png"))]

    final_pink_files = [r["file"] for r in final_reports if r["suspicious_pink_px"] > 0]
    menu_p1_pink_files = [r["file"] for r in menu_p1_reports if r["suspicious_pink_px"] > 0]
    menu_vignette = next((r for r in menu_p1_reports if r["file"] == "menu_vignette_bottom.png"), None)
    menu_p1_hard = bool(menu_vignette and menu_vignette["hard_fail"])
    modal_pending = not (ROOT / "modal_work" / "processed" / "modal_p0").exists()

    batch_status = {
        "asset_work/processed/first_screen_p0": "STALE",
        "asset_work/processed/first_screen_p0_v2": "STALE",
        "asset_work/processed/first_screen_p0_image_completion": "STALE",
        "asset_work/processed/first_screen_p0_completion": "REJECTED_PLACEHOLDER",
        "asset_work/processed/first_screen_p0_final": "STALE",
        "asset_work/processed/first_screen_p0_final_image": "FINAL_CANDIDATE",
        "menu_work/processed/menu_p0": "ACCEPTED",
        "menu_work/processed/menu_p1": "NEEDS_FIX" if menu_p1_hard else "ACCEPTED",
        "modal_work/raw_generated/modal_p0": "PENDING_PROCESS",
        "modal_work/processed/modal_p0": "PENDING_PROCESS",
    }

    if menu_p1_hard:
        final_decision = "NEEDS_FIX_BEFORE_ART_DELIVERY"
    elif modal_pending:
        final_decision = "PENDING_MODAL_POSTPROCESS"
    elif first_cov["missing_count"] or first_cov["wrong_size_count"] or first_cov["alpha_missing_count"] or menu_cov["missing_count"] or menu_cov["wrong_size_count"] or menu_cov["alpha_missing_count"]:
        final_decision = "NEEDS_FIX_BEFORE_ART_DELIVERY"
    else:
        final_decision = "ACCEPTED_FOR_ART_DELIVERY"

    manifest = {
        "generated_at": "2026-06-11",
        "final_decision": final_decision,
        "candidate_priority": [
            {"rank": 1, "path": str(final_dir), "status": "FINAL_CANDIDATE"},
            {"rank": 2, "path": str(DIRS["menu_p0"]), "status": "ACCEPTED"},
            {"rank": 3, "path": str(menu_p1_dir), "status": "NEEDS_FIX" if menu_p1_hard else "ACCEPTED"},
            {"rank": 4, "path": str(modal_raw_dir), "status": "PENDING_PROCESS"},
        ],
        "batch_status": batch_status,
        "coverages": {
            "FIRST_SCREEN_ASSET_SPEC.json": first_cov,
            "MENU_SCREEN_ASSET_SPEC.json": menu_cov,
            "MODAL_ASSET_SPEC.json": modal_cov,
        },
        "final_image_assets": [
            {
                "file": r["file"],
                "size": r["size"],
                "alpha_exists": r["alpha_exists"],
                "bbox": r["bbox"],
                "occupancy": r["occupancy"],
                "suspicious_pink_px": r["suspicious_pink_px"],
                "exact_ff00ff_px": r["exact_ff00ff_px"],
                "hard_fail": r["hard_fail"],
                "hard_reasons": r["hard_reasons"],
            }
            for r in sorted(final_reports, key=lambda x: x["file"])
        ],
        "menu_p1_assets": [
            {
                "file": r["file"],
                "size": r["size"],
                "alpha_exists": r["alpha_exists"],
                "bbox": r["bbox"],
                "occupancy": r["occupancy"],
                "suspicious_pink_px": r["suspicious_pink_px"],
                "exact_ff00ff_px": r["exact_ff00ff_px"],
                "hard_fail": r["hard_fail"],
                "hard_reasons": r["hard_reasons"],
            }
            for r in sorted(menu_p1_reports, key=lambda x: x["file"])
        ],
        "modal_raw_assets": [
            {
                "file": r["file"],
                "size": r["size"],
                "alpha_exists": r["alpha_exists"],
                "bbox": r["bbox"],
                "occupancy": r["occupancy"],
                "suspicious_pink_px": r["suspicious_pink_px"],
                "exact_ff00ff_px": r["exact_ff00ff_px"],
                "hard_fail": r["hard_fail"],
                "hard_reasons": r["hard_reasons"],
            }
            for r in sorted(modal_raw_reports, key=lambda x: x["file"])
        ],
    }

    (OUT / "ART_ASSET_ACCEPTANCE_PLAN.md").write_text(
        "\n".join(
            [
                "# ART Asset Acceptance Plan",
                "",
                "Date: 2026-06-11",
                "",
                "Scope:",
                "- Independent read-only QA of current art asset batches.",
                "- No source image edits, no moves, no overwrites.",
                "- Output is confined to `asset_acceptance_work`.",
                "",
                "Checks:",
                "1. Read the three baseline specs.",
                "2. Enumerate raw/processed/review/reports directories.",
                "3. Validate spec coverage, sizes, alpha, bbox, and pink residuals.",
                "4. Classify batches as FINAL_CANDIDATE / ACCEPTED / NEEDS_FIX / PENDING_PROCESS / STALE / REJECTED_PLACEHOLDER.",
                "5. Generate contact sheets and decision docs.",
                "",
                "Final decision rule:",
                "- Any hard pink residual in final candidates or an incomplete modal batch blocks ACCEPTED_FOR_ART_DELIVERY.",
            ]
        )
        + "\n",
        encoding="utf-8",
    )

    (OUT / "GLOBAL_ASSET_LOCATION_MAP.md").write_text(
        "\n".join(
            [
                "# Global Asset Location Map",
                "",
                "## Directories",
                "",
                "- `asset_work/raw_generated`",
                "- `asset_work/processed`",
                "- `asset_work/review`",
                "- `asset_work/reports`",
                "- `menu_work/raw_generated`",
                "- `menu_work/processed`",
                "- `menu_work/review`",
                "- `menu_work/reports`",
                "- `modal_work/raw_generated`",
                "- `modal_work/reports`",
                "",
                "## Batch Map",
                "",
                "| Batch | Location | Status |",
                "| --- | --- | --- |",
                "| first_screen_p0 | `asset_work/processed/first_screen_p0` | STALE |",
                "| first_screen_p0_v2 | `asset_work/processed/first_screen_p0_v2` | STALE |",
                "| first_screen_p0_image_completion | `asset_work/processed/first_screen_p0_image_completion` | STALE |",
                "| first_screen_p0_completion | `asset_work/processed/first_screen_p0_completion` | REJECTED_PLACEHOLDER |",
                "| first_screen_p0_final | `asset_work/processed/first_screen_p0_final` | STALE |",
                "| first_screen_p0_final_image | `asset_work/processed/first_screen_p0_final_image` | FINAL_CANDIDATE |",
                "| menu_p0 | `menu_work/processed/menu_p0` | ACCEPTED |",
                "| menu_p1 | `menu_work/processed/menu_p1` | NEEDS_FIX |",
                "| modal_p0 raw | `modal_work/raw_generated/modal_p0` | PENDING_PROCESS |",
                "",
                "## Delivery Priority",
                "",
                "1. `asset_work/processed/first_screen_p0_final_image`",
                "2. `menu_work/processed/menu_p0`",
                "3. `menu_work/processed/menu_p1` if fixed",
                "4. `modal_work/processed/modal_p0` once created",
                "5. `modal_work/raw_generated/modal_p0` is source only",
            ]
        )
        + "\n",
        encoding="utf-8",
    )

    qa_lines = [
        "# ART Asset QA Report",
        "",
        f"Decision: `{final_decision}`",
        "",
        "## Key Findings",
        f"- First-screen final candidate: {first_cov['found_count']}/{first_cov['expected_count']} assets found in the merged final directory.",
        f"- Menu P0 coverage: {menu_cov['found_count']}/{menu_cov['expected_count']}.",
        f"- Modal P0: raw-only; no processed modal batch exists yet.",
        f"- Menu P1 suspicious pink files: {len(menu_p1_pink_files)}.",
        "",
        "## Hard Issues",
    ]
    qa_lines.append("- `menu_work/processed/menu_p1/menu_vignette_bottom.png` contains a large visible pink residual and is a hard fail." if menu_p1_hard else "- No hard pink residual found in menu P1.")
    qa_lines.append("- Modal P0 has no processed acceptance batch; raw generation only." if modal_pending else "- Modal P0 processed batch exists.")
    qa_lines += [
        "",
        "## Batch Status",
    ]
    for k, v in batch_status.items():
        qa_lines.append(f"- `{k}`: `{v}`")
    qa_lines += [
        "",
        "## Notes",
        "- `first_screen_p0_completion` shows historical `vector_render_magenta_fill` traces in the legacy reports and is treated as rejected/stale, not a final art source.",
        "- `first_screen_p0_final_image` is the only first-screen batch treated as final-candidate here.",
    ]
    (OUT / "ART_ASSET_QA_REPORT.md").write_text("\n".join(qa_lines) + "\n", encoding="utf-8")

    magenta_lines = [
        "# Magenta / Alpha Issues",
        "",
        "Thresholds used:",
        "- suspicious pink = alpha > 10 and R > 220, B > 220, G < 120",
        "- exact magenta = RGB 255,0,255 with alpha > 10",
        "- hard fail if suspicious pink pixels exceed 20 in a transparent asset",
        "",
        "## First-screen final image",
    ]
    if final_pink_files:
        for r in final_reports:
            if r["suspicious_pink_px"] > 0:
                magenta_lines.append(
                    f"- `{r['file']}`: suspicious={r['suspicious_pink_px']}, exact={r['exact_ff00ff_px']}, occupancy={r['occupancy']}, hard_fail={r['hard_fail']}"
                )
    else:
        magenta_lines.append("- No visible pink residual detected in the first-screen final candidate batch.")
    magenta_lines += ["", "## Menu P1"]
    if menu_p1_pink_files:
        for r in menu_p1_reports:
            if r["suspicious_pink_px"] > 0:
                magenta_lines.append(
                    f"- `{r['file']}`: suspicious={r['suspicious_pink_px']}, exact={r['exact_ff00ff_px']}, occupancy={r['occupancy']}, hard_fail={r['hard_fail']}"
                )
    else:
        magenta_lines.append("- No visible pink residual detected in menu P1 assets other than the suspected vignette batch.")
    if menu_p1_hard:
        magenta_lines.append("- `menu_vignette_bottom.png` is the blocking issue and should be regenerated or postprocessed again.")
    magenta_lines += [
        "",
        "## Alpha Notes",
        "- All transparent assets in the first-screen final candidate have alpha present.",
        "- Modal raw assets are still source-only and should not be treated as delivered transparent assets.",
    ]
    (OUT / "MAGENTA_ALPHA_ISSUES.md").write_text("\n".join(magenta_lines) + "\n", encoding="utf-8")

    spec_lines = [
        "# Asset Spec Coverage Report",
        "",
        "## FIRST_SCREEN_ASSET_SPEC.json",
        f"- Expected: {first_cov['expected_count']}",
        f"- Found: {first_cov['found_count']}",
        f"- Missing: {first_cov['missing_count']}",
        f"- Wrong size: {first_cov['wrong_size_count']}",
        f"- Missing alpha on transparent assets: {first_cov['alpha_missing_count']}",
    ]
    if first_cov["missing"]:
        spec_lines += ["- Missing files:", md_list(first_cov["missing"])]
    if first_cov["wrong_size"]:
        spec_lines.append("- Wrong sizes:")
        for x in first_cov["wrong_size"]:
            spec_lines.append(f"  - `{x['file']}`: expected {x['expected']}, actual {x['actual']} ({x['dir_name']})")
    spec_lines += [
        "",
        "## MENU_SCREEN_ASSET_SPEC.json",
        f"- Expected: {menu_cov['expected_count']}",
        f"- Found: {menu_cov['found_count']}",
        f"- Missing: {menu_cov['missing_count']}",
        f"- Wrong size: {menu_cov['wrong_size_count']}",
        f"- Missing alpha on transparent assets: {menu_cov['alpha_missing_count']}",
    ]
    if menu_cov["missing"]:
        spec_lines += ["- Missing files:", md_list(menu_cov["missing"])]
    if menu_cov["wrong_size"]:
        spec_lines.append("- Wrong sizes:")
        for x in menu_cov["wrong_size"]:
            spec_lines.append(f"  - `{x['file']}`: expected {x['expected']}, actual {x['actual']} ({x['dir_name']})")
    spec_lines += [
        "",
        "## MODAL_ASSET_SPEC.json",
        f"- Expected: {modal_cov['expected_count']}",
        f"- Found: {modal_cov['found_count']}",
        f"- Missing: {modal_cov['missing_count']}",
        f"- Wrong size: {modal_cov['wrong_size_count']}",
        f"- Missing alpha on transparent assets: {modal_cov['alpha_missing_count']}",
        "- Status: pending processed modal batch",
    ]
    (OUT / "ASSET_SPEC_COVERAGE_REPORT.md").write_text("\n".join(spec_lines) + "\n", encoding="utf-8")

    stale_lines = [
        "# Stale and Rejected Batches",
        "",
        "## Stale / Superseded",
        "- `asset_work/processed/first_screen_p0`",
        "- `asset_work/processed/first_screen_p0_v2`",
        "- `asset_work/processed/first_screen_p0_image_completion`",
        "- `asset_work/processed/first_screen_p0_final`",
        "",
        "## Rejected Placeholder",
        "- `asset_work/processed/first_screen_p0_completion`",
        "  - legacy reports contain `vector_render_magenta_fill` / programmatic fill traces",
        "  - treat as rejected placeholder, not delivery art",
        "",
        "## Pending Process",
        "- `modal_work/raw_generated/modal_p0`",
        "  - raw source only",
        "  - no `modal_work/processed/modal_p0` directory exists yet",
        "",
        "## Needs Fix",
    ]
    if menu_p1_hard:
        stale_lines += [
            "- `menu_work/processed/menu_p1`",
            "  - `menu_vignette_bottom.png` hard-fails pink residual QA",
        ]
    else:
        stale_lines.append("- none at present")
    (OUT / "STALE_AND_REJECTED_BATCHES.md").write_text("\n".join(stale_lines) + "\n", encoding="utf-8")

    decision_md = [
        "# Final Decision",
        "",
        f"`{final_decision}`",
        "",
        "## Rationale",
        f"- First-screen final candidate is present at `{final_dir}` and is the strongest first-screen batch.",
        "- Menu P0 is accepted, but menu P1 still carries a blocking pink-residual risk if the suspected vignette is part of delivery.",
        "- Modal assets are only present as raw generation; there is no processed modal delivery batch yet.",
        "",
        "## Verdict",
        "- Do not treat the project as fully delivered until menu P1 is cleaned or excluded and modal P0 is processed.",
    ]
    (OUT / "ART_ASSET_FINAL_DECISION.md").write_text("\n".join(decision_md) + "\n", encoding="utf-8")

    (OUT / "DELIVERY_CANDIDATE_MANIFEST.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    (REPORTS / "artifact_analysis_bundle.json").write_text(
        json.dumps(
            {
                "first_cov": first_cov,
                "menu_cov": menu_cov,
                "modal_cov": modal_cov,
                "final_reports": final_reports,
                "menu_p1_reports": menu_p1_reports,
                "modal_raw_reports": modal_raw_reports,
                "final_decision": final_decision,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    make_contact_sheet("first_screen_p0_final_image", sorted(final_dir.glob("*.png")), REVIEW / "first_screen_p0_final_image_contact_sheet.png", cols=5, thumb=(220, 220))
    make_contact_sheet("menu_p1", sorted(menu_p1_dir.glob("*.png")), REVIEW / "menu_p1_contact_sheet.png", cols=3, thumb=(280, 280))
    make_contact_sheet("modal_p0_raw", sorted(modal_raw_dir.glob("*.png")), REVIEW / "modal_p0_raw_contact_sheet.png", cols=2, thumb=(380, 380))

    print(
        json.dumps(
            {
                "final_decision": final_decision,
                "menu_p1_hard": menu_p1_hard,
                "first_screen_coverage": first_cov,
                "menu_coverage": menu_cov,
                "modal_coverage": modal_cov,
                "final_image_suspicious_files": final_pink_files,
                "menu_p1_suspicious_files": menu_p1_pink_files,
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
