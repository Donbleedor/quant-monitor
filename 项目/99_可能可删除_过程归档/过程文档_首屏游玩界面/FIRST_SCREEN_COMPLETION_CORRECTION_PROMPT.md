# First Screen Completion Correction Prompt

Use this prompt to correct the gameplay asset agent after it produced programmatic placeholder art.

```text
需要纠偏：当前补齐批次不能验收。

问题不是尺寸或 alpha，而是补齐资源大量使用了程序图形/Pillow/CSS/SVG/Canvas 风格的几何占位图，和已确认的 image 生成资产、效果图风格不一致。这些只能作为临时 placeholder，不能作为最终美术资源。

请先读取更新后的规则：

E:\参考图\麻将\项目\POSTPROCESS_PLAN.md
E:\参考图\麻将\项目\PROCESS_FIRST_SCREEN_ASSETS_SCRIPT_SPEC.md
E:\参考图\麻将\项目\FIRST_SCREEN_CUTTING_PLAN.md
E:\参考图\麻将\项目\STYLE_BIBLE.md
E:\参考图\麻将\项目\TOTEM_TILE_MAP.md
E:\参考图\麻将\项目\FIRST_SCREEN_ASSET_SPEC.json

任务：
1. 将当前程序图形补齐批次标记为 rejected_placeholder，不要作为 final。
2. 保留已经通过的 image 生成资源：
   E:\参考图\麻将\项目\asset_work\processed\first_screen_p0_v2
3. 对缺失的 P0 资源重新走 image 生图或参考图编辑，不允许用程序几何图形补齐最终美术。
4. 透明 raw 资源使用纯洋红 #FF00FF 背景，之后按 POSTPROCESS_PLAN.md 做 alpha、alpha bbox normalization、尺寸标准化。
5. 补齐后的资源必须和 first_screen_p0_v2 里已通过资源保持一致：
   - 半写实雕刻质感
   - 古金描边
   - 暖象牙/深绿/陶土/午夜蓝配色
   - 同一光照方向
   - 相近线条粗细和视觉密度
6. 允许程序脚本做后处理、裁边、抠图、缩放、contact sheet、QA；不允许程序脚本生成最终符号/图标造型。

输出新批次：
raw:
E:\参考图\麻将\项目\asset_work\raw_generated\first_screen_p0_image_completion

processed:
E:\参考图\麻将\项目\asset_work\processed\first_screen_p0_image_completion

final merged candidate:
E:\参考图\麻将\项目\asset_work\processed\first_screen_p0_final_image

review:
E:\参考图\麻将\项目\asset_work\review\first_screen_p0_final_image

reports:
E:\参考图\麻将\项目\asset_work\reports\FIRST_SCREEN_P0_IMAGE_COMPLETION_REPORT.md
E:\参考图\麻将\项目\asset_work\reports\FIRST_SCREEN_P0_FINAL_IMAGE_ACCEPTANCE.md

最终验收必须包含：
- coverage 是否达到 FIRST_SCREEN_ASSET_SPEC.json 的 P0 全覆盖
- dimensions 是否全部匹配
- alpha 是否合格
- visible bbox 是否合理
- art direction consistency 是否通过
- 是否存在 placeholder_reject

只有在没有 blocking、没有 placeholder_reject 时，才允许结论为 ACCEPTED_FOR_INTEGRATION。
```

