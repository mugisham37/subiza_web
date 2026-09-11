# 19 — Flow: Compliance, Consent & Data Rights

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-19 |
| **Actors** | A1 Caller · A2 Messager · **A4 Data Subject** · A3 Voice Owner · A5 Owner · DPO |
| **Entry points** | Runtime disclosure · in-conversation request · public rights form · Settings → Privacy · admin |
| **Exit states** | Consent captured · request fulfilled · data exported · data erased · refused with reason |
| **Depends on** | 05 |
| **Blocks** | Lawful operation |
| **Frequency** | Continuous (disclosure) · rare (rights requests) |
| **Criticality** | **Critical — build with the critical set, not later** |

---

## 1. Purpose

Make Subiza lawful to operate and trustworthy to use: disclose the AI, capture consent properly, store data where the law requires, and honour data-subject rights within statutory deadlines.

**What breaks if this is wrong:** the company. Rwanda's Law 058/2021 carries administrative penalties of RWF 2–5 million or 1% of turnover, and criminal penalties up to 7–10 years imprisonment and RWF 20–25 million for unlawful processing of sensitive data — a category that very likely includes voiceprints.

**Why this is built early:** consent capture and data residency **cannot be retrofitted onto data already collected**. Data gathered without valid consent is legally unusable and ethically indefensible. There is no version of this that can be added in month six.

---

## 2. The obligations, in plain terms

| Obligation | Source | What it means in the product |
|---|---|---|
| Register as controller **and** processor | Arts. 29–31 | A platform prerequisite before any tenant processes data. Certificate within 30 working days |
| **Store personal data in Rwanda** unless authorised | **Art. 50** | Rwanda-resident datastores by default; any cross-border processing is an explicit, authorised, logged exception |
| Consent must be freely given, specific, informed, unambiguous — and may be **oral** | Art. 6 | A spoken disclosure and confirmation at call start can be valid consent, if genuinely informed and recorded |
| Withdrawal as easy as giving | Art. 8 | A caller can say "don't record me" and it must work |
| Information and access | Art. 18 | Subject-access mechanism |
| Portability, structured and readable | Art. 20 | Export |
| Erasure | Art. 23 | Deletion propagating across every store |
| Rectification **within 30 days** | Art. 24 | An SLA, not a best effort |
| Breach: notify within **48 hours**, full report within **72** | Arts. 43–45 | Detection, a named owner, a rehearsed runbook |
| Sensitive data includes biometric information | Art. 3(2) | Voiceprints handled under stricter controls |
| **DPO required** | — | A named role, published contact, notified to the authority |
| AI disclosure | EU AI Act Art. 50 from 2 Aug 2026, and good practice | Non-skippable, audible, every conversation |

---

## 3. Overview

```
   ┌──────────────────────────────────────────────────────────┐
   │  RUNTIME  ·  every conversation                           │
   │                                                           │
   │   "Muraho, ni Salon Ubwiza. Ndi umufasha                  │
   │    w'ikoranabuhanga. Iki kiganiro gishobora               │
   │    kwandikwa. Nabafasha nte?"                             │
   │                                                           │
   │   AI disclosed · recording disclosed · human available    │
   │   → logged as a compliance event, every time              │
   └────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   caller objects      caller asks         no objection
   to recording        to be deleted       → proceed
        │                   │
        ▼                   ▼
   no-record mode      RIGHTS REQUEST
   or human            ┌──────────────────────────────┐
                       │  public form · in-conversation │
                       │  · via the business            │
                       │           ▼                    │
                       │  identity verification         │
                       │           ▼                    │
                       │  DPO queue, deadline clock     │
                       │           ▼                    │
                       │  fulfil across ALL stores      │
                       │  (DB · recordings · vectors ·  │
                       │   training corpus · backups)   │
                       │           ▼                    │
                       │  confirm to the subject        │
                       └──────────────────────────────┘
```

---

## 4. Runtime disclosure

### 4.1 On a call

The greeting contains three things, in order, before anything else: the business name, that this is an AI assistant, and that the call may be recorded. Plus an always-available route to a human.

It is **non-skippable and non-removable** by the tenant, in every language, on every call. Each play is logged as a compliance event — not analytics — so that "was disclosure given on this call?" is answerable for any call, years later.

### 4.2 On chat

First contact in each session carries the disclosure. Shorter, but present.

### 4.3 If the caller objects to recording

| Route | Behaviour |
|---|---|
| **No-record mode** | The conversation continues, audio is not retained, a transcript is kept only if the tenant's policy allows and the caller does not object to that either |
| **Human** | Immediate escalation |
| **Logged** | The objection itself is recorded as a consent event |

Article 8 requires withdrawal to be as easy as giving consent. A caller saying *"ntimunyandike"* must produce an actual change in behaviour, not an apology. Whether this is fully enforceable mid-call without re-establishing the session is an open technical question (19.c).

---

## 5. Data rights requests

### 5.1 How they arrive

| Route | Handling |
|---|---|
| **Public form** (no login, linked from the website and every disclosure) | The primary route |
| **In conversation** — "delete my details" | Detected as a rights request, not a support note. Logged, and the subject is given the form link |
| **Via the business** | The tenant forwards it; Subiza fulfils as processor |
| **Direct to the DPO** | Published contact |

### 5.2 Identity verification

Verification uses **data we already hold** — an OTP to the phone number in question — rather than demanding identity documents. That is both lower friction and more defensible: an OTP to the number whose records are being requested proves control of that number, which is the identity we actually hold.

Refusal is possible where identity cannot be established, and the refusal and its reason are recorded.

### 5.3 Fulfilment

The hard part is completeness. A deletion request must reach:

| Store | Action |
|---|---|
| Conversation records | Delete or anonymise |
| Call recordings | Delete from object storage, including versions |
| Transcripts | Delete |
| **Vector embeddings** | Delete — commonly forgotten, and a genuine leak if missed |
| Customer timeline | Delete |
| Leads, bookings, actions | Delete or anonymise, subject to the tenant's own legal retention needs |
| **Training corpus** | Remove, and mark the affected model versions |
| Backups | Flagged for deletion on the next cycle, with the delay explained honestly to the subject |
| Consent records | **Retained** — evidence that consent existed and was withdrawn |

**Retaining the consent record while deleting the data it covered is correct and must be explained to the subject**, because otherwise deletion appears incomplete.

### 5.4 Deadlines

| Right | Deadline | Product behaviour |
|---|---|---|
| Rectification | **30 days** (Art. 24) | Countdown from receipt, visible in the DPO queue, escalating alerts at 20 and 27 days |
| Access, portability, erasure | Statutory period to be confirmed with counsel | Same countdown mechanism, conservative default |

---

## 6. Data residency

The single most consequential architectural constraint in the product.

| Requirement | Implementation |
|---|---|
| Personal data stored in Rwanda (Art. 50) | Primary datastores region-pinned. A deployment that would place personal data outside Rwanda without a recorded authorisation reference **fails the pipeline** — compliance enforced by tooling, not by memory |
| Cross-border processing | Only against a named, recorded NCSA authorisation, per vendor and per purpose, with an expiry date tracked |
| Visible to the tenant | Settings → Privacy shows where their data lives and which external processors are involved |
| Visible to us | A residency control panel in the admin console ([Flow 23](23-admin-trust-safety-and-quality.md)) |

**This is why the project documentation treats self-hosted inference as a legal driver, not only a cost one.** Streaming call audio to a foreign speech API is a cross-border transfer of personal data.

---

## 7. Retention

| Data | Default | Tenant-configurable |
|---|---|---|
| Call recordings | 30 days | Yes, 7–90 days |
| Transcripts | 12 months | Yes |
| Conversation metadata | 24 months | No |
| Leads and bookings | Tenant's own retention | Yes |
| Consent records | 7 years | No |
| Audit log | 7 years | No |
| Training corpus | Consent-linked, revocable | Opt-in per tenant |

**Recordings default to a short retention deliberately.** They are the highest-risk data we hold and the least often needed after a few days. Transcripts serve almost every legitimate purpose at a fraction of the risk.

---

## 8. The tenant's own compliance surface

Settings → Privacy gives the owner what they need to meet *their* obligations:

- Where their data is stored, and which processors are involved
- Their retention settings
- A downloadable data-processing agreement
- **Opt-in collection tools for messaging** — a QR code, a web form, an IVR prompt — because Meta places opt-in responsibility on the business with no carve-out for the platform (W16), and a tenant left to improvise will improvise badly
- Their own audit log, including **every time Subiza staff accessed their account** ([Flow 01 §6](01-actors-roles-and-permissions.md))
- A one-tap export of everything
- Account deletion, with the consequences stated plainly

---

## 9. Breach response

The 48-hour clock is short enough that the process must exist before it is needed.

| Stage | Requirement |
|---|---|
| **Detect** | Alerting on unusual recording access, unexpected egress, auth anomalies |
| **Assess** | Named DPO and deputy; a decision record of what was known when, because the clock runs from awareness |
| **Notify NCSA** | Within 48 hours, using a pre-drafted template |
| **Full report** | Within 72 hours |
| **Notify subjects** | Where risk is high (Art. 45) |
| **Notify tenants** | Always, if their data or their customers' data is affected |
| **Rehearse** | At least annually, as a real exercise |

---

## 10. Screens, states, decisions

| Screen | States |
|---|---|
| Runtime disclosure | Played · objection raised · no-record mode |
| Public rights form | Submitting · verifying · verified · rejected |
| DPO queue | New · verifying · in progress · **deadline approaching** · fulfilled · refused |
| Fulfilment checklist | Per store: pending · done · deferred (backups) |
| Tenant privacy settings | Residency · retention · processors · export · delete |
| Consent registry | Per subject, per type, per version |
| Breach workspace | Detected · assessing · notified · reported · closed |

| Decision | Branches |
|---|---|
| Objection to recording? | No-record mode · human · end |
| Rights request valid? | Verified → fulfil · unverifiable → refuse with reason |
| Data outside Rwanda? | Authorisation on file → allow · none → **block** |
| Deletion complete? | All stores confirmed · backups deferred with explanation |
| Breach confirmed? | 48h clock starts |

---

## 11. Edge cases and failures

| Case | Behaviour |
|---|---|
| Deletion requested for data the tenant must legally keep (a transaction record) | Partial fulfilment, with the legal basis for retention explained to the subject |
| Subject cannot be verified | Refused with a reason and an appeal path |
| Data in an immutable backup | Deleted on the next cycle; the delay is stated honestly rather than claimed as instant |
| Voice owner revokes consent | Handled by [Flow 11 §6.3](11-flow-voice-and-cloning.md) — immediate disable, then deletion |
| Tenant deletes their account with rights requests outstanding | Requests are completed regardless. Obligations outlive the relationship |
| Cross-border authorisation expires | The affected processing **stops** until renewed. Fails closed |
| A caller withdraws consent mid-call | Handled per 19.c; at minimum, recording stops and the objection is logged |
| Tenant asks us to hand over another tenant's data | Refused |
| Law enforcement request | Legal review, minimum necessary, logged, and the subject notified where lawful |

---

## 12. Retention rationale

Compliance is usually framed as friction. Here it is a feature, and the framing should be explicit in the product.

| Decision | Reason |
|---|---|
| Disclosure is honest and up front | Callers who are told tolerate AI far better than callers who work it out |
| Consent asked in context, never bundled | Both better UX and legally stronger |
| Tenants can see when *we* accessed their account | Turns a frightening capability into a trust signal |
| Short recording retention by default | Less risk, and it signals seriousness about their customers' privacy |
| Opt-in tooling provided | Tenants cannot meet an obligation we do not help them meet |
| Data residency stated plainly in the product | "Your customers' data stays in Rwanda" is a genuine selling point against foreign competitors |

---

## 13. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 19.1 | AI disclosure on every conversation | Runtime audit of recordings and transcripts | 100% |
| 19.2 | Disclosure cannot be disabled by a tenant | Functional test | Pass |
| 19.3 | Recording objection changes behaviour | Functional test | Pass |
| 19.4 | Personal data is Rwanda-resident by default | Infrastructure audit | 100% |
| 19.5 | Cross-border processing without authorisation is blocked | Deployment-pipeline test | Pass |
| 19.6 | Deletion reaches every store including embeddings and training data | Functional test with verification queries | 100% |
| 19.7 | Rectification within 30 days | Queue SLA | 100% |
| 19.8 | Breach runbook rehearsed | Annual exercise completed | Pass |
| 19.9 | Consent records complete and exportable | Schema validation | Pass |
| 19.10 | Tenants can see platform staff access to their account | Functional test | Pass |
| 19.11 | Retention policies are enforced automatically | Lifecycle audit | Pass |
| 19.12 | Public rights form reachable without login, in four languages | Manual audit | Pass |

---

## 14. Instrumentation

| Event | Properties |
|---|---|
| `compliance.disclosure_played` | conversation, language, channel |
| `compliance.recording_objection` | action taken |
| `rights.request_received` | type, route, language |
| `rights.identity_verified` / `refused` | method, reason |
| `rights.fulfilled` | type, days elapsed, stores touched |
| `rights.deadline_warning` | days remaining |
| `residency.crossborder_blocked` | processor, reason |
| `consent.captured` / `withdrawn` | type, subject, version |
| `breach.detected` / `notified` / `reported` | hours elapsed |
| `admin.tenant_access` | actor, tenant, reason, duration |

---

## 15. Open questions

| # | Question | Blocks |
|---|---|---|
| 19.a | Exactly what does Article 50 permit for transient processing abroad, and can a foreign inference API be authorised as a named processor? | **The entire infrastructure architecture** |
| 19.b | Is a voiceprint formally biometric under Art. 3(2)? | Voice cloning; criminal exposure |
| 19.c | Can a mid-call recording objection be technically enforced without ending and re-establishing the session? | Runtime design |
| 19.d | What are the statutory deadlines for access, portability and erasure — only rectification's 30 days is confirmed | SLA design |
| 19.e | Is a DPIA formally required, and under what instrument? | Launch readiness |
| 19.f | Does any Rwandan statute govern call-recording consent beyond Law 058/2021's general principles? | Disclosure wording |
| 19.g | What is the NCSA registration fee and realistic timeline? | Launch schedule |

**Every one of these needs a Rwandan lawyer. None can be resolved from public sources.**

---

*Next: [20 — Admin Console & Operations](20-admin-console-and-operations.md)*
