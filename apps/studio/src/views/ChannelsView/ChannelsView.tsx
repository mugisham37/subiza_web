import {
  Banner,
  Button,
  DeniedState,
  Field,
  Icon,
  Input,
  PhoneField,
  WizardShell,
} from "@subiza/ui";
import {
  COEX_HISTORY_DAYS,
  COEX_MEDIA_DAYS,
  COEX_PHASES,
  COEX_THROUGHPUT_MPS,
  COEX_WINDOW_HOURS,
  CODE_TTL_SECONDS,
  IG_PRIVATE_REPLY_PER_COMMENT,
  IG_TOKEN_DAYS,
  IG_WINDOW_HOURS,
  META_VERIFICATION_MAX,
  META_VERIFICATION_MIN,
  WA_FREE_SERVICE_PER_NUMBER,
  WA_TIER_LADDER,
  WA_WINDOW_HOURS,
  type MessagingChannel,
  type MessagingStep,
} from "@subiza/domain";
import { getTranslations } from "next-intl/server";
import {
  acceptPaymentAction,
  answerPreflightAction,
  backToConnectionsAction,
  checkInstagramAction,
  chooseRouteAction,
  confirmCoexAction,
  createBotFatherAction,
  createManagedBotAction,
  openMetaAction,
  reconnectAction,
  relaunchMetaAction,
  submitDisplayNameAction,
} from "@/features/channels/actions";
import { loadChannels } from "@/features/channels/load";
import { hrefForChannel } from "@/features/channels/steps";
import { ChannelAside } from "./asides";

export async function ChannelsView({
  channel,
  step,
  search,
}: {
  channel: MessagingChannel;
  step: MessagingStep;
  search?: Record<string, string | string[] | undefined>;
}) {
  const model = await loadChannels(channel, step, search ?? {});
  const t = await getTranslations("channel");
  const hideProg = step === "brk" || model.progressNow === 0;
  const figures = modelFigures(model.billFrom, model.tenant.name, model.botUsername, model.ownerDisplay, model.since);
  return (
    <WizardShell
      brandHref="/connections"
      tag={t("tag")}
      tagTone={model.channels.telegram.status === "working" || model.channels.whatsapp.status === "working" ? "ok" : "neutral"}
      {...(hideProg ? {} : { progress: 4, progressNow: Math.max(0, model.progressNow - 1) })}
      aside={<ChannelAside step={step} />}
      footer={
        <p className="microfoot" style={{ textAlign: "left" }}>
          {t("foot")} · {t("privacy")}
        </p>
      }
    >
      {model.denied ? (
        <DeniedState title={t("deniedTitle")} body={t("deniedBody")} />
      ) : (
        <StepScreen step={step} model={model} figures={figures} />
      )}
    </WizardShell>
  );
}

function modelFigures(billFrom: string, tenant: string, username: string, number: string, since: string | null) {
  return {
    minDays: META_VERIFICATION_MIN,
    maxDays: META_VERIFICATION_MAX,
    ttl: CODE_TTL_SECONDS,
    history: COEX_HISTORY_DAYS,
    phases: COEX_PHASES,
    window: COEX_WINDOW_HOURS,
    media: COEX_MEDIA_DAYS,
    mps: COEX_THROUGHPUT_MPS,
    tier0: WA_TIER_LADDER[0],
    free: WA_FREE_SERVICE_PER_NUMBER,
    billFrom,
    waWindow: WA_WINDOW_HOURS,
    igWindow: IG_WINDOW_HOURS,
    tokenDays: IG_TOKEN_DAYS,
    replies: IG_PRIVATE_REPLY_PER_COMMENT,
    tenant,
    username,
    number,
    since: since ?? "—",
  };
}

async function StepScreen({
  step,
  model,
  figures,
}: {
  step: MessagingStep;
  model: Awaited<ReturnType<typeof loadChannels>>;
  figures: ReturnType<typeof modelFigures>;
}) {
  if (step === "tg1") return <Tg1Screen model={model} figures={figures} />;
  if (step === "tg2") return <Tg2Screen model={model} figures={figures} />;
  if (step === "wa1") return <Wa1Screen figures={figures} />;
  if (step === "wa2") return <Wa2Screen figures={figures} />;
  if (step === "wa3") return <Wa3Screen figures={figures} unavailable={model.channels.whatsapp.coexistenceUnavailable} />;
  if (step === "wa4") return <Wa4Screen figures={figures} expired={model.force === "expired"} />;
  if (step === "wa5") return <Wa5Screen figures={figures} screen={model.metaScreen} expired={model.channels.whatsapp.codeExpired || model.force === "expired"} />;
  if (step === "wa6") return <Wa6Screen figures={figures} queued={model.channels.whatsapp.queuePosition} />;
  if (step === "wa7") return <Wa7Screen figures={figures} />;
  if (step === "wa8") return <Wa8Screen figures={figures} />;
  if (step === "wa9") return <Wa9Screen figures={figures} />;
  if (step === "ig1") return <Ig1Screen figures={figures} still={model.stillPersonal} />;
  if (step === "ig2") return <Ig2Screen figures={figures} />;
  return <BrkScreen figures={figures} />;
}

async function Tg1Screen({
  model,
  figures,
}: {
  model: Awaited<ReturnType<typeof loadChannels>>;
  figures: ReturnType<typeof modelFigures>;
}) {
  const t = await getTranslations("channel");
  const done = model.telegramDone || model.channels.telegram.status === "working";
  return (
    <>
      <a className="backlink" href="/connections">
        <Icon name="arrow-left" size={14} />
        {t("back")}
      </a>
      <h1>{t("tg1title")}</h1>
      <p className="sub">{t("tg1lede")}</p>
      <div className="handoff">
        <div className="hh">
          <span className="hm tg">TG</span>
          <div>
            <b>{t("tg1hh")}</b>
            <span>{t("tg1hs")}</span>
          </div>
        </div>
        <ol className="mscreens">
          <li>{t("tg1s1")}</li>
          <li className="you">
            <b>{t("tg1s2")}</b>
            <span className="tagme">{t("you")}</span>
          </li>
          <li>{t("tg1s3")}</li>
        </ol>
      </div>
      {done ? (
        <>
          <div className="botcard">
            <span className="ba">{figures.tenant.slice(0, 2).toUpperCase()}</span>
            <div>
              <b>{figures.tenant}</b>
              <span>@{figures.username}</span>
            </div>
          </div>
          <form action={backToConnectionsAction}>
            <Button type="submit" size="lg" block style={{ marginTop: "var(--s-6)" }}>
              {t("done")}
              <Icon name="arrow-right" size={16} />
            </Button>
          </form>
        </>
      ) : (
        <form action={createManagedBotAction}>
          <Button type="submit" size="lg" block style={{ marginTop: "var(--s-7)" }}>
            {t("tgOpen")}
            <Icon name="external-link" size={16} />
          </Button>
        </form>
      )}
      <p className="microfoot" style={{ marginTop: "var(--s-6)" }}>
        <a href={hrefForChannel("telegram", "tg2")}>{t("tgOlder")}</a>
      </p>
    </>
  );
}

async function Tg2Screen({
  model,
  figures,
}: {
  model: Awaited<ReturnType<typeof loadChannels>>;
  figures: ReturnType<typeof modelFigures>;
}) {
  const t = await getTranslations("channel");
  return (
    <>
      <a className="backlink" href={hrefForChannel("telegram", "tg1")}>
        <Icon name="arrow-left" size={14} />
        {t("back")}
      </a>
      <h1>{t("tg2title")}</h1>
      <p className="sub">{t("tg2lede")}</p>
      <div className="cmdblock">
        <span className="c">1.</span> {t("tg2c1")} <span className="k">@BotFather</span>
        <br />
        <span className="c">2.</span> {t("tg2c2")} <span className="k">/newbot</span>
        <br />
        <span className="c">3.</span> {t("tg2c3")}: <span className="k">{figures.tenant}</span>
        <br />
        <span className="c">4.</span> {t("tg2c4")}: <span className="k">{figures.username}</span>
        <br />
        <span className="c">5.</span> {t("tg2c5")}
      </div>
      <form action={createBotFatherAction}>
        <Field id="tok" label={t("tg2token")} hint={model.tokenInvalid ? t("tg2bad") : t("tg2hint")} {...(model.tokenInvalid ? { error: t("tg2bad") } : {})}>
          <div className="tokenbox">
            <Input id="tok" name="token" className="inp" autoComplete="off" required placeholder="8014223951:AAH..." />
          </div>
        </Field>
        <Button type="submit" size="lg" block>
          {t("done")}
          <Icon name="arrow-right" size={16} />
        </Button>
      </form>
    </>
  );
}

async function Wa1Screen({ figures }: { figures: ReturnType<typeof modelFigures> }) {
  const t = await getTranslations("channel");
  return (
    <>
      <a className="backlink" href="/connections">
        <Icon name="arrow-left" size={14} />
        {t("back")}
      </a>
      <h1>{t("wa1title")}</h1>
      <p className="sub">{t("wa1lede")}</p>
      <form action={answerPreflightAction}>
        <div className="qcard">
          <div className="qh">
            <b>{t("wa1q1")}</b>
          </div>
          <div className="qa" style={{ padding: "var(--s-6)" }}>
            <PhoneField id="number" name="number" defaultValue="788 123 456" required />
          </div>
        </div>
        <div className="qcard">
          <div className="qh">
            <b>{t("wa1q2")}</b>
            <span>{t("wa1q2d")}</span>
          </div>
          <div className="qa">
            <label>
              <input type="radio" name="alreadyOnWa" value="yes" required />
              <span>{t("yes")}</span>
            </label>
            <label>
              <input type="radio" name="alreadyOnWa" value="no" />
              <span>{t("no")}</span>
            </label>
          </div>
        </div>
        <div className="qcard">
          <div className="qh">
            <b>{t("wa1q3")}</b>
            <span>{t("wa1q3d")}</span>
          </div>
          <div className="qa">
            <label>
              <input type="radio" name="rdb" value="yes" required />
              <span>{t("yes")}</span>
            </label>
            <label>
              <input type="radio" name="rdb" value="no" />
              <span>{t("notYet")}</span>
            </label>
          </div>
        </div>
        <Button type="submit" size="lg" block>
          {t("continue")}
          <Icon name="arrow-right" size={16} />
        </Button>
        <p className="microfoot">{t("wa1need", figures)}</p>
      </form>
    </>
  );
}

async function Wa2Screen({ figures }: { figures: ReturnType<typeof modelFigures> }) {
  const t = await getTranslations("channel");
  return (
    <>
      <a className="backlink" href={hrefForChannel("whatsapp", "wa1")}>
        <Icon name="arrow-left" size={14} />
        {t("back")}
      </a>
      <h1>{t("wa2title")}</h1>
      <p className="sub">{t("wa2lede")}</p>
      <form action={chooseRouteAction}>
        <div className="routes">
          <label className="route">
            <input type="radio" name="route" value="move" defaultChecked />
            <span className="rb">
              <span className="rt">
                <span className="rn">
                  <Icon name="check" size={12} />
                </span>
                <span>
                  <h4>{t("wa2move")}</h4>
                  <p className="rd">{t("wa2moved")}</p>
                </span>
              </span>
              <span className="tradeoffs">
                <span className="tradeoff good">
                  <Icon name="check" size={14} />
                  {t("wa2moveg")}
                </span>
                <span className="tradeoff bad">
                  <Icon name="x" size={14} />
                  {t("wa2moveb")}
                </span>
              </span>
            </span>
          </label>
          <label className="route">
            <input type="radio" name="route" value="coex" />
            <span className="rb">
              <span className="rt">
                <span className="rn">
                  <Icon name="check" size={12} />
                </span>
                <span>
                  <h4>{t("wa2coex")}</h4>
                  <p className="rd" dangerouslySetInnerHTML={{ __html: t.raw("wa2coexd") }} />
                </span>
              </span>
              <span className="tradeoffs">
                <span className="tradeoff good">
                  <Icon name="check" size={14} />
                  {t("wa2coexg")}
                </span>
                <span className="tradeoff bad">
                  <Icon name="x" size={14} />
                  {t("wa2coexb1", figures)}
                </span>
                <span className="tradeoff bad">
                  <Icon name="x" size={14} />
                  {t("wa2coexb2", figures)}
                </span>
                <span className="tradeoff bad">
                  <Icon name="x" size={14} />
                  {t("wa2coexb3")}
                </span>
                <span className="tradeoff bad">
                  <Icon name="x" size={14} />
                  {t("wa2coexb4", figures)}
                </span>
              </span>
            </span>
          </label>
          <label className="route">
            <input type="radio" name="route" value="other" />
            <span className="rb">
              <span className="rt">
                <span className="rn">
                  <Icon name="check" size={12} />
                </span>
                <span>
                  <h4>{t("wa2other")}</h4>
                  <p className="rd">{t("wa2otherd")}</p>
                </span>
              </span>
              <span className="tradeoffs">
                <span className="tradeoff good">
                  <Icon name="check" size={14} />
                  {t("wa2otherg")}
                </span>
                <span className="tradeoff bad">
                  <Icon name="x" size={14} />
                  {t("wa2otherb")}
                </span>
              </span>
            </span>
          </label>
        </div>
        <Button type="submit" size="lg" block style={{ marginTop: "var(--s-7)" }}>
          {t("continue")}
          <Icon name="arrow-right" size={16} />
        </Button>
      </form>
    </>
  );
}

async function Wa3Screen({
  figures,
  unavailable,
}: {
  figures: ReturnType<typeof modelFigures>;
  unavailable: boolean;
}) {
  const t = await getTranslations("channel");
  return (
    <>
      <a className="backlink" href={hrefForChannel("whatsapp", "wa2")}>
        <Icon name="arrow-left" size={14} />
        {t("back")}
      </a>
      <Banner tone="warn" title={t("wa3read")}>
        <span dangerouslySetInnerHTML={{ __html: t.raw("wa3once") }} />
      </Banner>
      <h1>{t("wa3title", figures)}</h1>
      <div className="track" style={{ marginTop: "var(--s-7)" }}>
        <div className="tkrow now">
          <div className="tb">
            <b>{t("wa3k1")}</b>
            <span>{t("wa3k1d")}</span>
          </div>
          <span className="tt">{t("wa3k1t", figures)}</span>
        </div>
        <div className="tkrow">
          <div className="tb">
            <b>{t("wa3k2", figures)}</b>
            <span>{t("wa3k2d", figures)}</span>
          </div>
          <span className="tt">{t("wa3k2t", figures)}</span>
        </div>
        <div className="tkrow">
          <div className="tb">
            <b>{t("wa3k3")}</b>
            <span>{t("wa3k3d")}</span>
          </div>
          <span className="tt">—</span>
        </div>
      </div>
      <Banner tone="info" title={t("wa3rw")}>
        {unavailable ? t("wa3rwOff") : t("wa3rwd")}
      </Banner>
      <form action={confirmCoexAction}>
        <Button type="submit" size="lg" block style={{ marginTop: "var(--s-8)" }}>
          {t("wa3go")}
          <Icon name="arrow-right" size={16} />
        </Button>
      </form>
      <p className="microfoot" style={{ marginTop: "var(--s-6)" }}>
        <a href={hrefForChannel("whatsapp", "wa2")}>{t("wa3back")}</a>
      </p>
    </>
  );
}

async function Wa4Screen({ figures, expired }: { figures: ReturnType<typeof modelFigures>; expired: boolean }) {
  const t = await getTranslations("channel");
  return (
    <>
      <a className="backlink" href={hrefForChannel("whatsapp", "wa1")}>
        <Icon name="arrow-left" size={14} />
        {t("back")}
      </a>
      <h1>{t("wa4title")}</h1>
      <p className="sub">{t("wa4lede")}</p>
      {expired ? <Banner tone="warn" title={t("wa4expired", figures)}>{t("wa4expiredD", figures)}</Banner> : null}
      <div className="handoff">
        <div className="hh">
          <span className="hm">M</span>
          <div>
            <b>{t("wa4hh")}</b>
            <span>{t("wa4hs")}</span>
          </div>
        </div>
        <ol className="mscreens">
          <li>{t("wa4s1")}</li>
          <li>{t("wa4s2")}</li>
          <li>{t("wa4s3")}</li>
          <li className="you">
            <b>{t("wa4s4")}</b>
            <span className="tagme">{t("onlyYou")}</span>
          </li>
        </ol>
        <div className="platstrip">
          <Icon name="smartphone" size={15} />
          <span>{t("wa4plat")}</span>
        </div>
      </div>
      <noscript>
        <Banner tone="info" title={t("wa4nojs")}>
          {t("wa4nojsD")}
        </Banner>
        <p className="microfoot">
          <a href={hrefForChannel("telegram", "tg1")}>{t("tgOpen")}</a>
        </p>
      </noscript>
      <form action={openMetaAction}>
        <input type="hidden" name="outcome" value="success" />
        <Button type="submit" size="lg" block style={{ marginTop: "var(--s-7)" }}>
          {t("wa4open")}
          <Icon name="external-link" size={16} />
        </Button>
      </form>
      <p className="microfoot" style={{ marginTop: "var(--s-5)" }}>
        <a href={`${hrefForChannel("whatsapp", "wa4")}?force=expired`}>{t("wa4missed")}</a>
        {" · "}
        <form action={openMetaAction} style={{ display: "inline" }}>
          <input type="hidden" name="outcome" value="abandon" />
          <input type="hidden" name="screen" value="phone-number" />
          <button type="submit" className="linkish">
            {t("wa4left")}
          </button>
        </form>
      </p>
    </>
  );
}

async function Wa5Screen({
  figures,
  screen,
  expired,
}: {
  figures: ReturnType<typeof modelFigures>;
  screen: string;
  expired: boolean;
}) {
  const t = await getTranslations("channel");
  const where = screen === "otp" ? t("wa5otp") : t("wa5number");
  return (
    <>
      <Banner tone="warn" title={expired ? t("wa5expTitle", figures) : t("wa5title")}>
        <span dangerouslySetInnerHTML={{ __html: expired ? t("wa5expBody", figures) : t("wa5got", { where }) }} />
      </Banner>
      <h1>{t("wa5h1")}</h1>
      <p className="sub">{t("wa5lede")}</p>
      <div className="qcard">
        <div className="qh">
          <b>{t("wa5prep")}</b>
          <span>{t("wa5prepd")}</span>
        </div>
      </div>
      <form action={relaunchMetaAction}>
        <Button type="submit" size="lg" block style={{ marginTop: "var(--s-7)" }}>
          {t("wa5again")}
          <Icon name="external-link" size={16} />
        </Button>
      </form>
      <p className="microfoot" style={{ marginTop: "var(--s-6)" }}>
        <a href="/connections">{t("wa5later")}</a>
      </p>
    </>
  );
}

async function Wa6Screen({
  figures,
  queued,
}: {
  figures: ReturnType<typeof modelFigures>;
  queued: number | null;
}) {
  const t = await getTranslations("channel");
  return (
    <>
      <p className="dot-line">
        <span className="dot dot-warn" />
        {t("wa6pill")}
      </p>
      <h1>{t("wa6title")}</h1>
      <p className="sub">{t("wa6lede")}</p>
      {queued ? <Banner tone="info" title={t("wa6queue", { position: queued })}>{t("wa6queueD")}</Banner> : null}
      <div className="track">
        <div className="tkrow done">
          <div className="tb">
            <b>{t("wa6k1")}</b>
            <span>{t("wa6k1d")}</span>
          </div>
          <span className="tt">✓</span>
        </div>
        <div className="tkrow now">
          <div className="tb">
            <b>{t("wa6k2")}</b>
            <span dangerouslySetInnerHTML={{ __html: t.raw("wa6k2d") }} />
          </div>
          <span className="tt">{t("wa6k2t")}</span>
        </div>
        <div className="tkrow">
          <div className="tb">
            <b>{t("wa6k3")}</b>
            <span>{t("wa6k3d")}</span>
          </div>
          <span className="tt">{t("wa6k3t", figures)}</span>
        </div>
        <div className="tkrow">
          <div className="tb">
            <b>{t("wa6k4")}</b>
            <span>{t("wa6k4d")}</span>
          </div>
          <span className="tt">—</span>
        </div>
      </div>
      <Banner tone="ok" title={t("wa6ok")}>
        {t("wa6okd")}
      </Banner>
      <form action={backToConnectionsAction}>
        <Button type="submit" tone="secondary" size="lg" block style={{ marginTop: "var(--s-7)" }}>
          <Icon name="arrow-left" size={16} />
          {t("backConn")}
        </Button>
      </form>
    </>
  );
}

async function Wa7Screen({ figures }: { figures: ReturnType<typeof modelFigures> }) {
  const t = await getTranslations("channel");
  return (
    <>
      <Banner tone="warn" title={t("wa7banner")}>
        {t("wa7bannerD")}
      </Banner>
      <h1>{t("wa7title", figures)}</h1>
      <p className="sub">{t("wa7lede")}</p>
      <div className="limits" style={{ marginBottom: "var(--s-7)" }}>
        <div className="lrow">
          <span className="lk">{t("wa7e")}</span>
          <span className="lv mut">💇</span>
        </div>
        <div className="lrow">
          <span className="lk">{t("wa7p")}</span>
          <span className="lv mut">Best</span>
        </div>
        <div className="lrow">
          <span className="lk">{t("wa7g")}</span>
          <span className="lv mut">{t("wa7gv")}</span>
        </div>
        <div className="lrow">
          <span className="lk">{t("wa7r")}</span>
          <span className="lv mut">—</span>
        </div>
      </div>
      <form action={submitDisplayNameAction}>
        <Field id="dn" label={t("wa7try")} hint={t("wa7hint")}>
          <Input id="dn" name="name" defaultValue={figures.tenant} />
        </Field>
        <Button type="submit" size="lg" block>
          {t("wa7go")}
          <Icon name="arrow-right" size={16} />
        </Button>
      </form>
    </>
  );
}

async function Wa8Screen({ figures }: { figures: ReturnType<typeof modelFigures> }) {
  const t = await getTranslations("channel");
  return (
    <>
      <h1>{t("wa8title")}</h1>
      <p className="sub">{t("wa8lede")}</p>
      <div className="policy" style={{ marginBottom: "var(--s-7)" }}>
        <h4>
          <Icon name="hand-coins" size={17} />
          {t("wa8doing")}
        </h4>
        <p dangerouslySetInnerHTML={{ __html: t.raw("wa8tiers") }} />
        <p>{t("wa8momo")}</p>
      </div>
      <Banner tone="info" title={t("wa8now")}>
        {t("wa8nowd")}
      </Banner>
      <form action={acceptPaymentAction}>
        <Button type="submit" size="lg" block style={{ marginTop: "var(--s-7)" }}>
          {t("wa8go")}
          <Icon name="arrow-right" size={16} />
        </Button>
      </form>
      <p className="microfoot" style={{ marginTop: "var(--s-6)" }}>
        <a href="/connections">{t("wa8exit")}</a>
      </p>
    </>
  );
}

async function Wa9Screen({ figures }: { figures: ReturnType<typeof modelFigures> }) {
  const t = await getTranslations("channel");
  return (
    <>
      <p className="dot-line">
        <span className="dot dot-ok" />
        {t("wa9pill")}
      </p>
      <h1>{t("wa9title")}</h1>
      <p className="sub">{t("wa9lede")}</p>
      <div className="limits">
        <div className="lh">
          <span className="chanrow c-wa" style={{ border: "none", padding: 0, background: "none", width: "auto" }}>
            <span className="ci">
              <Icon name="message-circle" size={21} />
            </span>
          </span>
          <div>
            <b>{figures.tenant}</b>
            <span style={{ fontSize: "var(--t-cap)", color: "var(--ink-2)", display: "block" }}>{figures.number}</span>
          </div>
        </div>
        <div className="lrow">
          <span className="lk">{t("wa9name")}</span>
          <span className="lv">{figures.tenant}</span>
        </div>
        <div className="lrow">
          <span className="lk">{t("wa9q")}</span>
          <span className="lv">
            <span className="qbar green">
              <i />
              <i />
              <i />
            </span>
          </span>
        </div>
        <div className="lrow">
          <span className="lk">{t("wa9start")}</span>
          <span className="lv">{figures.tier0}</span>
        </div>
        <div className="lrow">
          <span className="lk">{t("wa9reply", figures)}</span>
          <span className="lv">{t("wa9unlim")}</span>
        </div>
        <div className="lrow">
          <span className="lk">{t("wa9free")}</span>
          <span className="lv">{figures.free}</span>
        </div>
      </div>
      <Banner tone="info" title={t("wa9rise", figures)}>
        {t("wa9rised")}
      </Banner>
      <Banner tone="warn" title={t("wa9oct", figures)}>
        {t("wa9octd", figures)}
      </Banner>
      <div className="policy" style={{ marginTop: "var(--s-6)" }}>
        <h4>
          <Icon name="shield-check" size={17} />
          {t("wa9ai")}
        </h4>
        <p>{t("wa9aiP")}</p>
        <blockquote>{t("wa9quote")}</blockquote>
        <p dangerouslySetInnerHTML={{ __html: t.raw("wa9ok") }} />
      </div>
      <form action={backToConnectionsAction}>
        <Button type="submit" size="lg" block style={{ marginTop: "var(--s-8)" }}>
          <Icon name="arrow-left" size={16} />
          {t("backConn")}
        </Button>
      </form>
    </>
  );
}

async function Ig1Screen({ figures, still }: { figures: ReturnType<typeof modelFigures>; still: boolean }) {
  const t = await getTranslations("channel");
  return (
    <>
      <a className="backlink" href="/connections">
        <Icon name="arrow-left" size={14} />
        {t("back")}
      </a>
      <h1>{t("ig1title")}</h1>
      <p className="sub">{t("ig1lede")}</p>
      {still ? <Banner tone="info" title={t("ig1still")}>{t("ig1stillD")}</Banner> : null}
      <div className="limits" style={{ marginBottom: "var(--s-7)" }}>
        <div className="lh">
          <b>{t("ig1what")}</b>
        </div>
        <div className="lrow">
          <span className="lk">{t("ig1a")}</span>
          <span className="lv">{t("ig1none")}</span>
        </div>
        <div className="lrow">
          <span className="lk">{t("ig1b")}</span>
          <span className="lv">{t("ig1none")}</span>
        </div>
        <div className="lrow">
          <span className="lk">{t("ig1c")}</span>
          <span className="lv">{t("ig1gain")}</span>
        </div>
        <div className="lrow">
          <span className="lk">{t("ig1d")}</span>
          <span className="lv">{t("ig1any")}</span>
        </div>
      </div>
      <div className="cmdblock">
        <span className="c">1.</span> {t("ig1c1")}
        <br />
        <span className="c">2.</span> <span className="k">{t("ig1c2")}</span>
        <br />
        <span className="c">3.</span> <span className="k">{t("ig1c3")}</span>
        <br />
        <span className="c">4.</span> {t("ig1c4")} <span className="k">Business</span>
      </div>
      <form action={checkInstagramAction}>
        <input type="hidden" name="professional" value="1" />
        <Button type="submit" size="lg" block style={{ marginTop: "var(--s-7)" }}>
          {t("ig1go")}
          <Icon name="refresh-cw" size={16} />
        </Button>
      </form>
      <p className="chanhint">
        <Icon name="info" size={14} />
        <span>{t("ig1page")}</span>
      </p>
    </>
  );
}

async function Ig2Screen({ figures }: { figures: ReturnType<typeof modelFigures> }) {
  const t = await getTranslations("channel");
  return (
    <>
      <p className="dot-line">
        <span className="dot dot-ok" />
        {t("ig2pill")}
      </p>
      <h1>{t("ig2title")}</h1>
      <p className="sub">{t("ig2lede")}</p>
      <div className="limits">
        <div className="lrow">
          <span className="lk">{t("ig2a", figures)}</span>
          <span className="lv">{t("ig2no")}</span>
        </div>
        <div className="lrow">
          <span className="lk">{t("ig2b")}</span>
          <span className="lv">{t("ig2none")}</span>
        </div>
        <div className="lrow">
          <span className="lk">{t("ig2c")}</span>
          <span className="lv">{t("ig2once", figures)}</span>
        </div>
        <div className="lrow">
          <span className="lk">{t("ig2d")}</span>
          <span className="lv mut">{t("ig2tag")}</span>
        </div>
      </div>
      <Banner tone="warn" title={t("ig2mig")}>
        {t("ig2migd", figures)}
      </Banner>
      <Banner tone="info" title={t("ig2why")}>
        {t("ig2whyd")}
      </Banner>
      <form action={backToConnectionsAction}>
        <Button type="submit" size="lg" block style={{ marginTop: "var(--s-8)" }}>
          <Icon name="arrow-left" size={16} />
          {t("backConn")}
        </Button>
      </form>
    </>
  );
}

async function BrkScreen({ figures }: { figures: ReturnType<typeof modelFigures> }) {
  const t = await getTranslations("channel");
  return (
    <>
      <Banner tone="risk" title={t("brkH")}>
        {t("brkP", figures)}
      </Banner>
      <h1>{t("brkFix")}</h1>
      <p className="sub">{t("brkLede", figures)}</p>
      <div className="chanrow c-ig err" style={{ cursor: "default", marginBottom: "var(--s-7)" }}>
        <span className="ci">
          <Icon name="image" size={21} />
        </span>
        <span className="cm">
          <b>{t("instagram")}</b>
          <span>{t("disconnected", figures)}</span>
        </span>
      </div>
      <form action={reconnectAction}>
        <Button type="submit" size="lg" block>
          {t("reconnect")}
          <Icon name="refresh-cw" size={16} />
        </Button>
      </form>
      <p className="chanhint">
        <Icon name="clock" size={14} />
        <span>{t("brkHint")}</span>
      </p>
    </>
  );
}
