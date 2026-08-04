"use client";

import Script from "next/script";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { useLocale } from "@/components/locale-provider";

const TURNSTILE_SCRIPT =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const REQUEST_API =
  process.env.NEXT_PUBLIC_STATS_WRITE_API ?? "https://api.codexpet.top";
const BUILD_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme: "auto";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const copy = {
  en: {
    eyebrow: "Online submission",
    title: "Submit a pet request",
    intro: "Enter the character name and a public reference image link. The original work and production preferences are optional.",
    character: "Character or concept",
    characterPlaceholder: "Misaka Mikoto, a golden retriever, my mascot...",
    franchise: "Original work",
    franchisePlaceholder: "Optional",
    reference: "Public reference image (required)",
    referencePlaceholder: "https://example.com/reference.png",
    referenceHelp: "Use a publicly accessible HTTPS image URL.",
    notes: "Anything important",
    notesPlaceholder: "Optional style, prop, expression, or animation preference",
    version: "Pet version",
    versionValue: "V2 · includes 16 look directions",
    submit: "Submit free request",
    pending: "Submitting...",
    loading: "Loading secure form...",
    privacy: "The request will be public in the community queue and synced to GitHub Issues. No account or email is collected.",
    verifyMissing: "The request form is temporarily unavailable. Use Codex or GitHub below.",
    verifyNeeded: "Complete the human verification first.",
    error: "The request could not be submitted. Please try again.",
    success: "Request received. It will appear in the community queue within a few minutes.",
  },
  zh: {
    eyebrow: "在线提交",
    title: "在线提交制作请求",
    intro: "角色名称和公开参考图片链接为必填；所属作品、画风和动作偏好可选。",
    character: "角色或概念",
    characterPlaceholder: "御坂美琴、金毛、我的吉祥物……",
    franchise: "所属作品",
    franchisePlaceholder: "可不填",
    reference: "公开参考图片链接（必填）",
    referencePlaceholder: "粘贴可公开访问的图片 URL（https://...）",
    referenceHelp: "请填写图片链接，不要填写本地文件路径。",
    notes: "重要偏好",
    notesPlaceholder: "可不填，例如画风、道具、表情或动作",
    version: "宠物版本",
    versionValue: "V2 · 包含 16 个环视方向",
    submit: "免费提交申请",
    pending: "正在提交……",
    loading: "正在加载安全表单……",
    privacy: "提交后会公开进入社区队列，并自动同步为 GitHub Issue；不收集账号或邮箱。",
    verifyMissing: "申请表暂时不可用，请使用下方 Codex 或 GitHub 入口。",
    verifyNeeded: "请先完成人机验证。",
    error: "提交失败，请稍后重试。",
    success: "申请已收到，几分钟后会进入社区制作队列。",
  },
  ko: {
    eyebrow: "온라인 제출",
    title: "펫 제작 요청 제출",
    intro: "캐릭터 이름과 공개 참고 이미지 링크가 필수입니다. 원작과 제작 선호는 선택 사항입니다.",
    character: "캐릭터 또는 콘셉트",
    characterPlaceholder: "캐릭터, 동물, 마스코트...",
    franchise: "원작",
    franchisePlaceholder: "선택 사항",
    reference: "공개 참고 이미지 (필수)",
    referencePlaceholder: "https://example.com/reference.png",
    referenceHelp: "공개로 열 수 있는 HTTPS 이미지 URL을 입력하세요.",
    notes: "중요한 요청",
    notesPlaceholder: "선택 사항: 스타일, 소품, 표정, 동작",
    version: "펫 버전",
    versionValue: "V2 · 16개 시선 방향 포함",
    submit: "무료 요청 제출",
    pending: "제출 중...",
    loading: "보안 양식 로드 중...",
    privacy: "커뮤니티 대기열에 공개되고 GitHub Issues로 동기화됩니다. 계정이나 이메일은 수집하지 않습니다.",
    verifyMissing: "요청 양식을 잠시 사용할 수 없습니다. 아래 Codex 또는 GitHub를 이용하세요.",
    verifyNeeded: "사람 인증을 먼저 완료하세요.",
    error: "요청을 제출하지 못했습니다. 다시 시도하세요.",
    success: "요청이 접수되었습니다. 몇 분 안에 커뮤니티 대기열에 표시됩니다.",
  },
  ja: {
    eyebrow: "オンライン送信",
    title: "ペット制作リクエストを送信",
    intro: "キャラクター名と公開参考画像リンクが必須です。原作と制作の希望は任意です。",
    character: "キャラクターまたはコンセプト",
    characterPlaceholder: "キャラクター、動物、マスコット…",
    franchise: "原作",
    franchisePlaceholder: "任意",
    reference: "公開参考画像（必須）",
    referencePlaceholder: "https://example.com/reference.png",
    referenceHelp: "公開アクセスできる HTTPS 画像 URL を入力してください。",
    notes: "大切な希望",
    notesPlaceholder: "任意：スタイル、小物、表情、動き",
    version: "ペットバージョン",
    versionValue: "V2 · 16方向の視線を含む",
    submit: "無料リクエストを送信",
    pending: "送信中…",
    loading: "安全なフォームを読み込み中…",
    privacy: "コミュニティキューで公開され、GitHub Issues に同期されます。アカウントやメールは収集しません。",
    verifyMissing: "フォームは一時利用できません。下の Codex または GitHub を利用してください。",
    verifyNeeded: "人間確認を完了してください。",
    error: "送信できませんでした。もう一度お試しください。",
    success: "リクエストを受け付けました。数分後にコミュニティキューへ表示されます。",
  },
  es: {
    eyebrow: "Envío online",
    title: "Enviar una petición de mascota",
    intro: "El nombre del personaje y un enlace público a una imagen de referencia son obligatorios. La obra y las preferencias son opcionales.",
    character: "Personaje o concepto",
    characterPlaceholder: "Personaje, animal, mascota...",
    franchise: "Obra original",
    franchisePlaceholder: "Opcional",
    reference: "Imagen pública de referencia (obligatoria)",
    referencePlaceholder: "https://example.com/reference.png",
    referenceHelp: "Usa una URL HTTPS de imagen accesible públicamente.",
    notes: "Preferencias importantes",
    notesPlaceholder: "Opcional: estilo, objeto, expresión o animación",
    version: "Versión de mascota",
    versionValue: "V2 · incluye 16 direcciones de mirada",
    submit: "Enviar petición gratis",
    pending: "Enviando...",
    loading: "Cargando formulario seguro...",
    privacy: "Se publicará en la cola comunitaria y se sincronizará con GitHub Issues. No recopilamos cuentas ni correo.",
    verifyMissing: "El formulario no está disponible temporalmente. Usa Codex o GitHub abajo.",
    verifyNeeded: "Completa primero la verificación humana.",
    error: "No se pudo enviar. Inténtalo de nuevo.",
    success: "Petición recibida. Aparecerá en la cola comunitaria en unos minutos.",
  },
} as const;

export function ManualRequestForm() {
  const { locale } = useLocale();
  const text = copy[locale];
  const turnstileContainer = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [siteKey, setSiteKey] = useState(BUILD_SITE_KEY);
  const [configLoaded, setConfigLoaded] = useState(Boolean(BUILD_SITE_KEY));
  const [scriptReady, setScriptReady] = useState(false);
  const [token, setToken] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (BUILD_SITE_KEY) return;
    const controller = new AbortController();
    fetch(`${REQUEST_API}/config/public`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<{ turnstileSiteKey?: string }>;
      })
      .then((config) => setSiteKey(config.turnstileSiteKey || ""))
      .catch(() => {
        if (!controller.signal.aborted) setSiteKey("");
      })
      .finally(() => {
        if (!controller.signal.aborted) setConfigLoaded(true);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!scriptReady || !siteKey || !turnstileContainer.current || !window.turnstile) return;
    widgetId.current = window.turnstile.render(turnstileContainer.current, {
      sitekey: siteKey,
      theme: "auto",
      callback: setToken,
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [scriptReady, siteKey]);

  function resetVerification() {
    setToken("");
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    if (!token) {
      setSuccess(false);
      setMessage(text.verifyNeeded);
      return;
    }
    const form = new FormData(formElement);
    setPending(true);
    setMessage("");
    try {
      const response = await fetch(`${REQUEST_API}/requests/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character: form.get("character"),
          franchise: form.get("franchise"),
          referenceUrl: form.get("referenceUrl"),
          notes: form.get("notes"),
          website: form.get("website"),
          locale,
          turnstileToken: token,
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      formElement.reset();
      setSuccess(true);
      setMessage(text.success);
    } catch {
      setSuccess(false);
      setMessage(text.error);
    } finally {
      resetVerification();
      setPending(false);
    }
  }

  return (
    <section
      className="scroll-mt-20 border-b border-border py-12"
      id="manual-request-form"
    >
      {siteKey ? <Script onLoad={() => setScriptReady(true)} src={TURNSTILE_SCRIPT} /> : null}
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">{text.eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-text">{text.title}</h2>
      <p className="mt-3 max-w-2xl leading-7 text-text-secondary">{text.intro}</p>
      {siteKey ? (
        <form className="mt-8 grid gap-5" onSubmit={submit}>
          <label className="grid gap-2 text-sm font-medium text-text">
            {text.character}
            <input className="h-12 rounded-lg border border-border bg-bg-elevated px-4 outline-none focus:border-accent" maxLength={100} name="character" placeholder={text.characterPlaceholder} required />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-text">
              {text.franchise}
              <input className="h-12 rounded-lg border border-border bg-bg-elevated px-4 outline-none focus:border-accent" maxLength={120} name="franchise" placeholder={text.franchisePlaceholder} />
            </label>
            <label className="grid gap-2 text-sm font-medium text-text">
              {text.reference}
              <input className="h-12 rounded-lg border border-border bg-bg-elevated px-4 outline-none focus:border-accent" maxLength={500} name="referenceUrl" placeholder={text.referencePlaceholder} required type="url" />
              <span className="text-xs font-normal leading-5 text-muted">{text.referenceHelp}</span>
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium text-text">
            {text.notes}
            <textarea className="min-h-28 resize-y rounded-lg border border-border bg-bg-elevated px-4 py-3 outline-none focus:border-accent" maxLength={1000} name="notes" placeholder={text.notesPlaceholder} />
          </label>
          <label className="hidden" aria-hidden="true">
            Website
            <input autoComplete="off" name="website" tabIndex={-1} />
          </label>
          <div className="flex flex-col gap-5 border-t border-border pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">{text.version}</p>
              <p className="mt-1 text-sm font-semibold text-text">{text.versionValue}</p>
              <div className="mt-4 min-h-[65px]" ref={turnstileContainer} />
            </div>
            <button className="inline-flex h-12 min-w-44 items-center justify-center rounded-lg bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-55" disabled={pending || !token} type="submit">
              {pending ? text.pending : text.submit}
            </button>
          </div>
          <p className="text-xs leading-5 text-muted">{text.privacy}</p>
          {message ? <p aria-live="polite" className={`text-sm font-medium ${success ? "text-accent" : "text-[#b42318]"}`} role="status">{message}</p> : null}
        </form>
      ) : configLoaded ? (
        <p className="mt-6 text-sm text-[#b42318]">{text.verifyMissing}</p>
      ) : (
        <p className="mt-6 text-sm text-muted">{text.loading}</p>
      )}
    </section>
  );
}
