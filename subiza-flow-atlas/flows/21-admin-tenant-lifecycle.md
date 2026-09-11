# 21 — Flow: Tenant Lifecycle & Support

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-21 |
| **Actors** | Onboarding Specialist · Support L1/L2 · Billing Admin · Super Admin |
| **Entry points** | Operations home queues · a support request · a churn signal · a provisioning event |
| **Exit states** | Tenant unstuck · issue resolved · suspended · restored · offboarded |
| **Depends on** | 20 |
| **Blocks** | Activation rate, retention |
| **Frequency** | Continuous |
| **Criticality** | Important — and the highest-leverage operational work in the company |

---

## 1. Purpose

Get stuck tenants unstuck, resolve problems, and manage the tenant lifecycle from provisioning to offboarding — without ever exceeding the access a support person legitimately needs.

**What breaks if this is wrong:** activation collapses. The competitor research is unambiguous that the worst-rated moments in this category are not in the product but in the verification and provisioning layers beneath it. A tenant stuck at Meta verification for two weeks with no contact simply leaves.

---

## 2. Onboarding Operations — the stuck-tenant queue

The section nobody else builds, and in this market the most valuable one.

```
   ONBOARDING OPS                                 6 stuck

   ┌──────────────────────────────────────────────────────────┐
   │ Salon Bella          stuck 7d   WhatsApp verification     │
   │                                 Meta rejected: doc name   │
   │                                 mismatch                  │
   │ Assigned: Jean       Next: call and explain the fix       │
   ├──────────────────────────────────────────────────────────┤
   │ Kigali Auto Parts    stuck 5d   Phone forwarding          │
   │                                 verification failed 3×    │
   │ Assigned: —          Next: assisted setup call            │
   ├──────────────────────────────────────────────────────────┤
   │ Café Umuco           stuck 3d   Activation — abandoned    │
   │                                 at price list step        │
   │ Assigned: —          Next: WhatsApp with a photo tip      │
   └──────────────────────────────────────────────────────────┘
```

### 2.1 What lands in this queue

| Stall | Threshold | Typical fix |
|---|---|---|
| Activation abandoned mid-wizard | 24h | A WhatsApp message referencing the exact step |
| Test call never completed | 48h | Offer the browser test or an assisted call |
| Forwarding verification failed repeatedly | 3 attempts | Assisted setup call — the single highest-value human intervention available |
| WhatsApp verification pending | 5 days | Check the submission, explain the wait honestly |
| WhatsApp verification rejected | Immediate | Explain the specific reason, help resubmit |
| Display name rejected twice | Immediate | Naming guidance |
| Number provisioning pending | Provider SLA + 2 days | Chase the provider |
| Activated but never went live | 7 days | Ask what is holding them back |
| Live but zero traffic | 7 days | **Verify forwarding is still active** — the most likely cause |

### 2.2 The intervention ladder

Escalating touch, matched to how much is at stake:

| Day | Action |
|---|---|
| 1 | Automated WhatsApp referencing the exact step and offering the exact fix |
| 3 | Second automated message, different angle, or a short video |
| 7 | **A human sends a personal WhatsApp message** |
| 14 | **A human calls** |
| 30 | Final human contact; then archive as unactivated |

**Day 30 is a hard boundary.** Automated reactivation of accounts that never activated converts under 5% past that point. Everything before day 30 should be tried; nothing after it should be automated.

---

## 3. Tenant directory and detail

| Screen | Content |
|---|---|
| **Directory** | Searchable and filterable: status, plan, health score, language, business type, days since signup, MRR, last activity |
| **Detail — Profile** | Business, owner, contact, language, verification status, assigned specialist |
| **Detail — Configuration** | Agent, knowledge counts, voice, channels, rung. **Content masked by default** |
| **Detail — Usage** | Minutes, messages, conversations, containment, latency, cost, margin |
| **Detail — Billing** | Balance, plan, top-ups, statements, exceptions |
| **Detail — Conversations** | Metadata visible; **content requires an explicit, reasoned, logged unmask** |
| **Detail — Health** | Churn signals, quality trend, channel health |
| **Detail — Audit** | Everything we have done to this tenant, and everything they have done |
| **Detail — Notes** | Internal, timestamped, attributed |

**The masking default is the important part.** A support agent troubleshooting a billing question has no business reading a caller's conversation with a clinic. Unmasking is possible, requires a reason, is logged, and appears in the tenant's own audit log.

---

## 4. Support

### 4.1 Triage

| Category | Owner | Typical resolution |
|---|---|---|
| "It's not answering" | L1 | Almost always forwarding or credit. A **guided diagnostic** checks both in seconds |
| "It said something wrong" | L1 → Quality | Locate the turn, read the trace, fix the knowledge, save as a regression test |
| "I can't connect WhatsApp" | Onboarding | Route by the specific Meta failure |
| Billing | Billing Admin | |
| "I want to delete everything" | DPO | Rights request, not a support ticket ([Flow 19](19-flow-compliance-and-data-rights.md)) |
| Feature request | Product | Logged, not promised |

### 4.2 The guided diagnostic

The single most useful support tool, because it resolves the most common complaint without a conversation:

```
   DIAGNOSE — Salon Ubwiza

   ✅ Agent is live (after-hours only)
   ✅ Credit: 14,200 RWF
   ❌ Forwarding: last verified 9 days ago — TEST FAILED
   ✅ WhatsApp: connected, quality green
   ✅ Escalation target reachable

   → Likely cause: forwarding was removed or reset.
   → [ Send the re-dial instructions ]  [ Call the owner ]
```

It runs the same checks a support agent would, in order of likelihood, and produces a next action rather than a diagnosis.

### 4.3 Support impersonation

Governed entirely by [Flow 01 §6](01-actors-roles-and-permissions.md). The operational summary: reason and ticket required, 15 minutes, read-only unless separately justified, banner visible, high-risk actions blocked outright, third-party PII masked, and the session recorded in the tenant's own audit log.

---

## 5. Lifecycle operations

| Operation | Who | Rules |
|---|---|---|
| **Provision** | Automated | Tenant, workspace, defaults, free allowance |
| **Assisted signup** | Onboarding | Field sales creates the tenant; the owner still completes OTP themselves |
| **Plan change** | Billing Admin | Logged with a reason |
| **Credit adjustment** | Billing Admin | **Mandatory reason code and approver.** Above a threshold, a second approver |
| **Refund** | Billing Admin | Threshold-based approval, audited |
| **Suspend (non-payment)** | Automated after grace | Agent pauses; **calls still reach the owner**; data retained |
| **Suspend (policy)** | Trust & Safety only | Reason, evidence, appeal path ([Flow 23](23-admin-trust-safety-and-quality.md)) |
| **Restore** | Support Lead or T&S | Restores state, not a re-onboarding |
| **Ownership transfer** | Super Admin | Identity verification of both parties, logged. Handles the lost-phone case |
| **Offboard** | Owner-initiated or after long dormancy | Export offered, retention countdown explained, forwarding-removal instructions provided |

**Suspension never removes forwarding**, and it never leaves a business with a dead line. Whatever the reason for suspension, the calls go back to ringing the owner's phone (G22).

---

## 6. Screens, states, decisions

| Screen | States |
|---|---|
| Onboarding Ops queue | Empty · populated · assigned · overdue |
| Tenant detail | Active · pending · suspended · dormant · offboarded |
| Diagnostic | Running · passed · failed with cause · action offered |
| Impersonation | Requesting · active with countdown · expired · blocked action attempted |
| Credit adjustment | Drafting · needs approval · applied · rejected |
| Suspension | Proposed · active · appealed · lifted |

| Decision | Branches |
|---|---|
| Stuck reason? | Routes to the matching fix |
| Automated or human? | Day 1–3 automated · day 7+ human |
| Need conversation content? | Reason + unmask + log, or resolve without it |
| Credit adjustment size? | Self-approve · second approver |
| Suspension type? | Non-payment (automatic, reversible) · policy (T&S only) |

---

## 7. Platform constraints

| Constraint | Effect |
|---|---|
| **W10/W11 — Meta verification and onboarding caps** | Onboarding Ops is structured around waiting; the weekly cap is tracked as a growth constraint |
| **P3 — number provisioning KYC** | Provisioning is a tracked, chaseable state with a provider SLA |
| **P1/P2 — forwarding is manual and verified by test call** | The assisted setup call is the highest-value human intervention we offer |
| Law 058/2021 | Content masked by default; every access reasoned and logged and visible to the tenant |
| G22 | Suspension never kills the line |

---

## 8. Edge cases and failures

| Case | Behaviour |
|---|---|
| Tenant stuck because Meta is slow, not because of anything they did | Say so honestly. Do not imply it is their fault, and keep them informed weekly |
| Owner lost their phone | Ownership recovery with identity verification, not a self-serve reset |
| Two people claim to own a business | Escalate to Super Admin; require documentary evidence; do nothing irreversible meanwhile |
| Support agent needs data they cannot access | Escalate to a role that can, rather than widening the role that cannot |
| A tenant is abusive to staff | Documented, and a suspension path exists |
| Bulk tenant migration (provider change) | A planned operation with a runbook, tenant notice, and a rollback plan |
| Dormant tenant returns after months | Restore, not re-onboard. State preserved |
| Tenant offboards but forwarding is still set | **Explicit instructions to remove it**, or their customers reach a number that no longer serves them |

That last row is easy to miss and would be a serious harm: a business that cancels and forgets to dial `##61#` has quietly broken their own phone line.

---

## 9. Retention rationale

| Decision | Reason |
|---|---|
| Onboarding Ops as a real queue | The category's worst friction is here, and nobody operationalises it |
| Escalating human touch | A person at day 7 is far cheaper than a lost customer at day 30 |
| Guided diagnostic | Resolves the most common complaint in seconds, without a conversation |
| Assisted setup calls for forwarding | The step most likely to defeat a non-technical owner |
| Masked by default | Protects the tenant's customers, and protects us |
| Suspension never kills the line | The business must never be worse off, even when suspended |
| Offboarding includes forwarding removal | Leaving well is part of the product |

---

## 10. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 21.1 | Stuck tenants are contacted | Within 1 business day of entering the queue | > 95% |
| 21.2 | Stuck tenants get unstuck | Resolved within 7 days of contact | > 60% |
| 21.3 | Assisted setup succeeds | Forwarding verified after an assisted call | > 85% |
| 21.4 | Diagnostic identifies the cause | Correct cause on first run | > 80% |
| 21.5 | Support resolves in one touch | Tickets closed without escalation | > 70% |
| 21.6 | Impersonation is always reasoned, time-boxed and logged | Audit of every session | 100% |
| 21.7 | Conversation content is masked by default | Functional test | Pass |
| 21.8 | Credit adjustments carry a reason and approver | Schema validation | 100% |
| 21.9 | Suspension never blocks calls reaching the owner | End-to-end test | Pass |
| 21.10 | Offboarding includes forwarding-removal instructions | Copy audit | Pass |
| 21.11 | Day-30 unactivated tenants get human contact | Ops audit | > 90% |

---

## 11. Instrumentation

| Event | Properties |
|---|---|
| `onboarding.stuck` | tenant, step, days, reason |
| `onboarding.intervention` | type (auto / human message / call), day, outcome |
| `onboarding.unstuck` | days stuck, intervention that worked |
| `support.ticket_created` / `resolved` | category, time to resolve, escalated? |
| `support.diagnostic_run` | result, cause, action taken |
| `tenant.suspended` / `restored` | reason, type, duration |
| `tenant.offboarded` | reason, tenure, data exported? |
| `billing.adjustment` | amount, reason code, approver |
| `impersonation.*` | per Flow 20 §6 |

**`onboarding.unstuck` with the intervention that worked is the most valuable operational dataset in the company** — it tells us which friction to remove from the product entirely.

---

## 12. Open questions

| # | Question | Blocks |
|---|---|---|
| 21.a | At what tenant count does the stuck queue need automation rather than a person? | Ops scaling |
| 21.b | Is an assisted setup call economically viable at our price point, and at what conversion rate does it pay for itself? | Unit economics |
| 21.c | Should the guided diagnostic be exposed to tenants directly, as self-service? | Support load |
| 21.d | What identity evidence is sufficient for ownership transfer in a market with informal business structures? | Recovery policy |
| 21.e | How long should a dormant tenant's data be retained before offboarding? | Retention policy |

---

*Next: [22 — AI Operations](22-admin-ai-operations.md)*
