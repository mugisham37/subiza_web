# 22 — Flow: AI Operations

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-22 |
| **Actors** | ML Engineer · Quality Reviewer · Engineer/SRE · Super Admin |
| **Entry points** | Operations home · a quality alert · a scheduled evaluation · a model or prompt change |
| **Exit states** | Change published · rolled back · blocked by evaluation · incident opened |
| **Depends on** | Live traffic |
| **Blocks** | Answer quality over time |
| **Frequency** | Continuous monitoring; weekly review; changes as needed |
| **Criticality** | Important — and it is what stops quality decaying invisibly |

---

## 1. Purpose

Manage the models, prompts, templates and evaluations that determine how well every tenant's agent works — and make sure a change intended to improve one thing never quietly breaks another.

**What breaks if this is wrong:** quality drifts down without anyone noticing, or a well-intentioned prompt change degrades a hundred businesses at once. In a product where the failure is experienced by *our customers' customers*, that is a failure we hear about late and from the wrong direction.

---

## 2. The design position

**Prompts, models, templates and knowledge defaults are releases.** They are versioned, reviewed, evaluated, rolled out progressively and revertible in minutes — exactly like code. The failure mode this prevents is familiar and expensive: a prompt edited directly in production on a Friday, quality degrading over the weekend, and nobody able to say what changed.

**The replay suite is the gate.** A held-out set of real, consented, anonymised conversations is replayed against every change. A change that improves an offline benchmark but regresses the replay suite does not ship. Synthetic test cases are useful; relying on them alone is how a system passes all its tests and fails every real call.

**Real failures become permanent guards.** Any conversation that went wrong can be converted into a regression test with one action. Over time the suite becomes a map of everything that has ever gone wrong, and none of it can happen twice.

---

## 3. Overview

```
   ┌─────────────────────────────────────────────────────────────┐
   │  MONITOR                                                     │
   │   latency p50/p95/p99 per stage · containment · refusal      │
   │   understanding rate per language · spurious switches        │
   │   hallucination reports · cost per conversation              │
   └───────────────────────────┬─────────────────────────────────┘
                               ▼
   ┌─────────────────────────────────────────────────────────────┐
   │  REVIEW                                                      │
   │   sampled conversations + everything flagged                 │
   │   annotate · confirm or overturn the AI's own verdict        │
   │   → systemic fix, not a one-off correction                   │
   └───────────────────────────┬─────────────────────────────────┘
                               ▼
   ┌─────────────────────────────────────────────────────────────┐
   │  CHANGE                                                      │
   │   model · prompt · template · retrieval · threshold          │
   │   versioned · diffed · reasoned                              │
   └───────────────────────────┬─────────────────────────────────┘
                               ▼
   ┌─────────────────────────────────────────────────────────────┐
   │  EVALUATE   ← THE GATE                                       │
   │   replay suite · persona suite · language suite              │
   │   pass rate vs the current version, per language             │
   │   regression → BLOCKED                                       │
   └───────────────────────────┬─────────────────────────────────┘
                               ▼
   ┌─────────────────────────────────────────────────────────────┐
   │  ROLL OUT                                                    │
   │   internal → design partners → 5% → 25% → all                │
   │   watch the same metrics · revert in minutes                 │
   └─────────────────────────────────────────────────────────────┘
```

---

## 4. Monitor

### 4.1 The metrics that matter

| Metric | Why | Alert |
|---|---|---|
| **Turn latency, per stage, p50/p95/p99** | The product fails socially above ~1.5s. Decomposed by stage so a regression is attributable | p95 > 1,200ms for 5 min → page |
| **Understanding rate per language** | **The Kinyarwanda number is the company's core technical risk** | 2σ below baseline → page |
| **Containment rate** | Too low means the agent is useless; too high means it is answering things it should escalate. **Both edges are investigated** | Outside 65–85% → ticket |
| **Refusal rate** | The safety valve working | Sudden change → ticket |
| **Spurious language switches** | Detection-triggered switches with no caller switch | > 1% → ticket |
| **Hallucination reports** | Zero tolerance | Any → page |
| **Cost per conversation** | Margin is engineered continuously or lost quietly | Above target → ticket |
| **Escalation success** | Every escalation reaching a human or a logged promise | < 100% → page |

Every metric is sliceable by language, business type, channel, tenant and model version — because an aggregate that looks healthy can hide a language that is failing.

### 4.2 The per-conversation trace

The single artefact that serves four purposes: engineering debugging, the owner's "why did it say that?" explanation, the quality-review dataset, and the regulatory audit trail. Per turn: audio in, partial and final transcript, detected language, retrieval query and scores, decision, generated text, synthesised audio, and a timestamp at every stage boundary.

Building it once and well is one of the highest-leverage decisions in the platform.

---

## 5. Review

### 5.1 What gets reviewed

Not everything, and not randomly. A monitor-based sampling strategy:

| Source | Volume |
|---|---|
| **Everything flagged** — hallucination reports, 👎, escalation failures, understanding failures | 100% |
| **Random sample of all traffic** | ~1% — the only way to know the true baseline rather than just the complaint rate |
| **Targeted samples** — new tenants' first week, new model versions, a language under investigation | Configurable |

### 5.2 The review interface

The reviewer sees the transcript with audio, the full trace, and an **AI-generated first-pass verdict with its reasoning** — then confirms or overturns it with a short rationale. Reviewing an existing verdict is far faster than scoring from a blank slate, and it produces a labelled dataset measuring the AI reviewer's own accuracy.

### 5.3 Fix systemically, not individually

**This is the rule that makes review worth doing.** When a review finds a problem, the correction goes to the **cause**, not the instance:

| Found | Individual fix (wrong) | Systemic fix (right) |
|---|---|---|
| Agent misread a price | Correct that answer | Fix the price table row, and check whether OCR mis-extracted for other tenants too |
| Agent did not escalate an angry caller | Note it | Adjust the frustration threshold, add a regression test |
| Agent mispronounced a place name | Tell the tenant | Add it to the template's default pronunciation dictionary **for every tenant in that business type** |
| Agent answered an out-of-scope question | Correct it | Investigate the scope boundary — this is a **policy** issue on WhatsApp (W8), not just quality |

The same mistake, left unfixed at the cause, recurs across every future conversation on that topic and across every tenant with the same template.

### 5.4 Template improvement

An aggregate view of unanswered questions by business type ([Flow 16](16-flow-analytics-and-retention.md)) drives template improvement. If eleven salons cannot answer "do you do children's hair," that question belongs in the salon template with a placeholder answer — and it should be added for every future salon and offered to existing ones.

**This is the platform's compounding advantage.** Every tenant's failure improves the product for every future tenant.

---

## 6. Change and evaluate

### 6.1 What is versioned

| Artefact | Versioned | Rollout |
|---|---|---|
| Models (ASR, LLM, TTS) | Version + quantisation + config | Progressive |
| System prompts | Full text, diffed | Progressive |
| Business-type templates | Rules, questions, pronunciation | Progressive |
| Retrieval config | Chunking, hybrid weights, reranking, thresholds | Progressive |
| Refusal thresholds | Per language | Progressive |
| Language detection config | Per language | Progressive |
| Guardrail sets | Global mandatory rules | Immediate for safety fixes |

Every version carries: who changed it, when, why, what changed, and the evaluation result that permitted it.

### 6.2 The evaluation gate

| Suite | Content | Rule |
|---|---|---|
| **Replay** | Real, consented, anonymised conversations with known-good outcomes | **No regression permitted.** This is the gate |
| **Persona** | The five customer personas from [Flow 13](13-flow-test-and-go-live.md), scaled up | Pass rate must not fall |
| **Language** | Per-language understanding and response sets, weighted toward Kinyarwanda | Per-language pass rates, no aggregate hiding a per-language failure |
| **Safety** | Prompt injection, out-of-scope, price invention, escalation bypass | **100% required. No exceptions** |
| **Latency** | Synthetic load at target concurrency | p95 must not regress |

Results are shown per language, never only in aggregate — an improvement in English that costs Kinyarwanda is a regression for this company.

**Probabilistic evaluation:** because model outputs vary, each case runs several times and the pass rate is reported as a band (green at 100%, amber above 80%, red below), rather than a single pass or fail from one run.

### 6.3 Rollout

Internal → design partners → 5% → 25% → all, with the monitoring metrics watched at each stage and an automatic halt on regression. Per-tenant feature flags mean risk-averse tenants can stay on the stable path while design partners take the newest.

Rollback is one action and takes minutes, including model and prompt versions. Because a bad model version is experienced by customers as "the AI got stupid," rollback speed is a customer-facing property.

---

## 7. Cost operations

Every conversation accrues a cost record: telephony minutes, speech-recognition seconds, model tokens in and out, synthesis characters, storage, and an allocated share of fixed infrastructure. Aggregated per tenant, per plan and per business type, continuously.

This surfaces three things a monthly finance report cannot: which tenants are unprofitable and why, whether a model change moved cost as well as quality, and when self-hosting a component crosses its break-even (see the project documentation's economics chapter).

---

## 8. Screens, states, decisions

| Screen | States |
|---|---|
| Monitoring | Healthy · degraded · alerting · incident |
| Trace viewer | Per conversation, per turn, per stage |
| Review queue | Empty · populated · in review · completed |
| Version registry | Current · previous · candidate · rolled back |
| Evaluation run | Queued · running · passed · **blocked by regression** |
| Rollout | Staged with percentage · halted · complete |
| Cost explorer | Per tenant / model / component / period |

| Decision | Branches |
|---|---|
| Metric out of band? | Alert · investigate · incident |
| Review verdict? | Confirm · overturn → systemic fix |
| Evaluation result? | Pass → roll out · regression → **blocked** |
| Regression during rollout? | Halt · revert |
| Fix scope? | One tenant · one template · all tenants |

---

## 9. Platform constraints

| Constraint | Effect |
|---|---|
| **Law 058/2021 Art. 50 residency** | Evaluation data and the training corpus are Rwanda-resident; the model lab is isolated from production and separately access-controlled |
| **Consent-linked training data** | A withdrawn consent must propagate: the record leaves the corpus and affected model versions are marked ([Flow 19](19-flow-compliance-and-data-rights.md)) |
| **W8 out-of-scope enforcement** | The safety suite's out-of-scope tests are a **policy** requirement, not a quality preference |
| Engineers have no ambient conversation access | Review uses anonymised data by default; identified data requires justification |
| Kinyarwanda is the core technical risk | Per-language reporting is mandatory; aggregate-only reporting is prohibited |

---

## 10. Edge cases and failures

| Case | Behaviour |
|---|---|
| Evaluation suite itself becomes stale | Refreshed quarterly from recent production conversations; coverage tracked as a metric |
| A change improves aggregate but regresses one language | **Blocked.** Per-language gates, no aggregate override |
| Urgent safety fix needed | An expedited path exists: safety suite only, immediate rollout, mandatory post-hoc full evaluation |
| Model provider deprecates a version | Tracked in the registry with an end-of-life date and a migration task |
| Quality degrades with no change on our side | Investigate upstream — provider drift, traffic-mix change, a new tenant cohort with different speech |
| Reviewer disagrees with the AI verdict frequently | The AI reviewer itself needs retraining; its accuracy is a tracked metric |
| Rollback needed during a rollout | One action, minutes, including model and prompt |

---

## 11. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 22.1 | Every AI-affecting change is versioned with author, reason and evaluation | Audit | 100% |
| 22.2 | No change ships with a replay-suite regression | Pipeline enforcement | 100% |
| 22.3 | Safety suite passes completely before any rollout | Pipeline enforcement | 100% |
| 22.4 | Per-language results are reported for every evaluation | Audit | 100% |
| 22.5 | Rollback completes in under 5 minutes | Drill | Pass |
| 22.6 | Flagged conversations are all reviewed | Within 7 days | 100% |
| 22.7 | Review findings produce systemic fixes | Reviews leading to a template, threshold or knowledge change | > 50% |
| 22.8 | Real failures become regression tests | Flagged conversations converted | > 30% |
| 22.9 | Cost per conversation is current | Data freshness | < 24h |
| 22.10 | Withdrawn consent propagates out of the training corpus | Functional test | Pass |
| 22.11 | Hallucination reports are investigated | Within 24h | 100% |

---

## 12. Instrumentation

| Event | Properties |
|---|---|
| `ai.metric_alert` | metric, value, threshold, slice |
| `ai.review_sampled` / `completed` | source, verdict, overturned?, systemic fix? |
| `ai.version_created` | artefact, author, reason, diff summary |
| `ai.evaluation_run` | suite, version, pass rate per language, blocked? |
| `ai.rollout_stage` | version, percentage, metrics at stage |
| `ai.rollback` | version, reason, minutes to complete |
| `ai.regression_test_added` | source conversation, category |
| `ai.template_improved` | business type, change, tenants affected |
| `ai.cost_per_conversation` | tenant, components |

---

## 13. Open questions

| # | Question | Blocks |
|---|---|---|
| 22.a | What is an acceptable Kinyarwanda understanding rate on 8 kHz telephone audio, and what is the baseline? Unknown until measured | Every quality target in this flow |
| 22.b | How large must the replay suite be to catch regressions reliably? | Evaluation design |
| 22.c | Can an AI reviewer grade Kinyarwanda conversations accurately, or must review be fully human for that language? | Review scaling and cost |
| 22.d | How do we get consent for training use without making the consent flow heavier for callers? | Data strategy |
| 22.e | Should tenants be able to opt out of model changes entirely, staying pinned to a version they trust? | Stability vs improvement |
| 22.f | What is the right random-sample rate — 1% is a guess, not a calculation | Review cost |

---

*Next: [23 — Trust, Safety & Quality](23-admin-trust-safety-and-quality.md)*
