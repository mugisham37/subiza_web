import type { ReactNode } from "react";
import type { SiteLocale } from "@subiza/i18n";
import {
  Banner,
  Button,
  ButtonLink,
  ChoiceCard,
  Field,
  Icon,
  Input,
  OtpField,
  PhoneField,
  Tag,
  otpSlotsScript,
} from "@subiza/ui";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  changeNumber,
  chooseWorkspace,
  requestCode,
  saveConsent,
  saveLanguage,
  saveProfile,
  startRecovery,
  submitCode,
} from "@/features/auth/actions";
import type { AuthModel } from "@/features/auth/load";
import "./auth.css";

const PROG = ["phone", "code", "profile", "language", "consent"] as const;

export async function AuthView({
  lang,
  model,
}: {
  lang: SiteLocale;
  model: AuthModel;
}) {
  const t = await getTranslations("auth");
  const tag =
    model.mode === "recover"
      ? t("tagRecover")
      : model.mode === "signin"
        ? t("tagSignin")
        : t("tagStart");
  const showProg = model.mode === "start" && PROG.includes(model.step as (typeof PROG)[number]);
  const stepIndex = PROG.indexOf(model.step as (typeof PROG)[number]);

  return (
    <div className="auth">
      <div className="authmain">
        <header className="authhead">
          <Link href="/" className="blogo">
            <span className="mk">
              <Icon name="audio-lines" size={17} />
            </span>
            <b>Subiza</b>
          </Link>
          <Tag>{tag}</Tag>
        </header>
        <main id="content" className="authbody">
          {showProg ? (
            <div className="prog" aria-hidden="true">
              {PROG.map((key, index) => (
                <i
                  key={key}
                  className={index < stepIndex ? "done" : index === stepIndex ? "now" : undefined}
                />
              ))}
            </div>
          ) : null}
          <div className="screen">
            <Screen lang={lang} model={model} />
          </div>
        </main>
        <footer className="authfoot">
          <p className="microfoot" style={{ textAlign: "left" }}>
            {t("footStore")} · <Link href="/legal/privacy">{t("footPrivacy")}</Link> ·{" "}
            <a href="mailto:ibanga@subiza.rw">ibanga@subiza.rw</a>
          </p>
        </footer>
      </div>
      <aside className="authaside">
        <Aside model={model} />
      </aside>
      <script dangerouslySetInnerHTML={{ __html: otpSlotsScript }} />
    </div>
  );
}

async function Screen({ lang, model }: { lang: SiteLocale; model: AuthModel }) {
  const mode = model.mode === "recover" ? "start" : model.mode;
  const meta = (
    <>
      <input type="hidden" name="locale" value={lang} />
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="entry" value={model.entry} />
    </>
  );
  const hidden = (
    <>
      {meta}
      <div className="hp" aria-hidden="true" inert>
        <input name="company" tabIndex={-1} autoComplete="off" />
      </div>
    </>
  );

  switch (model.step) {
    case "phone":
      return <PhoneScreen model={model} hidden={hidden} />;
    case "code":
      return <CodeScreen model={model} hidden={hidden} meta={meta} />;
    case "profile":
      return <ProfileScreen model={model} hidden={hidden} />;
    case "language":
      return <LanguageScreen hidden={hidden} />;
    case "consent":
      return <ConsentScreen model={model} hidden={hidden} />;
    case "done":
      return <DoneScreen lang={lang} />;
    case "choose":
      return <ChooseScreen model={model} hidden={hidden} />;
    case "blocked":
      return <BlockedScreen />;
    case "recycled":
      return <RecycledScreen />;
    case "recover":
      return <RecoverHub />;
    case "delivery":
      return <RecoverDelivery hidden={meta} phone={model.phone} />;
    case "lost":
      return <RecoverLost />;
    case "changed":
      return <RecoverChanged hidden={hidden} />;
    case "not-me":
    case "dispute":
      return <RecoverHuman kind={model.step} hidden={hidden} />;
    case "sent":
      return <RecoverSent />;
    default:
      return <PhoneScreen model={model} hidden={hidden} />;
  }
}

async function PhoneScreen({
  model,
  hidden,
}: {
  model: AuthModel;
  hidden: ReactNode;
}) {
  const t = await getTranslations("auth");
  const signin = model.mode === "signin";
  return (
    <>
      {model.entry === "demo" ? (
        <div className="entryb">
          <Icon name="phone-call" size={16} />
          <p>{t.rich("entryDemo", { b: (chunk) => <b>{chunk}</b> })}</p>
        </div>
      ) : null}
      {model.entry === "referral" ? (
        <div className="entryb">
          <Icon name="users" size={16} />
          <p>{t("entryReferral")}</p>
        </div>
      ) : null}
      {model.entry === "invite" ? (
        <div className="entryb">
          <Icon name="user-plus" size={16} />
          <p>{t("entryInvite")}</p>
        </div>
      ) : null}
      <h1>{signin ? t("signinTitle") : t("phoneTitle")}</h1>
      <p className="sub">{signin ? t("signinLede") : t("phoneLede")}</p>
      {model.error === "not-rwandan" ? (
        <Banner tone="warn" title={t("notRwTitle")}>
          {t("notRwBody")}
        </Banner>
      ) : null}
      <form action={requestCode}>
        {hidden}
        <Field
          id="phone"
          label={t("phoneLabel")}
          {...(model.error === "not-rwandan" ? { error: t("notRwField") } : {})}
        >
          <PhoneField
            id="phone"
            name="phone"
            required
            maxLength={12}
            placeholder="788 123 456"
            {...(model.phone ? { defaultValue: model.phone.replace("+250", "") } : {})}
          />
        </Field>
        <Button type="submit" tone="primary" size="lg" block>
          {t("send")}
          <Icon name="arrow-right" size={17} />
        </Button>
      </form>
      {model.error === "not-rwandan" ? (
        <a className="fbrow wa" href="https://wa.me/250788782492" style={{ marginTop: "var(--s-6)" }}>
          <span className="fi">
            <Icon name="message-circle-more" size={16} />
          </span>
          <span className="fw">
            <b>{t("messageUs")}</b>
            <span>0788 782 492</span>
          </span>
        </a>
      ) : null}
      <p className="microfoot">{t("noEmail")}</p>
      <p className="microfoot" style={{ marginTop: "var(--s-5)" }}>
        {signin ? (
          <>
            {t("noAccount")} <Link href="/start">{t("startHere")}</Link>
          </>
        ) : (
          <>
            {t("haveAccount")} <Link href="/signin">{t("signIn")}</Link>
          </>
        )}
      </p>
    </>
  );
}

async function CodeScreen({
  model,
  hidden,
  meta,
}: {
  model: AuthModel;
  hidden: ReactNode;
  meta: ReactNode;
}) {
  const t = await getTranslations("auth");
  const described = model.error ? "code-hint code-err" : "code-hint";
  const err =
    model.error === "wrong"
      ? t("wrongCode")
      : model.error === "expired"
        ? t("expiredCode")
        : model.error === "burned"
          ? t("burnedCode")
          : model.error === "throttled"
            ? t("throttledCode")
            : undefined;
  return (
    <>
      <form action={changeNumber}>
        {meta}
        <button className="backlink" type="submit">
          <Icon name="arrow-left" size={14} />
          <span>{t("changeNumber")}</span>
        </button>
      </form>
      <h1>{t("codeTitle")}</h1>
      <p className="sub">
        {t("sentTo")} <b>{model.phoneDisplay}</b> · {t("viaSms")}
      </p>
      {model.error === "throttled" || model.error === "cooldown" ? (
        <Banner tone="warn" title={t("waitTitle")}>
          {t("waitBody")}
        </Banner>
      ) : null}
      <form action={submitCode}>
        {hidden}
        <Field
          id="code"
          label={t("codeLabel")}
          hint={`${t("expires")} ${formatMmss(model.expiresSec)}`}
          {...(err ? { error: err } : {})}
        >
          <OtpField id="code" name="code" invalid={Boolean(err)} describedBy={described} />
        </Field>
        <Button type="submit" tone="primary" size="lg" block>
          {t("continue")}
          <Icon name="arrow-right" size={17} />
        </Button>
      </form>
      <div className="fallbacks">
        <p className="hint" style={{ marginBottom: "var(--s-5)" }}>
          {t("didntGet")}
        </p>
        <Fallback
          hidden={meta}
          phone={model.phone}
          channel="sms"
          icon="message-square-text"
          title={t("resendSms")}
          lede={t("resendSmsLede")}
          wait={model.resendSec}
        />
        <Fallback
          hidden={meta}
          phone={model.phone}
          channel="whatsapp"
          icon="message-circle-more"
          title={t("resendWa")}
          lede={t("resendWaLede")}
          wait={model.whatsappReady ? 0 : Math.max(model.resendSec, 30)}
          wa
        />
        <Fallback
          hidden={meta}
          phone={model.phone}
          channel="voice"
          icon="phone-call"
          title={t("resendVoice")}
          lede={t("resendVoiceLede")}
          wait={model.voiceReady ? 0 : 60}
        />
        <p className="microfoot" style={{ textAlign: "left", marginTop: "var(--s-6)" }}>
          <Link href="/recover">{t("cantGet")}</Link>
        </p>
      </div>
    </>
  );
}

function Fallback({
  hidden,
  phone,
  channel,
  icon,
  title,
  lede,
  wait,
  wa,
}: {
  hidden: ReactNode;
  phone?: string;
  channel: "sms" | "whatsapp" | "voice";
  icon: "message-square-text" | "message-circle-more" | "phone-call";
  title: string;
  lede: string;
  wait: number;
  wa?: boolean;
}) {
  return (
    <form action={requestCode}>
      {hidden}
      <input type="hidden" name="channel" value={channel} />
      <input type="hidden" name="phone" value={phone ?? ""} />
      <button className={wa ? "fbrow wa" : "fbrow"} type="submit">
        <span className="fi">
          <Icon name={icon} size={16} />
        </span>
        <span className="fw">
          <b>{title}</b>
          <span>{lede}</span>
        </span>
        {wait > 0 ? <span className="ft">{wait}s</span> : null}
      </button>
    </form>
  );
}

async function ProfileScreen({
  model,
  hidden,
}: {
  model: AuthModel;
  hidden: ReactNode;
}) {
  const t = await getTranslations("auth");
  return (
    <>
      <h1>{t("nameTitle")}</h1>
      <p className="sub">{t("nameLede")}</p>
      <form action={saveProfile}>
        {hidden}
        <Field id="n1" label={t("yourName")}>
          <Input id="n1" name="name" required autoComplete="given-name" defaultValue={model.name} />
        </Field>
        <Field id="b1" label={t("bizName")} hint={t("bizHint")}>
          <Input id="b1" name="business" required autoComplete="organization" defaultValue={model.business} />
        </Field>
        <div className="type-grid">
          <ChoiceCard id="t-salon" name="type" value="salon" title={t("typeSalon")} description={t("typeSalonD")} defaultChecked />
          <ChoiceCard id="t-clinic" name="type" value="clinic" title={t("typeClinic")} description={t("typeClinicD")} />
          <ChoiceCard id="t-hotel" name="type" value="hotel" title={t("typeHotel")} description={t("typeHotelD")} />
          <ChoiceCard id="t-other" name="type" value="other" title={t("typeOther")} description={t("typeOtherD")} />
        </div>
        <Button type="submit" tone="primary" size="lg" block>
          {t("continue")}
          <Icon name="arrow-right" size={17} />
        </Button>
      </form>
    </>
  );
}

async function LanguageScreen({ hidden }: { hidden: ReactNode }) {
  const t = await getTranslations("auth");
  return (
    <>
      <h1>{t("langTitle")}</h1>
      <p className="sub">{t("langLede")}</p>
      <form action={saveLanguage}>
        {hidden}
        <div className="lang-grid">
          <ChoiceCard id="lg-rw" name="language" value="rw" title="Ikinyarwanda" description="Kinyarwanda" defaultChecked />
          <ChoiceCard id="lg-en" name="language" value="en" title="English" description="Icyongereza" />
          <ChoiceCard id="lg-fr" name="language" value="fr" title="Français" description="Igifaransa" />
          <ChoiceCard id="lg-sw" name="language" value="sw" title="Kiswahili" description="Igiswahili" />
        </div>
        <div style={{ marginTop: "var(--s-8)" }}>
          <Button type="submit" tone="primary" size="lg" block>
            {t("continue")}
            <Icon name="arrow-right" size={17} />
          </Button>
        </div>
      </form>
    </>
  );
}

async function ConsentScreen({
  model,
  hidden,
}: {
  model: AuthModel;
  hidden: ReactNode;
}) {
  const t = await getTranslations("auth");
  return (
    <>
      <h1>{t("termsTitle")}</h1>
      <p className="sub">{t("termsLede")}</p>
      <div className="summ">
        <ul>
          <li>
            <Icon name="server" size={15} />
            <span>{t.rich("sumRwanda", { b: (chunk) => <b>{chunk}</b> })}</span>
          </li>
          <li>
            <Icon name="clock" size={15} />
            <span>{t.rich("sumKeep", { b: (chunk) => <b>{chunk}</b> })}</span>
          </li>
          <li>
            <Icon name="mic" size={15} />
            <span>{t.rich("sumRecord", { b: (chunk) => <b>{chunk}</b> })}</span>
          </li>
          <li>
            <Icon name="bot" size={15} />
            <span>{t.rich("sumDisclose", { b: (chunk) => <b>{chunk}</b> })}</span>
          </li>
          <li>
            <Icon name="eye-off" size={15} />
            <span>{t.rich("sumSell", { b: (chunk) => <b>{chunk}</b> })}</span>
          </li>
          <li>
            <Icon name="undo-2" size={15} />
            <span>{t.rich("sumWithdraw", { b: (chunk) => <b>{chunk}</b> })}</span>
          </li>
        </ul>
        <p className="sfoot">
          <Link href="/legal/terms">{t("termsLink")}</Link> · <Link href="/legal/privacy">{t("privacyLink")}</Link> ·{" "}
          <Link href="/legal/dpa">{t("dpaLink")}</Link> · {t("version")}
        </p>
      </div>
      {model.error === "consent" ? (
        <Banner tone="warn" title={t("acceptToContinue")}>
          {t("contractLede")}
        </Banner>
      ) : null}
      <form action={saveConsent}>
        {hidden}
        <label className="consent">
          <input type="checkbox" name="contract" value="on" required />
          <span className="cbx">
            <Icon name="check" size={13} />
          </span>
          <span className="cw">
            <b>
              {t("contractTitle")}
              <span className="req">{t("required")}</span>
            </b>
            <span>{t("contractLede")}</span>
          </span>
        </label>
        <label className="consent">
          <input type="checkbox" name="marketing" />
          <span className="cbx">
            <Icon name="check" size={13} />
          </span>
          <span className="cw">
            <b>
              {t("marketTitle")}
              <span className="req">{t("optional")}</span>
            </b>
            <span>{t("marketLede")}</span>
          </span>
        </label>
        <div className="notyet">
          <Icon name="info" size={14} />
          <p style={{ margin: 0 }}>{t.rich("notOnThisPage", { b: (chunk) => <b>{chunk}</b> })}</p>
        </div>
        <div style={{ marginTop: "var(--s-8)" }}>
          <Button type="submit" tone="primary" size="lg" block>
            {t("create")}
            <Icon name="arrow-right" size={17} />
          </Button>
        </div>
        <p className="microfoot">{t("acceptToContinue")}</p>
      </form>
    </>
  );
}

async function DoneScreen({ lang }: { lang: SiteLocale }) {
  const t = await getTranslations("auth");
  return (
    <div style={{ textAlign: "center" }}>
      <div className="donemark">
        <Icon name="check" size={34} />
      </div>
      <h1>{t("doneTitle")}</h1>
      <p className="sub" style={{ maxWidth: "36ch", marginLeft: "auto", marginRight: "auto" }}>
        {t("doneLede")}
      </p>
      <ButtonLink href={`/${lang}/activate`} tone="primary" size="lg" block>
        {t("toAgent")}
        <Icon name="arrow-right" size={17} />
      </ButtonLink>
    </div>
  );
}

async function ChooseScreen({
  model,
  hidden,
}: {
  model: AuthModel;
  hidden: ReactNode;
}) {
  const t = await getTranslations("auth");
  return (
    <>
      <h1>{t("chooseTitle")}</h1>
      <p className="sub">{t("chooseLede")}</p>
      {model.workspaces.map((ws) => (
        <form action={chooseWorkspace} key={ws.tenantId}>
          {hidden}
          <input type="hidden" name="tenant" value={ws.tenantId} />
          <button className="wsopt" type="submit">
            <span className="wa">{initials(ws.name)}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <b>{ws.name}</b>
              <span>{ws.role}</span>
            </span>
          </button>
        </form>
      ))}
      <p className="microfoot">{t("chooseMissing")}</p>
    </>
  );
}

async function BlockedScreen() {
  const t = await getTranslations("auth");
  return (
    <>
      <Banner tone="warn" title={t("blockedTitle")}>
        {t("blockedBody")}
      </Banner>
      <h1>{t("blockedH1")}</h1>
      <p className="sub">{t("blockedLede")}</p>
      <a className="fbrow wa" href="https://wa.me/250788782492">
        <span className="fi">
          <Icon name="message-circle-more" size={16} />
        </span>
        <span className="fw">
          <b>{t("messageUs")}</b>
          <span>0788 782 492</span>
        </span>
      </a>
    </>
  );
}

async function RecycledScreen() {
  const t = await getTranslations("auth");
  return (
    <>
      <h1>{t("recycledTitle")}</h1>
      <p className="sub">{t("recycledLede")}</p>
      <Link href="/recover/not-me" className="recopt">
        <span className="ri">
          <Icon name="shield" size={18} />
        </span>
        <span style={{ flex: 1 }}>
          <b>{t("notMyAccount")}</b>
          <span>{t("notMyAccountLede")}</span>
        </span>
      </Link>
      <a className="fbrow wa" href="https://wa.me/250788782492">
        <span className="fi">
          <Icon name="message-circle-more" size={16} />
        </span>
        <span className="fw">
          <b>{t("messageUs")}</b>
          <span>0788 782 492</span>
        </span>
      </a>
    </>
  );
}

async function RecoverHub() {
  const t = await getTranslations("auth");
  return (
    <>
      <Link href="/signin" className="backlink">
        <Icon name="arrow-left" size={14} />
        <span>{t("back")}</span>
      </Link>
      <h1>{t("recoverTitle")}</h1>
      <p className="sub">{t("recoverLede")}</p>
      <Link href="/recover/delivery" className="recopt">
        <span className="ri">
          <Icon name="signal" size={18} />
        </span>
        <span style={{ flex: 1 }}>
          <b>{t("recDelivery")}</b>
          <span>{t("recDeliveryLede")}</span>
        </span>
      </Link>
      <Link href="/recover/lost" className="recopt">
        <span className="ri">
          <Icon name="smartphone" size={18} />
        </span>
        <span style={{ flex: 1 }}>
          <b>{t("recLost")}</b>
          <span>{t("recLostLede")}</span>
        </span>
      </Link>
      <Link href="/recover/changed" className="recopt">
        <span className="ri">
          <Icon name="move-horizontal" size={18} />
        </span>
        <span style={{ flex: 1 }}>
          <b>{t("recChanged")}</b>
          <span>{t("recChangedLede")}</span>
        </span>
      </Link>
      <Link href="/recover/not-me" className="recopt">
        <span className="ri">
          <Icon name="shield" size={18} />
        </span>
        <span style={{ flex: 1 }}>
          <b>{t("recNotMe")}</b>
          <span>{t("recNotMeLede")}</span>
        </span>
      </Link>
      <Link href="/recover/dispute" className="recopt">
        <span className="ri">
          <Icon name="users" size={18} />
        </span>
        <span style={{ flex: 1 }}>
          <b>{t("recDispute")}</b>
          <span>{t("recDisputeLede")}</span>
        </span>
      </Link>
    </>
  );
}

async function RecoverDelivery({ hidden, phone }: { hidden: ReactNode; phone: string }) {
  const t = await getTranslations("auth");
  return (
    <>
      <Link href="/recover" className="backlink">
        <Icon name="arrow-left" size={14} />
        <span>{t("back")}</span>
      </Link>
      <h1>{t("tryOther")}</h1>
      <p className="sub">{t("tryOtherLede")}</p>
      <Fallback hidden={hidden} phone={phone} channel="whatsapp" icon="message-circle-more" title={t("resendWa")} lede={t("waNet")} wait={0} wa />
      <Fallback hidden={hidden} phone={phone} channel="voice" icon="phone-call" title={t("resendVoice")} lede={t("voiceNoData")} wait={0} />
      <a className="fbrow" href="https://wa.me/250788782492">
        <span className="fi">
          <Icon name="life-buoy" size={16} />
        </span>
        <span className="fw">
          <b>{t("messagePerson")}</b>
          <span>0788 782 492 · {t("hours")}</span>
        </span>
      </a>
    </>
  );
}

async function RecoverLost() {
  const t = await getTranslations("auth");
  return (
    <>
      <Link href="/recover" className="backlink">
        <Icon name="arrow-left" size={14} />
        <span>{t("back")}</span>
      </Link>
      <h1>{t("getNumber")}</h1>
      <p className="sub">{t("getNumberLede")}</p>
      <Banner tone="info" title={t("takeWith")}>
        {t("takeWithBody")}
      </Banner>
      <a className="fbrow wa" href="https://wa.me/250788782492" style={{ marginTop: "var(--s-6)" }}>
        <span className="fi">
          <Icon name="message-circle-more" size={16} />
        </span>
        <span className="fw">
          <b>{t("messageUs")}</b>
          <span>0788 782 492</span>
        </span>
      </a>
    </>
  );
}

async function RecoverChanged({ hidden }: { hidden: ReactNode }) {
  const t = await getTranslations("auth");
  return (
    <RecoverHuman kind="changed" hidden={hidden} />
  );
}

async function RecoverHuman({
  kind,
  hidden,
}: {
  kind: string;
  hidden: ReactNode;
}) {
  const t = await getTranslations("auth");
  return (
    <>
      <Link href="/recover" className="backlink">
        <Icon name="arrow-left" size={14} />
        <span>{t("back")}</span>
      </Link>
      <h1>{t("humanTitle")}</h1>
      <p className="sub">{t("humanLede")}</p>
      <div className="asidecard" style={{ marginBottom: "var(--s-7)" }}>
        <h3>{t("askFor")}</h3>
        <ul>
          <li>
            <Icon name="badge-check" size={15} />
            <span>{t("askId")}</span>
          </li>
          <li>
            <Icon name="building-2" size={15} />
            <span>{t("askRdb")}</span>
          </li>
          <li>
            <Icon name="hand-coins" size={15} />
            <span>{t("askMomo")}</span>
          </li>
        </ul>
      </div>
      <form action={startRecovery}>
        {hidden}
        <input type="hidden" name="kind" value={kind} />
        <Button type="submit" tone="primary" size="lg" block>
          {t("startHuman")}
          <Icon name="arrow-right" size={17} />
        </Button>
      </form>
      <p className="microfoot">{t("humanFoot")}</p>
    </>
  );
}

async function RecoverSent() {
  const t = await getTranslations("auth");
  return (
    <>
      <h1>{t("recSentTitle")}</h1>
      <p className="sub">{t("recSentLede")}</p>
      <a className="fbrow wa" href="https://wa.me/250788782492">
        <span className="fi">
          <Icon name="message-circle-more" size={16} />
        </span>
        <span className="fw">
          <b>{t("messageUs")}</b>
          <span>0788 782 492</span>
        </span>
      </a>
    </>
  );
}

async function Aside({ model }: { model: AuthModel }) {
  const t = await getTranslations("auth");
  const step = model.step;
  if (step === "code") {
    return (
      <>
        <div className="asidecard">
          <h3>{t("asideCodeTitle")}</h3>
          <p>{t("asideCodeBody")}</p>
        </div>
        <div className="asidecard">
          <h3>{t("asideCaptchaTitle")}</h3>
          <p>{t("asideCaptchaBody")}</p>
        </div>
      </>
    );
  }
  if (step === "profile") {
    return (
      <>
        <div className="gprev">
          <div className="gl">
            <Icon name="volume-2" size={14} />
            <span>{t("asideHear")}</span>
          </div>
          <p className="gq">
            Muraho, <mark>{model.business || "—"}</mark>. Ndi umufasha wa <mark>{model.name || "—"}</mark>.
          </p>
          <p className="gt">{t("asideHearEn")}</p>
        </div>
      </>
    );
  }
  if (step === "language") {
    return (
      <>
        <div className="asidecard">
          <h3>{t("asideLangTitle")}</h3>
          <p>{t.rich("asideLangBody", { b: (chunk) => <b>{chunk}</b> })}</p>
        </div>
        <div className="asidecard">
          <h3>{t("asideRwTitle")}</h3>
          <p>{t("asideRwBody")}</p>
        </div>
      </>
    );
  }
  if (step === "consent") {
    return (
      <>
        <div className="asidecard">
          <h3>{t("asideTwoTitle")}</h3>
          <p>{t("asideTwoBody")}</p>
        </div>
      </>
    );
  }
  if (step === "choose") {
    return (
      <>
        <div className="asidecard">
          <h3>{t("chooseTitle")}</h3>
          <p>{t("chooseLede")}</p>
        </div>
        <div className="asidecard">
          <h3>{t("asideNeverTitle")}</h3>
          <p>{t("asideNeverBody")}</p>
        </div>
      </>
    );
  }
  if (step === "done") {
    return (
      <div className="gprev">
        <div className="gl">
          <Icon name="phone-call" size={14} />
          <span>{t("asideNext")}</span>
        </div>
        <p className="gq">{t("asideNextBody")}</p>
      </div>
    );
  }
  if (model.mode === "recover" || step === "recycled") {
    return (
      <>
        <div className="asidecard">
          <h3>{t("asideRecTitle")}</h3>
          <p>{t("asideRecBody")}</p>
        </div>
        <div className="asidecard">
          <h3>{t("asideNeverTitle")}</h3>
          <p>{t("asideNeverBody")}</p>
        </div>
      </>
    );
  }
  if (model.mode === "signin") {
    return (
      <>
        <div className="asidecard">
          <h3>{t("asideWhyTitle")}</h3>
          <ul>
            <li>
              <Icon name="check" size={15} />
              <span>{t("asideWhy1")}</span>
            </li>
            <li>
              <Icon name="check" size={15} />
              <span>{t("asideWhy3")}</span>
            </li>
          </ul>
        </div>
        <div className="asidecard">
          <h3>{t("asideNeverTitle")}</h3>
          <p>{t("asideNeverBody")}</p>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="asidecard">
        <h3>{t("asideWhyTitle")}</h3>
        <ul>
          <li>
            <Icon name="check" size={15} />
            <span>{t("asideWhy1")}</span>
          </li>
          <li>
            <Icon name="check" size={15} />
            <span>{t("asideWhy2")}</span>
          </li>
          <li>
            <Icon name="check" size={15} />
            <span>{t("asideWhy3")}</span>
          </li>
        </ul>
      </div>
      <div className="asidecard">
        <h3>{t("asideTwoMin")}</h3>
        <p>{t("asideTwoMinBody")}</p>
      </div>
    </>
  );
}

function formatMmss(total: number): string {
  const minutes = Math.floor(Math.max(0, total) / 60);
  const seconds = Math.max(0, total) % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
