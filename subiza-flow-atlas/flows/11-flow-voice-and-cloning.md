# 11 — Flow: Voice Selection & Cloning

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-11 |
| **Actors** | A5 Owner (initiates) · **A3 Voice Owner** (consents) |
| **Entry points** | Activation step 4 (selection only) · My Agent → Voice · Home checklist |
| **Exit states** | Library voice selected · Cloned voice live · Consent pending · Rejected · Revoked |
| **Depends on** | 06 |
| **Blocks** | Nothing — a library voice always works |
| **Frequency** | Once, plus occasional change |
| **Criticality** | High (selection) · Critical (cloning, for legal reasons) |

---

## 1. Purpose

Let the business choose how their agent sounds — from a library, or by cloning a real person's voice with consent that is genuine, documented and revocable.

**What breaks if this is wrong:** in the mild case, an agent that mispronounces the business's own name. In the severe case, a criminal offence. Under Rwandan Law 058/2021 a voiceprint is very likely "biometric information" (Art. 3(2)), and unlawful processing of sensitive personal data carries **7–10 years imprisonment and RWF 20–25 million** (Art. 60). This is the highest-legal-risk flow in the product.

---

## 2. The design position

The research is blunt: **the industry norm for voice cloning consent is a checkbox self-attestation with no verification at all.** A consumer-protection assessment of major vendors found most require nothing more than a tick. Only a minority implement real speaker verification.

**Subiza does not follow the norm**, for two reasons — one legal, one commercial.

Legally, a checkbox is not a defensible consent record under a statute that treats voiceprints as sensitive data with criminal penalties. Commercially, in a market where an AI answering the phone in someone's own voice is genuinely novel, being the platform that verifies is a trust asset, not a friction cost.

```
   INDUSTRY NORM              SUBIZA
   ─────────────              ──────
   ☑ "I have the right        1. Name the voice owner
      to clone this voice"    2. They record a generated sentence
                              3. We check it matches the samples
   done.                      4. Consent artefact stored, scoped, revocable
                              5. Audible AI disclosure on every call
```

---

## 3. Overview

```
                      MY AGENT ▸ VOICE
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
   ┌────────────────────┐        ┌────────────────────────┐
   │  CHOOSE A VOICE     │        │  USE A REAL VOICE      │
   │  from the library   │        │  (cloning)             │
   │                     │        │                        │
   │  ▶ preview          │        │  1. Whose voice?       │
   │  ▶ hear your        │        │  2. Their consent      │
   │    greeting         │        │  3. Record 30–60s      │
   │  ✓ done in 30s      │        │  4. ★ VERIFY: read     │
   └─────────┬───────────┘        │     this sentence ★    │
             │                    │  5. Build (minutes)    │
             │                    │  6. Preview            │
             │                    │  7. Approve → live     │
             │                    └───────────┬────────────┘
             └───────────────┬────────────────┘
                             ▼
                    TUNE  speed · warmth
                    PRONUNCIATION dictionary
                             ▼
                          LIVE
```

**Cloning is never in the critical path.** A library voice is selected in thirty seconds during activation; cloning lives in Part Four of the checklist ([Flow 06](06-flow-guided-activation.md)), because it needs a second person, a legal artefact and several minutes.

---

## 4. Path A — choose a library voice

| | |
|---|---|
| **Sees** | Voices grouped by language, labelled the way a person hears them — *Warm, female, Kinyarwanda* — not by model name. Each with ▶ and the template's recommendation pre-selected |
| **Does** | Previews two or three, picks one |
| **System** | Generates a preview **saying their actual greeting with their actual business name** |
| **Can fail** | No sound → visible unmute prompt, never silent failure. Voice unavailable for a language → only offer what exists, with an explanation rather than a broken option |

**The preview says their name.** It is a small thing that does disproportionate work: hearing "Muraho, ni Salon Ubwiza" is the first moment the product feels real.

**Kinyarwanda voices are the constraint.** Because mainstream commercial TTS does not support Kinyarwanda, the library for it is built from the project's own language programme. Where a Kinyarwanda voice is not yet available at the required quality, the product says so plainly and offers the nearest option plus the pronunciation dictionary — it does not quietly serve a French-accented approximation and hope nobody notices.

---

## 5. Path B — clone a real voice

### Step 1 — Whose voice is this?

| | |
|---|---|
| **Sees** | *"Whose voice will Subiza use?"* — **Mine** · **Someone else in my business** · **Someone else entirely**. Below: *"We'll need them to record a short confirmation. We can't clone a voice without the person's permission."* |
| **Does** | Chooses; if not their own, enters that person's name and phone number |
| **System** | Creates a **consent request** naming that person as A3, the voice owner. If the voice owner is not the account owner, sends them a secure link by SMS or WhatsApp |
| **Can fail** | "Someone else entirely" with no contact → **refused**, with a plain explanation |

**This step exists because of a legal asymmetry** ([Flow 01 §7](01-actors-roles-and-permissions.md)): the account owner initiates, but the voice owner consents, and **only the voice owner can revoke** — even if they later leave the business and the owner objects.

**We refuse to clone a voice whose owner we cannot reach.** No exception, no "I have permission, trust me" path. That refusal is the product's answer to the misuse risk that caused a major open model release to be withdrawn from public distribution shortly after launch in 2025.

### Step 2 — Consent, in the voice owner's own words

The voice owner opens the link on their own phone and sees, in their chosen language:

```
   Salon Ubwiza wants to use your voice

   What this means:
   • Subiza will make a copy of your voice
   • It will answer this business's phone calls using it
   • Every caller will be told they are speaking to an AI
   • Your voice will not be used for anything else
   • You can withdraw this at any time and we will delete it

   Who is asking:  Salon Ubwiza
   Who you are:    Claudine Uwase, +250 78x xxx xxx

   [ I agree ]      [ No ]
```

| | |
|---|---|
| **Does** | Reads. Agrees or declines |
| **System** | Records the consent artefact: who, what for, which business, when, which language it was presented in, the exact wording version, and the device. Declining ends the flow and notifies the owner **without a reason** — the voice owner's reason is their own |

**Consent is separate from the account terms**, presented at the moment it matters, in plain language, in the person's own language, with the revocation right stated **before** they agree rather than buried afterwards.

### Step 3 — Record the samples

| | |
|---|---|
| **Sees** | *"Read this out loud, normally, as if you were greeting a customer."* A short passage of natural business speech in the chosen language, roughly 45 seconds. A live audio-level meter and a quiet-room prompt |
| **Does** | Records. Can re-record |
| **System** | Checks duration, loudness, background noise and single-speaker consistency. Rejects clearly unusable audio *before* the person leaves, not after |
| **Can fail** | Too noisy → guidance and re-record. Too short → prompt to continue. Multiple speakers → re-record |

**Why 30–60 seconds when the technology claims 5–10:** the claimed minimums assume clean, studio-like conditions and English-like phonemes. Real conditions — a phone microphone, a room with people in it, Kinyarwanda phonemes outside the model's training distribution — degrade sharply below roughly 30 seconds. Asking for 45 costs the user nothing and materially improves the result.

### Step 4 — Verification ★

| | |
|---|---|
| **Sees** | *"One last thing, to make sure it's really you."* A **sentence generated fresh for this request**, shown once: *"My name is Claudine and today is Friday the fifth of September."* |
| **Does** | Reads it aloud and records |
| **System** | Checks the recording against the samples for speaker consistency, **and** checks that the spoken content matches the generated sentence. Both must pass |
| **Can fail** | Mismatch → one retry, then a 24-hour cooldown, then a manual review queue in Trust & Safety ([Flow 23](23-admin-trust-safety-and-quality.md)) |

**What this proves and what it does not.** It proves the person was present and actively participating at the moment of consent — that the samples are not a recording of someone else captured without their knowledge. It does **not** prove identity. We are honest about that internally and we do not overclaim externally. Combined with a named consent artefact and unilateral revocation, it is proportionate to the risk.

### Steps 5–7 — Build, preview, approve

| Step | What happens |
|---|---|
| **5. Build** | Voice model built. Progress shown with an honest estimate. The owner can leave and be notified |
| **6. Preview** | Both the owner **and the voice owner** hear the result saying the real greeting, side by side with the original recording |
| **7. Approve** | Owner approves. **The voice owner can veto here** — hearing the clone is different from imagining it, and someone uncomfortable with the result must be able to stop it |

The veto at step 7 is unusual and deliberate. Consent given in the abstract is not the same as consent given after hearing yourself synthesised.

---

## 6. Disclosure, tuning and revocation

### 6.1 Disclosure is not optional

Every call using a cloned voice opens with an audible AI disclosure. This is required **independently of consent**: the EU AI Act's transparency obligation, applying from 2 August 2026, requires synthetic audio resembling a real person to be disclosed audibly regardless of whether the person consented. Consent settles rights; disclosure settles transparency to the listener.

**Subiza never impersonates a named human.** The agent may speak in Claudine's cloned voice and still says it is an assistant. The distance between "Claudine's salon's assistant, using Claudine's voice, announcing that it is an assistant" and "pretending to be Claudine" is the distance between a product and a fraud tool.

### 6.2 Tuning

Three plain controls, phrased as outcomes: **speed** (slower / normal / faster), **warmth** (warm / neutral / formal), **energy** (calm / normal / lively). No technical parameters. Every change previews immediately on the real greeting.

Plus the **pronunciation dictionary** ([Flow 10 §4.5](10-flow-knowledge-base.md)) — which for a cloned Kinyarwanda voice matters even more, because the clone will faithfully reproduce a *mispronunciation* if the underlying model gets a name wrong.

### 6.3 Revocation

| | |
|---|---|
| **Who** | **A3 the voice owner, unilaterally, at any time** — via a permanent link in their consent record, or by contacting Subiza directly. Also the account owner, for their own voice |
| **Effect** | The voice is disabled immediately — within minutes, not at the next billing cycle. The agent falls back to the library voice it had before. The account owner is notified with an explanation |
| **Then** | The voice model and reference audio are scheduled for deletion under a stated SLA; the consent record is retained as evidence that consent existed and was withdrawn |
| **Never** | Blocked, delayed, or made conditional on the account owner's agreement |

Revocation is tested as an acceptance criterion, not assumed to work.

---

## 7. Screens, states, decisions

| Screen | States |
|---|---|
| Voice library | Browsing · previewing · selected · unavailable for language |
| Whose voice | Choosing · own · employee · third party (refused without contact) |
| Consent (voice owner) | Sent · opened · agreed · declined · expired |
| Recording | Instructions · recording · too noisy · too short · accepted |
| Verification | Sentence shown · recording · passed · failed · cooldown · manual review |
| Build | Queued · building · ready · failed |
| Preview & approve | Previewing · approved · vetoed by voice owner |
| Live voice | Active · revoked · fallen back to library |
| Tuning | Adjusting · previewing |

| Decision | Branches |
|---|---|
| Library or clone? | Library (default) · clone |
| Whose voice? | Own · employee → consent link · third party without contact → **refused** |
| Consent given? | Yes → record · No → end, owner notified without reason |
| Verification passed? | Yes → build · No → retry → cooldown → manual review |
| Both parties approve? | Yes → live · Voice owner vetoes → discard |
| Revoked later? | Immediate disable → fall back to library → notify owner |

---

## 8. Platform constraints

| Constraint | Effect |
|---|---|
| **V1 — industry norm is a checkbox** | Rejected. We verify |
| **V2 — voice captcha proves presence, not identity** | Used, and honestly described internally |
| **V3 — 30–60s despite lower technical minimums** | Sample length set by real-world quality, not the spec sheet |
| **V4 — Kinyarwanda unsupported in commercial TTS** | Kinyarwanda voices come from the project's own language programme; the pronunciation dictionary is mandatory |
| **V5 — EU AI Act Art. 50 audible disclosure from 2 Aug 2026** | Non-skippable disclosure, independent of consent |
| **Law 058/2021 Arts. 3(2), 60** | Voice models stored separately, encrypted, access-logged, under stricter controls; **no speaker-verification features until the biometric classification is confirmed in writing** |

---

## 9. Edge cases and failures

| Case | Behaviour |
|---|---|
| Employee consents, then leaves the business | Their consent stands until *they* revoke it. The owner cannot revoke on their behalf, and cannot prevent them revoking |
| Owner tries to clone a celebrity or public figure | Refused at step 1 — no contactable voice owner. Repeated attempts flagged to Trust & Safety |
| Verification repeatedly fails for a legitimate user (accent, poor audio, speech difference) | Manual review with a human, not a permanent block. Accessibility matters here |
| Voice owner cannot read the verification sentence | Alternative: the sentence is played aloud to be repeated |
| Cloned voice sounds poor | Preview before approval; re-record; fall back to library with no penalty |
| Voice owner revokes during a live call | The current call finishes on the existing voice; every subsequent call uses the fallback |
| Owner wants two voices (Kinyarwanda and English) | Supported: one voice per language, each with its own consent if cloned |
| Consent link opened by the wrong person | Bound to the phone number it was sent to; requires the same-device session |

---

## 10. Retention rationale

| Decision | Reason |
|---|---|
| Library voice in activation, cloning deferred | Cloning needs a second person and several minutes; it cannot sit in a ten-minute critical path |
| Preview says their own business name | A moment of delight at almost zero cost |
| Verification rather than a checkbox | In a market where this technology is new, being the platform that checks is a trust asset — and it is the only defensible position under Rwandan law |
| Consent in the voice owner's own language, revocation stated first | Consent that is understood is stronger, ethically and legally |
| Voice-owner veto after preview | Prevents the regret that would otherwise become a complaint or a story |
| Immediate revocation, no conditions | The credibility of the whole consent model rests on revocation actually working |
| Honest handling of Kinyarwanda availability | Quietly substituting a French-accented voice would be discovered by the first caller |

---

## 11. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 11.1 | Library voice selected during activation | Tenants with a voice set at go-live | 100% |
| 11.2 | No voice is ever cloned without a verified consent artefact naming the voice owner | Schema validation + audit | 100% |
| 11.3 | Verification is required and cannot be bypassed | Adversarial test | Pass |
| 11.4 | Verification does not exclude legitimate users | Manual-review resolution in favour | > 95% |
| 11.5 | Revocation disables the voice within 5 minutes | Functional test | Pass |
| 11.6 | Revocation cannot be blocked by the account owner | Permission test | Pass |
| 11.7 | Audible AI disclosure on every call using any voice | Runtime audit of recordings | 100% |
| 11.8 | Third-party cloning without contact is refused | Adversarial test | 100% refused |
| 11.9 | Consent artefact is complete and exportable | Schema validation | Pass |
| 11.10 | Voice models stored separately with stricter access control | Security review | Pass |
| 11.11 | Pronunciation preview reflects the selected voice | Functional test | Pass |

---

## 12. Instrumentation

| Event | Properties |
|---|---|
| `voice.library_previewed` / `selected` | voice, language |
| `voice.clone_initiated` | relationship (self / employee / third party) |
| `voice.consent_requested` / `opened` / `granted` / `declined` / `expired` | language, hours to respond |
| `voice.samples_recorded` | duration, retries, quality flags |
| `voice.verification_attempted` / `passed` / `failed` | attempt, failure reason |
| `voice.verification_manual_review` | outcome |
| `voice.model_built` | duration, success |
| `voice.approved` / `vetoed_by_owner` | — |
| `voice.revoked` | by whom, days live, time to disable |
| `voice.disclosure_played` | per call — a compliance event, not an analytics one |

---

## 13. Open questions

| # | Question | Blocks |
|---|---|---|
| 11.a | Is a voiceprint formally "biometric information" under Art. 3(2)? Written confirmation from NCSA needed | Legal exposure; whether cloning ships in v1 at all |
| 11.b | Is a DPIA formally required before deploying cloning? | Launch readiness |
| 11.c | Will Kinyarwanda voice quality be good enough at launch, or does cloning ship English/French first? | Feature sequencing |
| 11.d | How reliable is speaker verification on Kinyarwanda speech over a phone microphone? | 11.4 |
| 11.e | Should cloning be gated behind a paid tier — both to fund verification and to reduce casual misuse? | Pricing, safety |
| 11.f | What is the right deletion SLA for voice models after revocation, and does the law specify one? | Retention policy |

---

*Next: [12 — Language & Switching](12-flow-language-and-switching.md)*
