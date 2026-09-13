import {
  Banner,
  Button,
  ForwardingCodeCard,
  Icon,
  LadderOption,
  Tag,
  WizardShell,
} from "@subiza/ui";
import {
  CLEAR_ALL_FORWARDING,
  codeForRepairRung,
  forwardingCode,
  forwardingCodes,
  shorterForwardingCode,
  telHref,
  type PhoneStep,
} from "@subiza/domain";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Script from "next/script";
import {
  backToPathAction,
  choosePathAction,
  climbRepairAction,
  continueToDoneAction,
  correctNetworkAction,
  dialledCodeAction,
  finishPhoneAction,
  openRepairAction,
  requestHumanAction,
  retryVerifyAction,
  saveScopeAction,
  startVerifyAction,
  takeNewNumberAction,
} from "@/features/phone/actions";
import { loadPhone } from "@/features/phone/load";
import { hrefForPhone } from "@/features/phone/steps";
import { activateEnhanceScript } from "@/lib/enhance";
import { pauseAgentAction } from "@/features/activation/actions";
import { PhoneAside } from "./asides";

function condLabel(condition: string, t: (key: string) => string): string {
  if (condition === "busy") return t("condBusy");
  if (condition === "unreachable") return t("condOff");
  if (condition === "unconditional") return t("condAll");
  return t("condNr");
}

export async function PhoneView({
  step,
  search,
}: {
  step: PhoneStep;
  search?: Record<string, string | string[] | undefined>;
}) {
  const model = await loadPhone(step, search ?? {});
  if (model.redirectTo && model.redirectTo !== step) {
    redirect(hrefForPhone(model.redirectTo) as never);
  }
  const t = await getTranslations("phone");
  const hideProg = step === "lost" || model.progressNow === 0;
  const platform = model.platform;
  return (
    <>
      <WizardShell
        brandHref="/connections"
        tag={t("tag")}
        tagTone={model.phone.verification.verifiedAt ? "ok" : "neutral"}
        {...(hideProg ? {} : { progress: 4, progressNow: model.progressNow - 1 })}
        aside={<PhoneAside step={step} />}
        footer={
          <p className="microfoot" style={{ textAlign: "left" }}>
            {t("foot")} · {t("privacy")}
            {model.live ? (
              <>
                {" · "}
                <form action={pauseAgentAction} style={{ display: "inline" }}>
                  <button type="submit" className="linkish">
                    {t("pause")}
                  </button>
                </form>
              </>
            ) : null}
          </p>
        }
      >
        {step === "path" ? <PathScreen /> : null}
        {step === "scope" ? <ScopeScreen /> : null}
        {step === "code" ? (
          <CodeScreen
            platform={platform}
            phone={model.phone}
            codes={model.codes}
            rung={model.rung}
          />
        ) : null}
        {step === "verify" ? (
          <VerifyScreen
            ownerDisplay={model.ownerDisplay}
            watch={model.watch}
            retry={model.retry}
            {...(model.force ? { force: model.force } : {})}
            elapsed={
              model.phone.verification.lastAttemptAt
                ? Math.max(0, Math.round((Date.now() - model.phone.verification.lastAttemptAt) / 1000))
                : 0
            }
          />
        ) : null}
        {step === "result" ? <ResultScreen outcome={model.phone.verification.outcome} /> : null}
        {step === "repair" ? (
          <RepairScreen phone={model.phone} prepaid={model.prepaid} human={model.human} />
        ) : null}
        {step === "done" ? <DoneScreen phone={model.phone} codes={model.codes} /> : null}
        {step === "number" ? <NumberScreen /> : null}
        {step === "lost" ? <LostScreen phone={model.phone} platform={platform} /> : null}
      </WizardShell>
      <Script id="phone-enhance" strategy="afterInteractive">
        {activateEnhanceScript}
      </Script>
    </>
  );
}

async function PathScreen() {
  const t = await getTranslations("phone");
  return (
    <>
      <h1>{t("s1title")}</h1>
      <p className="sub">{t("s1lede")}</p>
      <form action={choosePathAction}>
        <div className="paths">
          <label className="path">
            <input type="radio" name="path" value="forwarding" defaultChecked />
            <span className="pb">
              <span className="pi">
                <Icon name="phone-forwarded" size={20} />
              </span>
              <span>
                <h4>
                  {t("pathA")}
                  <span className="prec">{t("rec")}</span>
                </h4>
                <p className="pd">{t("pathAd")}</p>
                <span className="pt">
                  <Icon name="clock" size={12} />
                  {t("pathAt")}
                </span>
              </span>
            </span>
          </label>
          <label className="path">
            <input type="radio" name="path" value="new-number" />
            <span className="pb">
              <span className="pi">
                <Icon name="phone-incoming" size={20} />
              </span>
              <span>
                <h4>{t("pathB")}</h4>
                <p className="pd">{t("pathBd")}</p>
                <span className="pt">
                  <Icon name="calendar" size={12} />
                  {t("pathBt")}
                </span>
              </span>
            </span>
          </label>
        </div>
        <Button type="submit" tone="primary" size="lg" block>
          {t("continue")}
        </Button>
      </form>
    </>
  );
}

async function ScopeScreen() {
  const t = await getTranslations("phone");
  return (
    <>
      <a className="backlink" href={hrefForPhone("path")}>
        <Icon name="arrow-left" size={14} />
        {t("back")}
      </a>
      <h1>{t("s2title")}</h1>
      <p className="sub">{t("s2lede")}</p>
      <form action={saveScopeAction}>
        <LadderOption n={1} id="sc1" name="scope" value="miss" defaultChecked title={t("scope1")} recommended={t("rec")} detail={t("scope1d")} />
        <LadderOption n={2} id="sc2" name="scope" value="no-reply" title={t("scope2")} detail={t("scope2d")} />
        <LadderOption n={3} id="sc3" name="scope" value="all" title={t("scope3")} detail={t("scope3d")} />
        <Button type="submit" tone="primary" size="lg" block>
          {t("continue")}
        </Button>
      </form>
    </>
  );
}

async function CodeScreen({
  platform,
  phone,
  codes,
  rung,
}: {
  platform: "ios" | "android" | "unknown";
  phone: Awaited<ReturnType<typeof loadPhone>>["phone"];
  codes: Awaited<ReturnType<typeof loadPhone>>["codes"];
  rung: number;
}) {
  const t = await getTranslations("phone");
  const current = codes[phone.currentCodeIndex] ?? codes[0];
  const code = codeForRepairRung(phone, rung);
  const label = condLabel(current?.condition ?? "no-reply", t);
  const heading =
    rung === 1
      ? t("r1")
      : rung === 2
        ? t("r2")
        : rung === 3
          ? t("r3")
          : t("codeOf", { n: phone.currentCodeIndex + 1, total: codes.length, label });
  const unconditional = (current?.condition ?? phone.condition) === "unconditional";
  return (
    <>
      <a className="backlink" href={hrefForPhone("scope")}>
        <Icon name="arrow-left" size={14} />
        {t("back")}
      </a>
      <h1>{t("s3title")}</h1>
      <p className="sub">{t("s3lede")}</p>
      <div className={`netbadge ${phone.network}`}>
        <span className="nm">{phone.network === "airtel" ? "ATL" : phone.network === "mtn" ? "MTN" : "?"}</span>
        <span className="nx">
          <b>{phone.network === "mtn" ? t("netMtn") : phone.network === "airtel" ? t("netAirtel") : t("netUnknown")}</b>
          <span>{t("netHow")}</span>
        </span>
      </div>
      <form action={correctNetworkAction} className="netfix">
        <label htmlFor="network">{t("netNot")}</label>
        <select id="network" name="network" defaultValue={phone.network}>
          <option value="mtn">MTN</option>
          <option value="airtel">Airtel</option>
          <option value="unknown">{t("netUnknown")}</option>
        </select>
        <Button type="submit" tone="ghost" size="sm">
          {t("netPick")}
        </Button>
      </form>
      {unconditional ? (
        <Banner tone="warn" title={t("allWarnTitle")}>
          <span dangerouslySetInnerHTML={{ __html: t.raw("allWarnBody") }} />
        </Banner>
      ) : null}
      <Banner tone="warn" title={t("vmTitle")}>
        <span dangerouslySetInnerHTML={{ __html: t.raw("vmBody") }} />
      </Banner>
      <ForwardingCodeCard
        condition={current?.condition ?? "no-reply"}
        subizaNumber={phone.subizaNumber}
        code={code}
        telHref={telHref(code)}
        platform={platform}
        heading={heading}
        offNote={t("codeNote")}
        copyLabel={t("copy")}
        dialLabel={t("dial")}
        copyWorks={t("copyWorks")}
        platformNote={platform === "ios" ? t("platIos") : t("platAndroid")}
        step1={t("ios1")}
        step2={t("ios2")}
        step3={t("ios3")}
      />
      <p className="microfoot" dangerouslySetInnerHTML={{ __html: t.raw("undoHere") }} />
      <details className="tmplpeek">
        <summary>
          <Icon name="list-checks" size={15} />
          {t("explain")}
        </summary>
        <div className="tp-b">
          <dl>
            <dt>
              <code>**61*</code>
            </dt>
            <dd dangerouslySetInnerHTML={{ __html: t.raw("ex61") }} />
            <dt>
              <code>{phone.subizaNumber.replace(/\D/g, "")}</code>
            </dt>
            <dd>{t("exN")}</dd>
            <dt>
              <code>*11*</code>
            </dt>
            <dd>{t("ex11")}</dd>
            <dt>
              <code>*20#</code>
            </dt>
            <dd>{t("ex20")}</dd>
          </dl>
        </div>
      </details>
      <form action={dialledCodeAction}>
        <Button type="submit" tone="primary" size="lg" block>
          {t("dialled")}
        </Button>
      </form>
      <p className="microfoot">
        <a href={hrefForPhone("repair")}>{t("stuck")}</a>
      </p>
    </>
  );
}

async function VerifyScreen({
  ownerDisplay,
  watch,
  retry,
  force,
  elapsed,
}: {
  ownerDisplay: string;
  watch: boolean;
  retry: boolean;
  force?: string;
  elapsed: number;
}) {
  const t = await getTranslations("phone");
  const settleHref = `${hrefForPhone("verify")}?settle=1${force ? `&force=${force}` : ""}`;
  return (
    <>
      <h1>{t("s4title")}</h1>
      <p className="sub" dangerouslySetInnerHTML={{ __html: t.raw("s4lede") }} />
      <div className="verify">
        {watch || retry ? (
          <>
            {watch ? <meta httpEquiv="refresh" content={`3;url=${settleHref}`} /> : null}
            <span className="vring busy">
              <Icon name="phone-call" size={32} />
            </span>
            <div className="vsteps">
              <div className="vstep on">
                <span className="vi">
                  <Icon name="phone-call" size={12} />
                </span>
                <span>{t("v1")}</span>
                <span className="vt">{elapsed}s</span>
              </div>
              <div className={`vstep ${elapsed >= 2 ? "on" : ""}`}>
                <span className="vi">
                  <Icon name="radio" size={12} />
                </span>
                <span>{t("v2")}</span>
              </div>
              <div className={`vstep ${elapsed >= 8 ? "on" : ""}`}>
                <span className="vi">
                  <Icon name="corner-down-right" size={12} />
                </span>
                <span>{t("v3")}</span>
              </div>
            </div>
            <p className="dontpick">
              <Icon name="hand" size={14} />
              {t("dont")}
            </p>
            <p className="microfoot" style={{ color: "var(--panel-ink-2)" }}>
              {retry ? t("retryWait") : t("still")}
            </p>
            <form action={`${hrefForPhone("verify")}?settle=1`} method="get">
              {force ? <input type="hidden" name="force" value={force} /> : null}
              <input type="hidden" name="settle" value="1" />
              <Button type="submit" tone="secondary" block data-no-hold="1">
                {t("keepWatching")}
              </Button>
            </form>
          </>
        ) : (
          <>
            <span className="vring">
              <Icon name="phone-call" size={32} />
            </span>
            <p className="vdest">
              {t("willCall")} <b>{ownerDisplay}</b>
            </p>
            <form action={startVerifyAction}>
              {force ? <input type="hidden" name="force" value={force} /> : null}
              <Button type="submit" tone="primary" size="lg" block>
                {t("testNow")}
              </Button>
            </form>
            <p className="dontpick">
              <Icon name="hand" size={14} />
              {t("dont")}
            </p>
          </>
        )}
      </div>
    </>
  );
}

async function ResultScreen({
  outcome,
}: {
  outcome: Awaited<ReturnType<typeof loadPhone>>["phone"]["verification"]["outcome"];
}) {
  const t = await getTranslations("phone");
  const tone =
    outcome === "diverted"
      ? "ok"
      : outcome === "owner-answered" || outcome === "diverted-no-caller-id" || outcome === "inconclusive"
        ? "warn"
        : "bad";
  const title =
    outcome === "diverted"
      ? t("okTitle")
      : outcome === "owner-answered"
        ? t("ownerTitle")
        : outcome === "diverted-no-caller-id"
          ? t("cliTitle")
          : outcome === "inconclusive"
            ? t("incTitle")
            : outcome === "unconditional"
              ? t("g22Title")
              : outcome === "diverted-elsewhere"
                ? t("elseTitle")
                : t("badTitle");
  const body =
    outcome === "diverted"
      ? t("okBody")
      : outcome === "owner-answered"
        ? t("ownerBody")
        : outcome === "diverted-no-caller-id"
          ? t("cliBody")
          : outcome === "inconclusive"
            ? t("incBody")
            : outcome === "unconditional"
              ? t.raw("g22Body")
              : outcome === "diverted-elsewhere"
                ? t("elseBody")
                : t("badBody");
  return (
    <>
      <div className={`result ${tone}`}>
        <div className="rh">
          <span className="rm">
            <Icon
              name={
                outcome === "diverted"
                  ? "check"
                  : outcome === "owner-answered"
                    ? "hand"
                    : outcome === "diverted-no-caller-id"
                      ? "eye-off"
                      : outcome === "inconclusive"
                        ? "info"
                        : "x"
              }
              size={18}
            />
          </span>
          <div>
            <h4>{title}</h4>
            <p className="rd" dangerouslySetInnerHTML={{ __html: typeof body === "string" ? body : String(body) }} />
          </div>
        </div>
        <div className="rf">
          {outcome === "diverted" || outcome === "diverted-no-caller-id" ? (
            <>
              {outcome === "diverted-no-caller-id" ? <p className="hint">{t("cliNote")}</p> : null}
              <form action={continueToDoneAction}>
                <Button type="submit" tone="primary" block>
                  {t("cliGo")}
                </Button>
              </form>
            </>
          ) : null}
          {outcome === "owner-answered" || outcome === "inconclusive" ? (
            <form action={retryVerifyAction}>
              <Button type="submit" tone="primary" block>
                {t("tryAgain")}
              </Button>
            </form>
          ) : null}
          {outcome === "not-diverted" || outcome === "diverted-elsewhere" || outcome === "unconditional" ? (
            <>
              <p className="hint">{t("g22")}</p>
              <p className="hint">{t("humanLine")}</p>
              <form action={openRepairAction}>
                <Button type="submit" tone="primary" block>
                  {t("badGo")}
                </Button>
              </form>
              <form action={retryVerifyAction}>
                <Button type="submit" tone="ghost" block>
                  {t("testAgain")}
                </Button>
              </form>
            </>
          ) : null}
          {outcome == null ? (
            <form action={retryVerifyAction}>
              <Button type="submit" tone="primary" block>
                {t("testNow")}
              </Button>
            </form>
          ) : null}
        </div>
      </div>
    </>
  );
}

async function RepairScreen({
  phone,
  prepaid,
  human,
}: {
  phone: Awaited<ReturnType<typeof loadPhone>>["phone"];
  prepaid: boolean;
  human: boolean;
}) {
  const t = await getTranslations("phone");
  const short = shorterForwardingCode(phone);
  return (
    <>
      <a className="backlink" href={hrefForPhone("code")}>
        <Icon name="arrow-left" size={14} />
        {t("backCode")}
      </a>
      <h1>{t("s6title")}</h1>
      <p className="sub">{t("s6lede")}</p>
      <p className="hint">{t("g22")}</p>
      <form action={climbRepairAction}>
        <input type="hidden" name="rung" value="1" />
        <button type="submit" className="tryrow">
          <span className="ti">
            <Icon name="type" size={17} />
          </span>
          <span>
            <b>{t("r1")}</b>
            <span dangerouslySetInnerHTML={{ __html: t.raw("r1d").replace("{code}", short) }} />
          </span>
          <span className="ta">
            <Icon name="chevron-right" size={16} />
          </span>
        </button>
      </form>
      <form action={climbRepairAction}>
        <input type="hidden" name="rung" value="2" />
        <button type="submit" className="tryrow">
          <span className="ti">
            <Icon name="eye" size={17} />
          </span>
          <span>
            <b>{t("r2")}</b>
            <span dangerouslySetInnerHTML={{ __html: t.raw("r2d") }} />
          </span>
          <span className="ta">
            <Icon name="chevron-right" size={16} />
          </span>
        </button>
      </form>
      <form action={climbRepairAction}>
        <input type="hidden" name="rung" value="3" />
        <button type="submit" className="tryrow">
          <span className="ti">
            <Icon name="undo-2" size={17} />
          </span>
          <span>
            <b>{t("r3")}</b>
            <span dangerouslySetInnerHTML={{ __html: t.raw("r3d") }} />
          </span>
          <span className="ta">
            <Icon name="chevron-right" size={16} />
          </span>
        </button>
      </form>
      <form action={requestHumanAction}>
        <button type="submit" className="tryrow">
          <span className="ti">
            <Icon name="life-buoy" size={17} />
          </span>
          <span>
            <b>{t("r4")}</b>
            <span>{t("r4d")}</span>
          </span>
          <span className="ta">
            <Icon name="chevron-right" size={16} />
          </span>
        </button>
      </form>
      {human ? <Banner tone="ok" title={t("human")}>{t("r4ok")}</Banner> : null}
      {prepaid ? (
        <Banner tone="info" title={t("prepaidTitle")}>
          {t("prepaidBody")}
        </Banner>
      ) : (
        <form action={climbRepairAction}>
          <input type="hidden" name="rung" value="5" />
          <input type="hidden" name="prepaid" value="1" />
          <Button type="submit" tone="ghost" block>
            {t("prepaidTitle")}
          </Button>
        </form>
      )}
      {prepaid ? (
        <form action={takeNewNumberAction}>
          <Button type="submit" tone="primary" block>
            {t("prepaidGo")}
          </Button>
        </form>
      ) : null}
      <p className="microfoot">
        <a href={hrefForPhone("code")}>{t("backOrig")}</a>
      </p>
    </>
  );
}

async function DoneScreen({
  phone,
  codes,
}: {
  phone: Awaited<ReturnType<typeof loadPhone>>["phone"];
  codes: Awaited<ReturnType<typeof loadPhone>>["codes"];
}) {
  const t = await getTranslations("phone");
  return (
    <>
      <Tag tone="ok">{t("donePill")}</Tag>
      <h1>{t("s7title")}</h1>
      <p className="sub">{t("s7lede")}</p>
      <div className="summ2">
        {codes.map((row) => (
          <div className="srow" key={row.condition}>
            <span className="sk">{condLabel(row.condition, t)}</span>
            <span className="sv">{row.code.replace(phone.subizaNumber.replace(/\D/g, ""), "…")}</span>
          </div>
        ))}
        <div className="srow">
          <span className="sk">{t("rowCli")}</span>
          <span className="sv">{phone.verification.callerIdSurvived === false ? t("rowNo") : t("rowYes")}</span>
        </div>
        <div className="srow">
          <span className="sk">{t("rowChecked")}</span>
          <span className="sv mut">{t("rowNow")}</span>
        </div>
      </div>
      <article className="fcode" style={{ marginTop: "var(--s-7)" }}>
        <div className="fcode-h">
          <Icon name="undo-2" size={14} />
          {t("offTitle")}
        </div>
        <div className="fcode-b">
          <p className="fcode-s">{CLEAR_ALL_FORWARDING}</p>
          <p className="fcode-n" dangerouslySetInnerHTML={{ __html: t.raw("offBody") }} />
        </div>
      </article>
      <Banner tone="info" title={t("costTitle")}>
        <span dangerouslySetInnerHTML={{ __html: t.raw("costBody") }} />
      </Banner>
      <Banner tone="ok" title={t("weekTitle")}>
        {t("weekBody")}
      </Banner>
      <form action={finishPhoneAction}>
        <Button type="submit" tone="primary" size="lg" block>
          {t("done")}
        </Button>
      </form>
    </>
  );
}

async function NumberScreen() {
  const t = await getTranslations("phone");
  return (
    <>
      <a className="backlink" href={hrefForPhone("path")}>
        <Icon name="arrow-left" size={14} />
        {t("back")}
      </a>
      <h1>{t("s8title")}</h1>
      <p className="sub">{t("s8lede")}</p>
      <div className="tl">
        <div className="tlrow done">
          <div>
            <b>{t("tl1")}</b>
            <span>{t("tl1d")}</span>
          </div>
          <span className="tt">{t("tl1t")}</span>
        </div>
        <div className="tlrow now">
          <div>
            <b>{t("tl2")}</b>
            <span>{t("tl2d")}</span>
          </div>
          <span className="tt">{t("tl2t")}</span>
        </div>
        <div className="tlrow">
          <div>
            <b>{t("tl3")}</b>
            <span>{t("tl3d")}</span>
          </div>
          <span className="tt">—</span>
        </div>
        <div className="tlrow">
          <div>
            <b>{t("tl4")}</b>
            <span>{t("tl4d")}</span>
          </div>
          <span className="tt">—</span>
        </div>
      </div>
      <Banner tone="ok" title={t("s8ok")}>
        {t("s8okp")}
      </Banner>
      <form action={backToPathAction}>
        <Button type="submit" tone="ghost" block>
          {t("orKeep")}
        </Button>
      </form>
    </>
  );
}

async function LostScreen({
  phone,
  platform,
}: {
  phone: Awaited<ReturnType<typeof loadPhone>>["phone"];
  platform: "ios" | "android" | "unknown";
}) {
  const t = await getTranslations("phone");
  const primary = forwardingCodes(phone)[0];
  const code = primary?.code ?? forwardingCode({ ...phone, currentCodeIndex: 0 });
  return (
    <>
      <Banner tone="warn" title={t("lostBanner")}>
        {t("lostBannerP")}
      </Banner>
      <h1>{t("lostTitle")}</h1>
      <p className="sub">{t("lostLede")}</p>
      <ForwardingCodeCard
        condition={phone.condition}
        subizaNumber={phone.subizaNumber}
        code={code}
        telHref={telHref(code)}
        platform={platform}
        heading={t("lostCode")}
        offNote={t("codeNote")}
        copyLabel={t("copy")}
        dialLabel={t("dial")}
        copyWorks={t("copyWorks")}
        platformNote={platform === "ios" ? t("platIos") : t("platAndroid")}
        step1={t("ios1")}
        step2={t("ios2")}
        step3={t("ios3")}
      />
      <form action={startVerifyAction}>
        <input type="hidden" name="kind" value="recurring" />
        <Button type="submit" tone="primary" size="lg" block>
          {t("dialled")}
        </Button>
      </form>
      <p className="microfoot">{t("lostFoot")}</p>
    </>
  );
}
