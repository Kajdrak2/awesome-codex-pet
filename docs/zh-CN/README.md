<div align="center">

# Awesome Codex Pet

简体中文 | [English](../../README.md)

![pets: 59](https://img.shields.io/badge/pets-59-2ea44f) ![categories: 6](https://img.shields.io/badge/categories-6-0969da) ![languages: en | zh--CN](https://img.shields.io/badge/languages-en%20%7C%20zh--CN-8250df) ![code: MIT](https://img.shields.io/badge/code-MIT-111111) ![assets: CC BY--NC 4.0](https://img.shields.io/badge/assets-CC%20BY--NC%204.0-f97316) ![install: one command](https://img.shields.io/badge/install-one%20command-111111) [![Pet previews](https://github.com/legeling/awesome-codex-pet/actions/workflows/pet-previews.yml/badge.svg)](https://github.com/legeling/awesome-codex-pet/actions/workflows/pet-previews.yml)

[**🌐 在线画廊**](https://awesome-codex-pet.pages.dev) · [**⚡ 安装指南**](https://awesome-codex-pet.pages.dev/install) · [**📖 投稿指南**](https://awesome-codex-pet.pages.dev/guide)

![Awesome Codex Pet 封面](../../assets/cover/awesome-codex-pet-cover.png)

</div>

社区精选的 Codex 小宠物画廊。在[在线画廊](https://awesome-codex-pet.pages.dev)里浏览动画，一条命令完成安装，通过 GitHub 提交你自己的宠物。

## 亮点

- **一条命令安装** — 不需要克隆仓库，macOS / Linux / Windows 全平台支持
- **在线画廊** — [awesome-codex-pet.pages.dev](https://awesome-codex-pet.pages.dev) 提供动画预览、筛选、浏览/安装统计
- **GitHub 原生投稿** — 提 issue 或 PR，剩下的全自动
- **明确许可** — 代码 MIT，宠物资源 CC BY-NC 4.0

每只宠物都是一个很小的可分享包：

```text
pets/<pet-slug>--<author-slug>/
├── submission.json
├── pet.json
└── spritesheet.webp
```

预览图会作为本地或 CI 构建产物生成到 `assets/previews/<pet-id>/`，不会塞进宠物目录。

## 快速安装

无需 clone，按你的系统选一条命令：

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- firefly--lingxiaotian
```

```powershell
# Windows PowerShell
powershell -NoProfile -ExecutionPolicy Bypass -Command "iwr -UseB https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.ps1 | iex; Install-CodexPet firefly--lingxiaotian"
```

```bash
# 任何能跑 Node.js 的环境
npx awesome-codex-pet firefly--lingxiaotian
```

列出可安装的宠物：

```bash
curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- --list
```

默认安装位置：

- macOS / Linux：`~/.codex/pets/<pet-id>/`
- Windows：`%USERPROFILE%\.codex\pets\<pet-id>\`

可通过 `CODEX_HOME` 自定义安装路径，或者设置 `AWESOME_CODEX_PET_NO_STATS=1` 关闭匿名安装计数。

## 宠物收录

### 动漫人物

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/firefly--lingxiaotian">Firefly</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- firefly--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/firefly--lingxiaotian/gifs/idle.gif" alt="Firefly idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/firefly--lingxiaotian/gifs/waving.gif" alt="Firefly waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/firefly--lingxiaotian/gifs/running.gif" alt="Firefly running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/firefly--lingxiaotian/gifs/waiting.gif" alt="Firefly waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/firefly--lingxiaotian/gifs/review.gif" alt="Firefly review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/acheron--lingxiaotian">Acheron</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- acheron--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/acheron--lingxiaotian/gifs/idle.gif" alt="Acheron idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/acheron--lingxiaotian/gifs/waving.gif" alt="Acheron waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/acheron--lingxiaotian/gifs/running.gif" alt="Acheron running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/acheron--lingxiaotian/gifs/waiting.gif" alt="Acheron waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/acheron--lingxiaotian/gifs/review.gif" alt="Acheron review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/arlecchino--lingxiaotian">Arlecchino</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- arlecchino--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/arlecchino--lingxiaotian/gifs/idle.gif" alt="Arlecchino idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/arlecchino--lingxiaotian/gifs/waving.gif" alt="Arlecchino waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/arlecchino--lingxiaotian/gifs/running.gif" alt="Arlecchino running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/arlecchino--lingxiaotian/gifs/waiting.gif" alt="Arlecchino waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/arlecchino--lingxiaotian/gifs/review.gif" alt="Arlecchino review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/black-swan--lingxiaotian">Black Swan</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- black-swan--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/black-swan--lingxiaotian/gifs/idle.gif" alt="Black Swan idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/black-swan--lingxiaotian/gifs/waving.gif" alt="Black Swan waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/black-swan--lingxiaotian/gifs/running.gif" alt="Black Swan running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/black-swan--lingxiaotian/gifs/waiting.gif" alt="Black Swan waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/black-swan--lingxiaotian/gifs/review.gif" alt="Black Swan review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/castorice--lingxiaotian">Castorice</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- castorice--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/castorice--lingxiaotian/gifs/idle.gif" alt="Castorice idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/castorice--lingxiaotian/gifs/waving.gif" alt="Castorice waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/castorice--lingxiaotian/gifs/running.gif" alt="Castorice running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/castorice--lingxiaotian/gifs/waiting.gif" alt="Castorice waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/castorice--lingxiaotian/gifs/review.gif" alt="Castorice review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/cyrene--lingxiaotian">Cyrene</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- cyrene--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/cyrene--lingxiaotian/gifs/idle.gif" alt="Cyrene idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/cyrene--lingxiaotian/gifs/waving.gif" alt="Cyrene waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/cyrene--lingxiaotian/gifs/running.gif" alt="Cyrene running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/cyrene--lingxiaotian/gifs/waiting.gif" alt="Cyrene waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/cyrene--lingxiaotian/gifs/review.gif" alt="Cyrene review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/doro--lingxiaotian">Doro</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- doro--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/doro--lingxiaotian/gifs/idle.gif" alt="Doro idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/doro--lingxiaotian/gifs/waving.gif" alt="Doro waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/doro--lingxiaotian/gifs/running.gif" alt="Doro running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/doro--lingxiaotian/gifs/waiting.gif" alt="Doro waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/doro--lingxiaotian/gifs/review.gif" alt="Doro review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/frieren--lingxiaotian">Frieren</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- frieren--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/frieren--lingxiaotian/gifs/idle.gif" alt="Frieren idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/frieren--lingxiaotian/gifs/waving.gif" alt="Frieren waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/frieren--lingxiaotian/gifs/running.gif" alt="Frieren running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/frieren--lingxiaotian/gifs/waiting.gif" alt="Frieren waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/frieren--lingxiaotian/gifs/review.gif" alt="Frieren review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/furina--lingxiaotian">Furina</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- furina--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/furina--lingxiaotian/gifs/idle.gif" alt="Furina idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/furina--lingxiaotian/gifs/waving.gif" alt="Furina waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/furina--lingxiaotian/gifs/running.gif" alt="Furina running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/furina--lingxiaotian/gifs/waiting.gif" alt="Furina waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/furina--lingxiaotian/gifs/review.gif" alt="Furina review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/hu-tao--lingxiaotian">Hu Tao</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- hu-tao--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/hu-tao--lingxiaotian/gifs/idle.gif" alt="Hu Tao idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/hu-tao--lingxiaotian/gifs/waving.gif" alt="Hu Tao waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/hu-tao--lingxiaotian/gifs/running.gif" alt="Hu Tao running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/hu-tao--lingxiaotian/gifs/waiting.gif" alt="Hu Tao waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/hu-tao--lingxiaotian/gifs/review.gif" alt="Hu Tao review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/kamisato-ayaka--lingxiaotian">Kamisato Ayaka</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- kamisato-ayaka--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/kamisato-ayaka--lingxiaotian/gifs/idle.gif" alt="Kamisato Ayaka idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/kamisato-ayaka--lingxiaotian/gifs/waving.gif" alt="Kamisato Ayaka waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/kamisato-ayaka--lingxiaotian/gifs/running.gif" alt="Kamisato Ayaka running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/kamisato-ayaka--lingxiaotian/gifs/waiting.gif" alt="Kamisato Ayaka waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/kamisato-ayaka--lingxiaotian/gifs/review.gif" alt="Kamisato Ayaka review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/mahiro--lingxiaotian">Mahiro</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- mahiro--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mahiro--lingxiaotian/gifs/idle.gif" alt="Mahiro idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mahiro--lingxiaotian/gifs/waving.gif" alt="Mahiro waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mahiro--lingxiaotian/gifs/running.gif" alt="Mahiro running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mahiro--lingxiaotian/gifs/waiting.gif" alt="Mahiro waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mahiro--lingxiaotian/gifs/review.gif" alt="Mahiro review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/mihari--hyoni1129">Mihari</a> · 作者 <a href="https://github.com/Hyoni1129">@Hyoni1129</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- mihari--hyoni1129</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mihari--hyoni1129/gifs/idle.gif" alt="Mihari idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mihari--hyoni1129/gifs/waving.gif" alt="Mihari waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mihari--hyoni1129/gifs/running.gif" alt="Mihari running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mihari--hyoni1129/gifs/waiting.gif" alt="Mihari waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mihari--hyoni1129/gifs/review.gif" alt="Mihari review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/mikoto--lingxiaotian">Mikoto</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- mikoto--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mikoto--lingxiaotian/gifs/idle.gif" alt="Mikoto idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mikoto--lingxiaotian/gifs/waving.gif" alt="Mikoto waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mikoto--lingxiaotian/gifs/running.gif" alt="Mikoto running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mikoto--lingxiaotian/gifs/waiting.gif" alt="Mikoto waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mikoto--lingxiaotian/gifs/review.gif" alt="Mikoto review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/miku--lingxiaotian">Miku</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- miku--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/miku--lingxiaotian/gifs/idle.gif" alt="Miku idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/miku--lingxiaotian/gifs/waving.gif" alt="Miku waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/miku--lingxiaotian/gifs/running.gif" alt="Miku running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/miku--lingxiaotian/gifs/waiting.gif" alt="Miku waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/miku--lingxiaotian/gifs/review.gif" alt="Miku review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/nahida--lingxiaotian">Nahida</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- nahida--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/nahida--lingxiaotian/gifs/idle.gif" alt="Nahida idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/nahida--lingxiaotian/gifs/waving.gif" alt="Nahida waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/nahida--lingxiaotian/gifs/running.gif" alt="Nahida running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/nahida--lingxiaotian/gifs/waiting.gif" alt="Nahida waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/nahida--lingxiaotian/gifs/review.gif" alt="Nahida review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/navia--lingxiaotian">Navia</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- navia--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/navia--lingxiaotian/gifs/idle.gif" alt="Navia idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/navia--lingxiaotian/gifs/waving.gif" alt="Navia waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/navia--lingxiaotian/gifs/running.gif" alt="Navia running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/navia--lingxiaotian/gifs/waiting.gif" alt="Navia waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/navia--lingxiaotian/gifs/review.gif" alt="Navia review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/paimon--lingxiaotian">Paimon</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- paimon--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/paimon--lingxiaotian/gifs/idle.gif" alt="Paimon idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/paimon--lingxiaotian/gifs/waving.gif" alt="Paimon waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/paimon--lingxiaotian/gifs/running.gif" alt="Paimon running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/paimon--lingxiaotian/gifs/waiting.gif" alt="Paimon waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/paimon--lingxiaotian/gifs/review.gif" alt="Paimon review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/raiden-shogun--lingxiaotian">Raiden Shogun</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- raiden-shogun--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/raiden-shogun--lingxiaotian/gifs/idle.gif" alt="Raiden Shogun idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/raiden-shogun--lingxiaotian/gifs/waving.gif" alt="Raiden Shogun waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/raiden-shogun--lingxiaotian/gifs/running.gif" alt="Raiden Shogun running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/raiden-shogun--lingxiaotian/gifs/waiting.gif" alt="Raiden Shogun waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/raiden-shogun--lingxiaotian/gifs/review.gif" alt="Raiden Shogun review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/reimu--lingxiaotian">Reimu</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- reimu--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/reimu--lingxiaotian/gifs/idle.gif" alt="Reimu idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/reimu--lingxiaotian/gifs/waving.gif" alt="Reimu waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/reimu--lingxiaotian/gifs/running.gif" alt="Reimu running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/reimu--lingxiaotian/gifs/waiting.gif" alt="Reimu waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/reimu--lingxiaotian/gifs/review.gif" alt="Reimu review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/robin--lingxiaotian">Robin</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- robin--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/robin--lingxiaotian/gifs/idle.gif" alt="Robin idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/robin--lingxiaotian/gifs/waving.gif" alt="Robin waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/robin--lingxiaotian/gifs/running.gif" alt="Robin running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/robin--lingxiaotian/gifs/waiting.gif" alt="Robin waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/robin--lingxiaotian/gifs/review.gif" alt="Robin review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/ruan-mei--lingxiaotian">Ruan Mei</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- ruan-mei--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/ruan-mei--lingxiaotian/gifs/idle.gif" alt="Ruan Mei idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/ruan-mei--lingxiaotian/gifs/waving.gif" alt="Ruan Mei waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/ruan-mei--lingxiaotian/gifs/running.gif" alt="Ruan Mei running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/ruan-mei--lingxiaotian/gifs/waiting.gif" alt="Ruan Mei waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/ruan-mei--lingxiaotian/gifs/review.gif" alt="Ruan Mei review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/silver-wolf--lingxiaotian">Silver Wolf</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- silver-wolf--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/silver-wolf--lingxiaotian/gifs/idle.gif" alt="Silver Wolf idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/silver-wolf--lingxiaotian/gifs/waving.gif" alt="Silver Wolf waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/silver-wolf--lingxiaotian/gifs/running.gif" alt="Silver Wolf running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/silver-wolf--lingxiaotian/gifs/waiting.gif" alt="Silver Wolf waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/silver-wolf--lingxiaotian/gifs/review.gif" alt="Silver Wolf review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/sparkle--lingxiaotian">Sparkle</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- sparkle--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/sparkle--lingxiaotian/gifs/idle.gif" alt="Sparkle idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/sparkle--lingxiaotian/gifs/waving.gif" alt="Sparkle waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/sparkle--lingxiaotian/gifs/running.gif" alt="Sparkle running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/sparkle--lingxiaotian/gifs/waiting.gif" alt="Sparkle waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/sparkle--lingxiaotian/gifs/review.gif" alt="Sparkle review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/tingyun--lingxiaotian">Tingyun</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- tingyun--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/tingyun--lingxiaotian/gifs/idle.gif" alt="Tingyun idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/tingyun--lingxiaotian/gifs/waving.gif" alt="Tingyun waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/tingyun--lingxiaotian/gifs/running.gif" alt="Tingyun running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/tingyun--lingxiaotian/gifs/waiting.gif" alt="Tingyun waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/tingyun--lingxiaotian/gifs/review.gif" alt="Tingyun review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/dnf-female-ammo--qunboo">女弹药Q</a> · 作者 <a href="https://github.com/QunBoo">@QunBoo</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- dnf-female-ammo--qunboo</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/dnf-female-ammo--qunboo/gifs/idle.gif" alt="女弹药Q idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/dnf-female-ammo--qunboo/gifs/waving.gif" alt="女弹药Q waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/dnf-female-ammo--qunboo/gifs/running.gif" alt="女弹药Q running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/dnf-female-ammo--qunboo/gifs/waiting.gif" alt="女弹药Q waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/dnf-female-ammo--qunboo/gifs/review.gif" alt="女弹药Q review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/bocchi--lingxiaotian">Bocchi</a> · 作者 <a href="https://github.com/legeling">@legeling</a> · 动漫人物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- bocchi--lingxiaotian</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/bocchi--lingxiaotian/gifs/idle.gif" alt="Bocchi idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/bocchi--lingxiaotian/gifs/waving.gif" alt="Bocchi waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/bocchi--lingxiaotian/gifs/running.gif" alt="Bocchi running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/bocchi--lingxiaotian/gifs/waiting.gif" alt="Bocchi waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/bocchi--lingxiaotian/gifs/review.gif" alt="Bocchi review" width="120" height="130"></td></tr>
</table>

### 原创角色

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/aemeath-mini--cunuo">Aemeath Mini</a> · 作者 <a href="https://github.com/cuNuo">@cuNuo</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- aemeath-mini--cunuo</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/aemeath-mini--cunuo/gifs/idle.gif" alt="Aemeath Mini idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/aemeath-mini--cunuo/gifs/waving.gif" alt="Aemeath Mini waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/aemeath-mini--cunuo/gifs/running.gif" alt="Aemeath Mini running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/aemeath-mini--cunuo/gifs/waiting.gif" alt="Aemeath Mini waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/aemeath-mini--cunuo/gifs/review.gif" alt="Aemeath Mini review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/apu--xchangee">Apu</a> · 作者 <a href="https://github.com/xchangee">@xchangee</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- apu--xchangee</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/apu--xchangee/gifs/idle.gif" alt="Apu idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/apu--xchangee/gifs/waving.gif" alt="Apu waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/apu--xchangee/gifs/running.gif" alt="Apu running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/apu--xchangee/gifs/waiting.gif" alt="Apu waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/apu--xchangee/gifs/review.gif" alt="Apu review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/claude--xiangking">Claude</a> · 作者 <a href="https://github.com/xiangking">@xiangking</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- claude--xiangking</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/claude--xiangking/gifs/idle.gif" alt="Claude idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/claude--xiangking/gifs/waving.gif" alt="Claude waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/claude--xiangking/gifs/running.gif" alt="Claude running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/claude--xiangking/gifs/waiting.gif" alt="Claude waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/claude--xiangking/gifs/review.gif" alt="Claude review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/diaoyi-baobao--d1a0y1bb">Diaoyi Baobao</a> · 作者 <a href="https://github.com/D1a0y1bb">@D1a0y1bb</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- diaoyi-baobao--d1a0y1bb</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/diaoyi-baobao--d1a0y1bb/gifs/idle.gif" alt="Diaoyi Baobao idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/diaoyi-baobao--d1a0y1bb/gifs/waving.gif" alt="Diaoyi Baobao waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/diaoyi-baobao--d1a0y1bb/gifs/running.gif" alt="Diaoyi Baobao running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/diaoyi-baobao--d1a0y1bb/gifs/waiting.gif" alt="Diaoyi Baobao waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/diaoyi-baobao--d1a0y1bb/gifs/review.gif" alt="Diaoyi Baobao review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/hajimi--zeyuwang1999">Hajimi</a> · 作者 <a href="https://github.com/zeyuwang1999">@zeyuwang1999</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- hajimi--zeyuwang1999</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/hajimi--zeyuwang1999/gifs/idle.gif" alt="Hajimi idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/hajimi--zeyuwang1999/gifs/waving.gif" alt="Hajimi waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/hajimi--zeyuwang1999/gifs/running.gif" alt="Hajimi running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/hajimi--zeyuwang1999/gifs/waiting.gif" alt="Hajimi waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/hajimi--zeyuwang1999/gifs/review.gif" alt="Hajimi review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/hana2--initiatione">Hana2</a> · 作者 <a href="https://github.com/initiatione">@initiatione</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- hana2--initiatione</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/hana2--initiatione/gifs/idle.gif" alt="Hana2 idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/hana2--initiatione/gifs/waving.gif" alt="Hana2 waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/hana2--initiatione/gifs/running.gif" alt="Hana2 running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/hana2--initiatione/gifs/waiting.gif" alt="Hana2 waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/hana2--initiatione/gifs/review.gif" alt="Hana2 review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/lulu--yogazz">Lulu</a> · 作者 <a href="https://github.com/YoGazz">@YoGazz</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- lulu--yogazz</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/lulu--yogazz/gifs/idle.gif" alt="Lulu idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/lulu--yogazz/gifs/waving.gif" alt="Lulu waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/lulu--yogazz/gifs/running.gif" alt="Lulu running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/lulu--yogazz/gifs/waiting.gif" alt="Lulu waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/lulu--yogazz/gifs/review.gif" alt="Lulu review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/mika--rotl24">Mika</a> · 作者 <a href="https://github.com/ROTl24">@ROTl24</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- mika--rotl24</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mika--rotl24/gifs/idle.gif" alt="Mika idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mika--rotl24/gifs/waving.gif" alt="Mika waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mika--rotl24/gifs/running.gif" alt="Mika running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mika--rotl24/gifs/waiting.gif" alt="Mika waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mika--rotl24/gifs/review.gif" alt="Mika review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/night-neko--netizenxuan">Night Neko</a> · 作者 <a href="https://github.com/netizenXuan">@netizenXuan</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- night-neko--netizenxuan</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/night-neko--netizenxuan/gifs/idle.gif" alt="Night Neko idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/night-neko--netizenxuan/gifs/waving.gif" alt="Night Neko waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/night-neko--netizenxuan/gifs/running.gif" alt="Night Neko running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/night-neko--netizenxuan/gifs/waiting.gif" alt="Night Neko waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/night-neko--netizenxuan/gifs/review.gif" alt="Night Neko review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/ruruka--ltmcliao-cmyk">RuRuKa</a> · 作者 <a href="https://github.com/ltmcliao-cmyk">@ltmcliao-cmyk</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- ruruka--ltmcliao-cmyk</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/ruruka--ltmcliao-cmyk/gifs/idle.gif" alt="RuRuKa idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/ruruka--ltmcliao-cmyk/gifs/waving.gif" alt="RuRuKa waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/ruruka--ltmcliao-cmyk/gifs/running.gif" alt="RuRuKa running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/ruruka--ltmcliao-cmyk/gifs/waiting.gif" alt="RuRuKa waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/ruruka--ltmcliao-cmyk/gifs/review.gif" alt="RuRuKa review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/saki--rookie-09">Saki</a> · 作者 <a href="https://github.com/rookie-09">@rookie-09</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- saki--rookie-09</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/saki--rookie-09/gifs/idle.gif" alt="Saki idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/saki--rookie-09/gifs/waving.gif" alt="Saki waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/saki--rookie-09/gifs/running.gif" alt="Saki running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/saki--rookie-09/gifs/waiting.gif" alt="Saki waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/saki--rookie-09/gifs/review.gif" alt="Saki review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/shian-helper--mistyshen">Shian</a> · 作者 <a href="https://github.com/mistyShen">@mistyShen</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- shian-helper--mistyshen</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/shian-helper--mistyshen/gifs/idle.gif" alt="Shian idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/shian-helper--mistyshen/gifs/waving.gif" alt="Shian waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/shian-helper--mistyshen/gifs/running.gif" alt="Shian running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/shian-helper--mistyshen/gifs/waiting.gif" alt="Shian waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/shian-helper--mistyshen/gifs/review.gif" alt="Shian review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/wally--wally025">Wally</a> · 作者 <a href="https://github.com/wally025">@wally025</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- wally--wally025</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/wally--wally025/gifs/idle.gif" alt="Wally idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/wally--wally025/gifs/waving.gif" alt="Wally waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/wally--wally025/gifs/running.gif" alt="Wally running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/wally--wally025/gifs/waiting.gif" alt="Wally waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/wally--wally025/gifs/review.gif" alt="Wally review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/xian-xiao-lu--qingyunagi">Xian Xiao Lu</a> · 作者 <a href="https://github.com/qingyunAGI">@qingyunAGI</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- xian-xiao-lu--qingyunagi</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/xian-xiao-lu--qingyunagi/gifs/idle.gif" alt="Xian Xiao Lu idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/xian-xiao-lu--qingyunagi/gifs/waving.gif" alt="Xian Xiao Lu waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/xian-xiao-lu--qingyunagi/gifs/running.gif" alt="Xian Xiao Lu running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/xian-xiao-lu--qingyunagi/gifs/waiting.gif" alt="Xian Xiao Lu waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/xian-xiao-lu--qingyunagi/gifs/review.gif" alt="Xian Xiao Lu review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/yier--gbn666">Yi Er</a> · 作者 <a href="https://github.com/gbn666">@gbn666</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- yier--gbn666</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/yier--gbn666/gifs/idle.gif" alt="Yi Er idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/yier--gbn666/gifs/waving.gif" alt="Yi Er waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/yier--gbn666/gifs/running.gif" alt="Yi Er running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/yier--gbn666/gifs/waiting.gif" alt="Yi Er waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/yier--gbn666/gifs/review.gif" alt="Yi Er review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/yuanzai--gaming33">Yuanzai</a> · 作者 <a href="https://github.com/Gaming33">@Gaming33</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- yuanzai--gaming33</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/yuanzai--gaming33/gifs/idle.gif" alt="Yuanzai idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/yuanzai--gaming33/gifs/waving.gif" alt="Yuanzai waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/yuanzai--gaming33/gifs/running.gif" alt="Yuanzai running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/yuanzai--gaming33/gifs/waiting.gif" alt="Yuanzai waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/yuanzai--gaming33/gifs/review.gif" alt="Yuanzai review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/yuzubou--keseras34938976">Yuzubou</a> · 作者 <a href="https://github.com/Keseras34938976">@Keseras34938976</a> · 原创角色</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- yuzubou--keseras34938976</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/yuzubou--keseras34938976/gifs/idle.gif" alt="Yuzubou idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/yuzubou--keseras34938976/gifs/waving.gif" alt="Yuzubou waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/yuzubou--keseras34938976/gifs/running.gif" alt="Yuzubou running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/yuzubou--keseras34938976/gifs/waiting.gif" alt="Yuzubou waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/yuzubou--keseras34938976/gifs/review.gif" alt="Yuzubou review" width="120" height="130"></td></tr>
</table>

### 表情包

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/katana-cheems--thankyou-cheems">Katana Cheems</a> · 作者 <a href="https://github.com/Thankyou-Cheems">@Thankyou-Cheems</a> · 表情包</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- katana-cheems--thankyou-cheems</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/katana-cheems--thankyou-cheems/gifs/idle.gif" alt="Katana Cheems idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/katana-cheems--thankyou-cheems/gifs/waving.gif" alt="Katana Cheems waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/katana-cheems--thankyou-cheems/gifs/running.gif" alt="Katana Cheems running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/katana-cheems--thankyou-cheems/gifs/waiting.gif" alt="Katana Cheems waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/katana-cheems--thankyou-cheems/gifs/review.gif" alt="Katana Cheems review" width="120" height="130"></td></tr>
</table>

### 动物

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/becky--natewanggg">Becky</a> · 作者 <a href="https://github.com/NateWanggg">@NateWanggg</a> · 动物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- becky--natewanggg</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/becky--natewanggg/gifs/idle.gif" alt="Becky idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/becky--natewanggg/gifs/waving.gif" alt="Becky waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/becky--natewanggg/gifs/running.gif" alt="Becky running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/becky--natewanggg/gifs/waiting.gif" alt="Becky waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/becky--natewanggg/gifs/review.gif" alt="Becky review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/bubu--gbn666">Bubu</a> · 作者 <a href="https://github.com/gbn666">@gbn666</a> · 动物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- bubu--gbn666</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/bubu--gbn666/gifs/idle.gif" alt="Bubu idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/bubu--gbn666/gifs/waving.gif" alt="Bubu waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/bubu--gbn666/gifs/running.gif" alt="Bubu running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/bubu--gbn666/gifs/waiting.gif" alt="Bubu waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/bubu--gbn666/gifs/review.gif" alt="Bubu review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/corgi-companion--cxian0928-afk">Corgi Companion</a> · 作者 <a href="https://github.com/cxian0928-afk">@cxian0928-afk</a> · 动物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- corgi-companion--cxian0928-afk</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/corgi-companion--cxian0928-afk/gifs/idle.gif" alt="Corgi Companion idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/corgi-companion--cxian0928-afk/gifs/waving.gif" alt="Corgi Companion waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/corgi-companion--cxian0928-afk/gifs/running.gif" alt="Corgi Companion running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/corgi-companion--cxian0928-afk/gifs/waiting.gif" alt="Corgi Companion waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/corgi-companion--cxian0928-afk/gifs/review.gif" alt="Corgi Companion review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/diandian--lllucasxu">Diandian</a> · 作者 <a href="https://github.com/LLLucasXU">@LLLucasXU</a> · 动物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- diandian--lllucasxu</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/diandian--lllucasxu/gifs/idle.gif" alt="Diandian idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/diandian--lllucasxu/gifs/waving.gif" alt="Diandian waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/diandian--lllucasxu/gifs/running.gif" alt="Diandian running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/diandian--lllucasxu/gifs/waiting.gif" alt="Diandian waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/diandian--lllucasxu/gifs/review.gif" alt="Diandian review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/fleta--natewanggg">Fleta</a> · 作者 <a href="https://github.com/NateWanggg">@NateWanggg</a> · 动物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- fleta--natewanggg</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/fleta--natewanggg/gifs/idle.gif" alt="Fleta idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/fleta--natewanggg/gifs/waving.gif" alt="Fleta waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/fleta--natewanggg/gifs/running.gif" alt="Fleta running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/fleta--natewanggg/gifs/waiting.gif" alt="Fleta waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/fleta--natewanggg/gifs/review.gif" alt="Fleta review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/frankie--aygunvarol">Frankie</a> · 作者 <a href="https://github.com/AygunVarol">@AygunVarol</a> · 动物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- frankie--aygunvarol</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/frankie--aygunvarol/gifs/idle.gif" alt="Frankie idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/frankie--aygunvarol/gifs/waving.gif" alt="Frankie waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/frankie--aygunvarol/gifs/running.gif" alt="Frankie running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/frankie--aygunvarol/gifs/waiting.gif" alt="Frankie waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/frankie--aygunvarol/gifs/review.gif" alt="Frankie review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/little-sheep--mingdong">Little Sheep</a> · 作者 @MingDong · 动物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- little-sheep--mingdong</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/little-sheep--mingdong/gifs/idle.gif" alt="Little Sheep idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/little-sheep--mingdong/gifs/waving.gif" alt="Little Sheep waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/little-sheep--mingdong/gifs/running.gif" alt="Little Sheep running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/little-sheep--mingdong/gifs/waiting.gif" alt="Little Sheep waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/little-sheep--mingdong/gifs/review.gif" alt="Little Sheep review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/mai--dwdestiny">Mai</a> · 作者 <a href="https://github.com/DwDestiny">@DwDestiny</a> · 动物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- mai--dwdestiny</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mai--dwdestiny/gifs/idle.gif" alt="Mai idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mai--dwdestiny/gifs/waving.gif" alt="Mai waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mai--dwdestiny/gifs/running.gif" alt="Mai running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mai--dwdestiny/gifs/waiting.gif" alt="Mai waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mai--dwdestiny/gifs/review.gif" alt="Mai review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/mimi--spacebody">Mimi</a> · 作者 <a href="https://github.com/Spacebody">@Spacebody</a> · 动物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- mimi--spacebody</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mimi--spacebody/gifs/idle.gif" alt="Mimi idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mimi--spacebody/gifs/waving.gif" alt="Mimi waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mimi--spacebody/gifs/running.gif" alt="Mimi running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mimi--spacebody/gifs/waiting.gif" alt="Mimi waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/mimi--spacebody/gifs/review.gif" alt="Mimi review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/panda--jason-bai">Panda</a> · 作者 <a href="https://github.com/Jason-Bai">@Jason-Bai</a> · 动物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- panda--jason-bai</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/panda--jason-bai/gifs/idle.gif" alt="Panda idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/panda--jason-bai/gifs/waving.gif" alt="Panda waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/panda--jason-bai/gifs/running.gif" alt="Panda running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/panda--jason-bai/gifs/waiting.gif" alt="Panda waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/panda--jason-bai/gifs/review.gif" alt="Panda review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/teddy--danieloleary">Teddy</a> · 作者 <a href="https://github.com/danieloleary">@danieloleary</a> · 动物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- teddy--danieloleary</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/teddy--danieloleary/gifs/idle.gif" alt="Teddy idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/teddy--danieloleary/gifs/waving.gif" alt="Teddy waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/teddy--danieloleary/gifs/running.gif" alt="Teddy running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/teddy--danieloleary/gifs/waiting.gif" alt="Teddy waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/teddy--danieloleary/gifs/review.gif" alt="Teddy review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/tian-hua-hua--d1a0y1bb">Tian Hua Hua</a> · 作者 <a href="https://github.com/D1a0y1bb">@D1a0y1bb</a> · 动物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- tian-hua-hua--d1a0y1bb</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/tian-hua-hua--d1a0y1bb/gifs/idle.gif" alt="Tian Hua Hua idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/tian-hua-hua--d1a0y1bb/gifs/waving.gif" alt="Tian Hua Hua waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/tian-hua-hua--d1a0y1bb/gifs/running.gif" alt="Tian Hua Hua running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/tian-hua-hua--d1a0y1bb/gifs/waiting.gif" alt="Tian Hua Hua waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/tian-hua-hua--d1a0y1bb/gifs/review.gif" alt="Tian Hua Hua review" width="120" height="130"></td></tr>
</table>

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/zichao-xiong--z-kzhang">自嘲熊</a> · 作者 @z-kzhang · 动物</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- zichao-xiong--z-kzhang</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/zichao-xiong--z-kzhang/gifs/idle.gif" alt="自嘲熊 idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/zichao-xiong--z-kzhang/gifs/waving.gif" alt="自嘲熊 waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/zichao-xiong--z-kzhang/gifs/running.gif" alt="自嘲熊 running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/zichao-xiong--z-kzhang/gifs/waiting.gif" alt="自嘲熊 waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/zichao-xiong--z-kzhang/gifs/review.gif" alt="自嘲熊 review" width="120" height="130"></td></tr>
</table>

### 机器人

<table>
<tr><th>名称</th><td colspan="5"><a href="../../pets/codenono--dq02">CodeNoNo</a> · 作者 <a href="https://github.com/Dqd02">@Dqd02</a> · 机器人</td></tr>
<tr><th>安装</th><td colspan="5"><code>curl -fsSL https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/scripts/install-pet.sh | bash -s -- codenono--dq02</code></td></tr>
<tr><th>动作</th><td><strong>待机</strong></td><td><strong>挥手</strong></td><td><strong>奔跑</strong></td><td><strong>等待</strong></td><td><strong>审阅</strong></td></tr>
<tr><th>预览</th><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/codenono--dq02/gifs/idle.gif" alt="CodeNoNo idle" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/codenono--dq02/gifs/waving.gif" alt="CodeNoNo waving" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/codenono--dq02/gifs/running.gif" alt="CodeNoNo running" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/codenono--dq02/gifs/waiting.gif" alt="CodeNoNo waiting" width="120" height="130"></td><td><img src="https://awesome-codex-pet.pages.dev/assets/previews/codenono--dq02/gifs/review.gif" alt="CodeNoNo review" width="120" height="130"></td></tr>
</table>

## 投稿

最快的方式是看[网站上的投稿指南](https://awesome-codex-pet.pages.dev/guide)，里面有分类、目录结构和审核清单。

也可以直接基于仓库工作：

```text
pets/
└── pet-slug--author-slug/
    ├── submission.json
    ├── pet.json
    └── spritesheet.webp
```

目录名使用 `pet-slug--author-slug`，这样同一个角色的不同作者版本可以并存。预览图和 README 收录表都由 CI 自动生成：

```bash
python -m pip install -r requirements.txt
npm run validate:pr
npm run lint
```

贡献者 PR 只需提交 `submission.json`、`pet.json` 和 `spritesheet.webp`。预览图、README 收录和 `pets.json` 由维护者或 CI 在合并后统一生成，但预览二进制不会长期作为 Git 跟踪文件保留。

## 制作 Pet

- [.agents/skills/hatch-pet](../../.agents/skills/hatch-pet) — 设计、生成、QA、打包的端到端流水线

## 文档

- English: [docs/en](../en)
- 简体中文: [docs/zh-CN](./)
- 在线画廊源码: [web/](../../web)
- 统计 Worker: [worker/](../../worker)
- 贡献指南: [CONTRIBUTING.md](./CONTRIBUTING.md)

## 许可说明

- 代码和脚本：[MIT](../../LICENSE)
- 宠物资产和自动生成预览：[CC BY-NC 4.0](../../ASSETS-LICENSE.md)，除非具体宠物目录另有说明
