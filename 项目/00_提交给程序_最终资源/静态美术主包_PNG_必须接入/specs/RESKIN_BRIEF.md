# Mahjong V2 Reskin Brief

Date: 2026-06-10

## 1. Goal

将当前 H5 麻将消除 demo 换皮为 West African / Nigerian-inspired 图腾消除牌游戏。

首轮目标不是最终商业精修版，而是跑通一条可复用的低成本验证流程：

1. 先做普通游戏页完整效果图。
2. 从效果图拆出首界面 UI 组件和牌面组件。
3. 批量生产首界面 PNG 资源。
4. 接入项目并调整 UI 尺寸。
5. 验证普通游戏页可交互、无资源错误、图腾牌可识别。

## 2. Inputs

Current game screenshots:

- `E:\参考图\麻将\截图\1.png`
- `E:\参考图\麻将\截图\2.png`
- `E:\参考图\麻将\截图\3.png`
- `E:\参考图\麻将\截图\4.png`
- `E:\参考图\麻将\截图\5.png`

Style references:

- `E:\参考图\麻将\风格参考\1.png`
- `E:\参考图\麻将\风格参考\2.png`
- `E:\参考图\麻将\风格参考\3.png`
- `E:\参考图\麻将\风格参考\4.png`

Project:

- `E:\参考图\麻将\项目\01_游戏源码_可运行Demo\mahjong-v2`
- Entry: `E:\参考图\麻将\项目\01_游戏源码_可运行Demo\mahjong-v2\index.html`

Old resource scan/reference:

- `E:\AI流程\mahjong-v2\PNG_ASSET_SPEC.html`

## 3. Locked Decisions

| Topic | Decision |
| --- | --- |
| First screen | Normal gameplay screen |
| Tile identity | Fully converted from traditional mahjong to totem tiles |
| Gameplay logic | Keep unchanged |
| Text strategy | Prefer icon/symbol UI; necessary text can become English |
| Quality mode | Low-cost usable validation version |
| Layout strategy | Medium changes allowed; preserve interaction structure |
| Display ratio | Fixed Transsion mainstream 20:9 portrait canvas (`9 / 20` in CSS); browser resize must not change game composition |
| Art style | Semi-real embossed stone / carved UI inspired by West African and Nigerian visual language |
| First output | 2 gameplay screen concepts: one conservative, one more stylized |
| Asset format | PNG first; WebP optimization later |
| Project code | Only modify UI/rendering layer after effect image is approved |
| Documents location | `E:\参考图\麻将\项目` |

## 4. Display Canvas Requirement

The reskin must target one fixed portrait composition, not a fluid page layout.

Target device family:

- Transsion mainstream Android phones across TECNO, Infinix, and itel.
- Practical common denominator: `720x1600` HD+ displays.
- Production scale: `1080x2400`, exactly the same `9:20` portrait ratio.

Canonical production canvas:

- Full-screen concept images: `1080x2400`.
- Full-screen background assets: `1080x2400`.
- Runtime game aspect ratio: `9 / 20`.
- Low-end physical resolution reference: `720x1600`.

Runtime behavior:

- The game should always be displayed inside a 9:20 container.
- If the browser viewport is wider than 9:20, the game is pillarboxed.
- If the browser viewport is taller/narrower than 9:20, the game is letterboxed or fit-contained.
- UI positions, tile layout, top HUD, bottom tray, modals, and menu composition should scale within the 9:20 container instead of reflowing to arbitrary viewport proportions.
- Outer browser background can be a solid dark/patterned fill, but it is not part of the playable composition.

Code implication:

- Replace the current "fill 100dvh with max-width" behavior with a fixed-ratio app shell.
- Use CSS like `aspect-ratio: 9 / 20` and a contain-style sizing formula.
- Generate and cut assets against the 9:20 canvas.

## 5. Recommended Working Name

Use one of these during concepting:

- `Tribal Tiles`
- `Savanna Tiles`

For the first pass, `Tribal Tiles` is recommended because it is short, readable, and communicates the gameplay object. If the final visual leans more savanna, sunset, tree, and nature, switch to `Savanna Tiles`.

## 6. Visual Direction

Core palette:

- Deep emerald / forest green for base surfaces.
- Antique gold for borders, active states, and reward accents.
- Ivory / warm stone for tile bodies.
- Clay orange / bronze for secondary accents.
- Midnight blue for alternate tile families and deep background contrast.

Material language:

- Carved stone or ivory tile blocks.
- Dark leather/wood panels with worn edges.
- Embossed gold trim.
- Subtle geometric textile pattern in backgrounds.
- Low-noise hand-crafted texture, not flat modern vector.

Motif language:

- Sun symbol.
- Leaf / branch.
- Drum.
- Shield.
- Shell / cowrie-like oval.
- Water wave.
- Mountain / chevron.
- Woven diamond / knot pattern.
- Mask allowed, but avoid realistic human face on small gameplay tiles.

Avoid:

- Traditional Chinese mahjong text/characters on the final skin.
- Religious-looking symbols or culturally sensitive sacred marks.
- Random "African" decoration without UI purpose.
- Overly bright neon, cyberpunk, candy colors, or pure flat vector style.
- Too much text.

## 7. Old Spec Reuse Policy

The old `PNG_ASSET_SPEC.html` is useful as a scan artifact, not as the new art direction.

Reusable:

- It confirms the old project had 34 tile types.
- It suggests a high-resolution tile source size of `120x144`, which matches the current tile aspect ratio.
- It lists useful UI categories: modal background, logo/icon, hint/home/pause/shuffle icons, play button background, title image.
- It proposes a sensible asset directory split: `assets/tiles`, `assets/ui`, `assets/text`.

Discarded:

- `tile_wan_*`, `tile_tong_*`, `tile_tiao_*`, `tile_feng_*`, `tile_jian_*` visual meanings.
- Traditional Chinese character prompts.
- Any plan that keeps `万/筒/条/东/南/西/北/中/发/白` as visible symbols.
- Text-as-image priority for Chinese labels.

New interpretation:

- Keep 34 logical IDs for engine compatibility.
- Replace the meaning of those IDs with 34 totem tile identities.
- Keep pair-matching behavior exactly the same.
- Do not reuse any old full-screen layout assumptions that depend on arbitrary viewport height; all screen compositions must be adapted to the new 9:20 canvas.

## 8. First Milestone Definition

First milestone is complete when:

1. The normal gameplay screen has an approved visual concept.
2. A first batch of gameplay assets is generated and cut:
   - background
   - top bar
   - bottom bar
   - tool icons
   - tile base
   - selected tile state
   - blocked tile treatment
   - first-pass 34 tile face identities or a smaller test subset mapped to gameplay
3. The project can run through `index.html`.
4. Level 1 can be played.
5. Hint, undo, shuffle, home, pause still respond.
6. No new console errors or missing asset paths.
7. Resizing the browser keeps the game area at 9:20 and does not distort or reflow the composition.

## 9. Suggested Gates

Gate A: Concept approval

- Review 2 gameplay screen concepts.
- Choose conservative or stylized direction.
- Decide whether to adjust tile readability before asset production.

Gate B: First asset batch approval

- Review tile family, top/bottom UI, icon readability.
- Reject only obvious mismatches; avoid fine polish at this validation stage.

Gate C: In-game verification

- Play the first screen.
- Confirm click areas, stacking, selection glow, blocked state, and tool buttons still work.

