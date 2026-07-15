import type { Locale } from "@/lib/i18n";
import type { Pet } from "@/lib/pets";

const repositoryUrl = "https://github.com/legeling/awesome-codex-pet";

export function buildCodexUrl(prompt: string) {
  return `codex://new?prompt=${encodeURIComponent(prompt)}`;
}

export function getLocalizedPetName(pet: Pet, locale: Locale) {
  if (locale === "zh") {
    return pet.localizedNames?.zh || pet.displayName || pet.name;
  }
  return pet.localizedNames?.en || pet.name;
}

export function getSubmissionPrompt(locale: Locale) {
  if (locale === "zh") {
    return `请全程使用中文，帮我制作并投稿一只 Codex 宠物到 ${repositoryUrl}。

开始前先向我索取缺失的角色参考图、宠物名称、作者署名、来源链接和许可证信息，并询问名称只使用一种语言，还是同时提供中文名和英文名；没有明确再分发许可的素材不得投稿。

执行要求：
1. 如果当前不在项目目录，先把仓库克隆到可写工作区并进入仓库；然后阅读 AGENTS.md 和投稿指南。
2. 阅读仓库内的 .agents/skills/hatch-pet-v2/SKILL.md，并严格按这个本地 skill 制作新宠物。不要假设我的环境已全局安装 $hatch-pet-v2。
3. 制作 8x11、1536x2288 的 spritesheet。九组标准动作要分别设计和验收，不要用同一姿势机械复制；完整检查 16 个顺时针环视方向。
4. 在正常宠物尺寸和放大视图下逐帧检查深色、浅色、棋盘格背景。修复紫边、绿边、青边、洋红边、透明洞、尺寸跳变和基线抖动，但不能全局删除角色真实使用的颜色。
5. 正式目录必须是 pets/<pet-slug>--<author-slug>/，且只能包含 submission.json、pet.json、spritesheet.webp。
6. pet.json.id 必须与目录名一致，spritesheetPath 必须是 spritesheet.webp，spriteVersionNumber 必须是 2。
7. 保留真实作者、来源、分类、合集、标签与许可证，不要伪造授权或作者信息。单语名称只填写 name；选择双语时，在 submission.json 中同时填写 localized_names.en 与 localized_names.zh。
8. 运行 npm run previews、npm run readmes、npm run validate、npm run lint，并完成一次独立安装测试。
9. 不提交 QA、参考图、视频或临时产物。完成后创建独立分支、提交并向主仓库发起一个只包含这只宠物的 PR。

请先询问我需要提供的素材和信息，然后把制作、验证和 PR 一次完成。`;
  }

  return `Use English throughout this task. Help me create and submit a Codex pet to ${repositoryUrl}.

Before starting, ask me for any missing character reference, pet name, author credit, source URL, and license. Ask whether the pet should use one name or provide both English and Chinese names. Do not submit an asset without explicit redistribution permission.

Requirements:
1. If the project is not already open, clone the repository into a writable workspace and enter it. Then read AGENTS.md and the submission guide.
2. Read .agents/skills/hatch-pet-v2/SKILL.md from the repository and follow that local skill for the new pet. Do not assume $hatch-pet-v2 is globally installed in my environment.
3. Produce an 8x11, 1536x2288 spritesheet. Direct and review all nine standard actions independently instead of mechanically reusing one pose, then review all 16 clockwise look directions.
4. Inspect every frame at normal pet size and close zoom on dark, light, and checkerboard backgrounds. Repair purple, green, cyan, or magenta fringe, transparent holes, scale popping, and baseline jumps without globally deleting legitimate character colors.
5. The final folder must be pets/<pet-slug>--<author-slug>/ and contain only submission.json, pet.json, and spritesheet.webp.
6. pet.json.id must match the folder name, spritesheetPath must be spritesheet.webp, and spriteVersionNumber must be 2.
7. Preserve the real author, source, category, collections, tags, and license. Never invent permission or attribution. For a single-language name, keep only name; when bilingual naming is selected, provide both localized_names.en and localized_names.zh in submission.json.
8. Run npm run previews, npm run readmes, npm run validate, and npm run lint, then complete an isolated installation test.
9. Do not commit QA files, references, videos, or temporary output. When complete, create a focused branch and commit, then open one pull request containing only this pet.

Ask me for the required inputs first, then carry the creation, validation, and pull request through end to end.`;
}

export function getPetInstallPrompt(pet: Pet, locale: Locale) {
  const petName = getLocalizedPetName(pet, locale);
  if (locale === "zh") {
    return `请全程使用中文，为我安装 Awesome Codex Pet 中的「${petName}」（${pet.slug}）。先判断当前操作系统，再运行对应的官方安装命令；确认 pet.json 与 spritesheet.webp 已写入 Codex pets 目录，说明实际安装路径，并告诉我是否需要重启 Codex 以及如何在“设置 → 宠物”中启用它。\n\nmacOS / Linux：\n${pet.installCommand}\n\nWindows PowerShell：\n${pet.installCommandPowerShell}`;
  }

  return `Use English throughout this task. Install "${petName}" (${pet.slug}) from Awesome Codex Pet. Detect the current operating system, run the matching official command, verify that pet.json and spritesheet.webp were written to the Codex pets directory, report the actual install path, and explain whether Codex needs to restart and how to enable the pet under Settings → Pets.\n\nmacOS / Linux:\n${pet.installCommand}\n\nWindows PowerShell:\n${pet.installCommandPowerShell}`;
}

export function getInstallGuidePrompt(locale: Locale) {
  if (locale === "zh") {
    return `请全程使用中文，帮我从 ${repositoryUrl} 安装一只 Awesome Codex Pet。先询问我要安装的宠物页面链接或 pet slug；收到后判断当前操作系统，选择仓库提供的 Bash、PowerShell 或本地 Node.js 安装方式。安装完成后验证 pet.json 与 spritesheet.webp，告诉我实际安装路径，并说明如何重启 Codex、在“设置 → 宠物”中选择它。不要猜测宠物 slug，也不要修改其他已安装宠物。`;
  }

  return `Use English throughout this task. Help me install an Awesome Codex Pet from ${repositoryUrl}. First ask for the pet page URL or pet slug. Then detect the current operating system and use the repository's Bash, PowerShell, or local Node.js installer. Verify pet.json and spritesheet.webp after installation, report the actual install path, and explain how to restart Codex and select the pet under Settings → Pets. Do not guess the pet slug or modify other installed pets.`;
}

export function getCollectionInstallPrompt(
  title: string,
  petSlugs: string[],
  locale: Locale,
) {
  const slugs = petSlugs.join(", ");
  if (locale === "zh") {
    return `请全程使用中文，安装 Awesome Codex Pet 的「${title}」合集。宠物列表：${slugs}。请根据当前系统逐个调用仓库官方安装脚本，验证每只宠物的 pet.json 与 spritesheet.webp 都已安装到 Codex pets 目录，并用中文汇总安装路径、成功项和失败项。仓库：${repositoryUrl}`;
  }

  return `Use English throughout this task. Install the "${title}" collection from Awesome Codex Pet. Pet slugs: ${slugs}. Use the repository's official installer for this system for each pet, verify pet.json and spritesheet.webp in the Codex pets directory, then summarize install paths, successes, and failures in English. Repository: ${repositoryUrl}`;
}
