# 26 — Success Criteria & Acceptance Tests

*Part of the [Subiza Flow Atlas](../README.md)*

---

## 1. What this document is

The build checklist. Every criterion in the atlas, collected, so that "done" is a matter of evidence rather than opinion.

Use it three ways:

1. **As a build gate.** A flow is not complete until its criteria pass.
2. **As a release gate.** The blocking set in §3 must pass before any tenant sees a change.
3. **As an operating dashboard.** The measured criteria in §5 are the numbers the company watches.

Criteria are numbered by flow — 6.1 is the first criterion of Flow 06 — so any line here can be traced back to the flow that justifies it.

---

## 2. The seven that matter most

If only seven things were measured, these:

| # | Criterion | Target | Why |
|---|---|---|---|
| **6.1** | **Time to first value** — signup to a completed test call the owner witnessed | **< 10 min median** | The company's core product bet. Everything in activation is engineered for this |
| **6.2** | **Activation rate** — signups reaching `tenant.activated` | **> 60%** | If people do not activate, nothing else matters |
| **12.a** | **Kinyarwanda understanding rate on 8 kHz telephone audio** | **To be established** | The core technical risk. Currently unknown. Measuring it is Phase 0 |
| **24.2** | **Platform failure never blocks calls reaching the owner** | **Pass** | Law 1. The product's foundational promise |
| **16.5** | **The "calls you would have missed" number is auditable** | **100%** | The number that renews the subscription must be beyond dispute |
| **15.1** | **Every escalation reaches a human or a logged promise** | **100%** | What makes the product safe to deploy |
| **11.2** | **No voice cloned without a verified consent artefact** | **100%** | Criminal exposure under Law 058/2021 |

---

## 3. Blocking criteria — nothing ships without these

Non-negotiable. A failure here stops a release regardless of schedule.

### 3.1 Safety and legal

| # | Criterion |
|---|---|
| 19.1 | AI disclosure on every conversation, every channel |
| 19.2 | Disclosure cannot be disabled by a tenant |
| 19.4 | Personal data is Rwanda-resident by default |
| 19.5 | Cross-border processing without a recorded authorisation is **blocked in the deployment pipeline** |
| 11.2 | No voice cloned without a verified consent artefact naming the voice owner |
| 11.5 | Voice revocation disables within 5 minutes |
| 11.6 | Revocation cannot be blocked by the account owner |
| 11.7 | Audible AI disclosure on every call using any voice |
| 23.4 | Deceptive configurations blocked **before** publish |
| 9.8 | The out-of-scope deflection rule cannot be removed |
| 1.2 | No actor can read another tenant's data by any path |
| 1.3 | The AI cannot take an action the tenant has not enabled |

### 3.2 Reliability

| # | Criterion |
|---|---|
| 24.2 | Platform failure never blocks calls reaching the owner |
| 24.3 | Credit exhaustion never blocks calls reaching the owner |
| 21.9 | Suspension never blocks calls reaching the owner |
| 7.6 | Zero balance: the call still reaches the owner |
| 24.4 | The system never generates an answer when retrieval fails |
| 15.1 | Every escalation reaches a human or a logged promise |
| 13.3 | An agent cannot go live without an escalation target |
| 24.1 | Every failure mode has a defined, tested behaviour |

### 3.3 Quality

| # | Criterion |
|---|---|
| 10.3 | Prices are never generated — always read from the structured table |
| 22.2 | No change ships with a replay-suite regression |
| 22.3 | The safety evaluation suite passes completely before any rollout |
| 22.4 | Per-language results are reported for every evaluation |
| 12.5 | No third consecutive failed understanding attempt |

**§3.2 contains four separate criteria that all say the same thing.** That repetition is deliberate: the promise that a business is never less reachable than before Subiza must hold across billing, suspension, platform failure and forwarding independently, and each path is tested separately.

---

## 4. Acceptance tests by flow

Condensed to the criteria that require a written test. Full detail and measurement definitions live in each flow document.

### Foundations

| # | Test |
|---|---|
| 1.1 | Every product capability maps to exactly one row of the permission matrix |
| 1.4 | Impersonation sessions carry all nine required fields and appear in the tenant's audit log within 60s |
| 2.1 | Any core task reachable in ≤3 taps from Home; 8-task usability test, ≥90% success |
| 2.5 | Simple ↔ Advanced agent view round-trips without configuration loss |
| 2.6 | First meaningful paint < 3s on simulated 3G, mid-range Android |
| 3.3 | First value reachable with no external channel connected |
| 3.6 | Zero balance: end-to-end test, the call reaches the owner |
| 4.2 | Every 🟠 and 🟡 platform constraint has a designed state — traceability matrix |
| 4.7 | Business verification documents collected once, reused across Meta, CPaaS and internal KYC |

### Activation path

| # | Test |
|---|---|
| 5.1 | Signup completes in under 2 minutes, median |
| 5.5 | No card, no email, no password required anywhere |
| 5.8 | Abandoned signups resumable at 1h, 24h, 72h, 30d |
| 6.1 | Time to first value < 10 min median |
| 6.4 | Test call succeeds including fallbacks, > 95% |
| 6.7 | Parts One–Three completed unaided by > 60% |
| 6.12 | Full activation completable in Kinyarwanda — native-speaker walkthrough |
| 7.1 | Forwarding set and verified in one session, > 80% |
| 7.5 | Silent forwarding removal detected within 7 days |
| 8.3 | Fewer than 5% of tenants hit the "number already on WhatsApp" wall inside Meta's popup |
| 8.5 | Channel disconnection visible within 5 minutes of the first auth failure |
| 8.9 | Instagram private replies are never retried — idempotency test |

### Configuration

| # | Test |
|---|---|
| 9.1 | An owner can change agent behaviour unaided — "make it stop offering delivery", > 80% success |
| 9.3 | Contradiction check catches > 90% of seeded rule conflicts |
| 9.5 | Structurally-enforceable rules are enforced structurally, not by prompting |
| 10.2 | OCR extractions accepted with ≤3 edits, > 70% |
| 10.4 | Every knowledge-derived answer carries a citation |
| 10.6 | Source conflicts surfaced — seeded-conflict test |
| 11.3 | Voice verification cannot be bypassed — adversarial test |
| 11.8 | Third-party cloning without a contactable owner is refused, 100% |
| 12.2 | Code-switched utterances do not trigger a full language switch, > 95% |
| 12.3 | Spurious mid-conversation switches < 1% of conversations |

### Operation

| # | Test |
|---|---|
| 13.2 | Every go-live is preceded by at least one test — enforced |
| 13.7 | Pause reachable in one tap from any screen |
| 14.4 | Every conversation has a viewable transcript |
| 14.9 | No wrong identity merges in the customer timeline |
| 15.2 | Explicit human requests honoured within one turn, always |
| 15.6 | Promised callbacks made within the promised window, > 90% |
| 15.10 | The Instagram Human Agent tag is never applied by the AI |
| 16.5 | Every counted "would have missed" conversation is listed and openable |
| 16.9 | A zero-traffic week triggers a forwarding check |
| 17.5 | Lapsed credit never blocks calls reaching the owner |
| 17.10 | An aggregator outage automatically extends the grace period |
| 18.7 / 18.8 | Any team member can pause the AI; only Owner or Manager can resume |
| 19.6 | Deletion reaches every store including vector embeddings and the training corpus |
| 19.10 | Tenants can see when platform staff accessed their account |

### Platform operations

| # | Test |
|---|---|
| 20.4 | Impersonation follows all nine rules from Flow 01 §6 |
| 20.6 | Engineers have no ambient conversation access; break-glass alerts the DPO |
| 20.9 | The WhatsApp onboarding cap alerts at 8 of 10 weekly slots |
| 21.6 | Every impersonation session is reasoned, time-boxed and logged |
| 21.10 | Offboarding includes forwarding-removal instructions |
| 22.5 | Rollback completes in under 5 minutes |
| 22.10 | Withdrawn consent propagates out of the training corpus |
| 23.1 | Every voice model has a verified consent artefact |
| 23.9 | Zero unauthorised cross-border processing |
| 24.7 | One channel failing never affects another |
| 25.9 | Our notification volume never degrades a tenant's WhatsApp tier |

---

## 5. The operating dashboard

The numbers watched continuously, on the admin operations home ([Flow 20](20-admin-console-and-operations.md)).

### Funnel

| Metric | Target | Flow |
|---|---|---|
| Signup completion | > 75% | 05 |
| **Time to first value** | **< 10 min** | 06 |
| **Activation rate** | **> 60%** | 06 |
| Activation unaided | > 60% | 06 |
| Forwarding verified in one session | > 80% | 07 |
| Test → live within 7 days | > 70% | 13 |

### Product health

| Metric | Target | Flow |
|---|---|---|
| Turn latency p95 | < 1,200 ms | 22 |
| Answer rate | > 99.5% | 22 |
| Containment rate | 70–80% (**both edges investigated**) | 15 |
| Understanding rate per language | Baseline, then improving | 12, 22 |
| Spurious language switches | < 1% | 12 |
| Hallucination reports | **0** | 22 |
| Escalation success | 100% | 15 |
| Promised callbacks kept | > 90% | 15 |

### Retention

| Metric | Target | Flow |
|---|---|---|
| Daily session duration | < 2 min | 14 |
| Days active per week, month 1 | > 50% of tenants ≥4 days | 14 |
| Weekly report open rate | > 60% | 16 |
| Suggestions acted on | > 25% | 16 |
| Trust-ladder progression to rung 3+ in 30 days | > 50% | 13 |
| Monthly churn | < 5% | 16 |
| All-notifications muted | < 10% | 25 |

### Operations

| Metric | Target | Flow |
|---|---|---|
| Stuck tenants contacted within 1 business day | > 95% | 21 |
| Stuck tenants unstuck within 7 days | > 60% | 21 |
| Support resolved in one touch | > 70% | 21 |
| Voice consent queue resolved in 24h | > 95% | 23 |
| DSAR within statutory deadline | 100% | 19 |
| Margin per conversation minute | > 60% by Phase 3 | 22 |

---

## 6. The build order this implies

Criticality from [Flow 03 §10](03-master-flow-map.md), reordered as a build sequence.

| Stage | Flows | Gate |
|---|---|---|
| **1 — Walking skeleton** | 05, 06 (Parts One–Two), 09, 10, 11 (library only), 13 (sandbox) | **6.1 and 6.2**: an owner reaches first value in under 10 minutes |
| **2 — Real customers** | 07, 13 (go-live), 14, 15, 24 | **24.2, 15.1**: a real call is answered, escalates correctly, and never leaves a business unreachable |
| **3 — Legal to operate** | 19, 12, 01 permissions | **19.1, 19.4, 19.5**: disclosure, residency, and blocked unauthorised transfer |
| **4 — A business** | 16, 17, 25 | **16.5**: the value number is auditable and delivered weekly |
| **5 — Channels** | 08, 18 | **8.5**: disconnection is detected and repairable |
| **6 — Operable** | 20, 21, 22, 23 | **20.4, 22.2**: impersonation is controlled and no regression ships |
| **7 — Depth** | 09 advanced, 11 cloning, 12 full switching, 26 | Per-flow criteria |

**Voice cloning is in stage 7, not stage 1.** It is the most legally exposed feature in the product and it is not required for any customer to get value. Shipping it before the criminal-liability question in [Flow 19 §15](19-flow-compliance-and-data-rights.md) is settled would be reckless.

---

## 7. Criteria that cannot be met yet

Honesty about what is currently unknowable.

| # | Criterion | Blocked by |
|---|---|---|
| 12.a | Kinyarwanda understanding rate | **Not measured.** Requires real 8 kHz Rwandan telephone audio and a benchmark run |
| 7.a–7.c | Forwarding behaviour, caller ID, cost | **Not tested.** Two SIM cards and an afternoon |
| 19.a | What Article 50 permits for transient processing abroad | Requires Rwandan counsel |
| 19.b | Whether a voiceprint is biometric under Art. 3(2) | Requires written NCSA confirmation |
| 6.b | Whether owners can photograph a price list successfully | Requires field testing |
| 17.a | MoMo collection fees | Requires an aggregator quote |
| 25.a | Whether Meta will approve our notification templates in Rwanda | Requires a live WABA |

**Seven unknowns, of which four can be resolved in a week for almost nothing.** Everything else in this atlas is designed to survive whichever way they resolve — which is why each affected flow carries branches rather than assumptions.

---

## 8. How to use this in practice

1. **Before building a flow**, read its criteria. They define done.
2. **Before merging**, run the blocking set in §3. No exceptions, including for urgent fixes — an expedited path exists for safety fixes ([Flow 22 §10](22-admin-ai-operations.md)) but it still runs the safety suite.
3. **Before a tenant sees a change**, run the evaluation gate ([Flow 22 §6.2](22-admin-ai-operations.md)).
4. **Weekly**, review §5 against actuals. A metric outside target is a question, not a failure.
5. **When a criterion is wrong**, change it here and in its flow — with a reason. Criteria that drift from reality silently are worse than none.

---

## 9. The one-line test

If someone asks whether Subiza is working, the answer is a single sentence built from four numbers:

> **"Sixty-two percent of businesses who sign up have their AI answering a real call within a week, it handles three in four conversations without needing a person, it has never once left a business unreachable, and every one of them can see exactly how many customers it caught that they would have lost."**

Every criterion in this document exists to make that sentence true and provable.

---

*Return to: [Subiza Flow Atlas](../README.md)*
