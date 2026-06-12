# Prompt For The Other Agent

## Superseded Guidance Notice

This prompt was useful during the first-screen production stage. Future agents should also read the reusable playbook before following it:

```text
E:\参考图\麻将\项目\RESKIN_WORKFLOW_PLAYBOOK_20260611\02_AGENT_ORCHESTRATION_RULES.md
E:\参考图\麻将\项目\RESKIN_WORKFLOW_PLAYBOOK_20260611\03_ASSET_PRODUCTION_QA_CHECKLIST.md
E:\参考图\麻将\项目\RESKIN_WORKFLOW_PLAYBOOK_20260611\06_FUTURE_AGENT_PROMPTS.md
```

Additional hard rule learned later:

- Do not mark assets accepted without visual QA sheets on white, dark, checkerboard, and in-context backgrounds.
- Do not rely only on exact `#FF00FF`; broad pink/purple residue must be checked.
- If a delivery package is revoked, create a new V2 clean package after repair.

Use this prompt in the image-generation window after it finishes the current raw samples. It does not require interrupting the current generation immediately.

```text
请继续当前首屏 P0 小批量资源流程，但先读取新增后处理计划：

E:\参考图\麻将\项目\POSTPROCESS_PLAN.md
E:\参考图\麻将\项目\PROCESS_FIRST_SCREEN_ASSETS_SCRIPT_SPEC.md
E:\参考图\麻将\项目\FIRST_SCREEN_ASSET_SPEC.json
E:\参考图\麻将\项目\FIRST_SCREEN_CUTTING_PLAN.md
E:\参考图\麻将\项目\IMAGE_PROMPT_PACK.md

注意：
1. image 生成结果只视为 raw，不是最终游戏资源。
2. 原图尺寸不需要精确，但最终 processed PNG 必须严格匹配 FIRST_SCREEN_ASSET_SPEC.json。
3. 透明资源最终必须有 alpha 通道。
4. 从现在开始，透明资源的 raw 图统一使用纯洋红 #FF00FF 背景，不再使用绿色背景。
5. 已经生成的绿色背景样张可以保留，作为 legacy raw input，后处理时用边缘连通抠图尝试处理；如果伤到主体，重生洋红背景版。
6. tile symbol 和 tool icon 不允许带黄色底板、按钮底座、圆形徽章、整张牌底。它们必须是“主体符号 only”。
7. 背景类资源不抠图，只 resize/crop 到目标尺寸。
8. 不改游戏代码，不复制到 mahjong-v2 项目目录。
9. 注意：PNG 外框尺寸正确不代表视觉尺寸正确。去底后的透明边如果过大，导入游戏会显得主体偏小。
10. 所有透明资源都要做 alpha bbox normalization：先按 alpha bbox 裁出主体，再按目标安全留白缩放回精确尺寸画布。
11. tile symbol 必须额外生成一张合成预览：把符号放到 tile_base_ivory.png 上检查实际游戏内大小。
12. 禁止用程序图形/Pillow/CSS/SVG/Canvas 几何图形补齐最终美术资源。程序图形只能作为临时占位、mask、contact sheet 或调试辅助。
13. 如果缺资源，应标记 missing_source 并走 image 生图/参考图编辑补齐；不能因为尺寸和 alpha 正确就接受程序占位图。

接下来任务：
- 完成当前 6 张代表图腾牌 raw 样张收集。
- 不要把 raw 图直接当最终文件。
- 若有明显语义不确定的 `mask_mark` 和 `cowrie_shell`，请先输出对照预览并让我确认。
- 然后根据 POSTPROCESS_PLAN.md 生成或设计后处理结果：
  E:\参考图\麻将\项目\asset_work\processed\first_screen_p0
  E:\参考图\麻将\项目\asset_work\reports\first_screen_p0_postprocess_report.md
  E:\参考图\麻将\项目\asset_work\reports\first_screen_p0_postprocess_report.json
  E:\参考图\麻将\项目\asset_work\review\first_screen_p0\review_contact_sheet.png
- 报告中必须包含每张透明资源的 visible bbox 占比和是否存在 large_alpha_margin / subject_too_small 警告。

如果暂时无法运行后处理脚本，请至少按 PROCESS_FIRST_SCREEN_ASSETS_SCRIPT_SPEC.md 生成脚本草案和执行说明，不要继续全量 34 张生产。
```
