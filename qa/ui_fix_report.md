# UI 绗簩杞畾鐐硅繑淇姤鍛?
鏃ユ湡锛?026-06-12

## 淇敼鏂囦欢

- `ui.js`
- `style.css`

## Task 1 - 鑿滃崟 9:20 鏋勫浘

- 鐩稿叧 selector锛歚.menu-screen`銆乣.menu-logo-wrap`銆乣.menu-actions`銆乣.btn-play`銆乣.menu-row`
- 淇敼鍐呭锛氭妸鑿滃崟浠庣旱鍚戞祦寮忔帓鐗堟敼涓虹粷瀵瑰畾浣嶅竷灞€锛孡ogo銆丳lay銆佷簩绾у叆鍙ｆ寜 9:20 姣斾緥鍒嗗尯锛涚Щ闄?Logo / Play 鍥惧眰鐨?`scale()` 瑙嗚鏀惧ぇ锛岄伩鍏嶈瑙夋墿澶т絾甯冨眬涓嶅崰浣嶉€犳垚閲嶅彔銆?- 楠岃瘉缁撴灉锛歚ui.js` 淇濇寔璇硶閫氳繃锛涙枃鏈壂鎻忕‘璁よ彍鍗曠浉鍏充簨浠?ID 鏈彉锛屼笖鑿滃崟鍥剧墖璧勬簮璺緞鏈敼銆?
## Task 2 - HUD 閲嶆帓

- 鐩稿叧 function锛歚renderGameScreen()`
- 鐩稿叧 selector锛歚.top-bar`銆乣.hud-main`銆乣.hud-slot`銆乣.hud-readout`銆乣#levelLabel`銆乣#timerDisplay`
- 淇敼鍐呭锛欻ome 涓?Pause 淇濇寔鐙珛澶栦晶锛涘乏渚т粎鍏冲崱鍥炬爣锛屼腑闂撮暱鏉夸粎鏄剧ず `LV. N` 涓?`M:SS` 涓ゆ鍗曡璇绘暟锛屽彸渚т粎 timer 鍥炬爣銆?- 楠岃瘉缁撴灉锛歚node --check ui.js` 閫氳繃锛涙枃鏈壂鎻忕‘璁?`LV.` 宸茶繘鍏?HUD 鏂囨锛屼笖 HUD 鏈啀浣跨敤鏃х殑涓績缁撴瀯閫夋嫨鍣ㄣ€?
## Task 3 - 搴曟爮璇箟鏄犲皠

- 鐩稿叧 function锛歚renderGameScreen()`
- 鐩稿叧 selector锛歚.tool-btn .tool-icon`
- 淇敼鍐呭锛氶噸鏂版槧灏勫簳鏍忓浘鏍囪祫婧愶紝`Hint -> icon_undo.png`锛宍Undo -> icon_shuffle.png`锛宍Mix -> tile_totem_23_cross_weave.png`锛涗繚鐣欏師鏈?`aria-label` 鍜屼簨浠?ID锛屼笉澧炲姞鍙鏂囧瓧銆?- 楠岃瘉缁撴灉锛氭枃鏈壂鎻忕‘璁や笁绉嶈祫婧愯矾寰勫凡鏇挎崲鍒颁綅锛宍btnHint`銆乣btnUndo`銆乣btnShuffle` 浠嶄繚鐣欍€?
## Task 4 - Modal 鐗╃悊涓婇檺

- 鐩稿叧 selector锛歚.modal`銆乣.modal.modal-compact`
- 淇敼鍐呭锛氱Щ闄?`max-width: 460px`锛屾敼涓洪殢 app 瀹藉害鎸?86% 缂╂斁锛屽苟琛?`max-height: 92%`锛屼繚鎸佷袱绉嶉潰鏉挎瘮渚嬩笉鍙樸€?- 楠岃瘉缁撴灉锛氭枃鏈壂鎻忕‘璁?`max-width: 460px` 宸蹭笉瀛樺湪锛沗node --check ui.js` 涓?`node --check main.js` 鍧囬€氳繃銆?
## Task 5 - Levels 鐪?4 鍒?
- 鐩稿叧 selector锛歚.level-grid`銆乣.level-node`
- 淇敼鍐呭锛氬皢鍏冲崱缃戞牸鏀逛负 `repeat(4, minmax(0, 1fr))`锛実ap 缂╁皬涓?`4 * scale`锛岃妭鐐瑰搴︿氦缁?grid 鍐冲畾锛岄伩鍏嶈鏈€灏忓搴﹀帇鎴?3 鍒椼€?- 楠岃瘉缁撴灉锛氭枃鏈壂鎻忕‘璁?4 鍒楀啓娉曞凡鐢熸晥锛屼笖 `min-width: 44px` 鐨勬棫绾︽潫宸茬Щ闄ゃ€?
## Task 6 - Settings 涓?Reset 纭

- 鐩稿叧 function锛歚showSettingsModal()`
- 鐩稿叧 selector锛歚.settings-modal`銆乣.settings-content`銆乣.reset-confirm-content`銆乣.reset-trigger`銆乣.reset-actions`銆乣#app.large-font`銆乣#app.high-contrast`
- 淇敼鍐呭锛歋ettings 鍙繚鐣?`Large Text` 涓?`Contrast`锛汻eset 鏀逛负闈㈡澘鍐呯‘璁ゆ€侊紝鎻愪緵 `CANCEL` / `RESET` 涓ゆ寜閽紝纭鍚庢墠璋冪敤 `onClearData()`锛屼笉鍐嶄娇鐢ㄦ祻瑙堝櫒鍘熺敓 `confirm()`銆傚悓鏃惰ˉ榻?`large-font` 涓?`high-contrast` 鐨勭湡瀹炴牱寮忚鐩栵紝纭繚鍒囨崲鍚庡彲瑙佷笖涓嶇牬鐗堛€?- 楠岃瘉缁撴灉锛氭枃鏈壂鎻忕‘璁?`confirm(` 宸茬Щ闄わ紱`large-font`銆乣high-contrast` 閫夋嫨鍣ㄥ凡鍔犲叆锛汻eset 纭鎬佷笌鍥為€€閫昏緫宸茶惤鍦般€?
## Task 7 - 璇硶銆佺紪鐮佷笌绂佹椤规壂鎻?
- 璇硶妫€鏌ワ細
  - `node --check "E:\鍙傝€冨浘\楹诲皢\椤圭洰\01_娓告垙婧愮爜_鍙繍琛孌emo\mahjong-v3\ui.js"` 閫氳繃
  - `node --check "E:\鍙傝€冨浘\楹诲皢\椤圭洰\01_娓告垙婧愮爜_鍙繍琛孌emo\mahjong-v3\main.js"` 閫氳繃
- 缂栫爜妫€鏌ワ細
  - `ui.js`锛歎TF-8锛屾棤 BOM锛屾棤 U+FFFD
  - `style.css`锛歎TF-8锛屾棤 BOM锛屾棤 U+FFFD
  - `qa/ui_fix_report.md`锛歎TF-8锛屾棤 BOM锛屾棤 U+FFFD
- 绂佹椤规壂鎻忥細
  - `confirm(`锛氭湭鍛戒腑
  - `max-width: 460px`锛氭湭鍛戒腑
  - `hud_center_plate`锛氭湭鍛戒腑
  - `icon_hint.png`锛氭湭鍛戒腑

## 鏈畬鎴愰」涓庡墿浣欓闄?
- Task 8 鐨勬祻瑙堝櫒瀹炴満瑙嗚闂ㄧ鐢变富绾跨▼楠屾敹锛屾湰绾跨▼鏈仛鈥滃凡閫氳繃鈥濆绉般€?- 浠嶉渶涓荤嚎绋嬪湪 `360x800` 涓?`720x1600` 涓婄‘璁よ彍鍗曟瀯鍥俱€丠UD銆乵odal銆丩evels 鍥涘垪涓?Reset 闈㈡澘鐨勬渶缁堣瑙夋晥鏋溿€?

## Task 9 - Reset 纭鎸夐挳鍘嬫墎淇

- 鐩稿叧 selector锛歚.reset-confirm-content .modal-btns.reset-actions`銆乣.reset-confirm-content .btn-modal`銆乣.reset-confirm-content .btn-modal.danger`
- 淇敼鍐呭锛氬皢 Reset 纭椤电殑 `CANCEL / RESET` 浠庢í鍚戝弻鍒楁敼涓虹旱鍚戝叏瀹芥帓鍒楋紝鎸夐挳缁勬敼涓哄崟鍒楃珫鎺掑苟鍗犳弧闈㈡澘鍐呭锛涘悓鏃朵繚鐣欐寜閽師鏈夋瘮渚嬬害鏉燂紝骞跺崟鐙妸 `RESET` 鏂囨鎭㈠涓洪珮瀵规瘮娴呰壊瀛椾笌闃村奖锛岄伩鍏嶅帇鎵佸悗鍙鎬т笅闄嶃€?- 楠岃瘉缁撴灉锛歚node --check` 宸茬‘璁?`ui.js` 涓?`main.js` 鍧囧彲閫氳繃锛沗style.css` 澶撮儴妫€鏌ヤ负 UTF-8 鏃?BOM銆?- 灏氬緟 Task 10 娴忚鍣ㄥ娴?
