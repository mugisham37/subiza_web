# 04 — Platform Constraints & Design Boundaries

*Part of the [Subiza Flow Atlas](../README.md)*

---

> **Read this before any other flow document.**
>
> The most expensive mistake available to this project is designing a beautiful flow around a capability that does not exist — discovering it in month four, and rebuilding onboarding. This document establishes, with sources, exactly what WhatsApp, Instagram, Messenger, Telegram and the telephony layer will and will not let a third-party platform do. Every constraint here becomes a **designed state** in a flow rather than a bug.

---

## 1. How to use this document

Constraints come in three kinds, and they demand different responses:

| Kind | Meaning | Our response |
|---|---|---|
| 🔴 **IMPOSSIBLE** | The platform does not permit it, at all | Design it out. Never promise it |
| 🟠 **REQUIRES A HUMAN** | Only the business owner or a platform reviewer can do it | Design a guided instruction + a verification step + a waiting state |
| 🟡 **CONDITIONAL** | Possible, but gated by time, review, tier or approval | Design a pending state that can last days |

The single biggest design consequence: **a large part of connecting a channel is not something we do — it is something we guide someone else through and then verify.** That reframing is what makes the connection flows in [Documents 07](07-flow-phone-connection.md) and [08](08-flow-messaging-channel-connection.md) honest.

---

## 2. WhatsApp — the highest value and the tightest constraints

### 2.1 What the owner actually sees during Embedded Signup

This is a Meta-hosted popup. We do not control it, cannot restyle it, and cannot skip its steps. It runs:

| # | Screen | Notes |
|---|---|---|
| 1 | Facebook login | Reuses an existing session if present |
| 2 | Terms acceptance | WhatsApp Business, Cloud API, Meta Business Tools |
| 3 | Product selection | Which WhatsApp capabilities are granted |
| 4 | App authorisation | The actual OAuth consent — grants *our* app access |
| 5 | Business portfolio | Select existing or create new (name, business email) |
| 6 | WABA selection or creation | Under that portfolio |
| 7 | Phone number + **OTP** | SMS or voice call, owner's choice |
| 8 | Display name | Goes to **asynchronous review** afterwards |

Pre-filling known data (business name, phone number) shortens this materially — which is why [Flow 06](06-flow-guided-activation.md) collects the business profile *before* the channel connection step, not after.

What returns to us, client-side: WABA ID, phone number ID, and an **exchangeable code with a 30-second time-to-live**. Our server must exchange it inside that window or the whole popup must be run again.

### 2.2 The constraints

| # | Constraint | Kind | Design consequence |
|---|---|---|---|
| W1 | The owner must personally receive and enter the OTP. We cannot register a number for them | 🟠 | The connection flow is a guided handoff, not an automation. Detect abandonment and offer resume |
| W2 | A number already active on WhatsApp Messenger or the WhatsApp Business App **cannot** be registered for the Cloud API unless deleted from that app first — or the business uses Coexistence | 🔴/🟡 | Ask, before starting: "Do you already use this number on WhatsApp Business?" Branch accordingly. This is the most common blocker in the category |
| W3 | **Coexistence** lets the Business App and Cloud API share a number, but: one-time history sync only (6 months, 1:1 chats only, media only from the last 14 days), the app must stay open for ~24 hours during sync, throughput is capped at **20 messages/second**, and group chats, broadcast lists, disappearing messages and Business-App tools are invisible to the API | 🟡 | If the sync lapses or fails, the entire flow must restart — so the flow needs a resilient, resumable state and an upfront warning about the time window |
| W4 | Display name goes to **asynchronous review** and can be rejected (generic terms, mismatch with the legal name, emojis, phone numbers). Until approved, the number shows instead of the name | 🟡 | A "display name pending / rejected" state in Connections, with resubmission and a clear explanation. Never block go-live on it |
| W5 | The 30-second code exchange window | 🟡 | Server-side exchange must be immediate. If it fails, re-launch the popup with a plain explanation, not an error code |
| W6 | Free-form messages only within **24 hours** of the customer's last message. Outside it, only approved templates | 🔴 outside the window | The inbox shows the window state per conversation and disables free-form composition with an explanation, never a silent send failure |
| W7 | Templates require per-template Meta approval, can be rejected, and take real review time | 🟡 | Template management is its own screen with status per template |
| W8 | **General-purpose AI chatbots are banned** on WhatsApp — enforced for new users from 15 Oct 2025 and all users from 15 Jan 2026. Business-scoped assistants remain allowed *provided* they operate under a verified business number, keep clear human-escalation paths, and are a supporting feature rather than the centrepiece | 🔴 | This is an architectural constraint, not a policy footnote. Agents are scoped by construction: the retrieval boundary and rule set confine them to the tenant's business. Out-of-scope questions are deflected. Human escalation is always visible. **Subiza never ships a general assistant on WhatsApp** |
| W9 | We cannot import chat history from before connection (except W3's one-time sync) | 🔴 | Never promise "we'll learn from your past conversations" |
| W10 | Business Verification takes **5–15 business days per cycle**, and a rejection resets the clock | 🟡 | Onboarding must be fully useful while verification is pending. Voice and Telegram work immediately; WhatsApp arrives later |
| W11 | Onboarding is throttled at **10 new business customers per rolling 7 days** by default, rising to 200/7 days only after our Business Verification, App Review and Access Verification are complete | 🟡 | **This caps our own growth rate.** It must be an admin-console metric with an alert, and early cohorts must be scheduled |
| W12 | New tenants start at **250 business-initiated messages / 24h**, scaling to 2,000 and beyond based on quality and volume | 🟡 | Show the tenant their current tier and quality rating. Never let them discover it by failing to send |
| W13 | Quality rating (green / yellow / red) is platform-controlled. Red → flagged → 7-day grace → automatic tier downgrade. Hitting the limit → restricted, 24h send block | 🟡 | Monitor per tenant, alert the owner *before* degradation, and give concrete remediation |
| W14 | As a **Tech Provider**, each tenant must add their own payment method to Meta. We cannot pay on their behalf | 🟠 | An extra step in the connection flow that we must explain, because to a shop owner "add a card to Facebook" is a conversion wall. Becoming a Solution Partner later removes it |
| W15 | Meta's own 30-day message retention, outside our control | 🟡 | Disclosed to tenants in the data-processing terms |
| W16 | Opt-in is legally the **business's** obligation, with no carve-out for the platform collecting it on their behalf | 🟠 | We provide opt-in tooling (QR code, web form, IVR prompt) and monitor for patterns suggesting non-compliance, but the residual risk is real and must be in the tenant terms |
| W17 | A 2FA PIN set by a previous provider blocks migration | 🟠 | Detect and give reset instructions |
| W18 | Marketing templates are reported as unavailable for Rwandan WABAs (not corroborated on Meta's own materials) | 🟡 unverified | Do not build or promise marketing broadcast for Rwanda until confirmed. Inbound service is unaffected |
| W19 | Service messages become **billable from 1 October 2026** — 1,000 free per WABA per month, then charged at the utility rate | 🟡 | The cost model and the tenant's usage display must reflect this from launch |

### 2.3 What this does to the flow

Connecting WhatsApp is **not** a step in a wizard. It is a **sub-flow with four possible states that can persist for days**:

```
   Not started ──► In progress ──► Pending review ──► Connected
                        │                │
                        ▼                ▼
                   Blocked          Rejected
                   (W2: number      (W4: display name)
                    on Business
                    App)
```

Every one of those states needs a screen, an explanation in plain Kinyarwanda, and one clear next action. And critically: **the product must be fully valuable while WhatsApp sits in "pending review" for two weeks.** That is why voice comes first in activation.

---

## 3. Instagram — stricter than it looks

| # | Constraint | Kind | Design consequence |
|---|---|---|---|
| I1 | The account **must** be a professional (Business or Creator) account. Personal accounts cannot be connected by any API | 🟠 | Detect and guide the conversion, which is free and reversible, before attempting connection |
| I2 | 24-hour messaging window, opened by a DM, a comment, a story reply, or a reply in an existing thread. **Not** opened by views, likes or ad clicks | 🔴 outside | Window state visible per conversation |
| I3 | The **Human Agent tag** extends the window to 7 days but "must be applied by a real human, not an automated system." Using it from automation errors out | 🔴 for the AI | The AI can never use it. Only a human taking over may — and the product must enforce that, not just document it |
| I4 | **There is no template equivalent.** Once the window closes there is no paid way back in | 🔴 | When a window is about to close on an unresolved conversation, the product must offer to migrate the customer to WhatsApp or SMS. Otherwise the conversation dies silently |
| I5 | **One private reply per comment, ever, within 7 days** | 🔴 | Comment-to-DM automation must be idempotent and must never retry. A failed private reply is permanently failed |
| I6 | Roughly 200 automated DMs per hour per account (third-party source, unverified) | 🟡 | Rate-limit outbound with a visible queue rather than failing sends |
| I7 | App Review required for managing accounts we do not own — i.e. every real tenant. Timelines reportedly degraded toward ~20 days in 2026 (single unverified source) | 🟡 | Our own platform-level prerequisite. Tenants are unaffected once we hold it, but launch scheduling is |
| I8 | Long-lived tokens (~60 days) do not auto-renew | 🟠 | Proactive refresh well before expiry; treat refresh failure as a disconnection signal, not a retry |

**The comment-to-DM mechanic** — the thing ManyChat built a business on — is worth implementing, with one discipline: the public reply is visible to everyone, so it must be conservative and on-brand. A wrong public reply is a worse failure than a wrong DM.

---

## 4. Messenger

| # | Constraint | Kind | Design consequence |
|---|---|---|---|
| M1 | Shares Instagram's 24-hour window and tag system | 🔴 outside | Same handling |
| M2 | Marketing messages outside the window are restricted to the EU, UK, Japan, South Korea and Australia — **not Rwanda** | 🔴 | Never offered here |
| M3 | The **Handover Protocol** requires a Page admin to manually assign primary and secondary receiver apps in Page Settings. We cannot self-elect | 🟠 | If a tenant uses another tool on the same Page, this becomes a guided manual step |

Messenger is a cheap addition once Instagram exists (shared infrastructure) and a low priority in Rwanda, where Facebook has roughly 1.3 million users against WhatsApp's estimated four million and Instagram's 456,000.

---

## 5. Telegram — the easiest, with one awkward step

| # | Constraint | Kind | Design consequence |
|---|---|---|---|
| T1 | **We cannot create a bot on the owner's behalf.** They must message @BotFather, send `/newbot`, choose a name and username, and copy the returned token into Subiza | 🟠 | The most awkward step in the product. Mitigated with a copy-paste-ready message, a short video in Kinyarwanda, and validation of the pasted token on the spot |
| T2 | Telegram **Business Bots** attach to a business account with per-chat access rules the user controls | 🟡 | Explain the chat-access rules during connection, because the owner sets them and will otherwise be confused when some chats are not handled |
| T3 | A user can **pause or disconnect the bot per chat, silently, with no webhook notification** | 🔴 to detect directly | Infer from send failures or periodic connection polling. Surface as a per-chat state |
| T4 | Rate limits: ~1 message/second to one chat, 20/minute in groups, ~30/second aggregate | 🟡 | Queue and pace; never a burst |
| T5 | 20 MB download, 50 MB upload | 🟡 | Reject oversized media gracefully with an explanation |

Telegram has small reach in Rwanda but large engineering value: **it is free, instant, has no review process and no windows**, which makes it the right channel to build and prove the messaging core on before entering Meta's ecosystem.

---

## 6. Telephony

| # | Constraint | Kind | Design consequence |
|---|---|---|---|
| P1 | **We cannot set call forwarding on the owner's phone.** It is a GSM code they dial themselves | 🟠 | Show the exact code for their network, as a tap-to-dial link, with a picture. Then verify |
| P2 | We can only confirm forwarding worked by **placing a test call** and observing where it lands. The emerging network API for querying forwarding status is early-stage and carrier-dependent — not available in this market | 🟡 | Verification is an active test, and it is also the moment of delight: "we just called your number and Subiza answered" |
| P3 | CPaaS number provisioning is programmatic **but gated on regulatory KYC bundle approval** per country | 🟠/🟡 | Business verification becomes a shared, reusable step — see §9 |
| P4 | OTP is the only way to verify a business controls a number | 🟠 | Standard, but note it fails for landlines and some VoIP numbers |
| P5 | Whether MTN and Airtel Rwanda honour standard forwarding codes, whether caller ID survives the forward, who pays for the forwarded leg, and whether forwarding can be managed programmatically are all **unverified** | ⚠️ | Four cheap tests. Until they are done, [Flow 07](07-flow-phone-connection.md) carries branches for each outcome |

---

## 7. Voice cloning

| # | Constraint | Kind | Design consequence |
|---|---|---|---|
| V1 | Industry norm is a **checkbox self-attestation** with no verification. Only a minority of vendors do real speaker verification | — | **We do not follow the norm.** Rwandan law treats a voiceprint as sensitive biometric data with criminal penalties; a checkbox is not a defensible consent record |
| V2 | Verification by "voice captcha" — the person reads a generated sentence aloud — confirms presence and participation, **not** identity | 🟡 | We use it, and we are honest about what it proves. Combined with a named consent artefact and revocation, it is proportionate |
| V3 | Open zero-shot models claim 5–10 seconds of reference audio, but quality degrades sharply below ~30 seconds of clean audio, especially for phonemes outside the training distribution | 🟡 | Ask for **30–60 seconds**, regardless of the technical minimum |
| V4 | **Kinyarwanda is not a supported language in mainstream commercial TTS** | 🔴 today | Business names, place names and personal names will be mispronounced by default. A **pronunciation dictionary is a required onboarding step**, not an advanced setting |
| V5 | EU AI Act Article 50, applying from 2 August 2026, requires synthetic audio resembling a real person to be disclosed audibly — **regardless of whether consent was obtained** | 🟠 | Consent settles rights; disclosure settles transparency. Both are required. The disclosure is non-skippable |

---

## 8. Language handling

| # | Constraint | Kind | Design consequence |
|---|---|---|---|
| L1 | Automatic language detection is unreliable for closely related languages, and vendors document mid-conversation misfires — one reports roughly 4% of calls unexpectedly switching language around the eighth turn | 🟡 | Do not trust auto-detection alone. Default to explicit language selection, with detection as an assist |
| L2 | Restricting detection to the first turns reduces false switches but prevents genuine mid-call switching | 🟡 | Offer it as a setting the owner controls, explained in plain terms |
| L3 | Multi-language deployments create configuration drift — separate prompts per language diverging over time | 🟡 | One agent configuration, translated views. Never separate agents per language |

**Design position for Rwanda:** the caller chooses the language in the first three seconds — by speaking, by pressing a key, or by the agent asking. Detection assists that choice; it does not replace it. Mid-conversation switching is supported because Kigali speech genuinely code-switches, but it is bounded and observable.

---

## 9. The opportunity hiding in these constraints

Across the category, every severe friction complaint sits not in the agent builder but in the **identity, compliance and verification layers underneath**: carrier KYC, Meta Business Verification, number regulatory bundles, WhatsApp signup errors. Nobody designs that layer. Everybody bolts it onto whatever screen needs it.

**Subiza designs it once, as a first-class flow: "Verify your business."**

```
   ┌───────────────────────────────────────────────────────────┐
   │   VERIFY YOUR BUSINESS  — done once, reused everywhere     │
   │                                                            │
   │   RDB registration certificate                             │
   │   Owner identity                                           │
   │   Business address                                         │
   │   Contact details                                          │
   │                            │                               │
   │        ┌───────────────────┼───────────────────┐           │
   │        ▼                   ▼                   ▼           │
   │   Meta Business      CPaaS regulatory     Our own KYC      │
   │   Verification       bundle (numbers)     and fraud check  │
   └───────────────────────────────────────────────────────────┘
```

One document collection, one status object the owner can watch, three downstream approvals — instead of the same documents demanded three times by three different screens. This single decision removes the worst-rated moment in the entire category, and it costs us nothing extra to build because we need all of it anyway.

---

## 10. Cross-platform engineering constraints

| # | Constraint | Design consequence |
|---|---|---|
| X1 | **Revocation is not pushed.** Platforms generally do not notify a third-party app that access was removed | Detect reactively on the next failed call or webhook. Mark the channel disconnected immediately. Never assume silence means health |
| X2 | Long-lived tokens (~60 days) need proactive refresh | Refresh well ahead; treat failure as probable revocation |
| X3 | Webhooks must be acknowledged fast — commonly cited as ~3 seconds for Meta — then processed asynchronously | Verify signature → enqueue → 200 → process. Never do model calls inside the webhook cycle |
| X4 | **No ordering guarantee** on Meta webhooks | Order conversation state by timestamp, never by arrival |
| X5 | Platforms retry aggressively — Meta for up to ~7 days | Deduplicate on the platform's own message ID. Every handler idempotent |
| X6 | Each platform issues its own opaque identity: phone number, IGSID, PSID, Telegram user ID | Cross-channel identity is ours to build. Phone number is the primary key; weak-signal merges are never automatic |

---

## 11. The forbidden list

Things Subiza must never build, promise, or imply — collected in one place so nobody has to re-derive them.

| # | Never |
|---|---|
| F1 | Never claim we can connect WhatsApp without the owner receiving an OTP |
| F2 | Never promise the agent will learn from past WhatsApp conversations |
| F3 | Never build a general-purpose assistant on WhatsApp |
| F4 | Never send free-form outside a 24-hour window, or retry a failed Instagram private reply |
| F5 | Never let the AI apply the Instagram Human Agent tag |
| F6 | Never promise Instagram follow-up after the window closes |
| F7 | Never claim we set up call forwarding — we guide and verify it |
| F8 | Never promise same-day WhatsApp go-live; Meta verification runs 5–15 business days |
| F9 | Never clone a voice on a checkbox alone |
| F10 | Never ship a synthetic voice without audible AI disclosure |
| F11 | Never assume a channel is healthy because nothing has failed yet |
| F12 | Never build outbound calling campaigns in the current scope |
| F13 | Never promise marketing broadcast on WhatsApp in Rwanda until W18 is verified |
| F14 | Never require a payment card anywhere in the product |

---

## 12. Success criteria

| # | Criterion | Test |
|---|---|---|
| 4.1 | Every flow in this atlas is checked against §11 before build | Written sign-off per flow |
| 4.2 | Every 🟠 and 🟡 constraint has a corresponding designed state in a flow | Traceability matrix: constraint → flow → screen |
| 4.3 | No screen shows a raw platform error code to a business owner | Error-copy audit; every platform error maps to plain-language text in four languages |
| 4.4 | Channel disconnection is detected within 5 minutes of the first failed call | Fault-injection test per channel |
| 4.5 | A tenant can be fully valuable while WhatsApp is pending verification | End-to-end test with WhatsApp deliberately unconnected |
| 4.6 | Webhook handlers are idempotent and order-tolerant | Replay test: duplicate and out-of-order delivery produce identical state |
| 4.7 | "Verify your business" is collected once and reused across Meta, CPaaS and internal KYC | Functional test; document upload count = 1 |

---

## 13. Open questions

| # | Question | Blocks |
|---|---|---|
| 4.a | Do MTN and Airtel Rwanda honour standard GSM forwarding codes, and does caller ID survive the forward? | 07 — go-to-market |
| 4.b | Who pays for the forwarded leg, and how much? | 07, pricing honesty |
| 4.c | Are WhatsApp marketing templates genuinely unavailable for Rwandan WABAs? | 08, expectations |
| 4.d | What is the real Instagram App Review timeline in 2026? | Launch schedule |
| 4.e | Is Solution Partner status worth pursuing to remove the tenant's Meta payment-method step (W14)? | 08, conversion |
| 4.f | Can the Telegram BotFather step be made tolerable for a non-technical owner, or should Telegram be deferred? | 08 scope |
| 4.g | Does Coexistence (W3) work reliably enough in practice to offer, or should we require a clean number? | 08 branching |

---

*Next: [05 — Signup & Account Creation](05-flow-signup-and-account-creation.md)*
