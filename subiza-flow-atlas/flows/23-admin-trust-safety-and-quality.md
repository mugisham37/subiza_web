# 23 — Flow: Trust, Safety & Quality

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-23 |
| **Actors** | Trust & Safety Officer · DPO · Quality Reviewer · Super Admin |
| **Entry points** | Voice-consent queue · abuse detection · a tenant report · a caller complaint · a residency alert |
| **Exit states** | Verified · warned · suspended · appealed and restored · escalated to law enforcement |
| **Depends on** | 20 |
| **Blocks** | Lawful and ethical operation |
| **Frequency** | Low volume, high consequence |
| **Criticality** | Critical |

---

## 1. Purpose

Make sure the platform is not used to harm anyone — through voice cloning without consent, through AI configured to deceive, through data going where it must not go, or through abuse of the people on the other end of the line.

**What breaks if this is wrong:** a single publicised misuse — an AI in a real person's cloned voice deceiving customers — would end the company's credibility in a small, high-trust market where reputation travels fast. And under Rwandan law, unlawful processing of sensitive data is a criminal matter.

---

## 2. The design position

**We verify rather than attest.** The industry norm for voice cloning is a checkbox. Given Rwandan law and the market's novelty to this technology, verification is both legally necessary and commercially valuable ([Flow 11 §2](11-flow-voice-and-cloning.md)).

**Enforcement is proportionate and appealable.** Warning before suspension, evidence attached to every decision, a second reviewer on appeals, and overturn rates tracked as a measure of our own accuracy.

**Prevalence, not just complaints.** Reviewing only what is reported measures the complaint rate, not the violation rate. A random sample of all traffic is the only way to know the true baseline — expensive, and the only honest option.

---

## 3. Overview

```
   ┌──────────────────────────────────────────────────────────────┐
   │  TRUST & SAFETY                                               │
   │                                                               │
   │  🎙 VOICE CONSENT QUEUE            2 pending                  │
   │     verification failed · manual review required              │
   │                                                               │
   │  ⚠ POLICY VIOLATIONS               0 open                     │
   │     scope · deception · prohibited content · abuse            │
   │                                                               │
   │  🌍 RESIDENCY & PROCESSORS         all authorised             │
   │     cross-border authorisations, expiry tracked               │
   │                                                               │
   │  ⚖ APPEALS                         0 open                     │
   │                                                               │
   │  📊 PREVALENCE                                                │
   │     random sample: 0.2% flagged this month                    │
   └──────────────────────────────────────────────────────────────┘
```

---

## 4. Voice consent verification

The highest-consequence queue in the platform.

### 4.1 What arrives here

| Case | Why |
|---|---|
| Speaker verification failed twice | Could be misuse, could be a legitimate user with poor audio or an accent the check handles badly |
| Verification passed but the samples look inconsistent | Automated flag |
| A tenant repeatedly attempts third-party cloning | Refused at source ([Flow 11](11-flow-voice-and-cloning.md)), but the pattern is flagged |
| A voice owner reports that they did not consent | **Treated as severe. Voice disabled immediately, pending review** |
| Random sample of granted consents | Prevalence measurement |

### 4.2 The review

The reviewer sees the consent artefact, the voice samples, the verification recording, the tenant's history, and the automated verdict with its reasoning.

| Outcome | Action |
|---|---|
| **Approve** | Voice built. Rationale recorded |
| **Approve with note** | Legitimate but flagged for a later sample |
| **Reject** | Voice not built. **Tenant told what was wrong and how to retry** — most rejections are audio quality, not bad faith |
| **Escalate** | Suspected impersonation → tenant suspension and investigation |

**The bias is important.** A false rejection costs a tenant a feature and an hour. A false approval could mean a real person's voice cloned without their knowledge. We reject when uncertain, and we make retry easy so honest users are not lost.

**Accessibility discipline:** verification can fail for legitimate reasons — a strong accent, a speech difference, background noise, a phone microphone. These must not become a permanent block, so the manual path exists and its resolution rate in favour of the user is a tracked metric.

---

## 5. Policy violations

### 5.1 What we look for

| Category | Examples | Detection |
|---|---|---|
| **Scope violation** | Agent configured as a general assistant | Automated scope checks. **Not just our policy — a WhatsApp platform requirement (W8)** |
| **Deception** | Agent configured to claim it is human, or to impersonate a named person | Automated checks on greeting and rules; caller reports |
| **Prohibited content** | Gambling, unlicensed financial services, adult content, health misinformation | Content classification; also grounds for a WABA ban |
| **Consent violation** | Messaging without opt-in, recording without disclosure | Quality-rating signals, complaint patterns |
| **Abuse of callers** | Configured to harass, mislead or pressure | Caller complaints, review sampling |
| **Voice misuse** | Cloning without consent | The queue above |
| **Fraud** | Impersonating another business; telecom fraud patterns | Anomaly detection on call patterns and identity |

**Automated deception checks matter most.** The distinction the product depends on is that Subiza never impersonates a named human. An agent whose greeting says "This is Claudine" rather than "This is Claudine's assistant" crosses that line, and it is cheap to detect automatically at publish time — before a customer ever hears it.

### 5.2 Enforcement ladder

| Step | Action | Who |
|---|---|---|
| 1 | **Warning** — specific, with the exact configuration to change and a deadline | T&S |
| 2 | **Feature restriction** — disable the specific capability, not the account | T&S |
| 3 | **Temporary suspension** — agent paused, **calls still reach the owner**, data retained | T&S |
| 4 | **Permanent suspension** — for severe or repeated violation | T&S with Super Admin |
| 5 | **Report to authorities** — where legally required | DPO + legal |

Every step: a documented reason, evidence attached, tenant notified with the specific issue, and an appeal path.

**Even at step 4, forwarding is not removed and the line is not dead** (G22). A suspended business gets their calls back; they do not get a broken phone.

### 5.3 Appeals

Submitted by the tenant, reviewed by a **second, different** reviewer, decided within 3 business days with a written rationale. Overturns are tracked — a high overturn rate means our detection or our thresholds are wrong, not that tenants are lucky.

---

## 6. Residency and processor control

The panel that enforces the constraint that shapes the whole architecture.

```
   RESIDENCY & PROCESSORS

   Primary datastore        Rwanda           ✅
   Object storage           Rwanda           ✅
   Vector store             Rwanda           ✅
   Event log                Rwanda           ✅

   Speech recognition       [region]         ⚠ cross-border
                            NCSA auth #____  expires 2027-03-14
   Language model           [region]         ⚠ cross-border
                            NCSA auth #____  expires 2027-03-14
   Speech synthesis         Rwanda           ✅

   Deployments blocked this month: 0
```

Three rules:

1. **A deployment that would place personal data outside Rwanda without a recorded authorisation reference fails the pipeline.** Compliance enforced by tooling, not by memory.
2. **An expiring authorisation raises an alert 60 days out**, and the affected processing **stops** if it lapses. Fails closed.
3. **Tenants can see this**, in their own privacy settings — "your customers' data stays in Rwanda" is a genuine differentiator against foreign competitors and should be visible.

---

## 7. Quality review — the human layer

Distinct from AI Operations' technical evaluation ([Flow 22](22-admin-ai-operations.md)): this is human judgement about whether conversations were *good*, not merely correct.

| Aspect | Approach |
|---|---|
| **Sample** | 100% of flagged, ~1% random, plus targeted cohorts |
| **Scorecard** | Answer accuracy · policy compliance · resolution quality · tone and clarity · appropriate escalation |
| **Same bar for AI and human turns** | A human agent's rude reply is as much a quality failure as an AI's wrong price |
| **First pass by AI, confirmed or overturned by a human** | Faster than blank-slate scoring, and it measures the AI reviewer's own accuracy |
| **Output** | Systemic fixes, regression tests, template improvements — never a one-off correction ([Flow 22 §5.3](22-admin-ai-operations.md)) |

**Prevalence measurement is the part usually skipped.** Reviewing only complaints tells you the complaint rate. The random sample tells you the violation rate. Only the second number tells you whether things are getting better.

---

## 8. Screens, states, decisions

| Screen | States |
|---|---|
| Voice consent queue | Pending · in review · approved · rejected · escalated |
| Consent case detail | Artefact, samples, verification audio, tenant history, AI verdict |
| Violation queue | Open · investigating · actioned · appealed · closed |
| Enforcement | Warning issued · restricted · suspended · permanent · reported |
| Appeal | Submitted · second review · upheld · overturned |
| Residency panel | All authorised · expiring · **lapsed (processing stopped)** |
| Quality review | Queue · scoring · systemic fix logged |
| Prevalence | Sample rate, flagged rate, trend |

| Decision | Branches |
|---|---|
| Verification uncertain? | **Reject and make retry easy** |
| Violation severity? | Warning · restrict · suspend · permanent · report |
| Appeal outcome? | Upheld · overturned → detection review |
| Authorisation expiring? | Alert · renew · **stop processing** |
| Quality issue found? | Systemic fix, never individual |

---

## 9. Platform constraints

| Constraint | Effect |
|---|---|
| **W8 — no general-purpose assistants on WhatsApp** | Scope violations are a platform-policy matter with WABA consequences, not only an internal standard |
| **Law 058/2021 Art. 3(2) and Art. 60** | Voice consent verification is a criminal-risk control, not a quality feature |
| **Art. 50 residency** | The residency panel is an enforcement mechanism, not a report |
| **V5 — EU AI Act Art. 50 disclosure** | Disclosure compliance is audited continuously from call recordings |
| **W13 — WhatsApp quality rating and bans** | Tenant policy violations can trigger Meta enforcement we do not control; early internal detection protects the tenant as well as the platform |
| G22 | Suspension never leaves a business with a dead line |

---

## 10. Edge cases and failures

| Case | Behaviour |
|---|---|
| Voice owner claims they never consented, but a valid artefact exists | Voice disabled immediately pending review. The artefact is evidence, not a verdict — a coerced or misunderstood consent is still invalid |
| Tenant configures a deceptive greeting | Detected at publish. **Blocked before it reaches a customer**, with an explanation |
| Legitimate tenant repeatedly fails verification | Manual path; if resolved in their favour, the detection threshold is reviewed |
| A caller complains about a tenant's agent | Investigated as a quality and policy matter; the tenant is informed of the substance, not the complainant's identity |
| Suspension appealed and overturned | Full restoration; **the tenant is told plainly that we got it wrong** |
| Cross-border authorisation lapses unexpectedly | Processing stops; the fallback path engages; tenants are notified with an honest explanation |
| Prevalence sampling finds a systemic problem | Treated as an incident, not a queue item |
| Law enforcement request | Legal review, minimum necessary, logged, subject notified where lawful |

---

## 11. Retention rationale

Trust and safety is usually invisible to customers. Here, parts of it are deliberately visible.

| Decision | Reason |
|---|---|
| Verification instead of a checkbox | In a market new to this technology, being the platform that checks is a competitive asset |
| Tenants can see where their data lives | "Your customers' data stays in Rwanda" is a real differentiator |
| Warnings before suspensions | Most violations are ignorance, not malice; a warning that explains keeps a customer |
| Suspension never kills the line | Even enforcement must not harm the business's customers |
| Appeals with a second reviewer, overturns tracked | Fairness that can be demonstrated |
| Deception blocked at publish | Prevents the harm rather than remediating it |

---

## 12. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 23.1 | No voice is cloned without a verified consent artefact | Audit of every voice model | 100% |
| 23.2 | Voice consent queue is worked quickly | Resolution within 24h | > 95% |
| 23.3 | Legitimate users are not excluded by verification | Manual reviews resolved in the user's favour | > 95% |
| 23.4 | Deceptive configurations are blocked before publish | Adversarial test set | 100% |
| 23.5 | Scope violations detected | Test set of general-assistant configurations | > 95% |
| 23.6 | Enforcement is proportionate | Suspensions preceded by a warning (except severe) | > 90% |
| 23.7 | Appeals decided within 3 business days | Queue SLA | > 95% |
| 23.8 | Appeal overturn rate is monitored and low | Overturns ÷ appeals | < 20%, investigated if higher |
| 23.9 | No unauthorised cross-border processing | Deployment audit | 0 |
| 23.10 | Expiring authorisations alert 60 days ahead | Functional test | Pass |
| 23.11 | Prevalence is measured, not only complaints | Random sample maintained | ≥ 1% |
| 23.12 | Suspension never blocks calls reaching the owner | End-to-end test | Pass |

---

## 13. Instrumentation

| Event | Properties |
|---|---|
| `safety.voice_consent_queued` | reason, tenant |
| `safety.voice_consent_decided` | outcome, reviewer, rationale, time in queue |
| `safety.violation_detected` | category, detection method, severity |
| `safety.enforcement` | step, tenant, reason, evidence refs |
| `safety.appeal_submitted` / `decided` | outcome, days |
| `safety.deception_blocked` | tenant, configuration element |
| `residency.authorisation_expiring` / `lapsed` | processor, days remaining |
| `quality.sample_reviewed` | source, score, systemic fix? |
| `quality.prevalence` | sample size, flagged rate, period |

---

## 14. Open questions

| # | Question | Blocks |
|---|---|---|
| 23.a | Is speaker verification accurate enough on Kinyarwanda speech over a phone microphone to avoid excluding legitimate users? | Voice cloning viability |
| 23.b | What evidence standard applies to a "I never consented" claim, and who bears it? | Policy |
| 23.c | Can scope violations be detected reliably enough to satisfy Meta's requirement, or does it need human review of every agent? | Compliance cost |
| 23.d | What is the process, timeline and cost of obtaining an Art. 50 cross-border authorisation? | Architecture |
| 23.e | Should tenants see a public transparency report of enforcement actions? | Trust posture |
| 23.f | At what volume does 1% random sampling become too expensive, and what replaces it? | Ops scaling |

---

*Next: [24 — Errors, Degradation & Edge Cases](24-flow-errors-and-degradation.md)*
