# 给实现 Agent 的完整提示词：JSON Prefab + 游戏内可视化编辑器

将以下内容完整发送给新的实现 Agent。

---

你现在负责在现有 Mahjong V3 H5 游戏中实现一套 **JSON Prefab + 游戏内可视化 UI 编辑器**。

## 一、项目与文档

项目源码：

`E:\参考图\麻将\项目\01_游戏源码_可运行Demo\mahjong-v3`

必须先完整阅读：

1. `E:\参考图\麻将\项目\04_程序合入验收与返修计划\05_JSON_Prefab可视化编辑器设计规格_20260612.md`
2. `E:\参考图\麻将\项目\04_程序合入验收与返修计划\06_JSON_Prefab可视化编辑器实施计划_20260612.md`
3. `E:\参考图\麻将\项目\04_程序合入验收与返修计划\03_第二轮实机问题定点返修计划_20260612.md`
4. `E:\参考图\麻将\项目\01_游戏源码_可运行Demo\mahjong-v3\qa\browser_gate_report_20260612.md`

设计规格决定“做成什么样”，实施计划决定“按什么顺序做”。不得跳过文档直接自由发挥。

## 二、已确定需求

第一版只编辑现有组件：

- 位置
- 尺寸
- 锚点
- z-index
- 透明度
- 显示/隐藏
- 字号
- 字距
- gap
- 已允许组件的图片路径
- 棋盘安全参数

禁止：

- 新增组件
- 删除组件
- 复制组件
- 改按钮业务行为
- 改关卡结构
- 改麻将匹配逻辑
- 逐张拖动麻将牌

逻辑画布固定：

`360x800`

比例：

`9:20`

`720x1600` 和 `1080x2400` 只能是等比结果，不保存独立布局。

编辑器仅通过：

`index.html?editor=1`

普通 URL：

`index.html`

普通模式必须：

- 不加载 editor JS。
- 不加载 editor CSS。
- 不读取 editor localStorage 草稿。
- 不创建 editor DOM。
- 不拦截游戏操作。

## 三、推荐架构，必须遵守

采用：

**真实游戏 DOM + data-ui-id + 通用 RectTransform 覆盖层**

不要：

- 创建第二套游戏页面。
- 创建独立假预览。
- 把所有 UI 重写进 Canvas。
- 引入 React/Vue/游戏引擎。
- 为每个组件手写大量独立 CSS 变量。

现有 CSS 是基础 Prefab，JSON 只保存覆盖值。未被编辑的组件继续使用现有 CSS。

位置覆盖使用：

`element.style.translate`

禁止覆盖：

`element.style.transform`

因为现有 Logo、按钮、Tile、Modal 都依赖 transform 或 animation。

## 四、文件边界

严禁修改：

- `engine.js`
- `data.js`
- `assets\**\*`
- 现有关卡和存档语义

允许有限修改：

- `index.html`
- `ui.js`
- `main.js`
- `style.css`

允许新增：

```text
layout/
  layout-core.js
  layout-component-catalog.js
  layout-runtime.js
  layout-editor.js
  layout-editor.css
  ui-layout.default.json
  ui-layout.schema.json
  README.md

tests/
  layout-core.test.js

qa/
  layout_editor/
  layout_editor_acceptance.md
```

项目不是 Git 仓库。修改前先备份整个项目到：

`E:\参考图\麻将\项目\99_可能可删除_过程归档\代码返修备份\mahjong-v3_布局编辑器接入前_YYYYMMDD_HHMM`

验证备份文件数，并记录关键文件 SHA256。

## 五、执行方式

严格按实施计划 Task 1 到 Task 16 顺序执行。

不要一次性写完后再测试。每个 Task：

1. 阅读该 Task。
2. 写失败测试或明确基线。
3. 只实现该 Task。
4. 运行该 Task 的验证。
5. 更新进度记录。
6. 再进入下一 Task。

在没有真实验证证据时，不得使用：

- “完成”
- “通过”
- “应该正常”
- “看起来没问题”

## 六、核心接口

最终必须提供：

```js
window.UILayout = {
    init(app),
    mount(screenId, root),
    applyScreen(screenId),
    captureComponent(screenId, componentId),
    applyComponent(screenId, componentId),
    getActiveLayout(),
    setEditorDraft(draft),
    clearEditorDraft(),
    getBoardTuning(screenId),
    isEditorMode(),
    onChange(listener)
};
```

编辑器全局对象：

```js
window.UIEditor
```

只允许在 `?editor=1` 存在。

## 七、组件覆盖

必须覆盖所有当前核心页面：

- Menu
- Gameplay
- Daily
- Pause
- Victory
- Levels
- Settings
- Reset Confirmation
- Tip
- Combo
- Deadlock

组件 ID 必须使用设计规格中定义的命名。

所有可编辑 DOM 加：

```html
data-ui-id="screen.component"
```

不能使用易变化的 class 组合充当持久 ID。

## 八、编辑器功能

必须有：

- Screen selector
- Inspect / Interact 模式
- 组件树
- 点击真实组件选择
- 选择框
- 八方向 resize handles
- Anchor 3x3
- X/Y/Width/Height
- Lock Aspect
- Z Index
- Opacity
- Visible
- Font Size
- Letter Spacing
- Gap
- Asset Path
- Board tuning
- Undo / Redo
- Reset Component
- Reset Screen
- Reset All Draft
- Import JSON
- Export JSON
- 自动保存状态
- 错误提示

键盘：

- Arrow：1px
- Shift+Arrow：10px
- Ctrl/Cmd+Z：Undo
- Ctrl/Cmd+Shift+Z：Redo
- Esc：取消拖动
- Delete：不得删除组件，只提示不支持

## 九、草稿隔离

草稿 key：

`tribalTiles.uiLayoutDraft.v1`

编辑器偏好 key：

`tribalTiles.uiEditorPrefs.v1`

普通模式不得读取它们。

默认布局：

`layout/ui-layout.default.json`

普通模式只读取默认布局。

## 十、安全约束

导入 JSON 不允许提供：

- selector
- HTML
- CSS 字符串
- JavaScript
- 事件处理器
- 网络 URL
- data URL
- 父目录路径
- 磁盘绝对路径

禁止使用：

- `eval`
- `new Function`
- 将导入内容直接写入 `innerHTML`

资源路径只允许项目相对图片路径。

## 十一、棋盘约束

棋盘只允许编辑：

- boardArea rect
- tileMaxWidth
- zOffset
- totemWidthPercent
- totemHeightPercent
- boardPadding
- coveredOpacity

点击任意 tile，只能选择：

`game.tileFamily`

不得保存：

- tile instance id
- 单张 tile x/y
- typeId
- z 层级

不得修改 `engine.js` 或 `data.js`。

## 十二、编辑器视觉

编辑器是桌面生产工具，不是营销页。

布局：

- 左侧真实 360x800 游戏预览。
- 右侧紧凑组件树和属性面板。
- 使用清晰分区、数字输入、select、checkbox、slider。
- 不使用大 Hero、装饰卡片、渐变球或无意义说明文案。
- 组件面板可以滚动。
- 文本不得溢出。

移动端或窗口过小时显示：

`UI Editor requires a desktop browser.`

## 十三、验证要求

静态检查：

- 所有 JS `node --check`
- JSON 可解析
- UTF-8 无 BOM
- 无乱码
- layout-core 单元测试通过
- 无 eval/new Function

普通模式浏览器验收：

- 当前游戏视觉不回退。
- 编辑器 JS/CSS 没有请求。
- `window.UIEditor` 不存在。
- localStorage 草稿不影响普通模式。

编辑模式验收：

- 360x800 真实预览。
- 页面切换完整。
- Inspect 不误触游戏。
- Interact 可以操作游戏。
- 拖拽和输入框双向同步。
- resize handles 正确。
- 刷新恢复草稿。
- 导出、清空、导入后布局恢复。
- Board 不可逐牌编辑。
- Settings / Reset 等动态 DOM 重新渲染后覆盖仍存在。
- 移动端门禁正确。

截图必须保存到：

`qa/layout_editor/`

报告：

`qa/layout_editor_acceptance.md`

只有所有硬门禁通过，最终结论才允许写：

`EDITOR_ACCEPTED`

否则写：

`NEEDS_FIX`

并继续修复，不要把未完成部分交给用户。

## 十四、最终回复格式

最终回复必须包含：

1. 实际新增和修改的文件。
2. 编辑器打开 URL。
3. 普通游戏 URL。
4. 如何导出 JSON。
5. 如何将 JSON 固化为默认布局。
6. 自动测试命令与结果。
7. 浏览器验收报告路径。
8. 已知限制。

不要只给实现说明；必须实际完成、验证并落盘。
