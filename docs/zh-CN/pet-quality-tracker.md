# 宠物质量审查与升级台账

这份文档是仓库的人工质量索引，用来回答三个问题：哪些宠物已经人工审查或修复过，哪些仍需逐只复核，哪些需要进入 v2 升级排期。

它不替代 `pet.json`、`submission.json` 或 CI。元数据与版本以 pet 目录中的文件为准；CI 负责结构和尺寸校验；本台账只记录视觉判断、升级决策及其证据。

## 当前快照

- 快照日期：2026-07-19
- 对应仓库提交：`4421036`
- 宠物总数：151
- v1：136
- v2：15
- 有历史修复或复核证据：85
- 待建立人工基线：66
- 本轮透明边缘逐只复核通过：61
- 本轮透明边缘逐只复核需修复：0
- 透明边缘未审查：90

“待建立人工基线”不等于图片有问题，只表示仓库里还没有足够明确、可追溯的逐只审查记录。

## 状态定义

- `已修复并复核`：曾针对边缘、动作、方向、尺寸或元数据做过修复，并留下提交证据。
- `收录时已复核`：收录时完成了基本视觉检查，但还没有独立的完整复审记录。
- `待基线复核`：尚未留下可追溯的人工审查结论。
- `阻断`：存在会影响安装、显示或动作语义的问题，修复前不应视为通过。
- `边缘已审查：通过`：已逐只在浅色、中灰和黑色背景上查看当前图集，没有发现可见的色键残边、底色块或游离残片。
- `边缘已审查：需修复`：已经逐只查看并确认存在边缘或透明底问题，修复并再次人工确认前不能改为通过。
- `边缘未审查`：没有完成当前图集的逐只多背景检查；历史修复记录、CI 或颜色检测脚本均不能代替这个状态。
- `v2 已完成`：图集和元数据均为 v2，并包含 16 个环视方向。
- `v2 候选`：当前仍是有效的 v1，但有明确理由进入升级排期。

任何 `spritesheet.webp` 发生变化后，原有视觉状态自动失效，应重新审查并更新证据。只修改文案或不影响图集的元数据时，可以保留视觉状态，但仍需重新运行结构校验。

## 审查依据

逐只复核时必须检查以下内容：

1. **包结构**：pet 目录只有 `submission.json`、`pet.json` 和 `spritesheet.webp`；ID、路径、版本和图集尺寸一致。
2. **主体一致性**：各行动作中的角色、服装、发型、配色和标志性配件保持一致，不出现换人或关键特征丢失。
3. **尺寸与基线**：角色在各行中的视觉高度、脚底基线和留白稳定，不突然缩小、放大、漂移或被裁切。
4. **动作语义**：idle、waving、running、waiting、review 等标准动作易于辨认，帧间衔接自然。
5. **跑步方向**：左右方向与运行时语义一致，左右脚和手臂有自然交替，不能只平移同一姿势。
6. **透明边缘**：分别在棋盘格、深色和浅色背景下检查，不残留绿、青、紫、粉或其他色键背景的轮廓。
7. **保色原则**：只处理与背景连通或有明确色键证据的残留像素，禁止按颜色全局删除，以免破坏角色本身的绿色、紫色或粉色细节。
8. **v2 环视**：16 个方向按顺时针顺序连续，四个基准方向正确，相邻方向没有主体突变、镜像错误或明显跳帧。
9. **来源与署名**：作者、来源类型、使用说明和非商业限制等信息清楚，修复后继续保留原作者署名。

结构校验通过只能证明文件格式正确，不能替代第 2–8 项人工视觉审查。

## 证据要求

一次有效的台账更新至少要写清：

- 宠物 ID 和审查日期
- 审查范围，例如“全部 9 行”“running 行”“v2 环视 16 帧”或“透明边缘”
- 结论和仍存在的风险
- 对应 commit、PR、issue 或本地 QA 记录
- 审查人

推荐记录格式：

```text
- pet-id | 2026-07-19 | 已修复并复核 | running + 透明边缘 |
  结论：左右脚交替正确，深浅背景无色键残边；证据：commit abc1234；审查人：@name
```

本地 contact sheet、视频和拆帧图仍属于过程产物，不放入 pet 目录。长期证据优先使用 commit、PR 或 issue；确有必要保留图片时，应放在专门的文档资源目录，而不是最终 pet 包内。

## 升级规则

v1 仍是受支持格式，不因版本较旧就自动判定为不合格。满足以下任一条件时，可标为 `v2 候选`：

- 用户明确需要环视方向能力。
- 宠物使用频率较高，且有可靠参考图或可编辑源素材。
- 原图集已经需要大幅重做，顺便升级的成本明显低于以后再次返工。
- 维护者或原作者明确提出升级计划。

升级完成后必须同时满足：`spriteVersionNumber: 2`、`1536x2288`、8 列 × 11 行，以及完整复核 16 个环视方向。当前未为任何 v1 自动指定升级优先级；先完成待基线复核，再根据真实问题和使用需求排期。

## 透明边缘复核记录

2026-07-19 已对 61 只宠物完成本轮逐只复核。每只宠物都单独打开当前 `spritesheet.webp`，分别合成到白色、中灰和黑色背景上查看全部动作行；颜色检测脚本没有被用作通过结论，也没有对任何宠物执行批量清色。

本轮结论：61 只通过，当前已审查范围内没有待修复项。银狼的紫色和蓝色发梢、昔涟的粉色和青色服装、绿色角色及其他角色本色均按主体细节保留，没有因为颜色相似而判作背景残留。

本轮已完成修复：

- `furina--lingxiaotian`：逐帧删除 running-left 行第 1–5 帧和第 6 帧左侧与主体完全断开的游离碎片；白色、中灰和黑色背景复核通过，角色本身的蓝色发梢、帽饰和白色轮廓均保留。证据：本提交 `fix(pet): clean Furina running-left fragments`。
- `moomew-coder-cat--ping`：逐帧移除原始图集自带的不透明白色贴纸边，并单独删除 waving 第 1、3 帧残留的白底竖块；全部 57 个使用帧完成白色、中灰和黑色背景复核，白毛、白爪、道具、高光和状态特效均保留。证据：本提交 `fix(pet): remove MooMew white matte`。
- `yume-boundary--andy-meow`：逐帧移除浅色底边与 running-left、review 行的游离竖向残片；对人工确认的绿色色键污染使用相邻黑紫发色局部校正并保留原 alpha，没有全局删除绿色。全部 57 个使用帧完成三背景复核，紫色头发高光保留。证据：本提交 `fix(pet): clean Yume matte and green spill`。
- `gintoki-pixel--yuu-m`：仅移除 running-left 第 7 帧右侧与主体完全断开的重复头发残片，共 364 个可见像素；其余图集解码像素未改变，全部 9 行完成白色、中灰和黑色背景复核，银蓝头发和深紫描边均保留。证据：本提交 `fix(pet): remove Gintoki detached hair fragment`。

本轮新增逐只复核通过：

- `aiko--chenxin-dlut`、`anya--chenxin-dlut`、`chen--chenxin-dlut`、`chibi-rei-pet--bendy`、`conan--chenxin-dlut`：逐只查看全部 9 行，并在白色、中灰和黑色背景上确认透明边缘、浅色主体和深色轮廓均无可见残边、底色块或游离残片。证据：本提交 `docs: record pet edge review progress`。

当前已审查范围内没有仍待修复的宠物；未审查的 90 只仍需按相同方法逐只建立结论。

## 快速索引

### 边缘已审查通过：v2（7）

- `dai-dai-nai-you--1wphantom`、`kimoju--andiac`、`luna-angel-cat--neve`、`miu-meo--lemon-z`、`niumou--jarvis-2`：批次边缘和动作复核，证据 `663794d`。
- `misaka-network--ldl1234`：v2 修复与复核，证据 `f22a370`。
- `youmu--ai-generated`：方向修复与使用说明更新，证据 `e939f69`。

### 边缘已审查通过：v1（54）

- `apu--xchangee`、`arlecchino--lingxiaotian`、`black-swan--lingxiaotian`、`bocchi--lingxiaotian`、`bubu--gbn666`、`claude--xiangking`、`codenono--dq02`、`corgi-companion--cxian0928-afk`、`cyrene--lingxiaotian`、`diaoyi-baobao--d1a0y1bb`、`firefly--lingxiaotian`、`frankie--aygunvarol`、`frieren--lingxiaotian`、`hu-tao--lingxiaotian`、`kamisato-ayaka--lingxiaotian`、`katana-cheems--thankyou-cheems`、`mai--dwdestiny`、`miku--lingxiaotian`、`mimi--spacebody`、`nahida--lingxiaotian`、`navia--lingxiaotian`、`night-neko--netizenxuan`、`paimon--lingxiaotian`、`panda--jason-bai`、`raiden-shogun--lingxiaotian`、`robin--lingxiaotian`、`ruan-mei--lingxiaotian`、`silver-wolf--lingxiaotian`、`sparkle--lingxiaotian`、`tian-hua-hua--d1a0y1bb`、`wally--wally025`、`xian-xiao-lu--qingyunagi`、`yier--gbn666`、`yuanzai--gaming33`：透明边缘修复批次，证据 `1b537c1`。
- `buba--yurcek`、`capybara-lulu--jiushu`、`goblin--rkwap`、`happynailong--aquaxyy`、`linnea--nyakku-shigure`、`mellow-duck--sally-entr`、`xiaoba-cat--jack`：批次边缘和动作复核，证据 `663794d`。
- `doro--lingxiaotian`：running 方向修复，证据 `d15d116`。
- `furina--lingxiaotian`：running-left 游离碎片逐帧修复并完成三背景复核，证据：本提交 `fix(pet): clean Furina running-left fragments`。
- `mahiro--lingxiaotian`、`reimu--lingxiaotian`：动作和预览修复，证据 `a157ca8`。
- `moomew-coder-cat--ping`：不透明白色贴纸边和局部白底竖块逐帧修复并完成三背景复核，证据：本提交 `fix(pet): remove MooMew white matte`。
- `yume-boundary--andy-meow`：浅色底边、绿色色键污染和游离竖向残片逐帧修复并完成三背景复核，证据：本提交 `fix(pet): clean Yume matte and green spill`。
- `isekaijoucho--siiverash`：透明边缘和动画修复，证据 `3a2f8a6`。
- `aiko--chenxin-dlut`、`anya--chenxin-dlut`、`chen--chenxin-dlut`、`chibi-rei-pet--bendy`、`conan--chenxin-dlut`：2026-07-19 逐只完成全部 9 行三背景透明边缘复核，证据：本提交 `docs: record pet edge review progress`。
- `gintoki-pixel--yuu-m`：running-left 第 7 帧重复头发残片已定点移除并完成全部 9 行三背景复核，证据：本提交 `fix(pet): remove Gintoki detached hair fragment`。

### 边缘已审查需修复：v1（0）

- 无。

### 收录时已复核、边缘未审查：v1（24）

以下宠物在像素动漫批次收录时完成了基本结构和视觉复核，证据 `5811496`。它们仍应在后续独立复审中重新检查全部动作和深浅背景边缘。

- `ganyu--chenxin-dlut`、`giyu-tomioka--wangfan002`、`inosuke-hashibira--wangfan002`、`kid--chenxin-dlut`
- `klee--chenxin-dlut`、`lappland--chenxin-dlut`、`makimamini--1sh1ro`、`makisekurisu--m1gr4ine`、`march-7th--chenxin-dlut`、`muichiro-tokito--wangfan002`、`new-covenant-exusiai--chenxin-dlut`、`nezuko-kamado--wangfan002`、`phoebe--chenxin-dlut`、`regulus-star-antimony--chenxin-dlut`
- `saber--petdex-zhenyou-ling`、`shinchan--chenxin-dlut`、`shinobu-kocho--wangfan002`、`sonetto--chenxin-dlut`、`tanjiro-kamado--wangfan002`、`vertin--chenxin-dlut`、`yoimiya--chenxin-dlut`、`zani--chenxin-dlut`、`zenitsu-agatsuma--wangfan002`、`zero-two--mingqingmozhao`

### 待基线复核、边缘未审查：v2（8）

- `gudong--rank`、`joker--oytyo`、`koukou-penguin--hoody`、`maodie--octane0411`
- `minty--somnusochi`、`naiwa--sandytruant`、`xiaomai--brian-3`、`zhengyin--noonwake`

### 待基线复核、边缘未审查：v1（58）

- `acheron--lingxiaotian`、`aemeath-mini--cunuo`、`asuka--maxg24`、`azuma--tairazuma`、`becky--natewanggg`、`castorice--lingxiaotian`、`chispa--giiilberto-nm`、`desk-otter--zihualiu1997`、`diana--am`、`diandian--lllucasxu`
- `dimo-stand--god-wu`、`dnf-female-ammo--qunboo`、`doraemon--xueshi`、`dudu-bubu--clembuilds`、`duodong--froggie`、`elaina--nyakku-shigure`、`ella-wave--sehjk`、`eren--ash-sw`、`feibi--vanfff`、`feixiao--lingxiaotian`
- `fleta--natewanggg`、`gojo--lilokhalikfa`、`gpt-muse--opask`、`guga--circus`、`hajimi--zeyuwang1999`、`hana2--initiatione`、`ikaros--icarus-alpha`、`jiji--yena`、`kid-goku--julianhuang`、`levi--emrecb`
- `little-black-mage--libertis`、`little-sheep--mingdong`、`luffy-gear-5--jordsshmords1`、`lulu--yogazz`、`mihari--hyoni1129`、`mika--rotl24`、`mikoto--lingxiaotian`、`miyabi--eric-terminal`、`nimbus--soraberu`、`rem--l1`
- `rinami--siiverash`、`rook--klubbyte`、`roxy-pixel--gravity`、`ruruka--ltmcliao-cmyk`、`saki--rookie-09`、`shian-helper--mistyshen`、`spellbook--seymour`、`starcorn--alterhq`、`tangdouren--carl312`、`teddy--danieloleary`
- `tingyun--lingxiaotian`、`tiny-crt--chochou`、`tuantuan--jbbom`、`twinkle-twinkle--twinkletwinkle`、`usachi--jack`、`violet--lazenca`、`yuzubou--keseras34938976`、`zichao-xiong--z-kzhang`

## 每轮维护流程

1. 从 `待基线复核` 中选择一只宠物，并生成 contact sheet 与动作预览。
2. 按本页“审查依据”逐项检查，不用单一颜色阈值批量清理所有宠物。
3. 有问题时只修复证据明确的帧或像素区域，再次检查棋盘格、深色和浅色背景。
4. 运行 `npm run validate:pr`；涉及生成页面时再运行 `npm run previews`、`npm run readmes`、`npm run validate` 和 `npm run lint`。
5. 提交后，把宠物移动到相应状态，并补充日期、范围、结论、证据和审查人。
6. 新增宠物时必须同步加入本台账；删除宠物时同步移除；图集变化时必须重新进入复核状态。

每轮只处理少量宠物，优先保证逐只判断可追溯，而不是用无法区分角色本色与背景色键的全仓批处理换取速度。
