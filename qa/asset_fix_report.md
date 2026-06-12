# PNG 返修报告

日期：2026-06-12

## 范围

本次只重写 PNG 后处理返修报告，不再修改任何 PNG 或代码文件。

回顾上一轮返修时，实际处理范围仅限以下资源：

- `assets/menu/*.png`
- `assets/modal/*.png`
- `assets/gameplay/state_tile_covered_overlay.png`

未触碰：

- `data.js`
- `engine.js`
- `index.html`
- `main.js`
- `style.css`
- `ui.js`
- 其他 `gameplay`、`tile_base`、`HUD`、`tool_tray` 资源

## 备份

原图已完整备份到：

`E:\参考图\麻将\项目\01_游戏源码_可运行Demo\mahjong-v3\qa\asset_fix_backup\`

## 实际改动文件

| 文件 | 尺寸 | 主要变化 | 像素差异 |
| --- | ---: | --- | ---: |
| `assets/menu/menu_vignette_bottom.png` | 1080x620 | 低 alpha 边缘做了更强的去紫边和去脏边 | 163792 |
| `assets/modal/modal_panel_large.png` | 940x1480 | 半透明边缘去色、去 spill | 3714 |
| `assets/modal/modal_panel_standard.png` | 860x1120 | 半透明边缘去色、去 spill | 7457 |
| `assets/modal/icon_close.png` | 88x88 | 半透明边缘去色、去 spill | 470 |
| `assets/modal/level_node_open.png` | 132x132 | 半透明边缘去色、去 spill | 854 |
| `assets/modal/level_node_current.png` | 132x132 | 半透明边缘去色、去 spill | 948 |
| `assets/modal/level_node_locked.png` | 132x132 | 半透明边缘去色、去 spill | 841 |
| `assets/modal/btn_modal_primary.png` | 520x140 | 半透明边缘去色、去 spill | 1114 |
| `assets/modal/btn_modal_secondary.png` | 520x120 | 半透明边缘去色、去 spill | 941 |
| `assets/modal/toggle_track.png` | 104x60 | 半透明边缘去色、去 spill | 513 |
| `assets/modal/toggle_knob.png` | 52x52 | 半透明边缘去色、去 spill | 322 |
| `assets/modal/icon_home.png` | 88x88 | 半透明边缘去色、去 spill | 489 |
| `assets/modal/icon_lock.png` | 72x72 | 半透明边缘去色、去 spill | 375 |
| `assets/modal/icon_next.png` | 88x88 | 半透明边缘去色、去 spill | 462 |
| `assets/modal/icon_restart.png` | 88x88 | 半透明边缘去色、去 spill | 472 |
| `assets/modal/icon_resume.png` | 88x88 | 半透明边缘去色、去 spill | 461 |
| `assets/modal/icon_star.png` | 72x72 | 半透明边缘去色、去 spill | 383 |
| `assets/gameplay/state_tile_covered_overlay.png` | 168x201 | 基于现有图做颜色和 alpha 后处理，压低不透明度，去掉紫色描边，改成很轻的深绿薄雾 | 27594 |

## 算法

### 通用修边

- 对大多数 modal / menu PNG 仅处理半透明像素。
- 对低 alpha 区域做去饱和、去紫偏、边缘脏色抑制。
- 保持原始画布尺寸不变。
- 不裁切透明画布。
- 不改文件名。

### `state_tile_covered_overlay.png`

- 基于原图做 blur + tint 的后处理，不是重新绘制新美术。
- 大幅降低整体 alpha，让覆盖层变成轻薄雾状。
- 将色调压到深绿，并去掉紫边与网格感。
- 最终 alpha 范围压到 `0..78`，不再保留 255 级实心像素。

## 验证结果

### 尺寸

- 所有处理文件尺寸与原图一致。
- `state_tile_covered_overlay.png` 仍为 `168x201`。

### Alpha

- 除 `state_tile_covered_overlay.png` 外，其余 17 个文件的 alpha 范围都保持 `0..255`。
- `state_tile_covered_overlay.png` 的 alpha 范围变为 `0..78`，符合“轻薄覆盖雾”的目标。

### 视觉复核

已生成对照图：

- 原图：`E:\参考图\麻将\项目\01_游戏源码_可运行Demo\mahjong-v3\qa\asset_fix_review\original_contact_sheet.png`
- 返修后：`E:\参考图\麻将\项目\01_游戏源码_可运行Demo\mahjong-v3\qa\asset_fix_review\after_contact_sheet.png`

白底、黑底、棋盘格复核正常，整体紫色 spill 已明显收敛。

## 仍需人工复核

- `assets/menu/menu_vignette_bottom.png` 在纯黑背景下最远端叶尖仍能看到很轻的色彩残影，但已经比原图轻很多。
- `assets/gameplay/state_tile_covered_overlay.png` 现在非常轻，如果在实机里觉得覆盖感不够，可以再微调密度，但当前方向已符合“薄雾化”目标。