# 投稿指南

简体中文 | [English](../en/submission-guide.md)

这个仓库欢迎社区制作的 Codex pet 投稿。

## 目标

每份投稿都应该：

- 容易审核
- 容易预览
- 容易复用
- 清楚标明作者和许可证

## 推荐目录结构

```text
pets/
└── pet-slug--author-slug/
    ├── submission.json
    ├── pet.json
    ├── spritesheet.webp
```

pet 目录只应该包含这三个文件。

## 选择 v1 或 v2

| 版本 | Spritesheet            | 运行时字段                            | 内容                         |
| ---- | ---------------------- | ------------------------------------- | ---------------------------- |
| v1   | `1536x1872`，8 × 9 格  | 省略 `spriteVersionNumber` 或设为 `1` | 9 行标准动作                 |
| v2   | `1536x2288`，8 × 11 格 | 设置 `spriteVersionNumber: 2`         | 9 行标准动作加 16 个环视方向 |

保留或修复旧版 v1 宠物时使用 [.agents/skills/hatch-pet-v1](../../.agents/skills/hatch-pet-v1)；创建 v2 宠物或执行 v1 → v2 升级时使用 [.agents/skills/hatch-pet-v2](../../.agents/skills/hatch-pet-v2)。

升级本地已安装的 v1 宠物时，打开 Codex 的**设置 → 宠物**并点击**更新**，然后审核 Hatch Pet 的输出。升级会保留通过审核的标准动作行、增加方向行并更新本地 `pet.json`，但不会自动向本仓库投稿。

## 必填信息

请提供：

- `pet-slug--author-slug` 格式的目录名
- 主分类
- pet 名称
- 作者名或 handle
- 简短描述
- 来源链接或原始发布链接
- 资源许可证

## 审核要求

- `pet.json` 必须可以安装
- `pet.json` 的 `id` 必须与目录名一致
- `spriteVersionNumber` 必须与图集尺寸匹配
- `spritesheet.webp` 应作为 Codex 运行时资源一起提交
- 仓库侧元数据放在 `submission.json`，不要塞进 `pet.json`
- 自动生成的预览材料放在 `assets/previews/<pet-id>/`
- 自动生成的预览图、QA 输出、参考图和 README 文件不要放进 `pets/<pet-id>/`
- 强烈建议一个 PR 只提交一个 pet

## 预览图生成

预览图会从 `spritesheet.webp` 自动生成：

```bash
python -m pip install -r requirements.txt
npm run previews
```

它会生成：

```text
assets/previews/<pet-id>/contact-sheet.png
assets/previews/<pet-id>/gifs/<state>.gif
```

维护者和 CI 会在合并后运行同一条命令。贡献者 PR 不应提交生成的预览二进制。
所有动作 GIF 都会使用相同像素尺寸：`384x416`。

## 快速安装检查

提交 PR 前，请确认这个 pet 可以安装：

```bash
npm run install:pet -- pet-slug--author-slug --codex-home /tmp/codex-pet-test
```

命令应该生成：

```text
/tmp/codex-pet-test/pets/<pet-id>/
├── pet.json
└── spritesheet.webp
```

PR 合并后，用户不需要 clone 仓库，也可以直接安装：

```bash
curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- pet-slug--author-slug
```

## 资源建议

- 必填文件名固定为 `submission.json`、`pet.json` 和 `spritesheet.webp`
- 提交最终运行时 WebP，不要提交中间 PNG 或 Hatch Pet 运行目录
- 不要提交生成预览；维护者和 CI 会根据 spritesheet 自动生成
- 投稿前逐一审核所有标准动作；v2 还要审核完整的 16 方向循环

## 说明

随着 Codex pet 生态稳定，文件校验规则可能会继续演进。

目前比起强制复杂格式，更重要的是保持一致、清楚、可安装。
