import type { ReactNode } from "react";
import {
  AppShell,
  Banner,
  Bars,
  Button,
  ButtonLink,
  Card,
  ChannelTile,
  Chip,
  ChoiceCard,
  CreditCard,
  Empty,
  EscalationLadder,
  Eyebrow,
  Field,
  ForwardingCodeCard,
  Input,
  LiveCallCard,
  Meter,
  MotionSwitch,
  OtpField,
  PhoneField,
  PhoneFrame,
  Ring,
  RowItem,
  RowList,
  Sparkline,
  Stat,
  StatusDot,
  Tag,
  ThemeSwitch,
  Toast,
  Toggle,
  Transcript,
  WhatsAppBubble,
} from "@subiza/ui";

const SECTIONS = [
  ["principles", "Principles"],
  ["colour", "Colour"],
  ["type", "Typography"],
  ["space", "Space"],
  ["depth", "Depth"],
  ["motion", "Motion"],
  ["icons", "Icons"],
  ["tone", "Voice"],
  ["buttons", "Buttons"],
  ["chips", "Chips"],
  ["forms", "Forms"],
  ["cards", "Cards"],
  ["feedback", "Feedback"],
  ["navigation", "Navigation"],
  ["callcard", "Live call"],
  ["transcript", "Transcript"],
  ["channels", "Channels"],
  ["forwarding", "Forwarding"],
  ["escalation", "Escalation"],
  ["credit", "Credit"],
  ["report", "Report"],
  ["states", "States"],
  ["responsive", "Responsive"],
  ["a11y", "Accessibility"],
  ["perf", "Performance"],
  ["credits", "Credits"],
] as const;

function Why({ children }: { children: string }) {
  return (
    <div className="why">
      <p>{children}</p>
    </div>
  );
}

function Demo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="demo">
      <span className="demo-lab">{label}</span>
      {children}
    </div>
  );
}

export function DesignSystemView({ lang }: { lang: string }) {
  return (
    <div className="shell">
      <aside className="nav">
        <a className="brand" href={`/${lang}/design-system`}>
          <span className="mark">S</span>
          <span>
            <b>Subiza</b>
            <span>Design system</span>
          </span>
        </a>
        <p className="navver">Phase 1 · v1.0</p>
        {SECTIONS.map(([id, label], index) => (
          <a key={id} className="nl" href={`#${id}`}>
            {String(index + 1).padStart(2, "0")} {label}
          </a>
        ))}
      </aside>
      <main id="content" className="main">
        <div className="wrap">
          <div className="pgtop">
            <div>
              <Eyebrow>Design system</Eyebrow>
              <h1 className="h0">
                The system, <em>not a kit</em>
              </h1>
              <p className="docint">
                Ported from Design/design-system.html. Tokens are verbatim. Lime is a
                fill. Dark is authored.
              </p>
            </div>
            <div className="stackable demo-row">
              <ThemeSwitch />
              <MotionSwitch />
            </div>
          </div>

          <section className="sec" id="principles">
            <div className="seclab">
              <span className="n">01</span>
              <h2>Six principles</h2>
            </div>
            <p>Hairlines over shadows. One next action. Bytes are a user-facing cost.</p>
          </section>

          <section className="sec" id="colour">
            <div className="seclab">
              <span className="n">02</span>
              <h2>Colour</h2>
            </div>
            <Why>
              Lime is 1.2:1 on ground. It is a fill. The only green allowed as text is
              --signal-text.
            </Why>
            <div className="grid g4">
              {[
                ["--ground", "#FAF9F4"],
                ["--signal", "#C6F24E"],
                ["--signal-text", "#3D5C10"],
                ["--ink", "#14150F"],
              ].map(([name, hex]) => (
                <div className="sw" key={name}>
                  <div className="chip-c" style={{ background: `var(${name})` }} />
                  <div className="meta">
                    <b>{name}</b>
                    <code>{hex}</code>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="sec" id="type">
            <div className="seclab">
              <span className="n">03</span>
              <h2>Typography</h2>
            </div>
            <h1>Bricolage for moments</h1>
            <p>Plus Jakarta Sans for the work. JetBrains Mono for numbers and codes.</p>
          </section>

          <section className="sec" id="space">
            <div className="seclab">
              <span className="n">04</span>
              <h2>Space and radius</h2>
            </div>
            <p>Fourteen steps on a 4px base. Three radii, each meaning something else.</p>
          </section>

          <section className="sec" id="depth">
            <div className="seclab">
              <span className="n">05</span>
              <h2>Depth</h2>
            </div>
            <Why>
              A 1px hairline at 9% alpha survives cheap panels. Soft shadows do not.
            </Why>
          </section>

          <section className="sec" id="motion">
            <div className="seclab">
              <span className="n">06</span>
              <h2>Motion</h2>
            </div>
            <p>Ceiling 300ms. The spring easing is used on the toggle knob only.</p>
            <Toggle id="motion-demo" label="The only spring" defaultChecked />
          </section>

          <section className="sec" id="icons">
            <div className="seclab">
              <span className="n">07</span>
              <h2>Icons</h2>
            </div>
            <p>176 Lucide symbols, stroke 1.75, one sprite. No icon font.</p>
          </section>

          <section className="sec" id="tone">
            <div className="seclab">
              <span className="n">08</span>
              <h2>Voice and language</h2>
            </div>
            <p>Kinyarwanda is first-class. Icons and numbers over paragraphs.</p>
          </section>

          <section className="sec" id="buttons">
            <div className="seclab">
              <span className="n">09</span>
              <h2>Buttons</h2>
            </div>
            <Demo label="Variants">
              <div className="demo-row stackable">
                <Button tone="primary">Primary</Button>
                <Button tone="solid">Solid</Button>
                <Button tone="secondary">Secondary</Button>
                <Button tone="ghost">Ghost</Button>
                <Button tone="danger">Danger</Button>
                <Button tone="primary" loading>
                  Loading
                </Button>
                <ButtonLink href={`/${lang}/design-system`} tone="secondary">
                  A link
                </ButtonLink>
              </div>
            </Demo>
          </section>

          <section className="sec" id="chips">
            <div className="seclab">
              <span className="n">10</span>
              <h2>Chips and status</h2>
            </div>
            <Demo label="Status is shape + word + colour">
              <div className="demo-row">
                <Chip pressed count={4}>
                  Needs you
                </Chip>
                <Chip>All</Chip>
                <Tag tone="ok">Live</Tag>
                <Tag tone="warn">Low credit</Tag>
                <Tag tone="risk">Broken</Tag>
                <StatusDot tone="ok">Working</StatusDot>
                <StatusDot tone="warn">Action needed</StatusDot>
                <StatusDot tone="risk">Broken</StatusDot>
                <StatusDot tone="live">On a call now</StatusDot>
              </div>
            </Demo>
          </section>

          <section className="sec" id="forms">
            <div className="seclab">
              <span className="n">11</span>
              <h2>Forms</h2>
            </div>
            <Why>
              One OTP input, six painted slots. Six inputs fail WCAG 2.2 SC 3.3.8.
            </Why>
            <Demo label="Fields">
              <Field id="biz" label="Business name" hint="As customers say it">
                <Input id="biz" defaultValue="Claudine Salon" />
              </Field>
              <Field id="phone" label="Phone">
                <PhoneField id="phone" defaultValue="788 123 456" />
              </Field>
              <Field id="otp" label="Code from SMS">
                <OtpField id="otp" />
              </Field>
              <div className="grid g2">
                <ChoiceCard
                  id="kind-salon"
                  name="kind"
                  title="Salon"
                  description="Bookings, prices, hours."
                  icon="sparkles"
                  defaultChecked
                />
                <ChoiceCard
                  id="kind-shop"
                  name="kind"
                  title="Shop"
                  description="Stock, delivery, prices."
                  icon="store"
                />
              </div>
            </Demo>
          </section>

          <section className="sec" id="cards">
            <div className="seclab">
              <span className="n">12</span>
              <h2>Cards and stats</h2>
            </div>
            <div className="cq grid g3">
              <Stat label="Answered" value="31" delta="+6 vs last week" deltaTone="up" keyed />
              <Stat label="Missed before" value="12" />
              <Stat label="Credit" value="14,200" unit="RWF" />
            </div>
            <Card>
              <h3>A card is an object</h3>
              <p>Radius --r-md. Hairline, not a shadow.</p>
            </Card>
          </section>

          <section className="sec" id="feedback">
            <div className="seclab">
              <span className="n">13</span>
              <h2>Feedback</h2>
            </div>
            <Banner tone="info" title="A recording is missing">
              The rest of this conversation loaded. The audio did not.
            </Banner>
            <Banner tone="warn" title="Try again in 4 minutes">
              The network asked us to wait.
            </Banner>
            <Banner tone="risk" title="Something went wrong on our side">
              We know, and we are looking. This is not your fault.
            </Banner>
            <Toast>You are offline. We will send this when you are back.</Toast>
            <Empty title="Nothing here yet" action={<Button>Run a test call</Button>}>
              This is where answered conversations will land.
            </Empty>
          </section>

          <section className="sec" id="navigation">
            <div className="seclab">
              <span className="n">14</span>
              <h2>Navigation</h2>
            </div>
            <Why>
              The rail and the tab bar are different components. Never a hamburger.
            </Why>
            <AppShell
              items={[
                { id: "home", href: "#", label: "Home", shortLabel: "Home", icon: "house", active: true },
                { id: "conversations", href: "#", label: "Conversations", shortLabel: "Chats", icon: "inbox", count: 3 },
                { id: "agent", href: "#", label: "Agent", shortLabel: "Agent", icon: "bot" },
                { id: "connections", href: "#", label: "Connections", shortLabel: "Links", icon: "link" },
                { id: "results", href: "#", label: "Results", shortLabel: "Results", icon: "chart-column" },
                { id: "credit", href: "#", label: "Credit", shortLabel: "Credit", icon: "wallet" },
                { id: "settings", href: "#", label: "Settings", shortLabel: "More", icon: "settings" },
              ]}
            >
              <p>The feed lives here in Prompt 12.</p>
            </AppShell>
            <PhoneFrame>
              <p>Phone chrome for marketing and this showcase only.</p>
            </PhoneFrame>
          </section>

          <section className="sec" id="callcard">
            <div className="seclab">
              <span className="n">15</span>
              <h2>Live call</h2>
            </div>
            <LiveCallCard who="Aline U." line="Second this week · +250 788 000 111" elapsed="01:24" />
            <LiveCallCard who="Aline U." line="" elapsed="01:24" compact />
          </section>

          <section className="sec" id="transcript">
            <div className="seclab">
              <span className="n">16</span>
              <h2>Transcript</h2>
            </div>
            <Transcript
              turns={[
                {
                  id: "1",
                  speaker: "ai",
                  name: "Subiza",
                  time: "09:14",
                  text: "Muraho. This is Claudine’s assistant.",
                  original: "Muraho. Ndi umufasha wa Claudine.",
                  confidence: "hi",
                },
                {
                  id: "2",
                  speaker: "human",
                  name: "Caller",
                  time: "09:14",
                  text: "Do you have a slot on Saturday?",
                  confidence: "mid",
                },
              ]}
            />
          </section>

          <section className="sec" id="channels">
            <div className="seclab">
              <span className="n">17</span>
              <h2>Channels</h2>
            </div>
            <div className="cq grid g2">
              <ChannelTile kind="ph" name="Phone" detail="Forwarding verified" status="working" />
              <ChannelTile kind="wa" name="WhatsApp" detail="Waiting on Meta" status="action" />
              <ChannelTile kind="tg" name="Telegram" detail="Not connected" status="off" />
              <ChannelTile kind="ig" name="Instagram" detail="Window closed" status="err" />
            </div>
          </section>

          <section className="sec" id="forwarding">
            <div className="seclab">
              <span className="n">18</span>
              <h2>Forwarding code</h2>
            </div>
            <ForwardingCodeCard
              number="250788123456"
              code="**61*250788123456*11*20#"
              telHref="tel:**61*250788123456*11*20%23"
              platformNote="On iPhone, tel: MMI codes fail silently. On Android they only pre-fill."
            />
          </section>

          <section className="sec" id="escalation">
            <div className="seclab">
              <span className="n">19</span>
              <h2>Escalation</h2>
            </div>
            <EscalationLadder
              rungs={[
                { title: "AI tried", detail: "Low confidence", time: "09:16", state: "done" },
                { title: "Calling Claudine", detail: "Second on the rota", time: "now", state: "now" },
                { title: "Manager", detail: "If Claudine misses" },
              ]}
            />
          </section>

          <section className="sec" id="credit">
            <div className="seclab">
              <span className="n">20</span>
              <h2>Credit</h2>
            </div>
            <CreditCard balance={14200} cap={20000} locale="en" />
            <Meter value={12} tone="warn" />
          </section>

          <section className="sec" id="report">
            <div className="seclab">
              <span className="n">21</span>
              <h2>Report and data</h2>
            </div>
            <WhatsAppBubble
              name="Claudine"
              outcome="31 calls you would have missed"
              weakness="Two callers hung up before the greeting finished."
              href={`/${lang}/design-system`}
              time="19:02"
            />
            <Bars values={[8, 12, 9, 14, 11, 18, 31]} labels={["M", "T", "W", "T", "F", "S", "S"]} />
            <Ring value={72} label="Questions the agent can answer" />
            <Sparkline points={[4, 8, 6, 10, 9, 14, 31]} label="Answered this week" />
          </section>

          <section className="sec" id="states">
            <div className="seclab">
              <span className="n">22</span>
              <h2>The eight states</h2>
            </div>
            <Why>Nothing is designed until all eight exist. The happy path is one of eight.</Why>
            <RowList>
              <RowItem avatar="1" title="Loading" subtitle="Skeleton shaped like the content" />
              <RowItem avatar="2" title="Empty" subtitle="Why, and one action" />
              <RowItem avatar="3" title="Offline" subtitle="Queue and show as pending" />
              <RowItem avatar="4" title="Partial" subtitle="Say what is missing" />
              <RowItem avatar="5" title="Denied" subtitle="Why, and who can" />
              <RowItem avatar="6" title="Not found" subtitle="What happened, where to go" />
              <RowItem avatar="7" title="Rate limited" subtitle="When to try, in minutes" />
              <RowItem avatar="8" title="Server error" subtitle="Sorry once. Never a code." />
            </RowList>
          </section>

          <section className="sec" id="responsive">
            <div className="seclab">
              <span className="n">23</span>
              <h2>Responsive</h2>
            </div>
            <p>Base is 360. Six components are redesigned, not reflowed.</p>
          </section>

          <section className="sec" id="a11y">
            <div className="seclab">
              <span className="n">24</span>
              <h2>Accessibility</h2>
            </div>
            <p>WCAG 2.2 AA. Focus appearance is required. Targets are 48×48 with 8px gaps.</p>
          </section>

          <section className="sec" id="perf">
            <div className="seclab">
              <span className="n">25</span>
              <h2>Performance</h2>
            </div>
            <p>200KB above the fold. No chart library, no icon font, no animation runtime.</p>
          </section>

          <section className="sec" id="credits">
            <div className="seclab">
              <span className="n">26</span>
              <h2>Assets and licences</h2>
            </div>
            <p>Lucide ISC. Fonts OFL 1.1. Original instruments. No stock people.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
