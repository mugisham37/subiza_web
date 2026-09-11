# 20 — Flow: Admin Console & Operations Home

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-20 |
| **Actor** | A9 Platform staff (nine internal roles) |
| **Entry points** | admin.subiza.rw · an alert · a support ticket |
| **Exit states** | Situational awareness · action taken · escalated |
| **Depends on** | Tenants existing |
| **Blocks** | Support, safety, growth |
| **Frequency** | Continuously, during working hours |
| **Criticality** | Important |

---

## 1. Purpose

Give the platform team one place to see whether the business is healthy, whether the product is working, and who needs help right now.

**What breaks if this is wrong:** we find out about problems from customers. In a market where a business's phone line is at stake, that is the difference between a fixable incident and a lost account.

---

## 2. The design position

Two decisions distinguish this from a generic SaaS back office.

**First: Onboarding Operations is a first-class section, not a support afterthought.** The competitor research found that nearly every severe friction complaint in this category sits in the identity, compliance and verification layers — carrier KYC, Meta Business Verification, number provisioning — and **nobody treats "tenants stuck in onboarding" as an internal product.** In a market where Meta verification takes 5–15 business days and number provisioning needs local liaison, the stuck-tenant queue *is* the onboarding experience.

**Second: this console handles a second layer of data subjects.** Our tenants' data contains their customers' regulated personal data. That makes standard B2B SaaS admin practice insufficient — impersonation, access and masking rules here are stricter than the norm, and they are specified in [Flow 01 §6](01-actors-roles-and-permissions.md).

---

## 3. Overview

```
   ADMIN ▸ OPERATIONS
   ┌─────────────────────────────────────────────────────────────┐
   │  🔴 NEEDS ATTENTION                                          │
   │     2 tenants stuck >5 days in WhatsApp verification         │
   │     1 tenant paused their agent 3h after go-live             │
   │     WhatsApp onboarding: 8 of 10 weekly slots used  ⚠        │
   ├─────────────────────────────────────────────────────────────┤
   │  PLATFORM HEALTH                                             │
   │     Turn latency p95    980ms   ●                            │
   │     Answer rate         99.7%   ●                            │
   │     Containment         74%     ●                            │
   │     Active incidents    0                                    │
   ├─────────────────────────────────────────────────────────────┤
   │  FUNNEL — THIS WEEK                                          │
   │     Signups 34 → Activated 21 (62%) → Live 17 → Paying 12    │
   │     Time to first value  8m 40s median                       │
   ├─────────────────────────────────────────────────────────────┤
   │  BUSINESS                                                    │
   │     Live tenants 143 · MRR 2.4M RWF · churn 4.1%             │
   │     Margin/minute  +58%                                      │
   ├─────────────────────────────────────────────────────────────┤
   │  QUEUES                                                      │
   │     Onboarding stuck 6 · Support 3 · Quality review 24       │
   │     Voice consent 2 · Trust & safety 0 · DSAR 1 (due 12d)    │
   └─────────────────────────────────────────────────────────────┘
```

---

## 4. The five zones

### 4.1 Needs attention

The only actionable zone, and deliberately short. Items appear here only if a human must do something today.

| Trigger | Why it is urgent |
|---|---|
| Tenant stuck >5 days at an onboarding step | Beyond a week, activation probability collapses |
| Agent paused within 24h of go-live | **The strongest churn signal in the product** ([Flow 13](13-flow-test-and-go-live.md)) |
| **WhatsApp onboarding slots running out** | Meta caps us at 10 new business customers per rolling 7 days until our own verifications complete. **This caps company growth**, and running out silently would be a self-inflicted wound |
| Any tenant with zero traffic for 7 days | Usually broken forwarding, not a quiet week |
| DSAR approaching deadline | Statutory |
| Voice consent verification pending >24h | A tenant is blocked |
| Quality incident | A hallucination report or a spike in failures |

### 4.2 Platform health

The three numbers that determine whether the product works: **turn latency p95**, **answer rate**, and **containment rate** — plus active incidents. Deliberately few. A dashboard with forty metrics is a dashboard nobody reads.

**Latency is shown at p95, not p50.** A median inside budget while one call in twenty takes 2.5 seconds means one call in twenty is failing, and the average conceals it.

### 4.3 The funnel

Signups → activated → live → paying, with **time to first value** alongside. These are the two most important numbers in the company ([Flow 06 §10](06-flow-guided-activation.md)) and they belong on the operator's home screen from the first tenant.

Sliceable by business type, language and acquisition channel — because if one template converts materially worse than the others, that is a fixable product problem and we must be able to see it.

### 4.4 Business

Live tenants, MRR, churn, and **margin per conversation minute** — the last computed continuously from the per-conversation cost accounting, so margin is managed during the month rather than discovered at the end of it.

### 4.5 Queues

Every queue with a count and the oldest item's age. Clicking enters the relevant flow.

---

## 5. The queues

| Queue | Owner | SLA | Flow |
|---|---|---|---|
| **Onboarding stuck** | Onboarding Specialist | Contact within 1 business day | [21](21-admin-tenant-lifecycle.md) |
| **Support** | Support L1/L2 | 4 business hours | [21](21-admin-tenant-lifecycle.md) |
| **Quality review** | Quality Reviewer | Sampled weekly | [22](22-admin-ai-operations.md) |
| **Voice consent verification** | Trust & Safety | 24 hours | [23](23-admin-trust-safety-and-quality.md) |
| **Trust & safety** | T&S Officer | 24 hours; 1 hour if severe | [23](23-admin-trust-safety-and-quality.md) |
| **DSAR / rights** | DPO | Statutory | [19](19-flow-compliance-and-data-rights.md) |
| **Billing exceptions** | Billing Admin | 1 business day | [17](17-flow-billing-and-mobile-money.md) |
| **Number provisioning** | Onboarding Specialist | Tracked against provider SLA | [07](07-flow-phone-connection.md) |

---

## 6. Access, audit and impersonation

Every action in this console is governed by the RBAC matrix in [Flow 01 §5.2](01-actors-roles-and-permissions.md) and logged.

**The audit event schema** — one row per consequential action:

```
   timestamp · action (resource.object.verb) · actor id · actor name
   · reason · ticket ref · target tenant · ip · user agent
   · previous state (JSON) · next state (JSON)
```

Action names are a controlled vocabulary, not free text: `tenant.suspended`, `billing.credit.adjusted`, `prompt.version.published`, `impersonation.started`. Free-text action names make an audit log unsearchable exactly when it matters.

**Retention: 7 years.** The audit log is primary evidence in a breach investigation or a regulatory inquiry, and Rwandan law requires controllers to maintain records of processing activities.

**Impersonation** follows the rules in [Flow 01 §6](01-actors-roles-and-permissions.md): off by default, reason and ticket required, 15-minute time box, read-only by default, high-risk actions blocked, persistent banner, third-party PII masked by default, dual-identity logging — and **visible in the tenant's own audit log**, which is what turns a frightening capability into a trust feature.

---

## 7. Screens, states, decisions

| Screen | States |
|---|---|
| Operations home | Healthy · attention needed · incident active |
| Queue list | Empty · populated · overdue items highlighted |
| Tenant directory | Searchable, filterable by status, plan, health, language, business type |
| Tenant detail | Profile · configuration · usage · billing · conversations (masked) · audit · notes |
| Impersonation | Not active · requesting (reason + ticket) · active with countdown · expired |
| Audit log | Filterable by actor, tenant, action, date |
| Incident | None · declared · mitigating · resolved · postmortem due |

| Decision | Branches |
|---|---|
| Item urgent? | Needs attention · queue |
| Impersonation needed? | Read-only default · write with second reason · blocked action |
| Tenant at risk? | Automated prompt · human contact |
| Growth cap approaching? | Alert, and schedule new tenant onboarding |

---

## 8. Platform constraints

| Constraint | Effect |
|---|---|
| **W11 — 10 new WhatsApp customers per rolling 7 days** | A first-class operational metric with an alert, because it caps our growth rate until our own verifications are complete |
| **W10 — Meta verification 5–15 business days** | Onboarding Ops must be built around waiting, not around instant provisioning |
| **P3 — number provisioning gated on KYC** | Same |
| Law 058/2021 | Staff access to conversation content is masked by default; every access is logged and visible to the tenant |
| Second layer of data subjects | Stricter than typical B2B SaaS admin practice throughout |

---

## 9. Edge cases and failures

| Case | Behaviour |
|---|---|
| Two staff act on the same queue item | Claim-on-open with a visible owner |
| Engineer needs conversation content to debug | **Break-glass**: explicit request, heightened audit, time-boxed, alerts the DPO, post-hoc review task created |
| Tenant asks us to look at something | Their consent is recorded on the impersonation session, which shortens the justification but does not remove the audit |
| Admin console down | Alerting still fires by other channels; a documented manual runbook exists |
| Audit log grows very large | Partitioned by time; export to long-term storage; never truncated |
| Staff member leaves | Access revoked immediately; their audit history is retained |

---

## 10. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 20.1 | Operator home answers "is everything OK?" in 10 seconds | Usability test with staff | Pass |
| 20.2 | Needs-attention items are genuinely actionable | Items dismissed without action | < 15% |
| 20.3 | Every consequential action is audited with before/after state | Schema validation | 100% |
| 20.4 | Impersonation follows every rule in Flow 01 §6 | Functional test of all nine requirements | Pass |
| 20.5 | Impersonation appears in the tenant's audit log | Within 60s | Pass |
| 20.6 | Engineers have no ambient conversation access | Access review | Pass |
| 20.7 | Break-glass alerts the DPO and creates a review task | Functional test | Pass |
| 20.8 | Queue SLAs are met | Per queue | > 90% |
| 20.9 | WhatsApp onboarding cap alerts before exhaustion | Alert at 8 of 10 | Pass |
| 20.10 | Margin per minute is current | Data freshness | < 24h |

---

## 11. Instrumentation

| Event | Properties |
|---|---|
| `admin.login` | actor, role, ip |
| `admin.action` | full audit schema (§6) |
| `impersonation.started` / `ended` | actor, tenant, reason, ticket, duration, write access? |
| `impersonation.blocked_action` | attempted action |
| `breakglass.invoked` | actor, tenant, justification |
| `queue.item_created` / `claimed` / `resolved` | queue, age, actor |
| `alert.raised` / `acknowledged` | type, severity, time to acknowledge |

---

## 12. Open questions

| # | Question | Blocks |
|---|---|---|
| 20.a | Does the admin console need mobile support for on-call staff, or is desktop-only acceptable? | Scope |
| 20.b | At what tenant count does the stuck-tenant queue need automation rather than a person? | Ops scaling |
| 20.c | Should tenants see the platform health dashboard — a public status page? | Transparency |
| 20.d | Is 15 minutes the right impersonation time box, or too short for real debugging? | Support efficiency |
| 20.e | Who is the DPO in a five-person company, and can that person be independent enough? | Compliance structure |

---

*Next: [21 — Tenant Lifecycle & Support](21-admin-tenant-lifecycle.md)*
