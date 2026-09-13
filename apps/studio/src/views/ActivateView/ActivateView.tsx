import {
  Banner,
  Button,
  CallStage,
  Field,
  ForwardingCodeCard,
  Icon,
  Input,
  LadderOption,
  LiveTranscript,
  PhoneField,
  PriceTable,
  ReviewTurn,
  VoiceLibrary,
  WizardShell,
} from "@subiza/ui";
import type { ActivationStep } from "@subiza/domain";
import { RESUME_LABEL, WEEKDAYS, salonWeek } from "@subiza/domain";
import { interpolateGreeting } from "@subiza/domain";
import { businessTemplates } from "@subiza/fixtures";
import { formatDuration } from "@subiza/core";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Script from "next/script";
import {
  advanceCallAction,
  confirmPricesAction,
  continuePhone,
  correctTurn,
  importPrices,
  saveBusiness,
  saveEscalationAction,
  saveHoursAction,
  saveScopeAction,
  saveVoiceAction,
  skipCall,
  skipPhone,
  skipPrices,
  startCallAction,
  uploadPrices,
  verifyPhoneAction,
  viewTranscriptAction,
} from "@/features/activation/actions";
import { loadActivation } from "@/features/activation/load";
import { hrefFor } from "@/features/activation/steps";
import { activateEnhanceScript } from "@/lib/enhance";
import { StepAside } from "./asides";


export async function ActivateView({
  step,
  search,
}: {
  step: ActivationStep;
  search?: Record<string, string | string[] | undefined>;
}) {
  const rawResume = search?.["resume"];
  const resumeFlag = (Array.isArray(rawResume) ? rawResume[0] : rawResume) === "1";
  const model = await loadActivation(step, resumeFlag);
  if ("redirectTo" in model && model.redirectTo) {
    redirect(hrefFor(model.redirectTo) as never);
  }
  const t = await getTranslations();
  const part = model.part;
  const tag = part === 1 ? t("wizard.part1") : part === 2 ? t("wizard.part2") : t("wizard.part3");
  const q = (key: string) => {
    const value = search?.[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return (
    <>
      <WizardShell
        brandHref="/home"
        tag={tag}
        tagTone={part === 2 ? "ok" : "neutral"}
        progress={9}
        progressNow={model.index}
        aside={<StepAside step={step} />}
        footer={
          <p className="microfoot" style={{ textAlign: "left" }}>
            {t("wizard.foot")} · {t("wizard.privacy")}
          </p>
        }
      >
        {model.resume ? (
          <div className="entryb">
            <Icon name="info" size={16} />
            <div>
              <h4>{t("wizard.resumeTitle")}</h4>
              <p>{t("wizard.resumeBody", { step: t(`wizard.${RESUME_LABEL[model.resume]}` as "wizard.resumePrices") })}</p>
            </div>
          </div>
        ) : null}
        {model.back ? (
          <a className="backlink" href={hrefFor(step === "hours" ? "business" : step === "prices" ? "hours" : "prices")}>
            <Icon name="arrow-left" size={14} />
            {t("wizard.back")}
          </a>
        ) : null}
        {step === "business" ? <BusinessStep name={model.tenant.name} /> : null}
        {step === "hours" ? <HoursStep /> : null}
        {step === "prices" ? <PricesStep tab={q("tab") ?? "cam"} confirm={q("confirm") === "1"} blurry={q("err") === "blurry"} /> : null}
        {step === "voice" ? (
          <VoiceStep greeting={model.docs.agent?.greeting ?? interpolateGreeting("Muraho, ni {business}. Nabafasha nte?", model.tenant.name)} />
        ) : null}
        {step === "call" ? (
          <CallStep
            destination={model.destination}
            inbound={model.inbound}
            route={model.docs.testCall?.route ?? "outbound"}
            status={model.docs.testCall?.status ?? "ready"}
            turns={model.docs.testCall?.turns ?? []}
            duration={model.docs.testCall?.durationSeconds ?? 0}
          />
        ) : null}
        {step === "review" ? <ReviewStep /> : null}
        {step === "escalation" ? (
          <EscalationStep phone={model.destination.replace("+250 ", "")} invalid={q("err") === "phone"} />
        ) : null}
        {step === "phone" ? (
          <PhoneStep
            verified={Boolean(model.docs.phone?.verification.verifiedAt)}
            skipped={Boolean(model.docs.phone?.skippedAt)}
            number={model.docs.phone?.subizaNumber ?? "250788456123"}
          />
        ) : null}
        {step === "scope" ? <ScopeStep /> : null}
      </WizardShell>
      <Script id="activate-enhance" strategy="afterInteractive">
        {activateEnhanceScript}
      </Script>
    </>
  );
}

export async function BusinessStep({ name }: { name: string }) {
  const t = await getTranslations("w1");
  const w = await getTranslations("wizard");
  const tiles = [
    ["shop", "store", t("shop"), t("shopD")],
    ["salon", "sparkles", t("salon"), t("salonD")],
    ["restaurant", "utensils", t("restaurant"), t("restaurantD")],
    ["clinic", "heart", t("clinic"), t("clinicD")],
    ["repair", "settings", t("repair"), t("repairD")],
    ["generic", "ellipsis", t("generic"), t("genericD")],
  ] as const;
  return (
    <form action={saveBusiness}>
      <h1>
        {t.rich("title", {
          business: name,
          b: (chunks) => <b>{chunks}</b>,
        })}
      </h1>
      <p className="sub">{t("lede")}</p>
      <div className="types">
        {tiles.map(([value, icon, title, detail], i) => (
          <label className="tile" key={value}>
            <input type="radio" name="type" value={value} defaultChecked={value === "salon"} />
            <span className="tb">
              <span className="ti">
                <Icon name={icon === "utensils" ? "store" : icon} size={19} />
              </span>
              <span>
                <b>{title}</b>
                <span>{detail}</span>
              </span>
            </span>
          </label>
        ))}
      </div>
      <Field id="other" label={t("otherLabel")}>
        <Input id="other" name="other" />
      </Field>
      <details className="tmplpeek">
        <summary>
          <Icon name="sparkles" size={15} />
          {t("peek")}
        </summary>
        <div className="tp-b">
          <dl>
            <dt>{t("greeting")}</dt>
            <dd>{interpolateGreeting(businessTemplates.salon.greeting, name)}</dd>
            <dt>{t("manner")}</dt>
            <dd>{businessTemplates.salon.persona}</dd>
            <dt>{t("rules")}</dt>
            <dd>{businessTemplates.salon.rules.filter((rule) => !rule.locked).map((rule) => rule.text).join(" · ")}</dd>
            <dt>{t("questions")}</dt>
            <dd>{t("peekN", { n: businessTemplates.salon.questions.length })}</dd>
            <dt>{t("pronunciation")}</dt>
            <dd>{businessTemplates.salon.pronunciations.map((row) => row.surface).join(" · ")}</dd>
          </dl>
        </div>
      </details>
      <Button type="submit" tone="primary" size="lg" block>
        {w("continue")}
      </Button>
    </form>
  );
}

export async function HoursStep() {
  const t = await getTranslations("w2");
  const w = await getTranslations("wizard");
  const week = salonWeek();
  return (
    <form action={saveHoursAction}>
      <h1>{t("title")}</h1>
      <p className="sub">{t("lede")}</p>
      <div className="hours">
        {WEEKDAYS.map((day) => (
          <div key={day} className={week[day].open ? "hrow" : "hrow closed"}>
            <span className="hd">{t(day)}</span>
            <span className="ht">
              <input type="time" name={`start-${day}`} defaultValue={week[day].start} />
              <span>–</span>
              <input type="time" name={`end-${day}`} defaultValue={week[day].end} />
            </span>
            <label className="hc">
              <input type="checkbox" name={`closed-${day}`} defaultChecked={!week[day].open} /> {t("closed")}
            </label>
          </div>
        ))}
      </div>
      <label className="microfoot" style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
        <input type="checkbox" name="varies" data-hours-vary />
        {t("varies")}
      </label>
      <h3 style={{ margin: "2rem 0 1rem" }}>{t("after")}</h3>
      <LadderOption n={1} id="ah1" name="after" value="answer-and-message" defaultChecked title={t("ah1")} detail={t("ah1d")} />
      <LadderOption n={2} id="ah2" name="after" value="answer-and-book" title={t("ah2")} detail={t("ah2d")} />
      <LadderOption n={3} id="ah3" name="after" value="message-only" title={t("ah3")} detail={t("ah3d")} />
      <Button type="submit" tone="primary" size="lg" block>
        {w("continue")}
      </Button>
    </form>
  );
}

export async function PricesStep({ tab, confirm, blurry }: { tab: string; confirm: boolean; blurry: boolean }) {
  const t = await getTranslations("w3");
  const w = await getTranslations("wizard");
  const rows = [
    { id: "prc_1", name: "Braids — small", amount: 15000, flagged: false },
    { id: "prc_2", name: "Braids — large", amount: 10000, flagged: false },
    { id: "prc_3", name: "Relaxer", amount: null, flagged: true },
    { id: "prc_4", name: "Cut", amount: 5000, flagged: false },
    { id: "prc_5", name: "Colour", amount: 12000, flagged: false },
    { id: "prc_6", name: "Nails", amount: 8000, flagged: true },
    { id: "prc_7", name: "Bridal", amount: null, flagged: true },
    { id: "prc_8", name: "Kids cut", amount: 3000, flagged: false },
  ];
  return (
    <>
      <h1>{t("title")}</h1>
      <p className="sub">{t("lede")}</p>
      <div className="tabs" role="tablist">
        <a className={tab === "cam" ? "on" : undefined} href="/activate/prices?tab=cam">{t("photo")}</a>
        <a className={tab === "type" ? "on" : undefined} href="/activate/prices?tab=type">{t("type")}</a>
        <a className={tab === "web" ? "on" : undefined} href="/activate/prices?tab=web">{t("import")}</a>
      </div>
      {tab === "cam" && !confirm ? (
        <form action={uploadPrices}>
          <div className="capture">
            <div className="cam">
              <Icon name="image" size={28} />
            </div>
            <h4>{t("photoH")}</h4>
            <p>{t("photoP")}</p>
            <input type="hidden" name="quality" defaultValue="ok" />
            <label className="btn btn-primary">
              {t("take")}
              <input type="file" name="photo" accept="image/*" capture="environment" hidden />
            </label>
            <p className="microfoot">{t("onDevice")}</p>
            <div className="qcheck">
              <div className="qrow">
                <span className="qi" aria-hidden="true" />
                {t("sharp")}
              </div>
              <div className="qrow">
                <span className="qi" aria-hidden="true" />
                {t("glare")}
              </div>
              <div className="qrow">
                <span className="qi" aria-hidden="true" />
                {t("frame")}
              </div>
            </div>
          </div>
          {blurry ? (
            <div data-blurry>
              <Banner tone="warn" title={t("blurry")}>
                {t("blurryP")}
              </Banner>
            </div>
          ) : (
            <div data-blurry hidden />
          )}
          <Button type="submit" tone="primary" size="lg" block>
            {t("take")}
          </Button>
        </form>
      ) : null}
      {tab === "cam" && confirm ? (
        <form action={confirmPricesAction}>
          <input type="hidden" name="method" value="photo" />
          <PriceTable rows={rows} heading={t("believe")} flagLabel={t("flag", { n: rows.filter((r) => r.flagged).length })} />
          <Banner tone="info" title={t("three")}>
            {t("threeP")}
          </Banner>
          <Button type="submit" tone="primary" size="lg" block>
            {t("right")}
          </Button>
        </form>
      ) : null}
      {tab === "type" ? (
        <form action={confirmPricesAction}>
          <input type="hidden" name="method" value="type" />
          <PriceTable
            rows={[
              { id: "t1", name: "", amount: null, flagged: false },
              { id: "t2", name: "", amount: null, flagged: false },
              { id: "t3", name: "", amount: null, flagged: false },
            ]}
            heading={t("typeH")}
          />
          <Button type="submit" tone="primary" size="lg" block>
            {w("continue")}
          </Button>
        </form>
      ) : null}
      {tab === "web" ? (
        <form action={importPrices}>
          <Field id="wurl" label={t("importL")}>
            <Input id="wurl" name="url" inputMode="url" />
          </Field>
          <Button type="submit" tone="primary" size="lg" block>
            {t("look")}
          </Button>
        </form>
      ) : null}
      <form action={skipPrices}>
        <p className="microfoot">
          <Button type="submit" tone="ghost">
            {t("none")}
          </Button>
        </p>
      </form>
    </>
  );
}

export async function VoiceStep({ greeting }: { greeting: string }) {
  const t = await getTranslations("w4");
  const w = await getTranslations("wizard");
  return (
    <form action={saveVoiceAction}>
      <h1>{t("title")}</h1>
      <p className="sub">{t("lede")}</p>
      <VoiceLibrary
        selected="warm-female"
        playLabel={t("play")}
        voices={[
          { id: "warm-female", title: t("warmF"), detail: t("warmFd"), transcript: greeting, src: "/api/voice-preview?id=warm-female" },
          { id: "calm-female", title: t("calmF"), detail: t("calmFd"), transcript: greeting, src: "/api/voice-preview?id=calm-female" },
          { id: "warm-male", title: t("warmM"), detail: t("warmMd"), transcript: greeting, src: "/api/voice-preview?id=warm-male" },
          { id: "brisk-male", title: t("briskM"), detail: t("briskMd"), transcript: greeting, src: "/api/voice-preview?id=brisk-male" },
        ]}
        hearingNothing={
          <div className="hear-none" data-hear-none hidden>
            <Banner tone="info" title={t("silent")}>
              {t("silentP")}
            </Banner>
          </div>
        }
      />
      <p className="microfoot">
        <a href="/agent/voice">{t("clone")}</a>
      </p>
      <Button type="submit" tone="primary" size="lg" block>
        {w("continue")}
      </Button>
    </form>
  );
}

function failCopy(status: string, t: Awaited<ReturnType<typeof getTranslations>>) {
  if (status === "rate-limited") return { title: t("rate"), hint: t("rateP") };
  if (status === "platform-outage") return { title: t("outage"), hint: t("outageP") };
  if (status === "offline") return { title: t("offline"), hint: t("missedP") };
  if (status === "voicemail-detected") return { title: t("voicemail"), hint: t("voicemailP") };
  if (status === "carrier-failed") return { title: t("carrier"), hint: t("triedP") };
  return { title: t("missed"), hint: t("missedP") };
}

export async function CallStep({
  destination,
  inbound,
  route,
  status,
  turns,
  duration,
}: {
  destination: string;
  inbound: string;
  route: "outbound" | "browser" | "inbound";
  status: string;
  turns: readonly { id: string; speaker: "ai" | "human"; text: string; translation?: string | null; interim?: boolean }[];
  duration: number;
}) {
  const t = await getTranslations("w5");
  const liveTurns = turns.filter((turn) => !turn.interim).map((turn) => ({
    id: turn.id,
    speaker: turn.speaker,
    text: turn.text,
    translation: turn.translation ?? undefined,
  }));
  const failed = status !== "ready" && status !== "ringing" && status !== "live" && status !== "ended";
  const fail = failCopy(status, t);
  const showInbound = status === "ready" || status === "no-answer" || status === "carrier-failed" || status === "voicemail-detected" || route === "inbound";
  return (
    <>
      <h1>{t("title")}</h1>
      <p className="sub">{t("lede")}</p>
      <div
        data-call-live={status === "live" ? "1" : undefined}
        data-call-ring={status === "ringing" ? "1" : undefined}
        data-browser-call={route === "browser" && status === "live" ? "1" : undefined}
      >
        {status === "ready" || status === "ringing" || status === "live" ? (
          <CallStage
            state={status === "ready" ? "ready" : status === "ringing" ? "ringing" : "live"}
            pill={status === "live" ? t("onCall") : status === "ringing" ? t("answer") : t("sandbox")}
            time={status === "live" ? formatDuration(duration) : status === "ringing" ? "0:04" : t("nobody")}
            title={status === "ringing" ? t("answer") : status === "ready" ? t("waiting") : undefined}
            hint={status === "ringing" ? t("ringing") : status === "live" ? t("hang") : `${t("we'll")} ${destination}`}
            destination={status === "ready" ? destination : undefined}
          >
            {status === "live" ? <LiveTranscript turns={liveTurns} /> : undefined}
          </CallStage>
        ) : (
          <CallStage state={status as "no-answer"} pill={t("sandbox")} title={fail.title} hint={fail.hint} />
        )}
      </div>
      {status === "ready" ? (
        <form action={startCallAction}>
          <input type="hidden" name="route" value="outbound" />
          <Button type="submit" tone="primary" size="lg" block>
            {t("callMe")}
          </Button>
        </form>
      ) : null}
      {status === "ringing" ? (
        <div className="fbrows">
          <form action={advanceCallAction}>
            <input type="hidden" name="next" value="live" />
            <Button type="submit" tone="primary" size="lg" block>
              {t("answer")}
            </Button>
          </form>
          <form action={advanceCallAction}>
            <input type="hidden" name="next" value="no-answer" />
            <Button type="submit" tone="ghost" block>
              {t("cancel")}
            </Button>
          </form>
          <form action={advanceCallAction}>
            <input type="hidden" name="next" value="voicemail-detected" />
            <Button type="submit" tone="ghost" block>
              {t("voicemail")}
            </Button>
          </form>
          <div data-slow-route hidden>
            <Banner tone="warn" title={t("slow")}>
              {t("other")}
            </Banner>
            <form action={startCallAction}>
              <input type="hidden" name="route" value="browser" />
              <Button type="submit" tone="secondary" block>
                {t("browser")}
              </Button>
            </form>
          </div>
        </div>
      ) : null}
      {status === "live" ? (
        <form action={advanceCallAction}>
          <input type="hidden" name="next" value="ended" />
          <Button type="submit" tone="danger" block>
            {t("end")}
          </Button>
        </form>
      ) : null}
      {status === "ready" || failed ? (
        <div className="fbrows">
          {failed ? (
            <form action={startCallAction}>
              <input type="hidden" name="route" value="outbound" />
              <Button type="submit" tone="primary" block>
                {t("again")}
              </Button>
            </form>
          ) : null}
          <form action={startCallAction}>
            <input type="hidden" name="route" value="browser" />
            <Button type="submit" tone={status === "ready" ? "secondary" : "secondary"} block>
              {t("browser")}
            </Button>
          </form>
        </div>
      ) : null}
      <div data-browser-fail hidden>
        <Banner tone="warn" title={t("micNo")}>
          {t("micNoP")}
        </Banner>
      </div>
      {showInbound ? (
        <div className="dialcard">
          <span>{t("testN")}</span>
          <b className="dn">{inbound}</b>
          <p>{t("dialP")}</p>
          <span>{t("works")}</span>
          <div className="demo-row">
            <Button type="button" tone="primary" data-copy={inbound.replace(/\s/g, "")}>
              {t("copyN")}
            </Button>
            <Button tone="secondary" asChild>
              <a href={`tel:${inbound.replace(/\s/g, "")}`}>{t("dialIt")}</a>
            </Button>
          </div>
          <form action={advanceCallAction}>
            <input type="hidden" name="next" value="ended" />
            <Button type="submit" tone="ghost" block>
              {t("iCalled")}
            </Button>
          </form>
        </div>
      ) : null}
      <ul className="trylist">
        <li>
          <b>{t("try")}</b> {t("q1")}
        </li>
        <li>{t("q2")}</li>
        <li>{t("q3")}</li>
      </ul>
      <form action={skipCall}>
        <p className="microfoot">
          <Button type="submit" tone="ghost">
            {t("cannotFail")}
          </Button>
        </p>
      </form>
    </>
  );
}

export async function ReviewStep() {
  const model = await loadActivation("review");
  if ("redirectTo" in model && model.redirectTo) redirect(hrefFor(model.redirectTo) as never);
  const t = await getTranslations("w6");
  const turns = model.docs.testCall?.turns ?? [];
  return (
    <>
      <div className="actmark">
        <Icon name="circle-check" size={22} />
        <span>
          <b>{t("heard")}</b>
          <span>{t("heardP")}</span>
        </span>
      </div>
      <h1>{t("title")}</h1>
      <p className="sub">{t("lede")}</p>
      {turns.map((turn) => (
        <ReviewTurn
          key={turn.id}
          speaker={turn.speaker}
          name={turn.speaker === "human" ? t("you") : "Subiza"}
          time={formatDuration(turn.atSeconds)}
          text={turn.text}
          translation={turn.translation ?? undefined}
          flagged={turn.asrConfidence !== null && turn.asrConfidence < 0.7}
          why={turn.speaker === "ai" ? t("why") : undefined}
          sources={turn.sourceLabel ? [turn.sourceLabel] : undefined}
        />
      ))}
      <form action={correctTurn} className="fixbox">
        <input type="hidden" name="turnId" value={turns.find((turn) => turn.sourceKind === "hours")?.id ?? ""} />
        <Field id="fix1" label={t("fix")}>
          <Input id="fix1" name="corrected" defaultValue="Ku wa gatandatu dufunga saa kumi n'ebyiri z'umugoroba." />
        </Field>
        <p className="microfoot">{t("fixH")}</p>
        <Button type="submit" tone="secondary">
          {t("retry")}
        </Button>
      </form>
      <div className="demo-row">
        <form action={startCallAction}>
          <input type="hidden" name="route" value="outbound" />
          <Button type="submit" tone="secondary">
            {t("retry")}
          </Button>
        </form>
        <form action={viewTranscriptAction}>
          <Button type="submit" tone="primary">
            {t("good")}
          </Button>
        </form>
      </div>
    </>
  );
}

export async function EscalationStep({ phone, invalid = false }: { phone: string; invalid?: boolean }) {
  const t = await getTranslations("w7");
  const w = await getTranslations("wizard");
  return (
    <form action={saveEscalationAction}>
      <h1>{t("title")}</h1>
      <p className="sub">{t("lede")}</p>
      {invalid ? (
        <Banner tone="risk" title={t("refuse")}>
          {t("refuseP")}
        </Banner>
      ) : null}
      <Field id="esc" label={t("number")} hint={t("hint")} {...(invalid ? { error: t("refuseP") } : {})}>
        <PhoneField
          id="esc"
          name="phone"
          invalid={invalid}
          defaultValue={phone.replace(/\s/g, "").replace(/^250/, "").replace(/^\+/, "")}
        />
      </Field>
      <h3 style={{ margin: "2rem 0 1rem" }}>{t("none")}</h3>
      <LadderOption n={1} id="fb1" name="fallback" value="message-with-time" defaultChecked title={t("n1")} detail={t("n1d")} />
      <LadderOption n={2} id="fb2" name="fallback" value="try-next" title={t("n2")} detail={t("n2d")} />
      <Button type="submit" tone="primary" size="lg" block>
        {w("continue")}
      </Button>
    </form>
  );
}

export async function PhoneStep({ verified, skipped, number }: { verified: boolean; skipped: boolean; number: string }) {
  const t = await getTranslations("w8");
  const w = await getTranslations("wizard");
  return (
    <>
      <h1>{t("title")}</h1>
      <p className="sub">{t("lede")}</p>
      <ForwardingCodeCard
        condition="no-reply"
        subizaNumber={number}
        timerSeconds={20}
        platform="unknown"
        heading={t("heading")}
        offNote={t("rings")}
        copyLabel={t("copy")}
        dialLabel={t("dial")}
        copyWorks={t("copyWorks")}
        platformNote={t("plat")}
      />
      {verified ? (
        <Banner tone="ok" title={t("checked")}>
          {t("checkedP")}
        </Banner>
      ) : null}
      {skipped ? (
        <Banner tone="info" title={t("sandbox")}>
          {t("sandboxP")}
        </Banner>
      ) : null}
      <form action={verified ? continuePhone : verifyPhoneAction}>
        <Button type="submit" tone="primary" size="lg" block>
          {verified ? w("continue") : t("check")}
        </Button>
      </form>
      {verified ? null : (
        <form action={skipPhone}>
          <p className="microfoot">
            <Button type="submit" tone="ghost">
              {w("later")}
            </Button>
          </p>
        </form>
      )}
    </>
  );
}

export async function ScopeStep() {
  const t = await getTranslations("w9");
  return (
    <form action={saveScopeAction}>
      <h1>{t("title")}</h1>
      <p className="sub">{t("lede")}</p>
      <LadderOption n={1} id="g1" name="rung" value="closed-only" defaultChecked title={t("r1")} recommended={t("rec")} detail={t("r1d")} />
      <LadderOption n={2} id="g2" name="rung" value="no-answer" title={t("r2")} detail={t("r2d")} />
      <LadderOption n={3} id="g3" name="rung" value="all-calls" title={t("r3")} detail={t("r3d")} />
      <Button type="submit" tone="primary" size="lg" block>
        {t("on")}
      </Button>
    </form>
  );
}
