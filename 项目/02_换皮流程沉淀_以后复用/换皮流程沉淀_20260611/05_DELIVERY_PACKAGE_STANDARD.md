# Delivery Package Standard

Use this standard for future programmer handoffs.

## 1. Package Name

Use a clean package folder:

```text
ART_DELIVERY_TO_PROGRAMMER_{YYYYMMDD}_V{N}_FIXED
```

Do not deliver directly from working folders.

## 2. Required Structure

```text
ART_DELIVERY_TO_PROGRAMMER_YYYYMMDD_VN_FIXED/
  README_FOR_PROGRAMMER.md
  assets/
    gameplay/
    menu/
    modal/
    shared/
  specs/
  reports/
    final_after_visual_fix/
    gameplay_visual_fix/
    source_acceptance/
  review/
```

Use only folders that exist for the project.

## 3. Required README Contents

README must include:

- delivery status
- runtime target
- asset folder map
- asset counts
- fixed-slot rendering rules
- do-not-use folders
- known warnings that are not blockers
- key reports

## 4. Required Manifest

Manifest must include:

- delivery root
- status
- asset group paths
- PNG counts
- runtime ratio/canvas
- integration notes
- do-not-use paths

## 5. Do-Not-Use Policy

If a package is revoked:

- add `DO_NOT_USE_*.md`
- update README status to revoked
- do not later reuse that package as the final handoff
- create a new V2 package after repair

## 6. Programmer Integration Notes

Always tell programmers:

- do not auto-crop transparent PNGs
- render fixed-slot assets at their specified canvas size
- tile symbols are centered `96x96` overlays
- selected glow and shadow have their own slot sizes
- the game shell must stay fixed ratio

## 7. Package Verification

Before handoff, verify:

- PNG count by folder
- key README exists
- manifest parses
- final decision file exists
- review sheets exist
- root package does not contain `DO_NOT_USE`

## 8. This Project's Final Package

Final clean package:

```text
E:\参考图\麻将\项目\ART_DELIVERY_TO_PROGRAMMER_20260611_V2_FIXED
```

Asset counts:

- gameplay first screen P0: 55
- menu P0: 3
- menu P1: 9
- modal P0: 17
- total: 84
