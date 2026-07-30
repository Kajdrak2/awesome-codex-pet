import Link from "next/link";

import { CodexIcon } from "@/components/codex-icon";
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
    githubCta: "Open the request form",
    plazaCta: "Browse open requests",
    note: "No finished spritesheet or coding experience is required.",
    howEyebrow: "How it works",
    howTitle: "From character idea to community request",
    steps: [
      {
        index: "01",
        title: "Check the gallery",
        description:
          "Search the pet gallery and open requests first so the community does not duplicate an existing character.",
      },
      {
        index: "02",
        title: "Share recognizable references",
        description:
          "Provide the character name, original work, a public or GitHub-hosted reference image, and the visual details that matter.",
      },
      {
        index: "03",
        title: "Publish the free request",
        description:
          "Codex can organize the information and open the GitHub request, or you can fill in the community form yourself.",
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
          "Yes. You can request anime, game, mascot, animal, meme, object, avatar, or original characters. Include a recognizable official or public reference and honest source notes.",
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
    githubCta: "直接填写申请表",
    plazaCta: "先看已有制作请求",
    note: "不需要现成 spritesheet，也不要求会画画或写代码。",
    howEyebrow: "申请流程",
    howTitle: "从喜欢的角色到社区制作申请",
    steps: [
      {
        index: "01",
        title: "先搜索画廊",
        description:
          "先搜索宠物画廊和已有申请，确认喜欢的角色尚未收录，避免社区重复制作。",
      },
      {
        index: "02",
        title: "提供清楚的角色参考",
        description:
          "填写角色名称、所属作品、公开或 GitHub 可访问的参考图，以及最重要的外观和动作特点。",
      },
      {
        index: "03",
        title: "免费发布制作申请",
        description:
          "可以让 Codex 自动查重、整理资料并创建 GitHub Issue，也可以自己填写社区申请表。",
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
          "可以。动漫、游戏、吉祥物、动物、梗图、物品、头像和原创角色都可以申请。请提供能辨认角色的官方或公开参考资料，并如实填写来源。",
      },
      {
        question: "申请人需要自己制作 spritesheet 吗？",
        answer:
          "不需要。申请阶段只要说明角色或概念、提供参考图和偏好；有贡献者愿意认领时，再由社区完成制作与审查。",
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
    githubCta: "요청 양식 열기",
    plazaCta: "기존 요청 보기",
    note: "완성된 spritesheet나 코딩 경험이 필요하지 않습니다.",
    howEyebrow: "진행 방식",
    howTitle: "캐릭터 아이디어에서 커뮤니티 요청까지",
    steps: [
      {
        index: "01",
        title: "갤러리 확인",
        description: "같은 캐릭터가 이미 있는지 갤러리와 요청을 먼저 검색합니다.",
      },
      {
        index: "02",
        title: "알아볼 수 있는 참고 자료 제공",
        description:
          "캐릭터 이름, 원작, 공개 참고 이미지와 중요한 외형 정보를 제공합니다.",
      },
      {
        index: "03",
        title: "무료 요청 게시",
        description:
          "Codex가 정보를 정리해 GitHub 요청을 만들거나 직접 양식을 작성할 수 있습니다.",
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
        answer: "네. 알아볼 수 있는 공개 참고 자료와 정확한 출처를 포함해 주세요.",
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
    githubCta: "リクエストフォームを開く",
    plazaCta: "既存のリクエストを見る",
    note: "完成した spritesheet やプログラミング経験は不要です。",
    howEyebrow: "仕組み",
    howTitle: "キャラクター案からコミュニティリクエストまで",
    steps: [
      {
        index: "01",
        title: "ギャラリーを確認",
        description:
          "同じキャラクターの重複を避けるため、ギャラリーと既存リクエストを検索します。",
      },
      {
        index: "02",
        title: "分かりやすい参考資料を共有",
        description:
          "キャラクター名、原作、公開参考画像、重要な外見や動作を記載します。",
      },
      {
        index: "03",
        title: "無料リクエストを公開",
        description:
          "Codex に情報整理と GitHub Issue 作成を任せるか、自分でフォームを入力します。",
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
        answer: "はい。判別できる公開参考資料と正確な出典を添えてください。",
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
    githubCta: "Abrir el formulario",
    plazaCta: "Ver peticiones abiertas",
    note: "No necesitas un spritesheet terminado ni experiencia programando.",
    howEyebrow: "Cómo funciona",
    howTitle: "De una idea a una petición comunitaria",
    steps: [
      {
        index: "01",
        title: "Revisa la galería",
        description:
          "Busca primero en la galería y en las peticiones para evitar duplicados.",
      },
      {
        index: "02",
        title: "Comparte referencias reconocibles",
        description:
          "Incluye el personaje, su obra, una imagen pública y los detalles visuales importantes.",
      },
      {
        index: "03",
        title: "Publica la petición gratuita",
        description:
          "Codex puede organizar los datos y abrir el Issue, o puedes completar el formulario.",
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
        answer: "Sí. Incluye una referencia pública reconocible y datos honestos sobre la fuente.",
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
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
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
