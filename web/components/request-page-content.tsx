import Link from "next/link";

import { CodexIcon } from "@/components/codex-icon";
import { ManualRequestForm } from "@/components/manual-request-form";
import {
  buildCodexUrl,
  getPetRequestPrompt,
} from "@/lib/codex-links";
import { localeConfig, localePath, type Locale } from "@/lib/i18n";

const requestIssueUrl =
  "https://github.com/legeling/awesome-codex-pet/issues/new?template=pet-request.yml";

const content = {
  en: {
    breadcrumb: "Codex pet gallery",
    pageLabel: "Pet request",
    eyebrow: "Free community request",
    title: "Request a Codex pet for a character you love",
    intro:
      "Submitting a request is free. Tell the Awesome Codex Pet community which character, mascot, animal, or original idea you want. A community contributor may volunteer to create and publish it for free, but requests are not delivery promises.",
    codexCta: "Prepare my request in Codex",
    manualCta: "Fill the simple form",
    githubCta: "Open the request form",
    plazaCta: "Browse open requests",
    note: "No finished spritesheet or coding experience is required.",
    howEyebrow: "How it works",
    howTitle: "From character idea to community request",
    steps: [
      {
        index: "01",
        title: "Name the character",
        description:
          "The character or concept is the only required field. We handle the version and initial classification.",
      },
      {
        index: "02",
        title: "Add details if useful",
        description:
          "The original work, a public reference link, and visual preferences are optional.",
      },
      {
        index: "03",
        title: "Submit without an account",
        description:
          "Complete the human check and submit. The request enters the public community queue as V2.",
      },
      {
        index: "04",
        title: "Wait for a volunteer",
        description:
          "Contributors can discuss, claim, create, review, and submit the pet. Timing depends on volunteer interest and capacity.",
      },
    ],
    promiseEyebrow: "What the community offers",
    promiseTitle: "A request queue, not a paid commission shop",
    promiseBody:
      "Awesome Codex Pet is an open community gallery. The project does not charge a request fee, and community-made pets are published with creator, source, and usage information. A request can be declined, remain unclaimed, or need better references.",
    afterTitle: "When the pet is published",
    afterBody:
      "It receives a gallery detail page with animation previews and installation options. You can then install it directly from the website on macOS, Linux, or Windows.",
    browseCta: "Browse available pets",
    installCta: "Read the install guide",
    faqTitle: "Codex pet request FAQ",
    faq: [
      {
        question: "Does it cost money to request a Codex pet?",
        answer:
          "No. Opening a request in Awesome Codex Pet is free. The community may create it voluntarily; the project does not promise a completion date or acceptance.",
      },
      {
        question: "Can I request an anime or game character?",
        answer:
          "Yes. You can request anime, game, mascot, animal, meme, object, avatar, or original characters. A public reference is helpful but optional.",
      },
      {
        question: "Do I need to make the spritesheet myself?",
        answer:
          "No. A request only needs a clear character or concept, references, and preferences. Contributors handle production when they choose to claim it.",
      },
    ],
  },
  zh: {
    breadcrumb: "Codex 小宠物画廊",
    pageLabel: "制作申请",
    eyebrow: "免费社区制作申请",
    title: "免费提交喜欢角色的 Codex 小宠物制作申请",
    intro:
      "提交申请本身完全免费。告诉 Awesome Codex Pet 社区你想要哪个动漫角色、游戏人物、吉祥物、动物或原创形象；社区贡献者可能会志愿认领并免费制作，但申请不等于承诺交付。",
    codexCta: "让 Codex 帮我整理申请",
    manualCta: "直接填写简短表单",
    githubCta: "直接填写申请表",
    plazaCta: "先看已有制作请求",
    note: "不需要现成 spritesheet，也不要求会画画或写代码。",
    howEyebrow: "申请流程",
    howTitle: "从喜欢的角色到社区制作申请",
    steps: [
      {
        index: "01",
        title: "填写角色名称",
        description:
          "只要求填写角色或概念名称；版本、初始分类和查重由系统处理。",
      },
      {
        index: "02",
        title: "按需补充资料",
        description:
          "所属作品、公开参考链接和画风偏好都可以不填。",
      },
      {
        index: "03",
        title: "无需账号直接提交",
        description:
          "完成人机验证后即可提交，申请会以 V2 自动进入公开社区队列。",
      },
      {
        index: "04",
        title: "等待社区志愿者认领",
        description:
          "贡献者可以讨论、认领、制作、审查并投稿。完成时间取决于志愿者兴趣和精力。",
      },
    ],
    promiseEyebrow: "社区机制",
    promiseTitle: "这是免费申请队列，不是付费定制商店",
    promiseBody:
      "Awesome Codex Pet 是开放社区画廊，不收取制作申请费用。社区完成的宠物会公开作者、来源与使用说明；申请也可能暂时无人认领、被拒绝，或需要补充更清楚的参考资料。",
    afterTitle: "宠物收录之后",
    afterBody:
      "完成的宠物会获得独立画廊详情页、完整动作预览和安装入口。你可以直接从网站在 macOS、Linux 或 Windows 上一键安装。",
    browseCta: "先浏览现有宠物",
    installCta: "查看安装方法",
    faqTitle: "Codex 小宠物制作申请常见问题",
    faq: [
      {
        question: "申请制作 Codex 小宠物收费吗？",
        answer:
          "不收费。在 Awesome Codex Pet 创建制作申请是免费的，社区可能志愿完成；项目不承诺一定收录，也不承诺完成时间。",
      },
      {
        question: "可以申请动漫或游戏人物吗？",
        answer:
          "可以。动漫、游戏、吉祥物、动物、梗图、物品、头像和原创角色都可以申请；公开参考资料有帮助，但不是必填项。",
      },
      {
        question: "申请人需要自己制作 spritesheet 吗？",
        answer:
          "不需要。申请阶段只要填写角色或概念名称；参考图和偏好都可以不填，有贡献者愿意认领时再由社区完成制作与审查。",
      },
    ],
  },
  ko: {
    breadcrumb: "Codex 펫 갤러리",
    pageLabel: "펫 요청",
    eyebrow: "무료 커뮤니티 요청",
    title: "좋아하는 캐릭터의 Codex 펫을 요청하세요",
    intro:
      "요청 등록은 무료입니다. 원하는 캐릭터, 마스코트, 동물 또는 오리지널 아이디어를 알려 주세요. 커뮤니티 제작자가 무료로 만들 수 있지만 완성이나 채택은 보장되지 않습니다.",
    codexCta: "Codex로 요청 준비",
    manualCta: "간단한 양식 작성",
    githubCta: "요청 양식 열기",
    plazaCta: "기존 요청 보기",
    note: "완성된 spritesheet나 코딩 경험이 필요하지 않습니다.",
    howEyebrow: "진행 방식",
    howTitle: "캐릭터 아이디어에서 커뮤니티 요청까지",
    steps: [
      {
        index: "01",
        title: "캐릭터 이름 입력",
        description: "필수 항목은 캐릭터 또는 콘셉트뿐이며 V2가 자동 선택됩니다.",
      },
      {
        index: "02",
        title: "선택 정보 추가",
        description:
          "원작, 공개 참고 링크와 스타일 선호 사항은 선택입니다.",
      },
      {
        index: "03",
        title: "계정 없이 제출",
        description:
          "사람 인증 후 제출하면 V2 요청이 커뮤니티 대기열에 등록됩니다.",
      },
      {
        index: "04",
        title: "자원 제작자 기다리기",
        description:
          "기여자가 토론, 제작, 검토, 제출할 수 있으며 일정은 관심과 여력에 따라 달라집니다.",
      },
    ],
    promiseEyebrow: "커뮤니티가 제공하는 것",
    promiseTitle: "유료 주문 상점이 아닌 무료 요청 대기열",
    promiseBody:
      "Awesome Codex Pet은 열린 커뮤니티 갤러리입니다. 요청 비용은 없으며 제작자, 출처, 사용 조건을 공개합니다. 요청은 미완료 상태로 남거나 추가 자료가 필요할 수 있습니다.",
    afterTitle: "펫이 공개되면",
    afterBody:
      "애니메이션 미리 보기와 설치 옵션이 있는 상세 페이지가 만들어집니다.",
    browseCta: "현재 펫 보기",
    installCta: "설치 가이드 읽기",
    faqTitle: "Codex 펫 요청 FAQ",
    faq: [
      {
        question: "Codex 펫 요청은 유료인가요?",
        answer: "아니요. 요청은 무료이며 완성 시점이나 채택은 보장되지 않습니다.",
      },
      {
        question: "애니메이션이나 게임 캐릭터도 요청할 수 있나요?",
        answer: "네. 공개 참고 자료는 도움이 되지만 선택 사항입니다.",
      },
      {
        question: "spritesheet를 직접 만들어야 하나요?",
        answer: "아니요. 요청에는 명확한 캐릭터 정보, 참고 자료와 선호 사항만 필요합니다.",
      },
    ],
  },
  ja: {
    breadcrumb: "Codex ペットギャラリー",
    pageLabel: "ペットリクエスト",
    eyebrow: "無料コミュニティリクエスト",
    title: "好きなキャラクターの Codex ペットをリクエスト",
    intro:
      "リクエストは無料です。欲しいキャラクター、マスコット、動物、オリジナル案をコミュニティに伝えましょう。有志が無料で制作する場合がありますが、完成や採用は保証されません。",
    codexCta: "Codex でリクエストを準備",
    manualCta: "簡単なフォームに入力",
    githubCta: "リクエストフォームを開く",
    plazaCta: "既存のリクエストを見る",
    note: "完成した spritesheet やプログラミング経験は不要です。",
    howEyebrow: "仕組み",
    howTitle: "キャラクター案からコミュニティリクエストまで",
    steps: [
      {
        index: "01",
        title: "キャラクター名を入力",
        description:
          "必須なのはキャラクターまたはコンセプトだけで、V2 が自動選択されます。",
      },
      {
        index: "02",
        title: "必要なら情報を追加",
        description:
          "原作、公開参考リンク、スタイルの希望は任意です。",
      },
      {
        index: "03",
        title: "アカウントなしで送信",
        description:
          "人間確認後に送信すると、V2 リクエストがコミュニティキューに入ります。",
      },
      {
        index: "04",
        title: "有志の作者を待つ",
        description:
          "作者は相談、制作、レビュー、投稿を行えます。時期は関心と作業量によります。",
      },
    ],
    promiseEyebrow: "コミュニティの仕組み",
    promiseTitle: "有料依頼店ではなく、無料のリクエストキュー",
    promiseBody:
      "Awesome Codex Pet はオープンなコミュニティギャラリーです。料金はなく、作者、出典、利用条件を公開します。未着手のまま残る場合や追加資料が必要な場合もあります。",
    afterTitle: "ペットが公開されたら",
    afterBody:
      "アニメーションプレビューとインストール方法を備えた詳細ページが作られます。",
    browseCta: "公開済みペットを見る",
    installCta: "インストールガイド",
    faqTitle: "Codex ペットリクエスト FAQ",
    faq: [
      {
        question: "リクエストは有料ですか？",
        answer: "いいえ、無料です。完成時期や採用は保証されません。",
      },
      {
        question: "アニメやゲームのキャラクターも依頼できますか？",
        answer: "はい。公開参考資料があると役立ちますが、必須ではありません。",
      },
      {
        question: "spritesheet を自分で作る必要がありますか？",
        answer: "いいえ。明確なキャラクター情報、参考資料、希望だけで十分です。",
      },
    ],
  },
  es: {
    breadcrumb: "Galería de mascotas Codex",
    pageLabel: "Petición de mascota",
    eyebrow: "Petición comunitaria gratuita",
    title: "Pide una mascota Codex de tu personaje favorito",
    intro:
      "Publicar una petición es gratis. Dinos qué personaje, mascota, animal o idea original quieres. Alguien de la comunidad puede ofrecerse a crearla, pero no se garantiza la entrega ni la aceptación.",
    codexCta: "Preparar mi petición con Codex",
    manualCta: "Completar el formulario simple",
    githubCta: "Abrir el formulario",
    plazaCta: "Ver peticiones abiertas",
    note: "No necesitas un spritesheet terminado ni experiencia programando.",
    howEyebrow: "Cómo funciona",
    howTitle: "De una idea a una petición comunitaria",
    steps: [
      {
        index: "01",
        title: "Escribe el personaje",
        description:
          "Solo el personaje o concepto es obligatorio; V2 se elige automáticamente.",
      },
      {
        index: "02",
        title: "Añade datos opcionales",
        description:
          "La obra, un enlace público y las preferencias visuales son opcionales.",
      },
      {
        index: "03",
        title: "Envía sin una cuenta",
        description:
          "Tras la verificación humana, la petición V2 entra en la cola comunitaria.",
      },
      {
        index: "04",
        title: "Espera a una persona voluntaria",
        description:
          "La comunidad puede debatir, crear, revisar y enviar la mascota según su interés y disponibilidad.",
      },
    ],
    promiseEyebrow: "Qué ofrece la comunidad",
    promiseTitle: "Una cola gratuita, no una tienda de encargos",
    promiseBody:
      "Awesome Codex Pet es una galería comunitaria abierta. No cobra por las peticiones y publica la autoría, fuente y condiciones de uso. Una petición puede quedar pendiente o necesitar mejores referencias.",
    afterTitle: "Cuando se publique",
    afterBody:
      "Tendrá una página propia con animaciones y opciones de instalación para macOS, Linux y Windows.",
    browseCta: "Explorar mascotas disponibles",
    installCta: "Leer la guía de instalación",
    faqTitle: "Preguntas frecuentes",
    faq: [
      {
        question: "¿Cuesta dinero pedir una mascota Codex?",
        answer: "No. Publicar la petición es gratis; no se garantiza la fecha ni la aceptación.",
      },
      {
        question: "¿Puedo pedir un personaje de anime o videojuego?",
        answer: "Sí. Una referencia pública ayuda, pero es opcional.",
      },
      {
        question: "¿Debo crear el spritesheet?",
        answer: "No. Basta con una idea clara, referencias y preferencias.",
      },
    ],
  },
} as const;

export function RequestPageContent({
  locale,
  petCount,
}: {
  locale: Locale;
  petCount: number;
}) {
  const copy = content[locale];
  const requestPrompt = getPetRequestPrompt(locale);

  return (
    <main
      className="mx-auto max-w-[1120px] px-6 pb-24 pt-14 sm:pt-20"
      lang={localeConfig[locale].htmlLang}
    >
      <header className="border-b border-border pb-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link className="hover:text-accent" href="/">
            {copy.breadcrumb}
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span>{copy.pageLabel}</span>
        </nav>
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent">
          {copy.eyebrow}
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-text sm:text-6xl">
          {copy.title}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-text-secondary sm:text-lg">
          {copy.intro}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex h-12 items-center justify-center rounded-lg bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            href="#manual-request-form"
          >
            {copy.manualCta}
          </a>
          <a
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-5 text-sm font-medium text-text transition-colors hover:bg-surface"
            href={buildCodexUrl(requestPrompt)}
          >
            <CodexIcon className="size-5" />
            {copy.codexCta}
          </a>
          <a
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-bg-elevated px-5 text-sm font-medium text-text transition-colors hover:bg-surface"
            href={requestIssueUrl}
            target="_blank"
            rel="noreferrer"
          >
            {copy.githubCta}
          </a>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-bg-elevated px-5 text-sm font-medium text-text transition-colors hover:bg-surface"
            href="/requests"
          >
            {copy.plazaCta}
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted">{copy.note}</p>
      </header>

      <ManualRequestForm />

      <section className="border-b border-border py-14">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          {copy.howEyebrow}
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-text">
          {copy.howTitle}
        </h2>
        <ol className="mt-8 divide-y divide-border border-y border-border">
          {copy.steps.map((step) => (
            <li
              className="grid gap-3 py-6 sm:grid-cols-[64px_0.7fr_1.3fr]"
              key={step.index}
            >
              <span className="font-mono text-sm text-accent">
                {step.index}
              </span>
              <h3 className="text-lg font-semibold text-text">{step.title}</h3>
              <p className="leading-7 text-text-secondary">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-10 border-b border-border py-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {copy.promiseEyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-text">
            {copy.promiseTitle}
          </h2>
        </div>
        <div className="space-y-7 text-base leading-8 text-text-secondary">
          <p>{copy.promiseBody}</p>
          <div className="border-l-2 border-accent pl-5">
            <h3 className="font-semibold text-text">{copy.afterTitle}</h3>
            <p className="mt-2">{copy.afterBody}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <Link className="text-accent hover:underline" href="/#gallery">
              {copy.browseCta} ({petCount})
            </Link>
            <Link
              className="text-accent hover:underline"
              href={localePath(locale, "/install")}
            >
              {copy.installCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <h2 className="text-3xl font-semibold text-text">{copy.faqTitle}</h2>
        <div className="mt-7 divide-y divide-border border-y border-border">
          {copy.faq.map((item) => (
            <article className="grid gap-3 py-6 sm:grid-cols-2" key={item.question}>
              <h3 className="font-semibold leading-7 text-text">
                {item.question}
              </h3>
              <p className="leading-7 text-text-secondary">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
