import type { Locale } from "@/lib/i18n";
import type { Pet } from "@/lib/pets";

const repositoryUrl = "https://github.com/legeling/awesome-codex-pet";

export function buildCodexUrl(prompt: string) {
  return `codex://new?prompt=${encodeURIComponent(prompt)}`;
}

export function getSubmissionPrompt(locale: Locale) {
  if (locale === "zh") {
    return `请帮我制作并投稿一只 Codex 宠物到 ${repositoryUrl}。

开始前先向我索取缺失的角色参考图、宠物名称、作者署名、来源链接和许可证信息；没有明确再分发许可的素材不得投稿。

执行要求：
1. 如果当前不在项目目录，先把仓库克隆到可写工作区并进入仓库；然后阅读 AGENTS.md 和投稿指南。
2. 阅读仓库内的 .agents/skills/hatch-pet-v2/SKILL.md，并严格按这个本地 skill 制作新宠物。不要假设我的环境已全局安装 $hatch-pet-v2。
3. 制作 8x11、1536x2288 的 spritesheet，并完整检查 16 个环视方向。
4. 正式目录必须是 pets/<pet-slug>--<author-slug>/，且只能包含 submission.json、pet.json、spritesheet.webp。
5. pet.json.id 必须与目录名一致，spritesheetPath 必须是 spritesheet.webp，spriteVersionNumber 必须是 2。
6. 保留真实作者、来源、分类、合集、标签与许可证，不要伪造授权或作者信息。
7. 运行 npm run previews、npm run readmes、npm run validate、npm run lint，并检查预览与安装流程。
8. 不提交 QA、参考图、视频或临时产物。完成后创建独立分支、提交并向主仓库发起一个只包含这只宠物的 PR。

请先询问我需要提供的素材和信息，然后把制作、验证和 PR 一次完成。`;
  }

  return `Help me create and submit a Codex pet to ${repositoryUrl}.

Before starting, ask me for any missing character reference, pet name, author credit, source URL, and license. Do not submit an asset without explicit redistribution permission.

Requirements:
1. If the project is not already open, clone the repository into a writable workspace and enter it. Then read AGENTS.md and the submission guide.
2. Read .agents/skills/hatch-pet-v2/SKILL.md from the repository and follow that local skill for the new pet. Do not assume $hatch-pet-v2 is globally installed in my environment.
3. Produce an 8x11, 1536x2288 spritesheet and review all 16 look directions.
4. The final folder must be pets/<pet-slug>--<author-slug>/ and contain only submission.json, pet.json, and spritesheet.webp.
5. pet.json.id must match the folder name, spritesheetPath must be spritesheet.webp, and spriteVersionNumber must be 2.
6. Preserve the real author, source, category, collections, tags, and license. Never invent permission or attribution.
7. Run npm run previews, npm run readmes, npm run validate, and npm run lint. Review the previews and installation flow.
8. Do not commit QA files, references, videos, or temporary output. When complete, create a focused branch and commit, then open one pull request containing only this pet.

Ask me for the required inputs first, then carry the creation, validation, and pull request through end to end.`;
}

export function getPetInstallPrompt(pet: Pet, locale: Locale) {
  if (locale === "zh") {
    return `请为我安装 Awesome Codex Pet 中的「${pet.name}」（${pet.slug}）。运行适合当前系统的官方安装命令，确认宠物已写入 Codex pets 目录，然后告诉我是否需要重启 Codex。\n\nmacOS / Linux：\n${pet.installCommand}\n\nWindows PowerShell：\n${pet.installCommandPowerShell}`;
  }

  return `Install "${pet.name}" (${pet.slug}) from Awesome Codex Pet. Run the official command for this system, verify that the pet was written to the Codex pets directory, and tell me whether Codex needs to restart.\n\nmacOS / Linux:\n${pet.installCommand}\n\nWindows PowerShell:\n${pet.installCommandPowerShell}`;
}

export function getCollectionInstallPrompt(
  title: string,
  petSlugs: string[],
  locale: Locale,
) {
  const slugs = petSlugs.join(", ");
  if (locale === "zh") {
    return `请安装 Awesome Codex Pet 的「${title}」合集。宠物列表：${slugs}。请根据当前系统逐个调用仓库官方安装脚本，验证每只宠物都已安装到 Codex pets 目录，并汇总结果。仓库：${repositoryUrl}`;
  }

  return `Install the "${title}" collection from Awesome Codex Pet. Pet slugs: ${slugs}. Use the repository's official installer for this system for each pet, verify every pet in the Codex pets directory, and summarize the result. Repository: ${repositoryUrl}`;
}
