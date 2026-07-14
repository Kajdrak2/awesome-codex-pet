export type Locale = "en" | "zh";

export const translations = {
  en: {
    // Header
    gallery: "Gallery",
    collections: "Collections",
    install: "Install",
    guide: "Guide",
    docs: "Docs",
    github: "GitHub",
    submitPet: "Submit a Pet",
    submitWithAI: "Submit with AI",
    aiSubmission: "Create with Codex",
    aiSubmissionDesc: "Use the repository's built-in pet workflow and prepare a pull request.",
    manualSubmission: "Submit manually",
    manualSubmissionDesc: "Open the GitHub submission form and provide your pet files.",
    submissionGuide: "Read the submission guide",
    switchToLightMode: "Switch to light mode",
    switchToDarkMode: "Switch to dark mode",

    // Hero
    heroBadge: "{count} community pets available",
    heroTitle1: "Discover & install",
    heroTitle2: "Codex pets",
    heroDesc:
      "A curated gallery of community-made pets for Codex. Browse, preview animations, and install with a single command.",
    heroExplore: "Explore gallery",
    heroSubmit: "Submit your pet",
    heroStatPets: "Curated pets",
    heroStatCategories: "Categories",
    heroStatLicense: "Open source",
    heroStatLicenseValue: "MIT + CC BY-NC",
    exploreGallery: "Explore gallery",
    submitYourPet: "Submit your pet",

    // Gallery
    galleryTitle: "Gallery",
    petsAvailable: "{count} pets available",
    searchPlaceholder: "Search pets, authors, tags...",
    allCategories: "All categories",
    clearSearch: "Clear search",
    filterCategories: "Filter categories",
    noResults: "No pets match your search.",
    noResultsHint: "Try a different keyword or category.",
    loadMorePets: "Load more pets",
    showingPets: "Showing {count} pets",
    backToTop: "Back to top",

    // Collections
    featuredCollectionsEyebrow: "Featured collections",
    featuredCollectionsTitle: "Companions worth installing together",
    viewAllCollections: "View all",
    collectionPetCount: "{count} pets",
    collectionsPageTitle: "Explore pet collections",
    collectionsPageSubtitle:
      "Browse characters and companions grouped into shareable, one-click Codex collections.",
    backToCollections: "Back to collections",
    openCollectionInCodex: "Open collection in Codex",

    // Card
    by: "by",
    view: "View",
    installBtn: "Install",
    installOptions: "Choose an installation method",
    installationGuide: "Read the installation guide",
    copied: "Copied",
    defaultDesc: "A curated Codex pet package.",
    likePet: "Like this pet, {count} likes",
    likedPet: "You liked this pet, {count} likes",

    // Detail
    backToGallery: "Back to gallery",
    petNavigation: "Pet navigation",
    shufflePet: "Shuffle pet",
    interactivePreview: "Interactive preview",
    resetPetPosition: "Reset pet position",
    detailInstalls: "Installs",
    detailViews: "Views",
    detailInstallDesc:
      "Choose your platform, copy one command, and restart Codex to activate the pet.",
    actionPreviews: "Action Previews",
    actionPreviewsDesc:
      "Every animation state rendered from the spritesheet — what you'll actually see in Codex.",
    metadata: "Metadata",
    author: "Author",
    license: "License",
    displayName: "Display Name",
    petVersion: "Pet Version",
    slug: "Slug",
    tags: "Tags",
    installCommands: "Install Commands",
    copyBashInstall: "Copy Bash Install",
    copyPowerShell: "Copy PowerShell",
    source: "Source",
    openInCodex: "Open in Codex",
    codexRunsInstall: "Codex runs the install",
    share: "Share",
    copyInstall: "Copy install command",
    copyPageLink: "Copy page link",
    copyShareText: "Copy share message",
    shareMessage:
      "Found a delightful Codex pet: {title}. Discover more playful, installable companions on Awesome Codex Pet:",
    shareToX: "Share to X",
    shareToLinkedIn: "Share to LinkedIn",
    moreShareOptions: "More share options",

    // Footer
    contributing: "Contributing",
    footerTagline: "Adopt a pixel companion. One command, no clone needed.",
    footerLinksTitle: "Explore",
    footerCommunityTitle: "Community",
    footerLicenseLine: "Code under MIT · Pet assets under CC BY-NC 4.0.",
    footerBuiltWith:
      "Built with Next.js · Deployed on Cloudflare Pages · Assets under CC BY-NC 4.0",
    footerContributors: "Contributors submit",

    // 404
    notFoundTitle: "Pet not found",
    notFoundDesc:
      "The requested pet page does not exist in the current catalog.",

    // Install page
    installPageTitle: "Install a pet in seconds",
    installPageSubtitle:
      "Pick the pet slug from the gallery and run one of the commands below. No need to clone the repository.",
    installStep1Title: "1. Find a pet",
    installStep1Desc:
      "Open the gallery, hit the pet you like, and copy the slug shown on its detail page.",
    installStep2Title: "2. Run the install command",
    installStep2Desc:
      "Pick the script for your shell and replace {slug} with your chosen pet slug.",
    installStep3Title: "3. Restart Codex",
    installStep3Desc:
      "Codex will pick up the new pet from your local pets directory automatically.",
    installBashLabel: "macOS / Linux",
    installPwshLabel: "Windows PowerShell",
    installNodeLabel: "Run with Node.js",
    installBashTip: "Requires curl and bash.",
    installPwshTip: "Run as a normal user, no admin rights needed.",
    installNodeTip: "Works anywhere npx is available.",
    installFaqTitle: "FAQ",
    installFaqQ1: "Where are pets installed?",
    installFaqA1:
      "Each pet lands in your Codex home (default ~/.codex) under pets/<pet-id>/.",
    installFaqQ2: "Can I uninstall a pet?",
    installFaqA2: "Delete the pet folder. Nothing else is touched.",
    installFaqQ3: "Is sudo required?",
    installFaqA3: "No. Installs are scoped to your user directory.",
    openGallery: "Open gallery",

    // Guide page
    guidePageTitle: "Submit your own Codex pet",
    guidePageSubtitle:
      "A short walkthrough of categories, the folder layout, and what reviewers look for.",
    guideAIWorkflowEyebrow: "AI-assisted submission",
    guideAIWorkflowTitle: "Let Codex prepare the pet and pull request",
    guideAIWorkflowDesc:
      "Open a ready-made task in Codex. It clones this repository, reads the built-in Hatch Pet v2 skill, validates the package, and prepares a focused pull request.",
    startInCodex: "Start in Codex",
    copyAIPrompt: "Copy AI prompt",
    aiPromptPreview: "Submission task",
    repositorySkillLabel: "Repository skill",
    guideCategoriesTitle: "Categories",
    guideCategoriesDesc:
      "Categories come from the repository taxonomy. Pick the closest primary type when you submit.",
    guideStructureTitle: "Folder layout",
    guideStructureDesc:
      "Each pet lives under pets/<pet-slug>--<author-slug>/ and only contains three files.",
    guideStructureNote:
      "Generated previews land in assets/previews/<pet-id>/ and are produced by the build pipeline.",
    guideCollectionsTitle: "Collection membership",
    guideCollectionsDesc:
      "Use submission.json.collections to reference slugs from the repository's collections.json. The website groups the pet automatically.",
    guideVersionsTitle: "Choose a pet version",
    guideVersionsDesc:
      "v1 keeps the standard 8×9 animation atlas. v2 uses an 8×11 atlas and adds 16 clockwise look directions.",
    guideVersionV1: "v1: 1536×1872. Omit spriteVersionNumber or set it to 1.",
    guideVersionV2: "v2: 1536×2288. Set spriteVersionNumber to 2.",
    guideUpgradeTitle: "Upgrade an installed v1 pet",
    guideUpgradeDesc:
      "In Codex, open Settings → Pets and choose Update. Hatch Pet preserves approved standard rows, adds the look-direction rows, and updates the local package. Review it before submitting the three final files to this repository.",
    guideChecklistTitle: "Reviewer checklist",
    guideChecklistItem1: "Folder name matches the pet slug and author slug.",
    guideChecklistItem2: "pet.json id equals the folder name.",
    guideChecklistItem3: "spritesheet.webp is the final runtime asset.",
    guideChecklistItem4: "License is declared in submission.json.",
    guideChecklistItem5: "One pet per pull request.",
    guideOpenIssue: "Open a submission issue",
    guideReadFull: "Read full submission guide",

    // Sorting
    sortLabel: "Sort by",
    sortPopular: "Trending",
    sortDownloads: "Most installed",
    sortLikes: "Most liked",
    sortNewest: "Newest",
    sortName: "Name (A→Z)",
    statsLoading: "Loading statistics…",
    statsUnavailable: "Statistics temporarily unavailable",
    statsUpdated: "7-day trend updated",
    statsViews: "{count} views",
    statsInstalls: "{count} installs",

    // Actions
    idle: "Idle",
    waving: "Waving",
    running: "Running",
    "running-left": "Running left",
    "running-right": "Running right",
    waiting: "Waiting",
    review: "Review",
    jumping: "Jumping",
    failed: "Failed",
  },
  zh: {
    // Header
    gallery: "画廊",
    collections: "合集",
    install: "安装",
    guide: "指南",
    docs: "文档",
    github: "GitHub",
    submitPet: "提交宠物",
    submitWithAI: "AI投稿",
    aiSubmission: "交给 Codex 制作",
    aiSubmissionDesc: "使用仓库自带的宠物制作流程，并准备 Pull Request。",
    manualSubmission: "手动投稿",
    manualSubmissionDesc: "打开 GitHub 投稿表单，并提交你的宠物文件。",
    submissionGuide: "阅读投稿指南",
    switchToLightMode: "切换到浅色模式",
    switchToDarkMode: "切换到深色模式",

    // Hero
    heroBadge: "已收录 {count} 只社区宠物",
    heroTitle1: "发现并安装",
    heroTitle2: "Codex 宠物",
    heroDesc: "社区精选的 Codex 宠物画廊。浏览、预览动画，一条命令即可安装。",
    heroExplore: "浏览画廊",
    heroSubmit: "提交你的宠物",
    heroStatPets: "精选宠物",
    heroStatCategories: "分类数",
    heroStatLicense: "开源许可",
    heroStatLicenseValue: "MIT + CC BY-NC",
    exploreGallery: "浏览画廊",
    submitYourPet: "提交你的宠物",

    // Gallery
    galleryTitle: "画廊",
    petsAvailable: "共 {count} 只宠物",
    searchPlaceholder: "搜索宠物、作者、标签...",
    allCategories: "全部分类",
    clearSearch: "清除搜索",
    filterCategories: "筛选分类",
    noResults: "没有找到匹配的宠物",
    noResultsHint: "试试其他关键词或分类",
    loadMorePets: "加载更多宠物",
    showingPets: "已展示 {count} 只宠物",
    backToTop: "回到顶部",

    // Collections
    featuredCollectionsEyebrow: "精选合集",
    featuredCollectionsTitle: "值得一起安装的宠物系列",
    viewAllCollections: "查看全部",
    collectionPetCount: "{count} 只宠物",
    collectionsPageTitle: "探索宠物合集",
    collectionsPageSubtitle: "按作品与主题浏览宠物，并用 Codex 一次安装整个合集。",
    backToCollections: "返回合集",
    openCollectionInCodex: "在 Codex 中打开合集",

    // Card
    by: "作者",
    view: "查看",
    installBtn: "安装",
    installOptions: "选择安装方式",
    installationGuide: "阅读安装指南",
    copied: "已复制",
    defaultDesc: "一个精选的 Codex 宠物包。",
    likePet: "给这只宠物点赞，当前 {count} 个赞",
    likedPet: "你已经赞过这只宠物，当前 {count} 个赞",

    // Detail
    backToGallery: "返回画廊",
    petNavigation: "宠物导航",
    shufflePet: "随机宠物",
    interactivePreview: "互动预览",
    resetPetPosition: "重置宠物位置",
    detailInstalls: "安装次数",
    detailViews: "浏览次数",
    detailInstallDesc: "选择你的平台，复制一条命令并重启 Codex 即可启用宠物。",
    actionPreviews: "动作预览",
    actionPreviewsDesc: "Codex 中实际呈现的全部动作动画。",
    metadata: "元数据",
    author: "作者",
    license: "许可证",
    displayName: "显示名称",
    petVersion: "Pet 版本",
    slug: "标识符",
    tags: "标签",
    installCommands: "安装命令",
    copyBashInstall: "复制 Bash 命令",
    copyPowerShell: "复制 PowerShell",
    source: "源码",
    openInCodex: "在 Codex 中打开",
    codexRunsInstall: "由 Codex 执行安装",
    share: "分享",
    copyInstall: "复制安装命令",
    copyPageLink: "复制页面链接",
    copyShareText: "复制分享文案",
    shareMessage:
      "发现了一只好玩的 Codex 小宠物：{title}。更多好看、好玩、可以直接安装的小宠物都在 Awesome Codex Pet：",
    shareToX: "分享到 X",
    shareToLinkedIn: "分享到 LinkedIn",
    moreShareOptions: "更多分享方式",

    // Footer
    contributing: "贡献指南",
    footerTagline: "领养一只像素伙伴。一条命令，无需克隆仓库。",
    footerLinksTitle: "浏览",
    footerCommunityTitle: "社区",
    footerLicenseLine: "代码遵循 MIT · 宠物资源遵循 CC BY-NC 4.0。",
    footerBuiltWith:
      "使用 Next.js 构建 · 部署在 Cloudflare Pages · 资源遵循 CC BY-NC 4.0",
    footerContributors: "贡献者提交",

    // 404
    notFoundTitle: "宠物未找到",
    notFoundDesc: "当前目录中不存在该宠物页面。",

    // Install page
    installPageTitle: "几秒钟安装一只宠物",
    installPageSubtitle:
      "从画廊里挑一只想要的宠物，复制下方任意命令运行即可。无需克隆仓库。",
    installStep1Title: "1. 选一只宠物",
    installStep1Desc: "打开画廊进入宠物详情页，复制页面上的 slug。",
    installStep2Title: "2. 运行安装命令",
    installStep2Desc:
      "选择对应你系统的命令，把 {slug} 替换成你选中的宠物 slug。",
    installStep3Title: "3. 重启 Codex",
    installStep3Desc: "Codex 会从本地的 pets 目录自动加载新宠物。",
    installBashLabel: "macOS / Linux",
    installPwshLabel: "Windows PowerShell",
    installNodeLabel: "使用 Node.js 安装",
    installBashTip: "需要本地有 curl 和 bash。",
    installPwshTip: "无需管理员权限，普通用户即可执行。",
    installNodeTip: "只要环境里有 npx 就能跑。",
    installFaqTitle: "常见问题",
    installFaqQ1: "宠物会装到哪里？",
    installFaqA1:
      "默认安装到 Codex 主目录（默认是 ~/.codex）的 pets/<pet-id>/ 里。",
    installFaqQ2: "怎么卸载？",
    installFaqA2: "直接删掉对应宠物文件夹即可，不会影响其他东西。",
    installFaqQ3: "需要 sudo 吗？",
    installFaqA3: "不需要。所有安装都只动当前用户目录。",
    openGallery: "去画廊看看",

    // Guide page
    guidePageTitle: "提交你自己的 Codex 宠物",
    guidePageSubtitle: "简短走一遍分类、目录结构以及审核要点。",
    guideAIWorkflowEyebrow: "AI 辅助投稿",
    guideAIWorkflowTitle: "让 Codex 完成宠物制作与 PR",
    guideAIWorkflowDesc:
      "一键打开预设好的 Codex 任务。它会克隆本仓库、读取仓库自带的 Hatch Pet v2 skill、完成校验，并准备范围清晰的 Pull Request。",
    startInCodex: "在 Codex 中开始",
    copyAIPrompt: "复制 AI 提示词",
    aiPromptPreview: "投稿任务",
    repositorySkillLabel: "仓库内置 Skill",
    guideCategoriesTitle: "分类",
    guideCategoriesDesc:
      "分类来自仓库统一维护的类型元数据。投稿时选择最贴近的主类型即可。",
    guideStructureTitle: "目录结构",
    guideStructureDesc:
      "每只宠物放在 pets/<pet-slug>--<author-slug>/ 下，目录里只允许三个文件。",
    guideStructureNote:
      "自动生成的预览会落在 assets/previews/<pet-id>/，由构建流水线生成。",
    guideCollectionsTitle: "合集归属",
    guideCollectionsDesc:
      "在 submission.json.collections 中填写仓库 collections.json 已定义的 slug，网站会自动把宠物归入对应合集。",
    guideVersionsTitle: "选择 Pet 版本",
    guideVersionsDesc:
      "v1 保留标准 8×9 动画图集；v2 使用 8×11 图集，并增加 16 个顺时针环视方向。",
    guideVersionV1: "v1：1536×1872。省略 spriteVersionNumber 或设为 1。",
    guideVersionV2: "v2：1536×2288。必须把 spriteVersionNumber 设为 2。",
    guideUpgradeTitle: "升级已安装的 v1 宠物",
    guideUpgradeDesc:
      "在 Codex 中打开设置 → 宠物并点击更新。Hatch Pet 会保留通过审核的标准动作行、增加环视方向行并更新本地包。审核完成后，再向本仓库提交最终三件套。",
    guideChecklistTitle: "审核清单",
    guideChecklistItem1: "目录名遵循 pet-slug--author-slug 格式。",
    guideChecklistItem2: "pet.json 的 id 与目录名完全一致。",
    guideChecklistItem3: "spritesheet.webp 是最终运行时资源，不是过程版。",
    guideChecklistItem4: "在 submission.json 中明确写出许可证。",
    guideChecklistItem5: "一个 PR 只提交一只宠物。",
    guideOpenIssue: "去 GitHub 提交申请",
    guideReadFull: "阅读完整投稿指南",

    // Sorting
    sortLabel: "排序",
    sortPopular: "近期趋势",
    sortDownloads: "最多安装",
    sortLikes: "最多点赞",
    sortNewest: "最新",
    sortName: "名称（A→Z）",
    statsLoading: "正在加载统计数据…",
    statsUnavailable: "统计数据暂时不可用",
    statsUpdated: "近 7 日趋势已更新",
    statsViews: "{count} 次浏览",
    statsInstalls: "{count} 次安装",

    // Actions
    idle: "待机",
    waving: "挥手",
    running: "奔跑",
    "running-left": "向左跑",
    "running-right": "向右跑",
    waiting: "等待",
    review: "审查",
    jumping: "跳跃",
    failed: "失败",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  let text: string = translations[locale][key] ?? translations.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

export function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const lang = navigator.language || "en";
  if (lang.startsWith("zh")) return "zh";
  return "en";
}
