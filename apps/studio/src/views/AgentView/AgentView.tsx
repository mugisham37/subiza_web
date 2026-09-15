import {
  Banner,
  Button,
  DeniedState,
  Field,
  Icon,
  RuleRow,
  Tag,
  Textarea,
  VisuallyHidden,
  WizardShell,
} from "@subiza/ui";
import {
  GREETING_MAX_SECONDS,
  RULE_CATEGORIES,
  STAGE_TOOLS,
  WEEKDAYS,
  badgeTone,
  ruleMissingKnowledge,
  ruleText,
  type AgentRule,
  type AgentStage,
  type AgentStep,
  type AgentTool,
  type RuleCategory,
  type WeekGrid,
} from "@subiza/domain";
import { getTranslations } from "next-intl/server";
import {
  addRuleAction,
  deleteRuleAction,
  editRuleAction,
  publishAgentAction,
  resolveConflictAction,
  restoreVersionAction,
  saveGreetingAction,
  saveMannerAction,
  savePersonaAction,
  toggleRuleAction,
} from "@/features/agent/actions";
import { loadAgent } from "@/features/agent/load";
import { hrefForAgent } from "@/features/agent/steps";
import { pauseAgentAction } from "@/features/activation/actions";
import { AgentAside } from "./asides";

type Model = Awaited<ReturnType<typeof loadAgent>>;
type Copy = Awaited<ReturnType<typeof getTranslations>>;

export async function AgentView({
  step,
  search,
}: {
  step: AgentStep;
  search?: Record<string, string | string[] | undefined>;
}) {
  const model = await loadAgent(step, search ?? {});
  const t = await getTranslations("agent");
  return (
    <WizardShell
      brandHref="/home"
      tag={t("tag")}
      tagTone={model.agent.publishedAt ? "ok" : "neutral"}
      progress={3}
      progressNow={model.progressNow - 1}
      aside={<AgentAside step={step} view={model.view} />}
      footer={
        <p className="microfoot" style={{ textAlign: "left" }}>
          {t("nextCall")} · {t("foot")} · {t("privacy")}
          {model.docs.goLive != null && model.docs.goLive.rung !== "sandbox" && model.docs.goLive.pausedAt === null ? (
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
      {model.denied ? (
        <DeniedState title={t("deniedTitle")} body={t("deniedBody")} />
      ) : step === "conflict" ? (
        <ConflictScreen model={model} t={t} />
      ) : step === "history" ? (
        <HistoryScreen model={model} t={t} />
      ) : (
        <BehaviourScreen model={model} t={t} />
      )}
    </WizardShell>
  );
}

function hoursStrip(hours: WeekGrid): string {
  const open = WEEKDAYS.filter((day) => hours[day].open);
  if (open.length === 0) return "";
  const first = hours[open[0]!];
  return `${open[0]}–${open[open.length - 1]} ${first.start}–${first.end}`;
}

function HiddenNav({ step, view }: { step: AgentStep; view: Model["view"] }) {
  return (
    <>
      <input type="hidden" name="step" value={step} />
      <input type="hidden" name="view" value={view} />
    </>
  );
}

function ViewSwitch({ model, t }: { model: Model; t: Copy }) {
  if (!model.advancedShips) return null;
  return (
    <div className="viewbar">
      <div className="viewseg" role="group" aria-label={t("title")}>
        {(["simple", "advanced"] as const).map((view) => (
          <a
            key={view}
            href={hrefForAgent(model.step, view, model.view)}
            className={model.view === view ? "on" : undefined}
            aria-pressed={model.view === view}
          >
            <Icon name={view === "simple" ? "list-checks" : "git-branch"} size={12} />
            {view === "simple" ? t("simple") : t("advanced")}
          </a>
        ))}
      </div>
      <span className="samecount">
        <Icon name="check-check" size={12} />
        {t("countEither", { count: model.agent.rules.length })}
      </span>
    </div>
  );
}

function Pill({
  name,
  value,
  on,
  label,
  step,
  view,
}: {
  name: string;
  value: string;
  on: boolean;
  label: string;
  step: AgentStep;
  view: Model["view"];
}) {
  return (
    <form action={saveMannerAction}>
      <HiddenNav step={step} view={view} />
      <input type="hidden" name={name} value={value} />
      <button type="submit" className={on ? "on" : undefined} aria-pressed={on}>
        {label}
      </button>
    </form>
  );
}

function RuleList({
  model,
  t,
  cat,
  rules,
}: {
  model: Model;
  t: Copy;
  cat: RuleCategory;
  rules: AgentRule[];
}) {
  const titles: Record<RuleCategory, string> = { always: t("always"), never: t("never"), escalate: t("escalate") };
  const icons: Record<RuleCategory, "check-check" | "x" | "phone-forwarded"> = {
    always: "check-check",
    never: "x",
    escalate: "phone-forwarded",
  };
  const conflictIds = new Set(model.conflicts.flatMap((row) => [row.leftId, row.rightId]));
  return (
    <div className="grp">
      <div className="gh">
        <span>
          <Icon name={icons[cat]} size={14} /> <b>{titles[cat]}</b>
        </span>
        <span className="gc">{rules.length}</span>
      </div>
      <div className="rules">
        {rules.map((rule) => (
          <AgentRuleRow key={rule.id} rule={rule} model={model} t={t} conflicting={conflictIds.has(rule.id)} />
        ))}
      </div>
      <form action={addRuleAction} className="addrule-form">
        <HiddenNav step={model.step} view={model.view} />
        <input type="hidden" name="cat" value={cat} />
        <input type="text" name="text" placeholder={t("addPlaceholder")} aria-label={t("addRule")} />
        <button type="submit" className="addrule">
          <Icon name="plus" size={12} /> {t("addRule")}
        </button>
      </form>
    </div>
  );
}

function AgentRuleRow({
  rule,
  model,
  t,
  conflicting,
}: {
  rule: AgentRule;
  model: Model;
  t: Copy;
  conflicting: boolean;
}) {
  const tone = badgeTone(rule);
  const labels = { hard: t("guaranteed"), soft: t("guideline"), lock: t("alwaysOn") };
  const titles = { hard: t("guaranteedTitle"), soft: t("guidelineTitle"), lock: t("lockTitle") };
  const missing = ruleMissingKnowledge(rule, model.knownIds);
  const text = ruleText(rule, model.locale);
  return (
    <RuleRow
      off={!rule.on}
      locked={rule.lock}
      conflicting={conflicting}
      missingKnowledge={missing}
      badge={tone}
      badgeLabel={labels[tone]}
      badgeTitle={titles[tone]}
      switchSlot={
        rule.lock ? (
            <button type="button" className={rule.on ? "rsw on" : "rsw"} disabled aria-pressed={rule.on} aria-label={t("on")}>
            <VisuallyHidden>{t("on")}</VisuallyHidden>
          </button>
        ) : (
          <form action={toggleRuleAction}>
            <HiddenNav step={model.step} view={model.view} />
            <input type="hidden" name="id" value={rule.id} />
            <button type="submit" className={rule.on ? "rsw on" : "rsw"} aria-pressed={rule.on} aria-label={rule.on ? t("on") : t("off")}>
              <VisuallyHidden>{rule.on ? t("on") : t("off")}</VisuallyHidden>
            </button>
          </form>
        )
      }
      deleteSlot={
        rule.lock ? null : (
          <form action={deleteRuleAction}>
            <HiddenNav step={model.step} view={model.view} />
            <input type="hidden" name="id" value={rule.id} />
            <button type="submit" className="rdel">
              {t("delete")}
            </button>
          </form>
        )
      }
      meta={missing ? t("missingKnowledge") : null}
    >
      {rule.lock ? (
        <input type="text" readOnly value={text} aria-label={text} />
      ) : (
        <form action={editRuleAction}>
          <HiddenNav step={model.step} view={model.view} />
          <input type="hidden" name="id" value={rule.id} />
          <input type="hidden" name="locale" value={model.locale} />
          <input type="text" name="text" defaultValue={text} aria-label={text} />
          <button type="submit" className="save-rule">
            {t("save")}
          </button>
        </form>
      )}
    </RuleRow>
  );
}

function toolLabel(tool: AgentTool, t: Copy): string {
  if (tool === "prices") return t("toolPrices");
  if (tool === "booking") return t("toolBooking");
  if (tool === "hours") return t("toolHours");
  if (tool === "message") return t("toolMessage");
  if (tool === "escalate") return t("toolEscalate");
  return t("toolKnowledge");
}

function StageGroup({
  model,
  t,
  stage,
  title,
  icon,
  note,
}: {
  model: Model;
  t: Copy;
  stage: AgentStage;
  title: string;
  icon: "play" | "message-square-text" | "calendar-check" | "clipboard-list" | "hand";
  note?: string;
}) {
  const tools = model.tools[stage];
  const rules = model.agent.rules.filter((rule) => rule.stage === stage);
  const conflictIds = new Set(model.conflicts.flatMap((row) => [row.leftId, row.rightId]));
  return (
    <div className="grp">
      <div className="gh">
        <span>
          <Icon name={icon} size={14} /> <b>{title}</b>
        </span>
        <span className="gc">
          {stage === "always" ? t("interrupts") : t("toolsCount", { on: tools.available.length, all: STAGE_TOOLS[stage].length })}
        </span>
      </div>
      {note ? <div className="gb">{note}</div> : null}
      <div className="tools">
        {tools.all.map((row) => (
          <span className={row.available ? "tool on" : "tool off"} key={row.tool}>
            <Icon name={row.available ? "check" : "x"} size={12} /> {toolLabel(row.tool, t)}
            {row.reason === "bridal-rule" ? <span className="toolwhy">{t("bridalRule")}</span> : null}
            {row.reason === "no-such-tool" ? <span className="toolwhy">{t("noSuchTool")}</span> : null}
          </span>
        ))}
      </div>
      <div className="rules">
        {rules.map((rule) => (
          <AgentRuleRow key={rule.id} rule={rule} model={model} t={t} conflicting={conflictIds.has(rule.id)} />
        ))}
      </div>
    </div>
  );
}

async function BehaviourScreen({ model, t }: { model: Model; t: Copy }) {
  const hours = hoursStrip(model.agent.hours);
  const width = Math.min(100, Math.round((model.seconds / GREETING_MAX_SECONDS) * 100));
  return (
    <>
      <h1>{t("title")}</h1>
      <p className="sub">{t("lede")}</p>
      {hours ? <p className="hours-strip">{t("hours")}: {hours}</p> : null}
      <ViewSwitch model={model} t={t} />
      {model.view === "advanced" ? (
        <>
          <StageGroup model={model} t={t} stage="greeting" title={t("stageGreeting")} icon="play" note={model.agent.greeting} />
          <StageGroup model={model} t={t} stage="answer" title={t("stageAnswer")} icon="message-square-text" />
          <StageGroup model={model} t={t} stage="booking" title={t("stageBooking")} icon="calendar-check" />
          <StageGroup model={model} t={t} stage="message" title={t("stageMessage")} icon="clipboard-list" />
          <StageGroup model={model} t={t} stage="always" title={t("stageAlways")} icon="hand" note={t("stageAlwaysBody")} />
        </>
      ) : (
        <>
          <div className="grp">
            <div className="gh">
              <span>
                <Icon name="user" size={14} /> <b>{t("who")}</b>
              </span>
            </div>
            <div className="greet">
              <form action={savePersonaAction}>
                <HiddenNav step={model.step} view={model.view} />
                <Field id="persona" label={t("persona")} hint={t("personaHint")}>
                  <Textarea id="persona" name="persona" defaultValue={model.agent.persona} rows={2} />
                </Field>
                <Button type="submit" tone="secondary" size="sm">
                  {t("save")}
                </Button>
              </form>
              <form action={saveGreetingAction} className="greet">
                <HiddenNav step={model.step} view={model.view} />
                <Field id="greeting" label={t("greeting")}>
                  <Textarea id="greeting" name="greeting" defaultValue={model.agent.greeting} rows={3} />
                </Field>
                {model.greetingLong ? (
                  <Banner tone="warn" title={t("longGreeting")}>
                    {t("longGreetingBody")}
                  </Banner>
                ) : null}
                <div className="gf">
                  <span className={model.greetingLong ? "dur warn" : "dur"}>
                    <Icon name="timer" size={12} /> {model.seconds}s
                  </span>
                  <span className={model.greetingLong ? "durbar warn" : "durbar"} style={{ ["--w" as string]: `${width}%` }}>
                    <i />
                  </span>
                  <a className="btn btn-secondary btn-sm" href="/api/voice-preview">
                    <Icon name="play" size={12} /> {t("hear")}
                  </a>
                  <Button type="submit" tone="secondary" size="sm">
                    {t("save")}
                  </Button>
                </div>
                <audio controls src="/api/voice-preview" style={{ width: "100%", marginTop: "0.75rem" }}>
                  {t("hear")}
                </audio>
              </form>
              <div className="pickrow">
                <span className="pk">
                  <span>{t("manner")}</span>
                  <span>{t("mannerHint")}</span>
                </span>
                <span className="pills">
                  <Pill name="tone" value="warm" on={model.agent.tone === "warm"} label={t("warm")} step={model.step} view={model.view} />
                  <Pill name="tone" value="neutral" on={model.agent.tone === "neutral"} label={t("neutral")} step={model.step} view={model.view} />
                  <Pill name="tone" value="formal" on={model.agent.tone === "formal"} label={t("formal")} step={model.step} view={model.view} />
                </span>
              </div>
            </div>
          </div>
          <div className="grp">
            <div className="gh">
              <span>
                <Icon name="message-square-text" size={14} /> <b>{t("speaks")}</b>
              </span>
            </div>
            <div className="pickrow">
              <span className="pk">
                <span>{t("answerLen")}</span>
                <span>{t("answerLenHint")}</span>
              </span>
              <span className="pills">
                <Pill name="answerLength" value="short" on={model.agent.answerLength === "short"} label={t("short")} step={model.step} view={model.view} />
                <Pill name="answerLength" value="normal" on={model.agent.answerLength === "normal"} label={t("normal")} step={model.step} view={model.view} />
                <Pill name="answerLength" value="detailed" on={model.agent.answerLength === "detailed"} label={t("detailed")} step={model.step} view={model.view} />
              </span>
            </div>
            <div className="pickrow">
              <span className="pk">
                <span>{t("useName")}</span>
                <span>{t("useNameHint")}</span>
              </span>
              <span className="pills">
                <Pill name="useCallerName" value="yes" on={model.agent.useCallerName} label={t("yes")} step={model.step} view={model.view} />
                <Pill name="useCallerName" value="no" on={!model.agent.useCallerName} label={t("no")} step={model.step} view={model.view} />
              </span>
            </div>
            <div className="pickrow">
              <span className="pk">
                <span>{t("sure")}</span>
                <span>{t("sureHint")}</span>
              </span>
              <span className="pills">
                <Pill name="confidence" value="relaxed" on={model.agent.confidence === "relaxed"} label={t("relaxed")} step={model.step} view={model.view} />
                <Pill name="confidence" value="balanced" on={model.agent.confidence === "balanced"} label={t("balanced")} step={model.step} view={model.view} />
                <Pill name="confidence" value="careful" on={model.agent.confidence === "careful"} label={t("careful")} step={model.step} view={model.view} />
              </span>
            </div>
          </div>
          {RULE_CATEGORIES.map((cat) => (
            <RuleList
              key={cat}
              model={model}
              t={t}
              cat={cat}
              rules={model.agent.rules.filter((rule) => rule.cat === cat)}
            />
          ))}
        </>
      )}
      {model.tooMany ? (
        <Banner tone="warn" title={t("tooManyTitle")}>
          {t("tooManyBody")}
        </Banner>
      ) : null}
      <div className="pubbar">
        <span className="pinfo">
          {model.agent.unpublished ? t("draftChanges", { version: model.agent.versionNumber }) : t("noChanges", { version: model.agent.versionNumber })}
        </span>
        <Button tone="ghost" size="sm" asChild>
          <a href={hrefForAgent("history", model.view)}>
            <Icon name="undo-2" size={12} /> {t("history")}
          </a>
        </Button>
        <form action={publishAgentAction}>
          <HiddenNav step={model.step} view={model.view} />
          <Button type="submit" tone="primary">
            {t("publish")} <Icon name="arrow-right" size={14} />
          </Button>
        </form>
      </div>
    </>
  );
}

async function ConflictScreen({ model, t }: { model: Model; t: Copy }) {
  const first = model.conflicts[0];
  const left = model.agent.rules.find((rule) => rule.id === first?.leftId);
  const right = model.agent.rules.find((rule) => rule.id === first?.rightId);
  return (
    <>
      <a className="backlink" href={hrefForAgent("behaviour", model.view)}>
        <Icon name="arrow-left" size={14} />
        {t("back")}
      </a>
      {first && left && right ? (
        <>
          <h1>{t("conflictTitle")}</h1>
          <p className="sub">{t("conflictLede")}</p>
          <div className="conflict-card">
            <div className="ch">
              <Icon name="triangle-alert" size={18} />
              <div>
                <h4>{t("conflictQ")}</h4>
                <p>{t("conflictRefuse")}</p>
              </div>
            </div>
            <div className="vs">
              <div className="vsrow">
                <div className="vk">{t("alwaysLabel")}</div>
                <div>{ruleText(left, model.locale)}</div>
              </div>
              <div className="vsrow">
                <div className="vk">{t("neverLabel")}</div>
                <div>{ruleText(right, model.locale)}</div>
              </div>
            </div>
            {first.kind === "dual-run-disagreement" ? <Banner tone="info" title={t("dualRun")}>{t("dualRun")}</Banner> : null}
            <div className="resolve">
              {(["never", "always", "narrow"] as const).map((resolution) => (
                <form action={resolveConflictAction} key={resolution}>
                  <HiddenNav step={model.step} view={model.view} />
                  <input type="hidden" name="conflictId" value={first.id} />
                  <input type="hidden" name="resolution" value={resolution} />
                  <Button type="submit" tone="secondary" block>
                    {resolution === "never" ? t("resNever") : resolution === "always" ? t("resAlways") : t("resNarrow")}
                  </Button>
                </form>
              ))}
            </div>
          </div>
          <Banner tone="info" title={t("whyCatchTitle")}>
            {t("whyCatchBody")}
          </Banner>
          <form action={publishAgentAction}>
            <HiddenNav step={model.step} view={model.view} />
            <input type="hidden" name="anyway" value="1" />
            <Button type="submit" tone="primary" size="lg" block>
              {t("publishAnyway")} <Icon name="arrow-right" size={14} />
            </Button>
          </form>
          <p className="microfoot">{t("publishAnywayFoot")}</p>
        </>
      ) : (
        <>
          <h1>{t("cleanTitle")}</h1>
          <p className="sub">{t("cleanBody")}</p>
          <form action={publishAgentAction}>
            <HiddenNav step={model.step} view={model.view} />
            <Button type="submit" tone="primary" size="lg" block>
              {t("publish")} <Icon name="arrow-right" size={14} />
            </Button>
          </form>
        </>
      )}
    </>
  );
}

async function HistoryScreen({ model, t }: { model: Model; t: Copy }) {
  const current = model.agent;
  const previous = model.versions[0];
  const diff = previous ? model.diff : null;
  return (
    <>
      <a className="backlink" href={hrefForAgent("behaviour", model.view)}>
        <Icon name="arrow-left" size={14} />
        {t("back")}
      </a>
      <h1>{t("historyTitle")}</h1>
      <p className="sub">{t("historyLede")}</p>
      <div className="vers">
        <div className="vrow cur">
          <span className="vn">v{current.versionNumber}</span>
          <div className="vd">
            <b>{t("liveNow")}</b>
            <span>{model.tenant.name}</span>
          </div>
          <Tag tone="ok">{t("now")}</Tag>
        </div>
        {model.versions.map((version) => (
          <div className="vrow" key={version.id}>
            <span className="vn">v{version.snapshot.versionNumber}</span>
            <div className="vd">
              <b>{version.authorName}</b>
              <span>{new Date(version.at).toLocaleString()}</span>
            </div>
            <form action={restoreVersionAction}>
              <HiddenNav step={model.step} view={model.view} />
              <input type="hidden" name="versionId" value={version.id} />
              <Button type="submit" tone="secondary" size="sm">
                {t("restore")}
              </Button>
            </form>
          </div>
        ))}
      </div>
      {diff ? (
        <div className="diff">
          {diff.added.map((row) => (
            <div className="add" key={`a-${row}`}>
              {t("added")}: {row}
            </div>
          ))}
          {diff.removed.map((row) => (
            <div className="rem" key={`r-${row}`}>
              {t("removed")}: {row}
            </div>
          ))}
          <div>{t("unchanged", { count: diff.unchangedCount })}</div>
        </div>
      ) : null}
      <Banner tone="ok" title={t("restoreSaves")}>
        {t("restoreSavesBody")}
      </Banner>
    </>
  );
}
