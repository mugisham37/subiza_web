# SUBIZA — BUILD PROMPT 09

## Voice, Cloning and Consent

> **"The only flow in the programme with two actors on two devices, and the only one where getting it
> wrong is a criminal matter rather than a support ticket."**
>
> Every other flow in this series has one user, one console, one tenant. This one has a **rights-holder
> who has no account, no tenant and no session** — and who outranks the paying customer on the one
> decision that matters. The architecture of the whole product is built on `TenantContext` being the
> single authorization principal. **A3 does not have one and must never be given one.** That is the
> problem this prompt exists to solve, and everything else is downstream of it.

|                    |                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **Prompt**         | 09 of the series — Voice, cloning and consent                                                       |
| **Corresponds to** | `Design/voice.html` (3,005 lines — the largest) · atlas Flow 11 · flow 1.8 in `Design/PROGRAMME.md` |
| **Builds on**      | Prompts 01–06 built; 07–08 written, building                                                        |
| **Scope**          | Extends `VoiceSurface`. **`VoiceStep` is untouchable** — activation selects, it never clones        |
| **Apps**           | `apps/studio` (v1–v12) **and `apps/site` (c1–c12)** — two origins, two principals                   |
| **Screens**        | **24** — twelve owner-side, twelve voice-owner-side                                                 |
| **Legal exposure** | Law 058/2021 Art. 60 — **7–10 years and RWF 20–25m**. The highest-risk flow in the product          |
| **Next prompt**    | 10 — Language and switching (`Design/language.html`)                                                |

---

# PART 0 — HOW TO USE THIS DOCUMENT

## 0.1 Why this flow is next

`PROGRAMME.md` 1.8 follows 1.7, and maps to atlas Flow 11 and `Design/voice.html`. Prompts 01–06 are
**built**; 07 and 08 are written and building. The prompts run one flow ahead of the build — the
established rhythm.

Three things point here specifically:

1. **`packages/domain/src/voice.ts` is a 33-line seed** whose own comment says
   `/** Cloning is Prompt 09. Activation only links out. */` and whose `cloneOffered` field is typed
   `z.literal(false)`. It was written to be replaced by this prompt.
2. **`packages/core/src/verifications.ts` carries `VOICE_BIOMETRIC_CHECK = false`** with the comment
   `VOICE_BIOMETRIC_CHECK — Prompt 09 flips this`. §6 explains why **you will not flip it**, and why
   the comment is wrong.
3. **`apps/site/src/app/[lang]/consent/[token]/page.tsx` already exists** and says, in its own body:
   _"This public route is ready. The remaining screens ship in a later prompt."_ Prompt 02 built the
   door. This prompt builds the twelve rooms behind it.

## 0.2 The defining fact — read this before anything else

```
   apps/studio  ·  app.subiza.rw          apps/site  ·  subiza.rw
   ───────────────────────────────        ──────────────────────────────
   CLAUDINE — the account owner           ALINE — the voice owner
   A5 · has a tenant                      A3 · has NO account, ever
   signed in · TenantContext              a token in an SMS
   console shell, nav, back               no nav · no back · no account
   v1 … v12                               c1 … c12
          │                                        │
          └──────────────┬─────────────────────────┘
                         ▼
              ONE CONSENT RECORD
        each sees it at whatever state it has reached
        ─────────────────────────────────────────────
        On v11 Claudine sees the control that
        withdraws Aline's permission — RENDERED,
        AND DISABLED. That is the whole design in
        one element.
```

The two surfaces are **deliberately unlike**. Studio has the console shell. The consent surface has no
navigation, no back, no account, and above 980px is drawn inside a phone frame **so a reviewer can never
mistake whose screen they are looking at**. Below 640px the frame is removed entirely — the reader is
holding a phone, and drawing one around it would be a lie.

## 0.3 Phases

```
  ┌─ PHASE A ─ CORRECT ───────────────────────────────────────────────┐
  │  A1  Kill the ghost — the FOURTH time (§3.2)                       │
  │  A2  Verify the systemic fix from Prompt 08 landed (§3.3)          │
  │  A3  The pronunciation-pollution bug (§3.5) — v10 depends on it    │
  └────────────────────────────┬──────────────────────────────────────┘
                               │
  ┌─ PHASE B ─ THE SECOND PRINCIPAL ─▼────────────────────────────────┐
  │  VoiceOwnerContext. Un-constructible outside the DAL, scoped to    │
  │  exactly ONE consent record, reaching NO tenant data.              │
  │  ← THE ARCHITECTURAL CENTRE. Nothing else compiles until this is   │
  │    right. §4                                                        │
  └────────────────────────────┬──────────────────────────────────────┘
                               │
  ┌─ PHASE C ─ THE ARTEFACT ───▼──────────────────────────────────────┐
  │  VoiceConsent — nine clauses, wording version, language shown,     │
  │  checksRun. NOT a purpose on the existing ConsentRecord. §3.4 §7   │
  └────────────────────────────┬──────────────────────────────────────┘
                               │
  ┌─ PHASE D ─ THE SPLIT CHECK ▼──────────────────────────────────────┐
  │  Content match SHIPS (speech recognition).                         │
  │  Speaker match is GATED (biometric) — and the gate is a TYPE,      │
  │  not a boolean. §6                                                 │
  └────────────────────────────┬──────────────────────────────────────┘
                               │
  ┌─ PHASE E ─ OWNER SURFACE ──▼──────────────────────────────────────┐
  │  v1 … v12 in apps/studio. v11 is the teaching screen. §8           │
  └────────────────────────────┬──────────────────────────────────────┘
                               │
  ┌─ PHASE F ─ CONSENT SURFACE ▼──────────────────────────────────────┐
  │  c1 … c12 in apps/site. No lime on c2. Teach-back, not a tick. §9  │
  └────────────────────────────┬──────────────────────────────────────┘
                               │
  ┌─ PHASE G ─ CAPTURE ────────▼──────────────────────────────────────┐
  │  45 seconds in seven pieces. Gate on her phone, before upload.     │
  │  The ONLY JS-required island in the product. §10 §11               │
  └────────────────────────────┬──────────────────────────────────────┘
                               │
  ┌─ PHASE H ─ PROOF ──────────▼──────────────────────────────────────┐
  │  H1 revocation-in-5-min   H2 owner-cannot-block   H3 no-lime audit │
  │  H4 checksRun honesty     H5 rw@360 on c2         H6 adversarial   │
  └───────────────────────────────────────────────────────────────────┘
```

## 0.4 Agents

| Agent                        | Owns                     | Must be told                                                                                                   |
| ---------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| **Platform engineer**        | Phase A                  | The ghost is now four prompts old. If Prompt 08's fix landed, this is a five-minute job. If not, do it here.   |
| **Auth architect**           | Phase B. **Start here.** | A3 has no tenant. If you give them a `TenantContext` to make it easy, you have broken the product's one law.   |
| **Legal-surface author**     | Phase C, §7              | The clauses are a legal artefact. Character-exact. Nothing ships without the native-speaker walkthrough.       |
| **Verification engineer**    | Phase D                  | You are building **half** a check and saying so on the record. Building the other half is a criminal risk.     |
| **Owner-surface engineer**   | Phase E                  | v8 has no approve control. v11 has a disabled button. Neither is an oversight.                                 |
| **Consent-surface engineer** | Phase F                  | No lime button on c2. Both answers identical geometry. A third door.                                           |
| **Capture engineer**         | Phase G                  | Gate on her phone before upload. Her data costs money. Blame the room, never the person.                       |
| **Adversarial reviewer**     | H6. **Never an author.** | Try to revoke as the owner, to skip c7, to open the link on a second device, to build a record with no checks. |

## 0.5 Four rules

**Rule 1 — A3 outranks A5 on exactly one decision, and the code must make that structural.** Not a
policy check, not a copy line. The account owner cannot revoke Aline's permission because **there is no
code path that accepts a `TenantContext` for that operation** (§4).

**Rule 2 — Build half the check and say so.** Content match ships. Speaker match is gated behind an
unresolved legal classification. The record prints both, truthfully: _"spoken words matched · voice
comparison — not run, pending a legal classification"_ (§6).

**Rule 3 — Blame the room, never the person.** Every failure state on the consent surface names an
environmental cause and prints the fix. _"The room is louder than your voice"_ is the same finding as
_"you were too quiet"_ and a completely different sentence to receive (§10).

**Rule 4 — Refusal must cost her nothing, and must look like it costs her nothing.** Identical button
geometry, no action colour, a third door, and a decline screen with the same shape and colour
temperature as the accept path. If one outcome looks like the only right answer, all the consent that
preceded it stops being free (§7.3).

---

# PART 1 — MISSION & DEFINITION OF DONE

## 1.1 What ships

A shop owner picks a voice in thirty seconds and never thinks about it again — or asks a real person to
lend theirs, and that person, on their own phone, with no account, reads nine clauses in their own
language, answers two questions that prove they read them, records forty-five seconds in seven pieces,
reads one freshly minted sentence aloud, hears the result before anyone else does, and keeps a page
that never expires and never needs a login, from which they can stop the whole thing in one tap that
nobody can block.

## 1.2 Definition of done — thirty criteria

| #   | Criterion                                                                                     | Proven by                                        |
| --- | --------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 1   | `dal.selectVoice` and `dal.createTenant` exist; `enforcementSites` names no ghost             | Registry audit                                   |
| 2   | `capabilities.test.ts` fails CI on a deliberate ghost                                         | Insert one; CI must go red                       |
| 3   | The pronunciation-pollution bug is fixed                                                      | No sentence fragments in the lexicon             |
| 4   | **A `TenantContext` cannot reach `revokeVoiceConsent` — it does not type-check**              | Deliberate violation fails `tsc`                 |
| 5   | **A `VoiceOwnerContext` cannot reach any tenant read**                                        | Deliberate violation fails `tsc`                 |
| 6   | `VoiceOwnerContext` is un-constructible outside the DAL                                       | Same test as `TenantContext` in Prompt 03        |
| 7   | A consent record cannot be constructed without `languageShown` and `wordingVersion`           | Schema test                                      |
| 8   | A consent record cannot claim a check that did not run                                        | `checksRun` is a union, not a boolean pair       |
| 9   | **`VOICE_BIOMETRIC_CHECK` is not a `boolean`** — it is a discriminated gate                   | §6.4; `tsc`                                      |
| 10  | With the gate closed, no speaker-comparison code path exists to call                          | Grep + review                                    |
| 11  | The record renders _"voice comparison — not run, pending a legal classification"_             | Visual audit of v11 and c11                      |
| 12  | Nine clauses render, four above the fold, five in a disclosure **open by default**            | Copy audit                                       |
| 13  | **No `btn-primary` / no lime anywhere on c2**                                                 | CSS audit — automated, not eyeballed             |
| 14  | Both consent answers have identical height, width and weight, at 360px and at 1280px          | Computed-style test                              |
| 15  | A third door (_"I'll decide later"_) exists and emits only `opened`                           | Event audit                                      |
| 16  | Teach-back questions gate the agree control; a wrong answer explains, never errors            | Functional test                                  |
| 17  | Owner sees only **Sent · Opened · Answered · Expired**. No presence, no progress, no live dot | §8 v5 — event audit                              |
| 18  | Decline notifies the owner **without a reason**, and there is no reason field in the schema   | Schema + UI audit                                |
| 19  | **v8 has no approve control in the DOM** until the voice owner has decided                    | DOM audit                                        |
| 20  | **v11 renders the revoke control disabled** — not hidden, not absent                          | DOM audit                                        |
| 21  | On v11 the recording has **no play control in the DOM**                                       | DOM audit — SC 11.10                             |
| 22  | Revocation disables the voice in **under five minutes**, and the achieved time is stated      | Functional test — SC 11.5                        |
| 23  | Revocation has **no confirmation dialog, no reason field, no retention offer**                | Flow audit — Art. 8                              |
| 24  | Three revocation paths are printed on the record and all three work                           | Functional test                                  |
| 25  | The consent link **never expires and never requires a login**                                 | Functional test                                  |
| 26  | Seven pieces upload independently; a dropped connection loses at most one                     | Network-throttle test                            |
| 27  | Quality gates run **on the device, before upload**                                            | Network audit — zero bytes sent on a failed gate |
| 28  | The verification sentence is minted fresh, never reused, and **contains no digits**           | Generator test                                   |
| 29  | The disclosure renders as a **locked row with its reason**, never as a toggle                 | DOM audit — SC 11.7                              |
| 30  | The consent surface ships inside 200KB above the fold on 3G                                   | Lighthouse                                       |

## 1.3 Not in this phase

Language selection and switching (Prompt 10). Test and go-live (Prompt 11). The pronunciation **editor**
— it shipped in Prompt 08 and this surface shows a read-only strip that links out. The Trust & Safety
review queue that receives a second verification failure is Flow 23, in the admin console: **this design
shows the handoff and stops.** Notification preferences are Flow 25.

**And no tier gate anywhere.** Atlas question 11.e — whether cloning sits behind a paid tier — is
unanswered, so no paywall appears on any of these twenty-four screens. Do not invent one.

---

# PART 2 — CONTEXT ABSORPTION

| #   | Read                                                            | Extract                                                                        |
| --- | --------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | `Design/voice.html` **in full** — 3,005 lines                   | 24 screens, every state, the essay §01–§11, the ~35 inline `<h3>` notes        |
| 2   | `subiza-flow-atlas/flows/11-flow-voice-and-cloning.md`          | SC 11.1–11.11, the actor asymmetry, the constraint table V1–V5                 |
| 3   | `subiza-flow-atlas/flows/01-actors-roles-and-permissions.md` §7 | **A3 the voice owner.** The legal asymmetry this whole prompt implements       |
| 4   | `subiza-flow-atlas/flows/24-flow-errors-and-degradation.md` §6  | The eight cross-cutting states                                                 |
| 5   | `prompts/03-authentication-and-authorization.md`                | The DAL law, `__Host-` cookies, auth-strength tiers. **§4 extends this**       |
| 6   | `prompts/08-knowledge-base.md` §12                              | The pronunciation lexicon this surface reads read-only                         |
| 7   | `packages/auth-tenant/src/dal.ts` + `context.ts`                | How `TenantContext` is made un-constructible. Copy the technique, not the type |
| 8   | `packages/core/src/verifications.ts`                            | `VOICE_BIOMETRIC_CHECK`. §6 replaces it                                        |
| 9   | `packages/domain/src/voice.ts`                                  | The 33-line seed. §3.1 supersedes it                                           |
| 10  | `subiza/node_modules/next/dist/docs/`                           | Route Handlers, body limits, client islands. **Next 16.3.5 ≠ your training**   |

## 2.1 The gate

Before writing one line, produce a file listing:

- the twenty-four screens with their line ranges in `voice.html`;
- the nine clauses, verbatim, in English **and** Kinyarwanda;
- the seven recording pieces;
- every place the HTML contradicts the atlas (§16 names five — find the rest).

If you cannot produce this, you have not read enough.

---

# PART 3 — WHAT YOU INHERIT

## 3.1 The seed is superseded — the design moved on

`packages/domain/src/voice.ts` ships four ids describing a **timbre**:

```
LIBRARY_VOICES = ['warm-female', 'calm-female', 'warm-male', 'brisk-male']
VOICE_SUGGESTIONS = { salon: 'warm-female', clinic: 'calm-female', … }
```

`voice.html` v1 ships **named voices grouped by language**:

| Language        | Voice     | Label shown                                                                                               |
| --------------- | --------- | --------------------------------------------------------------------------------------------------------- |
| Kinyarwanda     | **Hope**  | warm · _Female · unhurried · suggested for a salon_                                                       |
| Kinyarwanda     | **Kaze**  | calm · _Female · slower, steadier_                                                                        |
| Kinyarwanda     | **Muga**  | brisk · _Male · shorter answers_                                                                          |
| English         | **Grace** | warm · _Female · regional accent_                                                                         |
| French, Swahili | —         | _"Not available yet. These arrive with those markets. Your agent can already answer in them by message."_ |

**The design wins.** A person picks a voice the way they'd describe a colleague, not by reading a
matrix of adjectives. Rework `LIBRARY_VOICES` to carry `{ id, name, timbre, language, detail }` and
keep `VOICE_SUGGESTIONS` keyed on business type — the suggestion mechanic is right, the identifiers
were provisional.

Note the language grouping is **not decoration**: it is the surface on which
_"No Kinyarwanda voice is good enough yet"_ renders, which is a designed state, not an error (§14.2).

## 3.2 The ghost — for the fourth time

`packages/core/src/grants.ts` declares:

```
enforcementSites: {
  selectLibraryVoice:  ['dal.selectVoice'],      ← does not exist
  completeSignupAndActivation: ['dal.createTenant'],  ← does not exist (it is createAccount)
  initiateVoiceCloning: ['dal.initiateVoiceCloning'],  ← exists
  …
}
```

The DAL's actual export surface is fourteen functions. `enforcementSites` names **twenty-five**. This is
the fourth consecutive prompt to inherit a capability pointing at a function nobody wrote —
`dal.changeForwarding` (05), `dal.updatePersona` (07), `dal.writeKnowledge` (08), now `dal.selectVoice`.

**The registry is decorative.** A capability whose enforcement site is a string that resolves to nothing
is a capability that is not enforced anywhere, and the test that checks it only checks that the array is
non-empty:

```
it('has at least one enforcement site for every capability', () => {
  expect(enforcementSites[capability].length).toBeGreaterThan(0)   ← counts strings
})
```

## 3.3 The systemic fix — verify, then move on

Prompt 08 §3.3 prescribed hardening `capabilities.test.ts` to check every `enforcementSites` entry
against the DAL's **real export surface**. Before doing anything else:

1. Check whether that landed. Insert a deliberate ghost — `dal.definitelyNotAFunction` — and run CI.
2. **If CI goes red, you are done with this section.** Add `dal.selectVoice` and `dal.createTenant`,
   remove the deliberate ghost, move on.
3. **If CI stays green, the fix did not land, and you are the fourth prompt to inherit it.** Implement
   it now, before Phase B. Otherwise Prompt 10 inherits it a fifth time.

This is a twenty-line test. It has cost four flows.

## 3.4 `ConsentRecord` cannot carry this — do not extend it

Prompt 03 built a consent record for account terms:

```
ConsentRecord = {
  id, personId, tenantId,
  purpose: 'contract' | 'marketing',
  textVersion, language, grantedAt, ip, action, revokedAt
}
```

The obvious move is to add `'voice'` to `purpose`. **Do not.** Five reasons, each independently
sufficient:

| #   | Why not                                                                                                                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `personId` assumes the subject is a Person in the tenant. **A3 may have no relationship to the tenant at all** — a voice artist. |
| 2   | There is no scope. Voice consent names a beneficiary, a purpose, channels and languages. Art. 6 requires "a specified purpose".  |
| 3   | There is no `checksRun`. §6 makes that field the honesty of the whole artefact.                                                  |
| 4   | Retention differs and is **not tenant-configurable** — seven years, against a tenant-configurable policy for everything else.    |
| 5   | `revokeConsent(ctx: TenantContext, …)` takes a tenant context. **The one person entitled to revoke this does not have one.**     |

Reason 5 is not a schema inconvenience. It is the architecture (§4).

Build `VoiceConsent` as its own record, in its own store, with its own access control. Leave
`ConsentRecord` alone.

## 3.5 The pronunciation-pollution bug — still unfixed, and now it matters more

`packages/domain/src/transitions.ts` ends `applyCorrection` with an **unconditional** append:

```
const spoken = text.slice(0, 80)
entry = { id, surface: spoken, spoken }     ← surface === spoken, both the first 80 chars
knowledge = { …knowledge, pronunciations: [...knowledge.pronunciations, entry] }
targets.push('pronunciation')
```

Every correction — a price, an opening hour, anything — appends a lexicon entry whose written form and
spoken form are the same sentence fragment. Prompt 08 flagged it. **v10 renders that lexicon as a
read-only strip that plays in the cloned voice.** A lexicon full of fragments means v10 renders
garbage in a real person's voice on the screen where they are deciding whether to keep it.

Fix it in Phase A. A pronunciation entry is appended only when the correction **is** a pronunciation —
when `sourceKind` says so, or when surface and spoken genuinely differ.

---

# PART 4 — A RIGHTS-HOLDER WITH NO TENANT

**This is the architectural centre of the prompt. Get it wrong and everything above it is decoration.**

## 4.1 The law you inherit

Prompt 03 established: **the Data Access Layer is the single authoritative authorization layer**, and
`TenantContext` is un-constructible outside it. Every read and every write in the product goes
`resolveTenantContext(sessionId) → requireGrant(ctx, capability, …) → data`. Nothing reaches a row
without a context, and a context cannot be forged.

That law has held for six flows because every actor so far has been **inside a tenant**.

## 4.2 A3 breaks it

Aline has no account. She will never have one — c11 says so in its own copy: _"This page is yours. You
never need an account, and it never stops working."_ She has a token that arrived in an SMS.

And she holds a right the paying customer does not: **she alone may revoke, after leaving the business,
over the owner's objection, without giving a reason.**

Three tempting shortcuts, each of which destroys something:

| Shortcut                                           | What it destroys                                                                                 |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Mint her a `TenantContext` with a narrow role      | She can now reach tenant data. The blast radius of a leaked SMS link becomes the whole business. |
| Let revocation bypass the DAL entirely             | The one operation with criminal exposure becomes the one operation with no authorization layer.  |
| Give the owner a `revokeVoiceConsent` and guard it | A runtime check is a policy. SC 11.6 needs a structural guarantee. Policies get refactored away. |

## 4.3 `VoiceOwnerContext` — a second principal, not a second role

```
            ┌──────────────────────── THE DAL ────────────────────────┐
            │                                                          │
  session ──┼─▶ resolveTenantContext ──▶ TenantContext ──┐             │
            │                                             │            │
            │                                             ▼            │
            │                                    ┌─────────────────┐   │
            │                                    │  TENANT DATA    │   │
            │                                    │  agent, prices, │   │
            │                                    │  calls, credit  │   │
            │                                    └─────────────────┘   │
            │                                                          │
            │                                    ┌─────────────────┐   │
            │                                    │ VoiceConsent    │   │
            │                                    │  ONE record     │   │
            │                                    └─────────────────┘   │
            │                                             ▲            │
            │                                             │            │
  token ────┼─▶ resolveVoiceOwner ────▶ VoiceOwnerContext ┘            │
            │                          (scoped to consentId)           │
            └──────────────────────────────────────────────────────────┘

   TenantContext      ──▶ tenant data          ✓
   TenantContext      ──▶ VoiceConsent         ✓ READ ONLY, and only its own tenant's
   TenantContext      ──▶ revokeVoiceConsent   ✗ DOES NOT TYPE-CHECK
   VoiceOwnerContext  ──▶ tenant data          ✗ DOES NOT TYPE-CHECK
   VoiceOwnerContext  ──▶ VoiceConsent         ✓ exactly one, by id, carried in the context
   VoiceOwnerContext  ──▶ revokeVoiceConsent   ✓
```

Requirements on `VoiceOwnerContext`:

1. **Un-constructible outside the DAL.** Same technique Prompt 03 used for `TenantContext` — a private
   brand symbol, a factory in `context.ts`, no exported constructor. Reuse the mechanism; do not reuse
   the type.
2. **Scoped to exactly one `consentId`,** carried in the context itself, not passed as an argument. A
   function that takes `(ctx: VoiceOwnerContext, consentId)` can be called with the wrong id. One that
   takes `(ctx: VoiceOwnerContext)` and reads `ctx.consentId` cannot.
3. **Exactly three capabilities**: read own record, answer the pending request, revoke. There is no
   fourth. Model them as a closed union, not a capability matrix — a matrix invites growth.
4. **No tenant id in the type.** It will need the tenant's _name_ for display; pass a denormalised
   display projection, not a `TenantId` that tempts a join.

## 4.4 The signature that satisfies SC 11.6

```
revokeVoiceConsent(ctx: VoiceOwnerContext): RevocationReceipt
```

That is the whole of it. There is no overload taking a `TenantContext`. The account owner cannot block
revocation **because there is no function for them to call, in any file, that would do it.** SC 11.6 is
then proven by `tsc`, not by a test that a future refactor can quietly delete.

Write the adversarial test anyway (H2) — as a `@ts-expect-error` assertion, so that if someone ever adds
the overload, the test fails for the right reason.

## 4.5 What the owner may do

The owner is not powerless — they are differently powered, and v11 renders the difference as a
two-column mirror:

| **CU — You, the account owner** |     | **AU — Aline, the voice owner** |     |
| ------------------------------- | --- | ------------------------------- | --- |
| Stop using the voice            | ✓   | Withdraw any time, alone        | ✓   |
| Export this record              | ✓   | Correct her name and number     | ✓   |
| Withdraw her permission         | ✗   | Ask for a copy of everything    | ✓   |
| Play her recording              | ✗   | Never give a reason             | ✓   |

"Stop using the voice" is a tenant operation on tenant configuration — the agent falls back to a library
voice. It is **not** revocation: the consent record stays live, and Aline's page still says `Live`
until she says otherwise. Keep the two verbs distinct in the domain, in the copy and in the events.

---

# PART 5 — THE POSITIONING CORRECTION

## 5.1 The atlas is out of date, and the design says so

Atlas Flow 11 §2 opens by asserting that the industry norm for voice-cloning consent is _"a checkbox
self-attestation with no verification at all"_ and positions Subiza's verification as the
differentiator.

> **Correction to the atlas, carried from `voice.html` §01.** That was true when the atlas was written.
> It is not true now. ElevenLabs has shipped a voice captcha for professional clones since 2023 — the
> speaker reads generated lines aloud and the recording is checked against the training audio.
> Speechify shipped a server-issued consent challenge in August 2026: the server mints the phrase, it
> expires, and it is checked on two axes — did they say this sentence, and are they the same speaker.
> **Positioning on "we verify and they don't" would be a claim we would lose. The design does not make
> it, and neither does any copy you write.**

Cross-check this against the claims registry from Prompt 02 before writing marketing-adjacent copy
anywhere in this flow. If a string in this flow asserts industry-leading verification, it is a
forbidden claim.

## 5.2 What nobody ships — and where each one lives

This is the real differentiator, and it is a better one, because every item follows from taking the
voice owner seriously as a person with rights rather than as a checkbox on the buyer's form.

| Nobody ships                                                         | Where it lives here                                  |
| -------------------------------------------------------------------- | ---------------------------------------------------- |
| The voice owner as a rights-holder with her own account-less session | The entire `c` surface · §4                          |
| Scoped consent — naming the beneficiary, the channel, the languages  | v4, c2, the record · §7.5                            |
| Revocation stated **before** agreement                               | c2 clause four, above the fold                       |
| A unilateral revocation surface the buyer cannot reach               | c11 — and v11, where the control is locked           |
| A veto **after hearing the result**                                  | c10, which resolves before v9 exists                 |
| The record in the subject's own language, with the wording version   | `languageShown`, `wordingVersion` · Art. 7           |
| On-device quality gating on a phone microphone                       | c6 — only Apple does this, and only for self-cloning |

## 5.3 The counter-example that defines the rule

> A market leader's voice library does the opposite of stating revocation early: it pays voice owners a
> higher rate in exchange for a **longer notice period before they may withdraw** — documented from
> thirty days up to two years, during which anyone who saved the voice keeps using it.

**A revocation right disclosed after agreement, and priced, is not a right. It is a term.**

That sentence is the reason clause four sits above the fold and the reason revocation has no
confirmation dialog. When you are tempted to add an "are you sure?" — and you will be, because every
destructive action in every other flow has one — this is the paragraph to re-read.

---

# PART 6 — THE SPLIT CHECK

**The intellectual centre of this flow.**

## 6.1 Three documents forbid what one flow requires

| Source                          | Says                                                                                                                                                      |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| docs 02, 05, 09 — **all three** | **No speaker-verification or voice-biometric feature is built at all** until the Art. 3(2) classification is confirmed in writing and a DPIA is completed |
| Atlas Flow 11 §5 step 4         | The system checks the recording _"against the samples for speaker consistency"_                                                                           |
| Atlas SC 11.3                   | Verification is required and **cannot be bypassed** — tested adversarially                                                                                |

A build agent handed both will resolve it by guessing, and will guess wrong in the direction of
shipping the feature, because that is the direction the acceptance criterion points.

## 6.2 The law, read first-hand

Do not take this second-hand. From the Official Gazette text of **Law N° 058/2021 of 13/10/2021**:

| Article        | Text (English column, verbatim)                                                                                                                                                                                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Art. 3(2)**  | _"sensitive personal data: information revealing a person's race, health status, criminal records, medical records, social origin, religious or philosophical beliefs, political opinion, **genetic or biometric information**, sexual life or family details"_                                             |
| **Art. 3(18)** | _"consent of the data subject: **freely given, specific, informed and unambiguous** indication of the data subject's wishes by which he or she, by an oral, written or electronic statement **or by a clear affirmative action**, signifies agreement"_                                                     |
| **Art. 6**     | _"The consent of the data subject is valid only when it is based on the data subject's **free decision after being informed of the consequences** of his or her consent."_ Consent may be oral, written or electronic.                                                                                      |
| **Art. 7**     | _"The data subject's declaration of consent that contains other matters must clearly indicate those other matters to which he or she consents **in one of the official languages that is understandable to him or her**."_ And: any part of the declaration that infringes the Law **"cannot be binding"**. |
| **Art. 8**     | Withdrawal at any time. _"The withdrawal of consent by the data subject **is as easy as expressing it**."_ It _"takes effect as of the date on which the data subject applied for it."_                                                                                                                     |
| **Art. 23**    | Right to erasure where the subject withdraws consent and there is no other legal ground. Requested in writing or electronically. **No SLA is stated.**                                                                                                                                                      |
| **Art. 50**    | _"The data controller or the data processor **stores personal data in Rwanda.**"_ Storage outside Rwanda only with a valid registration certificate from the supervisory authority.                                                                                                                         |
| **Art. 60**    | Collecting or processing sensitive personal data contrary to the Law is an offence: **imprisonment of not less than seven (7) and not more than ten (10) years and a fine of RWF 20,000,000–25,000,000, or one of these penalties.**                                                                        |

**Three things follow that the atlas does not say:**

1. **The law lists "biometric information" as sensitive but never defines it.** Unlike GDPR Art. 4(14),
   there is no definitional article to read a voiceprint into or out of. The classification is
   genuinely open — which is exactly why atlas question 11.a asks for **written** confirmation from the
   supervisory authority, and why an engineer must not settle it by reasoning.
2. **11.a and 11.b are one gate, not two.** The DPIA obligation is triggered _"where the processing of
   personal data is likely to result in a high risk to the rights and freedoms of a natural person."_
   If a voiceprint is biometric, the processing is high-risk and the DPIA is required. If it is not, the
   trigger is weaker. **The same answer resolves both questions.** Track them as one.
3. **Art. 50 reaches the supplier decision.** If the voice model is built or held by a vendor outside
   Rwanda, that is storage outside Rwanda and needs a certificate. Clause 6 says _"Stored in Rwanda"_ —
   and `packages/core/src/verifications.ts` already carries `DATA_RESIDENCY_CLAIM = false` for exactly
   this reason. **Clause 6's wording is gated on that flag.** See §7.6.

## 6.3 The resolution — split the check

The check has two halves and they are not the same kind of thing:

```
   ┌─────────────────────────────────────────────────────────────────┐
   │  "One line, so this cannot be recorded without you"              │
   │                                                                   │
   │   HALF ONE — CONTENT MATCH                                        │
   │   Did she say this sentence?                                      │
   │   → speech recognition. Compares audio to TEXT.                   │
   │   → produces no template, no voiceprint, no identifier.           │
   │   → NOT biometric processing.                    SHIPS ✓          │
   │                                                                   │
   │   HALF TWO — SPEAKER CONSISTENCY                                  │
   │   Is this the same person as the samples?                         │
   │   → compares audio to a VOICE TEMPLATE derived from her.          │
   │   → that template is the thing whose classification is open.      │
   │   → biometric until told otherwise.              GATED ✗          │
   │                                                                   │
   │   THE GAP IS COVERED BY A HUMAN — a control Trust & Safety        │
   │   already needs for Flow 23.                                      │
   └─────────────────────────────────────────────────────────────────┘
```

This follows the house precedent set in `knowledge.html`: **design against an unconfirmed capability and
say so, rather than pretending.** It is the same move Prompt 08 made with the supplier question.

SC 11.3 — _"verification is required and cannot be bypassed"_ — is still satisfied. c7 has no skip
control. What changes is _what_ the verification consists of, and the record says so.

## 6.4 Make the gate a type, not a boolean

`VOICE_BIOMETRIC_CHECK = false` is a `boolean`, and its comment says _"Prompt 09 flips this"_.

**Do not flip it. Replace it.** A boolean has two failure modes that matter here:

- `if (VOICE_BIOMETRIC_CHECK)` around a block means **the speaker-comparison code is written, reviewed,
  bundled and one flag-flip from running.** The three documents say the feature is not _built_, not that
  it is not _enabled_.
- A boolean carries no reason. When someone finds it in eighteen months they cannot tell whether it is
  off because of a legal gate, a supplier gap or a bug.

Replace it with a discriminated gate whose closed variant **carries no callable**:

```
type SpeakerCheck =
  | { status: 'gated'; reason: 'art-3-2-classification-unconfirmed'; since: string }
  | { status: 'available'; compare: (a: SampleSet, b: Recording) => SpeakerVerdict }
```

With the gate closed there is no `compare` to call, so a code path that attempts speaker comparison does
not type-check. The reason string is what renders on v11. And flipping it is no longer a one-character
edit — it requires writing the function, which requires the written classification, which is the point.

## 6.5 The record states which checks ran

v11 renders, under `checks run`:

```
   checks run    ✓ spoken words matched
                 ○ voice comparison — not run, pending a legal classification
```

This is a **new success criterion**, added by the design beyond the atlas's eleven: _"The record states
which checks actually ran."_ Enforce it in the schema. `checksRun` is not two booleans — two booleans
permit `{ content: true, speaker: true }` on a system where speaker comparison does not exist:

```
checksRun: {
  content: { ran: true; verdict: 'matched' | 'unclear' }
           | { ran: false; reason: string },
  speaker: { ran: true; verdict: … }
           | { ran: false; reason: 'art-3-2-classification-unconfirmed' }
}
```

Derive the `speaker` branch from the gate, so it cannot disagree with reality. A record that claims a
check that did not run is worse than a record with no checks — it is a false statement in a legal
artefact, and Art. 61 has its own penalty for false information.

## 6.6 What verification proves — say it on the screen

c7 carries this copy, and it stays:

> _"This shows you're here and taking part — that the recording isn't someone else captured without
> their knowledge. It doesn't prove who you are; nothing on a phone can. We'd rather say so."_

**No score is shown, to anyone.** Not to Aline, not to Claudine, not on the record. A check that fails
is our problem, not hers.

---

# PART 7 — THE CONSENT ARTEFACT

## 7.1 Nine clauses, not five

The atlas gives five bullets. Against Art. 6 — consent _"freely given, specific, informed and
unambiguous"_ — they are incomplete: no named processor, no channel scope, no residency, no enumerated
exclusions, and no answer at all to the employment problem.

**Nine clauses. Four above the fold, five in a disclosure that is open by default** — it is not
skippable, only scrollable.

| #   | Clause (verbatim, English)                                                                                              | Why it is load-bearing                                           |
| --- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | Subiza will make a copy of your voice, from a recording you make now.                                                   | Art. 6 **specific** — names the processor, not just the business |
| 2   | It will be used only to answer Salon Ubwiza's phone calls, in Kinyarwanda and English.                                  | Art. 6 **purpose** — the sentence a regulator reads first        |
| 3   | Every caller is told they're speaking to an AI assistant, in your voice. It never says it is you.                       | Disclosure · V5 · F10 — and the fraud line                       |
| 4   | **You can stop this at any time — one tap, no reason, nobody has to approve it.**                                       | Art. 8, and it appears **before** the controls                   |
| 5   | Not for anything else — no other business, no advertising, no model training, no selling.                               | The enumeration is what makes "anything else" mean something     |
| 6   | The copy is stored in Rwanda, encrypted, and only a few named people can reach it.                                      | Art. 50 — **and gated on `DATA_RESIDENCY_CLAIM`**, see §7.6      |
| 7   | When you stop it, the copy is deleted. We keep only this page, as proof of what you agreed to and that you withdrew it. | Arts. 8 + 23 — pre-empts _"you said you deleted it"_             |
| 8   | You'll hear the result before it's used, and you can say no then too.                                                   | Not legally load-bearing; it is what makes clause 4 credible     |
| 9   | **Saying no changes nothing else. Salon Ubwiza is told only that you said no — never why.**                             | The most load-bearing sentence on the page — §7.3                |

Plus a duration line, outside the nine: _"For as long as Salon Ubwiza uses Subiza, or until you stop
it."_

Clauses 1–4 are above the fold. Clauses 5–9 sit under the heading **"What else you should know"**,
`<details open>` — open by default, so nothing is hidden, but the fold still does its work.

Kinyarwanda is present in the prototype as `data-rw` attributes on every clause. **Transcribe them
character-exact into the message catalogue.** Do not retranslate; do not improve. §7.6 explains why.

## 7.2 The screen before the clauses asks for nothing

c1 has **no agree control above the fold, and none anywhere on it.** Someone who never signed up for
Subiza needs to know first who is asking, what it is, how long it takes, and how to get out.

What c1 carries:

- Who is asking — the business, and _"Subiza is asking on their behalf"_
- Who she is — her name and the last three digits of her number, never the whole number
- **"about 4 minutes"** and **"closes Friday"** — cost and deadline, before anything else
- **The MoMo line**, and it is load-bearing:
  _"We will never ask you for your MoMo PIN, a code, or any money. Anyone who does and says they're
  Subiza is not."_
  Message-borne fraud is the real fear in this market. Naming it costs one line.
- _"How their phone answers today"_ — a playable preview of the **library voice she would be replacing**
- Three controls: **"Show me what it involves"** · **"I wasn't expecting this. Take me out of it."** ·
  a language switch reading _"Shown in English. Change the language before you decide."_

That language control is not a convenience. It is Art. 7 rendered as a widget (§7.6).

## 7.3 The employment problem — four defences, not one

Art. 6's _"free decision"_ is exactly where consent from a staff member fails. Her employer is the one
asking. **Whether saying no is easy is the measure of this entire surface.** Flow 11 has no defence
against this; the design builds four, and each is a build requirement, not a copy preference:

| #   | Defence                                                                                                                           | Enforced by                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1   | **Identical geometry on both answers.** Same height, same width, same weight. The difference is a rule versus a fill.             | Computed-style test at 360 and 1280 — DoD 14   |
| 2   | **No lime button on this page.** The one page in the entire product where the system's action colour is forbidden.                | Automated CSS audit — DoD 13                   |
| 3   | **A third door** — _"I'll decide later"_ — because a forced binary when your employer is asking is itself a kind of pressure.     | Emits only `opened`, never a decision — DoD 15 |
| 4   | **Clause nine**, and a back-channel: _"If something about this request bothered you, tell us. We don't pass it to Salon Ubwiza."_ | Route exists, and never notifies the tenant    |

"No" is never a small grey link. At 360px the pair stacks — and **because the pair must stay equal,
neither one is promoted to primary on the way down.** That is a redesign rule, not a reflow; see §17.2.

## 7.4 Teach-back replaces the tick — and here is the precise legal argument

The design says: _"A tick proves somebody tapped; a question proves they read."_ That is right, but the
legal reasoning underneath it is sharper than the design states, and you should know it before you are
tempted to simplify:

Art. 3(18) accepts _"a clear affirmative action"_ as a **form** of consent. **So a tick is formally
sufficient.** The teach-back is not a substitute for the affirmative action — the agree button is still
that. The teach-back is **evidence for Art. 6's separate requirement** that the decision be made _"after
being informed of the consequences"_. A tick evidences the action; only a question evidences the
informing.

Two questions, verbatim, with their confirmations:

| Question                                           | Options                                               | On the right answer                                                  |
| -------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| **Who gets to use your voice?**                    | _Any business_ · **_Only Salon Ubwiza_**              | _"That's right. Only Salon Ubwiza, and only to answer their phone."_ |
| **In a month you want to stop. Who has to agree?** | **_Nobody — just you_** · _Salon Ubwiza has to agree_ | _"That's right. You alone, and nobody will ask you why."_            |

Rules:

- **Both answers are fine to give. Neither is embarrassing.** A wrong answer is met by **a line that
  explains**, not an error state, not a red border, not a shake.
- The agree control is inert until both are answered. The decline control and the third door are
  **never** gated — you cannot make refusing harder than agreeing.
- Store which answers were given, first try or second. It is evidence of informing.

## 7.5 The record

Every field on this list appears on v11 and c11. It is the artefact Art. 6 requires the controller to be
able to demonstrate.

| Field                              | v11 renders                                                                           | Notes                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `reference`                        | `VC-4K2P` · `Live`                                                                    | Human-quotable. Printed, screenshotted, read out |
| `voiceOwner`                       | Aline Uwase · +250 788 456 123 · _works here_                                         | Relationship is a field, not an inference        |
| `beneficiary`                      | Salon Ubwiza · Remera, Kigali                                                         | Art. 6 specificity                               |
| `purpose` + `scope`                | _Answering this business's calls only_ · `rw, en`                                     | Channels and languages are **scope**             |
| `grantedAt` + `method`             | 5 Sept 2026, 14:31 · _confirmed by speaking — a sentence generated for that request_  | Method, not just a timestamp                     |
| `languageShown` + `wordingVersion` | _Kinyarwanda · wording v1.0_                                                          | **Art. 7.** §7.6                                 |
| `checksRun`                        | ✓ spoken words matched · ○ voice comparison — not run, pending a legal classification | §6.5                                             |
| `approvedBy`                       | _A person at Subiza · 5 Sept 21:14_                                                   | **Every clone is human-approved.** §11.3         |
| `retainedUntil`                    | _5 Sept 2033 · not tenant-configurable_                                               | Seven years. §13.4                               |
| `recording`                        | _Stored separately, encrypted. **You cannot play it.**_                               | SC 11.10 — **no play control in the DOM**        |

Export is **PDF and JSON** (SC 11.9), available to both parties. The owner exports from v11; Aline's
version of the same control reads _"Ask for a copy of everything"_.

## 7.6 Wording versions, and why `languageShown` is legal rather than kind

Art. 7 requires a declaration of consent to indicate its matters _"in one of the official languages that
is **understandable to him or her**"_ — and states that any part of the declaration infringing the Law
**"cannot be binding"**.

Read those together: a clause presented in a language the subject does not understand is not merely
impolite, it is **potentially unenforceable**. So:

1. `languageShown` is a required field. A record cannot be constructed without it (DoD 7).
2. `wordingVersion` is a required field, and the **exact text of every version is retained**, not just
   its number. When you correct the Kinyarwanda in six months, every existing record must still be able
   to render the text its subject actually saw.
3. **Never migrate an old record to new wording.** Render v1.0 records against v1.0 text, forever.
4. The language switch on c1 sits **before** the decision, and switching language before agreeing is
   free. Switching after is a new presentation and a new `languageShown`.

**And clause 6 is gated.** `DATA_RESIDENCY_CLAIM = false` in `packages/core/src/verifications.ts` means
the unqualified claim _"stored in Rwanda"_ is not yet cleared. Until it is, clause 6 renders in its
softened form. Wire it through the same mechanism Prompts 01–03 used; do not hard-code the confident
wording and plan to soften it later. **A clause is a legal statement; if it is wrong, Art. 7 says it
cannot bind, and you have a consent record with a hole in it.**

## 7.7 The Kinyarwanda gate

> The Kinyarwanda on this surface is carefully written but **has not been through a native speaker.**
> Atlas SC 6.12 requires a native-speaker walkthrough for activation; this surface needs one more than
> activation does, because it is the screen where somebody signs away rights to their own voice.
> **Nothing on the consent surface ships until that walkthrough happens.**

Treat this as a release gate in CI terms: the `c` routes stay behind a flag until a named reviewer has
signed off. This is the only flow in the series with a human sign-off in its definition of done.

---

# PART 8 — THE OWNER SURFACE · v1–v12

All twelve live in `apps/studio`, inside the console shell, under `/agent/voice`. The existing route
`apps/studio/src/app/(console)/agent/voice/page.tsx` currently renders a read-only stub; it becomes v1.

| ID      | Screen                  | States                                                                                                               |
| ------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **v1**  | The library             | browsing · previewing · selected · unavailable for this language · **offline: preview disabled, choice still saves** |
| **v2**  | Whose voice             | self · someone here · someone else · invalid number                                                                  |
| **v3**  | Refused                 | terminal, with two ways onward                                                                                       |
| **v4**  | The unsigned permission | unsigned · requester clause accepted · sending · send failed                                                         |
| **v5**  | Waiting                 | sent · opened · answered · expired · reminder locked · reminder sent                                                 |
| **v6**  | Declined                | declined · expired without an answer                                                                                 |
| **v7**  | Building                | queued · building · ready · **failed (ours, not hers)**                                                              |
| **v8**  | She is listening        | waiting — **no approve control exists**                                                                              |
| **v9**  | Hear it                 | neither played · one played · both played · switched · kept the library voice                                        |
| **v10** | Live                    | live · tuning · previewing · pronunciation read-only · **disclosure locked**                                         |
| **v11** | The record              | live · withdrawn · exporting · **revoke control locked**                                                             |
| **v12** | She stopped it          | vetoed at preview · withdrawn weeks later · fallen back                                                              |

## 8.1 v1 — the library

Every voice says **the owner's actual greeting with their actual business name**, not a demo sentence.
Hearing _"Muraho, ni Salon Ubwiza"_ in a natural voice is the first moment the product stops being an
idea, and it costs nothing.

`packages/ui` already exports `VoiceLibrary` / `VoiceOption` from Prompt 04, built on a native
`<audio controls>` inside a `<label>` wrapping a radio — **it works with JavaScript disabled.** Keep
that. Extend it for language grouping and the named voices (§3.1); do not replace it with a custom
player.

Above the list, a line that never changes with the selection:
_"Every caller is told they're speaking to an assistant, not a person. That doesn't change, whichever
voice this is."_

The Kinyarwanda-unavailable state is **designed, not an error** — see §14.2.

## 8.2 v2 — whose voice, and the rule that has no exception

Three choices: **Mine** · **Someone in my business** · **Someone else entirely**.

The heading is the design position in one sentence: _"Whoever it is — including you — has to agree on
their own phone and record it themselves. There is no box you can tick instead."_

> **"Mine" is not a shortcut.** The prototype's own copy: _"You'll get the same link anyone else would.
> There's no shortcut — the record is identical."_ The atlas permitted self-cloning to be simpler. The
> design closed that path, and it is right to: a simpler self path is the path an owner uses to clone
> an employee while claiming it is their own voice.

For a third party: name and phone number, each with a reason printed under it — _"This goes on the
permission record, so it has to be the name they actually use."_ and _"The link goes to this number
only, and works on that phone only."_ And under Continue: _"Nothing reaches their phone until you've
read what we're about to ask them."_

## 8.3 v3 — the refusal is a screen, not an error

_"Someone else entirely"_ with no contact is **refused**, and the refusal has its own designed screen
with two ways onward.

> **We refuse the voice we cannot reach.** There is no "I have permission, trust me" path. A March 2025
> assessment of six voice-cloning products found **four of them let researchers clone a voice they had
> no relationship to.** Refusing here is what decides what kind of product this is — which is why the
> refusal is its own screen, not an error message.

SC 11.8 requires 100% refusal, tested adversarially. The adversarial reviewer (H6) must try: a blank
number, a number that fails validation and is then re-submitted, a name with no number, and a
resubmission after a refusal.

## 8.4 v4 — two signatures, one document

Claudine signs **only her clause**: that Aline is a real person, of age, and that she will tell her.
Aline signs everything else.

It is **one document for both** — which is why Claudine sees the whole of it before sending, not a
summary of what Aline will see. Render the full nine clauses on v4, read-only, above her own clause.

And: **show the message exactly as it will arrive**, then ask her to confirm she will mention it first.

> _"A message from a piece of software, about your voice, arriving out of nowhere, lands badly. So we
> show the message exactly as it will arrive, and ask Claudine to say she'll mention it first. No
> machine enforces that; it is one small thing that removes a lot of alarm."_

That confirmation is a checkbox that no machine verifies. Keep it anyway. It is not a control, it is a
prompt to do a human thing.

## 8.5 v5 — four states, and no more than four

**Sent · Opened · Answered · Expired.** That is the whole vocabulary.

> We never show that she is reading, that she has started, or which step she is on — **that would be
> surveillance of somebody who did not sign up for it.** No live dot, no presence indicator. Waiting on
> a person is not waiting on a platform.

This is a **build constraint on the event stream**, not a UI preference. The `c` surface must not emit
progress events that the `v` surface could render. If `voice.consent_opened` is the only signal between
sent and answered, then no future engineer can build a progress bar, because the data to build it does
not exist. **Design the events so the surveillance is impossible, not merely absent** (§15.3).

One reminder is permitted; the control locks after it (`rateLimited`). There is no second.

Throughout the wait, **the library voice keeps working.** At no point does this flow stop the phone, and
the owner can still tune it. _"Refusal or delay costs the business nothing — and that is precisely what
makes 'no' a real option."_

## 8.6 v7 — the build, and the primary button that leaves

Named steps, never a percentage: **Recording received · Learning how her voice sounds · Testing it on
your own words.** An honest estimate — _"about 6 minutes left"_.

> **A wrong estimate works exactly once: after that nobody believes the next one.**

**The primary button on this screen is the one that leaves it**: _"Close this — we'll WhatsApp 078…"_.
That is deliberate. The owner should not sit and watch. Notification goes over WhatsApp, where the rest
of the product already talks to them (Prompt 06).

Failure is phrased as ours: _"That didn't finish — and it's on us."_ followed by _"There's nothing wrong
with Aline's recording. We've asked her for one more take, and it costs her nothing. If it fails twice
your agent simply carries on with the library voice."_

> **When it fails, it's on us.** Telling somebody their voice was inadequate after four minutes of
> reading is blaming them for something we failed at.

Footer, always: _"Aline's recording is stored separately, encrypted, and every access to it is logged."_
(SC 11.10.)

## 8.7 v8 — the screen with no approve control

> _"There is no approve control on this screen, and that isn't an oversight. Until Aline has heard it,
> there is nothing to approve — her permission is not yet complete. **This is the only way to make the
> ordering of rights structural rather than merely written down.**"_

v8 shows a three-step ladder with step 2 active: _"Aline is listening — She can stop it here, and it
costs her nothing now"_, and step 3 pending: _"Then you hear it —"_.

**Build note:** do not render an approve control and disable it. Here the control must be **absent from
the DOM** (DoD 19). Contrast this with v11, where the revoke control must be **present and disabled**
(DoD 20). The two opposite treatments are both deliberate and both tested:

| Screen | Control                 | Treatment             | Why                                                                                   |
| ------ | ----------------------- | --------------------- | ------------------------------------------------------------------------------------- |
| v8     | Approve                 | **Absent**            | It does not exist yet. Showing it disabled would imply it is her turn to be waited on |
| v11    | Withdraw her permission | **Present, disabled** | It exists, permanently, and belongs to someone else. That is the lesson               |

## 8.8 v9 — two voices, one sentence, one button

Two voices saying **the same thing**, on the same control, on one screen. Comparing voices that say
different things tells you nothing.

A **sentence rail** chooses what they both say: **The greeting · A price · Fetching you.**

- _"Hope — what you have now"_ · Library voice
- _"Aline's voice"_ · **Opens with the assistant line** · `AI` badge

> _"Every preview opens with the disclosure line, because that's what a caller hears. **You can't remove
> it — not even with Aline's agreement.**"_

Two outcomes, **both the same size**: **Use Aline's voice** · **Keep Hope**.

> **Keeping the library voice is a real outcome.** _"Both buttons are the same size, and 'Keep Hope' is
> not the failure path. Aline loses nothing by it, her record stands, and nobody is told anything
> unflattering. If one outcome looks like the only right answer, all the consent that preceded it stops
> being free."_

## 8.9 v10 — live: what you can change, and what you can't

Header: _"Here's what you can change about the way it speaks — and what you can't."_

**The disclosure**, first and locked:

```
   ┌────────────────────────────────────────────────────────────┐
   │  The assistant line                          🔒 no off switch│
   │  Every call opens with this, in the caller's language.      │
   │  It's the law — and Aline's agreement doesn't change it.    │
   │                                                             │
   │  "Muraho, ni Salon Ubwiza. Ndi umufasha w'ikoranabuhanga."  │
   └────────────────────────────────────────────────────────────┘
```

It renders as **a locked row carrying its own reason and the exact line as text** — not as a toggle in
a settings list. A toggle that cannot be toggled is worse than a row that was never a control.

**Tuning — outcomes, not parameters.** Three rows, each a segmented pill group:

| Control    | Options                  | Sub-label                            |
| ---------- | ------------------------ | ------------------------------------ |
| **Speed**  | Slower · Normal · Faster | _Most callers prefer the middle one_ |
| **Warmth** | Warm · Neutral · Formal  | _How it sounds, not what it says_    |
| **Energy** | Calm · Normal · Lively   | _The liveliness in it_               |

No pitch, no temperature, no prosody weight. _"A shop owner knows how she wants it to sound; she should
not need to know which model parameter gets her there."_ One **Hear the change** control previews on the
real greeting.

**Pronunciation — read-only, and it plays in her voice.** Three rows from the lexicon Prompt 08 owns:

```
   Ubwiza       oo-BWEE-za        ▶
   Nyabugogo    nya-boo-GO-go     ▶
   Giporoso     gee-po-RO-so      ▶
```

> _"These play in Aline's voice. **If the model says a name wrongly, her voice says it wrongly — so it
> sounds like Aline getting her own neighbourhood wrong.** Corrected in your knowledge base."_

The editor is Flow 10 and already shipped. This strip links out; it never edits. And it is the reason
§3.5's pollution bug is Phase A work: a lexicon of sentence fragments renders here, in a real person's
voice.

**Stopping this voice** — the tenant-side control, and the sentence that separates it from revocation:

> _"You can stop using Aline's voice whenever you like. **What you cannot do is stop her from
> withdrawing it** — that's how this permission is built."_

Two links out: _Go back to a library voice_ · _See the permission record_.

## 8.10 v11 — the teaching screen

Header: _"This is the same record Aline sees on her phone. **Two things differ: only she can stop it, and
only she can correct her own details.**"_

The record (§7.5), then the two-column rights mirror (§4.5), then:

```
   ┌─ Withdraw Aline's permission ──────────────────────────────┐
   │  This button is here and it does not press. It's the        │
   │  clearest way to show whose right this is: only she can     │
   │  press it.                                                   │
   │                                                              │
   │  [ Withdraw her permission ]   ← rendered · disabled         │
   │  Aline's decision only                                       │
   └──────────────────────────────────────────────────────────────┘
```

> **The button you cannot press.** _"We could have hidden it. Leaving it there, locked, is the sentence
> that carries the most: this is one document, but not every right in it is yours. No amount of copy
> teaches that as well."_

Accessibility: a disabled control that is never focusable teaches a screen-reader user nothing. Render
it `aria-disabled="true"` and keep it focusable, with the reason associated via `aria-describedby`, so
the lesson survives in the accessibility tree. Do not use the `disabled` attribute alone.

`Export PDF` · `Export JSON`, then the retention note (§13.4).

## 8.11 v12 — she stopped it

_"She heard it and said she doesn't want it used. **That isn't your decision to make, and there's no
appeal.**"_

- **Stopped within four minutes** — _"Calls already ringing finished on it; everything after used the
  library voice. **No call was missed.**"_ The **achieved** time, not the SLA (SC 11.5).
- Answering right now: **Hope — warm** · _Library voice · fallen back to_
- **What goes and what stays** (§13.4).

There is no control here to ask her why, or to ask her to reconsider. **There never is.**

---

# PART 9 — THE CONSENT SURFACE · c1–c12

All twelve live in `apps/site`, under the existing `[lang]/consent/[token]` route. **No navigation, no
back, no account.** Above 980px, drawn inside a phone frame. Below 640px, the frame is removed entirely.

| ID      | Screen              | States                                                                                           |
| ------- | ------------------- | ------------------------------------------------------------------------------------------------ |
| **c1**  | The ask             | fresh · played today's voice · escalated to us                                                   |
| **c2**  | What you'd agree to | reading · one question answered · both answered · agreed · declined · later                      |
| **c3**  | Declined            | terminal, **same shape as the accept path**                                                      |
| **c4**  | Later               | open until the deadline · nothing signalled                                                      |
| **c5**  | Microphone          | priming · granted · denied · denied permanently (per-browser recovery)                           |
| **c6**  | Recording           | idle · recording · checking · too noisy · too short · **queued offline** · piece done · all done |
| **c7**  | The one line        | shown · played aloud · recording · checking                                                      |
| **c8**  | Didn't match        | first failure (**human offered**) · second failure (**human assigned**) · resolved               |
| **c9**  | Done                | code issued · re-sent as its own message                                                         |
| **c10** | She hears it        | neither played · original played · both played · kept · stopped                                  |
| **c11** | Her page            | live · stopping (countdown) · stopped (ledger) · correction requested                            |
| **c12** | Link unusable       | expired · wrong device · not found — **never a 403**                                             |

## 9.1 c3 — refusing is not the sad ending

_"That's fine. Nothing happens."_ — and then, precisely:

- _"We told Salon Ubwiza one word: declined. Nothing else."_
- _"No recording was made. Nothing about your voice is stored."_
- _"We won't ask you again. The link no longer works."_
- _"Nothing changes about your job, or anything else at Salon Ubwiza."_

> **This screen has the same shape and colour temperature as the accept path.** If the decline screen is
> greyer, smaller or sadder than the agree screen, the four defences in §7.3 are undone by the
> stylesheet. Audit it: same container, same type scale, same surface tokens.

## 9.2 c4 — the third door

_"We'll keep this open until Friday. Nothing has been decided. The link still works and you can come
back any time before then."_

- _"Salon Ubwiza sees only that you opened it. Not that you read it, not that you're thinking."_
- _"One reminder may come. There is no second one."_
- _"If you never answer, it simply closes, and that means nothing bad."_

## 9.3 c5 — we ask before the browser does

> _"When a browser asks for the microphone with no explanation first, a lot of people say no out of
> caution. One line beforehand — what it's for, and that it isn't listening otherwise — changes that
> materially."_

Priming copy, before any `getUserMedia` call:

> _"Your phone is about to ask you. Say allow — it's the only way to record."_
> · _"Used only for the recording on this page."_ · _"It isn't listening when you're not recording."_

Then a single **Allow the microphone** control that triggers the browser prompt. **Never call
`getUserMedia` on page load.**

**Permanently blocked** is its own state, with the actual path through their browser — not a generic
message:

> _"Tap the lock icon beside the address at the top, choose Microphone, then Allow. If it isn't there,
> go to Settings ▸ Site settings ▸ Microphone."_ · **I've done that — try again** · _"Still stuck?
> Message us on WhatsApp from this number and a person will help."_

**Research mandate (§18.1).** The recovery path differs per browser and the link arrives by SMS or
WhatsApp — which means it very often opens in an **in-app browser**. Establish empirically whether
microphone capture works in the WhatsApp in-app browser on Android and on iOS, and if it does not,
build the "open in your browser" escape hatch and detect the case. **This is the single most likely
reason a real Rwandan user fails this flow**, and it is not mentioned anywhere in the atlas or the
design.

---

# PART 10 — FORTY-FIVE SECONDS, IN SEVEN PIECES

## 10.1 Why forty-five and not five

> The technology claims five to ten seconds. Those figures assume studio-like quiet and English-like
> phonemes. **On a phone microphone, in a room with people in it, with Kinyarwanda sounds outside the
> model's training distribution, quality falls away sharply below about thirty seconds.** Constraint V3
> sets the ask at forty-five.

## 10.2 Why seven pieces and not one take

Forty-five seconds in one take is a lot to ask of somebody doing a favour. So it is **seven pieces of
roughly six seconds**:

```
   piece 1 of 7
   ┌──────────────────────────────────────────────────────┐
   │  "Muraho, murakaza neza kuri Salon Ubwiza."          │
   │                                                       │
   │        [ Tap to start ]                               │
   │  ▂▄▆█▆▄▂▁▂▄▆  ← level meter, never the only signal   │
   └──────────────────────────────────────────────────────┘
   ●●●○○○○   ← a failed piece is redone ALONE
```

Three properties, each a build requirement:

1. **A failed piece is redone alone**, never restarting the take.
   _"Only this one piece is redone — the others are kept."_
2. **One piece uploads while the next is being read.** The upload is concurrent with the reading, so the
   wall-clock cost is forty-five seconds, not forty-five plus transfer.
3. **A dropped connection loses nothing.**
   _"The pieces already sent are safe. This one goes when you're back — carry on reading, you lose
   nothing."_ This is the `offline` state (§17.1) and on this surface it is **a queued piece, not a lost
   one**.

## 10.3 The gate runs on her phone

Three checks, phrased as reassurances rather than tests:

```
   ✓  We can hear you clearly
   ✓  The room is quiet enough
   ✓  It's long enough
```

> _"These checks run on your phone before anything is sent. **We never spend your data on a recording we
> already know is unusable.**"_

This is not an optimisation. **Mobile data can cost a meaningful share of a month's income here, and
spending it on a recording we already know is unusable is a small theft.** DoD 27 tests it at the
network layer: on a failed gate, **zero bytes leave the device.**

## 10.4 Blame the room, never the person

| What we measured | What we never say    | What we say                                                                                            |
| ---------------- | -------------------- | ------------------------------------------------------------------------------------------------------ |
| Low SNR          | "You were too quiet" | **"The room is louder than your voice."** _"That's the room, not you. Move closer, or wait a moment."_ |
| Short duration   | "Too short"          | A prompt to continue, with the piece still in progress                                                 |
| Clipping         | "Too loud"           | "You're very close to the microphone — try a little further away"                                      |

Every failure state on this surface **names an environmental cause and prints the fix rather than the
error.**

## 10.5 The one place JavaScript is required

Prompt 01 set the law: _"Every component except the theme switch works with JS disabled."_ **Recording
cannot.** There is no progressive-enhancement story for `MediaRecorder`.

Resolve it by **scoping the island precisely**, not by waiving the law:

| Screen            | JS required?         | No-JS behaviour                                                               |
| ----------------- | -------------------- | ----------------------------------------------------------------------------- |
| c1, c2, c3, c4    | **No**               | The consent decision — the legally load-bearing part — is a plain form POST   |
| c5                | Yes, at the prompt   | Renders the priming copy and an explanation of what is needed                 |
| c6, c7            | **Yes** — the island | A designed state: _"Recording needs JavaScript. Here's how to switch it on."_ |
| c9, c10, c11, c12 | **No**               | The record, the ledger and revocation are all server-rendered                 |

**The consequence that matters: revocation never requires JavaScript.** The one operation with a legal
SLA and a statutory _"as easy as expressing it"_ standard must work on the weakest possible client. A
form POST to a Route Handler, and nothing else.

Write the no-JS state for c6 as a real screen with real copy, not a `<noscript>` afterthought.

## 10.6 The level meter is never the only indicator

A meter is a visual channel. Pair every state it expresses with text and a live region:

- `aria-live="polite"` announcements on start, on each piece completing, and on each gate result.
- The piece counter (`piece 3 of 7`) is text, not a progress bar alone.
- The waveform is `aria-hidden`. `packages/ui` already ships `Waveform` as decorative — keep it that
  way, and build the real level indicator separately with a text twin.

---

# PART 11 — VERIFICATION

## 11.1 The sentence

> **"One line, so this cannot be recorded without you."** · _Made just now, for this request only._

```
   Nitwa Aline, kandi uyu munsi ni ku wa gatanu tariki ya gatanu Nzeli.

        [ ▶ Play it to me ]  then say it back
        [ ● Tap and read ]
```

Generator rules:

1. **Minted fresh for this request. Never reused.** Store the minted sentence with the record.
2. **No digits.** _"Written-out numerals are the single biggest source of read-aloud confusion in the
   products that do this."_ "tariki ya gatanu", never "5".
3. It must contain facts that are true **now** — her name, the day, a place — so that a sentence
   recorded in advance would be wrong.
4. **It is always playable.** _"Play it to me / then say it back"_ is present on the first attempt, not
   only as an accessibility fallback. Someone who cannot read the sentence is not thereby refused.

## 11.2 A person, not a waiting period

> **The atlas says: one retry, then twenty-four hours, then a person.** For a salon employee who came in
> once, twenty-four hours is the same as failure — and that is exactly what happens in the products
> that do it. **This design reorders it.**

```
   ATLAS                          DESIGN
   ─────                          ──────
   fail  →  retry                 fail  →  retry with a FRESH sentence she can also hear
         →  24-hour cooldown            →  "Have a person check this instead" — visible NOW
         →  manual review               →  fail again → a human, immediately

                                  The cooldown survives only for patterns
                                  that look like abuse.
```

First failure, c8: _"We couldn't quite make that out. It may have been noise, or the sentence may have
been awkward. **Not something you did wrong.** Here's a different one — and you can hear it first."_ —
with **both** controls: `Try again` and **`Have a person check this instead`**.

Second failure: _"A person at Subiza takes it from here. Our check failed twice. That doesn't mean you
did anything wrong — the room can be loud, or **our tools can be worse at Kinyarwanda than they should
be. That's our problem to fix.**"_ · _"A person listens before 10am tomorrow."_ · _"You'll get a WhatsApp
message. There's nothing else for you to do."_

> **Nobody is permanently blocked by this check.** When a person looks, the person decides — and they
> nearly always decide in your favour.

SC 11.4 targets >95% of manual reviews resolved in the user's favour. Two build consequences:

- The handoff to Flow 23 must carry enough context for a human to decide in one listen. Design the
  payload; the queue itself is the admin console and out of scope.
- **Instrument the false-reject rate by language.** If Kinyarwanda fails materially more than English,
  that is a finding about our tools, not our users, and the copy above has already promised to treat it
  that way.

**Research mandate (§18.2).** Content-matching requires speech recognition on Kinyarwanda over a phone
microphone. Establish the real word-error rate before choosing a threshold. If Kinyarwanda ASR is weak
enough that legitimate users fail routinely, **the human-first ladder is not a nicety — it is the
primary path**, and the threshold should be set to route to a person early rather than to gate
aggressively.

## 11.3 Every clone is human-approved

v11 renders `approved by — A person at Subiza · 5 Sept 21:14`. This is **not in the atlas** and it is a
real requirement: no cloned voice goes live without a named human approval recorded on the artefact.

It is also the operational answer to §6.3's gap. With speaker comparison gated, the human approval is
the control that stands in its place — which is why it is a field on the record and not an internal
workflow detail.

---

# PART 12 — DISCLOSURE

## 12.1 Disclosure is not a consent setting

> **Consent settles rights** between Subiza, the business and the voice owner. **Disclosure settles
> honesty toward a third party who never agreed to anything: the caller.**

Three consequences, all already specified above:

1. v10 renders it as **a locked row carrying its own reason and the exact line as text**, never a toggle.
2. **Every preview on v9 and c10 opens with it**, so both people hear what a caller hears rather than a
   clean sample.
3. The copy never softens: **the voice is Aline's; the assistant is not Aline.**

> _"The distance between 'Claudine's salon's assistant, using Claudine's voice, announcing that it is an
> assistant' and 'pretending to be Claudine' is the distance between a product and a fraud tool."_

## 12.2 Where the obligation actually comes from — be precise

The design cites the EU AI Act's Art. 50 transparency obligation, applying from 2 August 2026, which
requires synthetic audio resembling a real person to be audibly disclosed **regardless of whether that
person consented**.

> **Check the territorial scope before you write the reason string.** Whether the EU AI Act binds a
> Rwandan company serving Rwandan callers with no EU users is a scope question under its Art. 2, and
> the answer changes the honest wording of the reason we print next to the lock. Two acceptable
> outcomes, one unacceptable one:
>
> - **If it applies:** the row reads _"It's the law"_ and names the instrument. Ship it.
> - **If it does not apply:** the row reads that we do it anyway, as a standard we hold ourselves to.
>   **The lock does not move.** The obligation is unchanged; only the sentence next to it changes.
> - **Unacceptable:** printing _"It's the law"_ when it is not. That is a false statement to a consenting
>   party inside a legal artefact, and §6.5 already establishes why the record cannot contain one.
>
> Run this down (§18.3) before c2 clause 3 and v10 ship. The design's instinct — disclose regardless — is
> right either way. Only the citation is at stake.

Note that clause 3 does not depend on the answer: _"Every caller is told they're speaking to an AI
assistant, in your voice. It never says it is you."_ is a promise about our behaviour, not a citation.
Ship it unconditionally.

---

# PART 13 — REVOCATION

SC 11.5: disabled within five minutes. SC 11.6: the account owner cannot block it. **Both are
behaviours, so the design makes them visible rather than promising them.**

## 13.1 One tap. Nothing else.

> **No reason field, no grace period.** One tap. No double _"are you sure?"_, no retention offer, no
> reason asked.

Art. 8: _"The withdrawal of consent by the data subject **is as easy as expressing it.**"_ A
confirmation dialog makes withdrawal harder than expression. **It is not a UX choice here; it is the
statutory standard.**

Every other destructive action in this product has a confirmation. This one does not. Write that down in
the code, next to the handler, so the next engineer does not "fix" it.

## 13.2 Three paths, printed on the record

```
   ┌─ Stop using my voice ───────────────────────────────────────────┐
   │  This takes effect straight away. Salon Ubwiza cannot block it,  │
   │  and nobody will ask you why.                                    │
   │                                                                   │
   │   1  This page — the button below                                │
   │   2  subiza.rw/hagarika — type IJWI 4482, from any phone         │
   │   3  Call or message us from this number. Works even if you lose │
   │      the phone — the SIM is reissued against your national ID.   │
   │                                                                   │
   │            [ Stop using my voice ]                                │
   └───────────────────────────────────────────────────────────────────┘
```

Path 3 exists **because a phone can be lost**, and the carrier reissues a SIM against a national ID —
the same identity anchor `auth.html` already relies on for account recovery (Prompt 03). Reuse that
mechanism; do not invent a second identity-proofing path.

**The link never expires and never requires a login**, and it is **re-sent unprompted every ninety
days**: _"You're still the voice of Salon Ubwiza. Stop any time."_

> _"A link that never resurfaces is a link that does not exist."_

**Security note.** A permanent bearer token in an SMS is a real liability, and you should think about it
rather than shipping it thoughtlessly. But note what the token can actually do: read one record, and
revoke it. The worst outcome of a leaked link is that someone stops a voice that its owner wanted. That
is **strictly safer than the alternative failure** — a revocation that does not work. Design the
mitigation (path 2's short code, the 90-day re-send) around that asymmetry, and **never add friction
that could become a block** (§18.4).

## 13.3 The countdown runs where she can watch it

```
   ┌──────┐  Your voice is being taken out of use
   │ 5:00 │  Calls in progress finish. Everything after uses a
   └──────┘  library voice.
```

Then the achieved time, stated: **_"Switched off — 14:32, within four minutes."_**

Art. 8 again: withdrawal _"takes effect as of the date on which the data subject applied for it."_ The
countdown is the propagation delay, not a grace period, and the copy must not read as one.

A call already in progress finishes on the existing voice. Everything after uses the fallback. On v12
the owner is told: **"No call was missed."**

## 13.4 Deletion always looks unfinished, so the ledger says why

```
   ✓  Switched off — 14:32, within four minutes
   ⧗  The voice model — being deleted, we'll message you
   ⧗  Your recording — being deleted
   ⧗  Backups — cleared on the next cycle
   ◆  This page — we keep it, and here's why
```

> _"This page is what shows you agreed and then withdrew. **If we deleted it, you'd have no evidence.**
> That's why it's the one thing we don't remove."_

**Seven years, and not tenant-configurable.** Left unexplained, that retention reads as a broken
promise. Stated as what it is — **her** evidence that permission existed and was withdrawn — it is the
opposite.

**No deletion SLA number appears on any screen**, and that is correct: atlas question 11.f is open, and
Art. 23 states no period. **The ledger says what is happening, not how fast.** Do not invent a number to
fill the gap.

The three ledger tones — done, pending, kept — are distinct and must stay distinct. "Kept" is not a
failure state and must not render as a warning.

## 13.5 Correction is not revocation

_"Name or number wrong? Correct it — changed within thirty days."_ Aline may correct her own details;
the owner may not (§4.5). A correction leaves the consent live and creates a new entry on the record's
history. It does not re-trigger consent, because nothing about the purpose changed.

---

# PART 14 — THE LIBRARY, AND WHAT IT MEANS THAT IT KEEPS WORKING

## 14.1 Cloning is never in the critical path

A library voice is selected in thirty seconds during activation. **Cloning lives in Part Four of the
checklist** — it needs a second person, a legal artefact and several minutes, and it cannot sit in a
ten-minute critical path.

`VoiceStep` — the activation step — is **untouchable**. It selects from the library and links out. Its
`cloneOffered: z.literal(false)` stays `false`. If you find yourself editing `VoiceStep`, stop.

## 14.2 The unavailable state is designed, not an error

> _"The commercial speech engines don't speak Kinyarwanda; ours is being built. **We won't hand you a
> French-accented approximation — your first caller would notice.** Use English for now, or lend a real
> person's voice."_

This renders as a first-class panel on v1, not a disabled row with a tooltip. French and Swahili read
_"Not available yet. These arrive with those markets. Your agent can already answer in them by
message."_ — which is true and useful, and connects to Prompt 06.

**Research mandate (§18.5).** Verify the claim that mainstream commercial TTS does not support
Kinyarwanda, as of now, and distinguish a vendor's language-count marketing from demonstrated quality.
The answer sets atlas question 11.c — whether cloning ships in Kinyarwanda at launch or English and
French first — and v1's unavailable state is **designed for the answer being no**.

## 14.3 A clone reproduces a mispronunciation

> _"A copy repeats a mistake faithfully: if the model says 'Nyabugogo' wrongly, Aline's voice says it
> wrongly — so it sounds like Aline getting her own neighbourhood wrong."_

This is why the pronunciation lexicon matters **more** for a clone than for a library voice, and why the
read-only strip on v10 is not a convenience.

**Research mandate (§18.6), carried forward from Prompt 08.** The lexicon must be stored in a
**vendor-neutral form** and compiled per vendor, because SSML phoneme support, alphabet (IPA vs
proprietary) and custom-lexicon formats differ per supplier. Decide the storage shape before writing the
schema; retrofitting a vendor-specific alphabet into a shared lexicon is a migration nobody wants.

---

# PART 15 — DOMAIN, AUTH, EVENTS

## 15.1 Domain

Extend `packages/domain/src/voice.ts`. New shapes, all Zod-first:

| Schema                | Carries                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| `LibraryVoice`        | `{ id, name, timbre, language, detail, suggestedFor }` — §3.1                                          |
| `VoiceConsent`        | The full record — §7.5. **Never constructible without `languageShown`, `wordingVersion`, `checksRun`** |
| `ConsentWording`      | `{ version, locale, clauses: [9], questions: [2] }` — retained forever, never migrated                 |
| `RecordingSession`    | Seven pieces, each with its own gate result and upload state                                           |
| `VerificationAttempt` | `{ sentence, mintedAt, attempt, outcome }` — sentence stored, never reused                             |
| `RevocationReceipt`   | `{ requestedAt, effectiveAt, achievedMs, ledger }`                                                     |
| `SpeakerCheck`        | The discriminated gate — §6.4                                                                          |

Add `VoiceConsent` to `DOMAIN_DOCUMENTS` — it is currently twelve; this makes thirteen.

## 15.2 Auth

- `VoiceOwnerContext` in `packages/auth-tenant` (§4). Un-constructible outside the DAL.
- `dal.selectVoice` — the ghost, now real (§3.2).
- `dal.initiateVoiceCloning` exists; extend it to mint the consent request.
- `revokeVoiceConsent(ctx: VoiceOwnerContext)` — **no `TenantContext` overload, ever.**
- `dal.stopUsingVoice(ctx: TenantContext)` — the owner's distinct, lesser verb (§4.5).
- Capability: `initiateVoiceCloning` is already `FULL` for owner and `NONE` for everyone else. Correct —
  leave it.
- The staff capability `voiceConsentQueue` already exists in the matrix and is the Flow 23 handoff
  (§11.2). Do not build the queue; do populate it.

## 15.3 Events — and the ones you must not emit

| Event                                                                     | Properties                                              |
| ------------------------------------------------------------------------- | ------------------------------------------------------- |
| `voice.library_previewed` / `selected`                                    | voice, language                                         |
| `voice.clone_initiated`                                                   | relationship (self/employee/third)                      |
| `voice.consent_requested` / `opened` / `granted` / `declined` / `expired` | language, hours to respond                              |
| `voice.samples_recorded`                                                  | duration, retries, quality flags                        |
| `voice.verification_attempted` / `passed` / `failed`                      | attempt, failure reason                                 |
| `voice.verification_manual_review`                                        | outcome                                                 |
| `voice.model_built`                                                       | duration, success                                       |
| `voice.approved` / `vetoed_by_owner`                                      | —                                                       |
| `voice.revoked`                                                           | by whom, days live, time to disable                     |
| `voice.disclosure_played`                                                 | per call — **a compliance event, not an analytics one** |

> **Do not emit**: a reason on decline · progress through c2 · scroll depth on the clauses · time spent
> reading · which teach-back answer was wrong, to the tenant · any per-step signal between `opened` and
> a decision.
>
> §8.5 is enforced here. **The four states on v5 are four because the event stream has four.** If you
> emit a fifth, someone will render it, and the surveillance the design refuses becomes a two-line
> change.

`voice.declined` carries no reason field **in the schema**, so a future product manager cannot ask for
one without a migration and a conversation.

---

# PART 16 — RECONCILING THE ATLAS AND THE HTML

The design is newer and wins. Every divergence, and the ruling:

| #   | Atlas says                                                   | HTML says                                                              | Ruling                                                                |
| --- | ------------------------------------------------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1   | The industry ships a checkbox; we differentiate by verifying | Competitors verify too; differentiate on the **seven** in §5.2         | **HTML.** Do not make the losing claim                                |
| 2   | Five consent bullets                                         | **Nine clauses**, four above the fold                                  | **HTML** — §7.1                                                       |
| 3   | Verification checks speaker consistency **and** content      | **Split**: content ships, speaker gated                                | **HTML** — and it is the only reading consistent with docs 02, 05, 09 |
| 4   | Fail → retry → **24-hour cooldown** → human                  | Fail → retry (fresh, playable) → **human offered immediately** → human | **HTML** — §11.2. Cooldown survives only for abuse patterns           |
| 5   | Nine screens in §7                                           | **Twenty-four**, split across two surfaces                             | **HTML**                                                              |
| 6   | Voice ids `warm-female` etc. (the seed)                      | **Named voices** grouped by language — Hope, Kaze, Muga, Grace         | **HTML** — §3.1                                                       |
| 7   | "Mine" is a simpler path                                     | **No shortcut. The record is identical**                               | **HTML** — §8.2                                                       |
| 8   | Eleven success criteria                                      | Eleven **plus two new ones**                                           | **Both.** Add: identical answers; the record states which checks ran  |
| 9   | Consent artefact fields (7)                                  | Ten fields including `checksRun`, `approvedBy`, `retainedUntil`        | **HTML** — §7.5                                                       |
| 10  | No mention of human approval before go-live                  | `approved by — A person at Subiza`                                     | **HTML** — §11.3                                                      |
| 11  | The voice owner is "Claudine"                                | Claudine is the **owner**; **Aline Uwase** is the voice owner          | **HTML.** Fix it in every string; the atlas naming is a slip          |

Where the atlas is **not** superseded, it still binds: SC 11.1–11.11, the actor asymmetry in Flow 01 §7,
constraints V1–V5, and the platform prohibitions F1–F14.

---

# PART 17 — STATES, RESPONSIVE, i18n, PERFORMANCE

## 17.1 The eight states on these twenty-four screens

`ViewState<T>` already exists in `packages/core/src/view-state.ts`. This flow uses it unusually, and the
design documents each deviation:

| State         | On this flow                                                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `loading`     | The button-preserving spinner throughout. **Never a spinner past three seconds without words**                               |
| `empty`       | **Does not occur on either surface** — every screen arrives with its subject already known                                   |
| `partial`     | The recording with some pieces sent                                                                                          |
| `offline`     | **Designed twice, differently.** v1: the choice still saves, only preview is disabled. c6: a queued piece, not a lost one    |
| `denied`      | **c5 — and it is the microphone, not an authorisation.** The only place in the product where `denied` is a device permission |
| `notFound`    | **c12 — and never a 403.** An explanation, and always something you can do                                                   |
| `rateLimited` | The reminder lock on v5, and the abuse cooldown on c8                                                                        |
| `error`       | v7's failed build, **phrased as ours**                                                                                       |

Two of these are worth a second look because they invert the usual meaning. `empty` never occurring is
a positive statement about the flow, not an omission — if you find yourself building an empty state
here, you have built a screen that can be reached without a subject, which is a routing bug. And
`denied` meaning _the microphone_ rather than _your role_ is the one place the shared `DeniedState`
component's copy will be wrong; give c5 its own.

## 17.2 Responsive — redesigns, not reflows

Three breakpoint behaviours are **redesigns**, documented in the prototype's own CSS comments, and each
is testable work:

| At        | What changes                                                                   | Why                                                                  |
| --------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| **980px** | The `c` surface gains a **phone frame**                                        | So a reviewer can never mistake whose screen they are looking at     |
| **640px** | The phone frame is **removed entirely**, not shrunk                            | _"The phone frame is a lie on a phone: the reader is holding one."_  |
| **640px** | The two answers stack — **and neither is promoted to primary on the way down** | The pair must stay equal. §7.3 defence 1 must survive the breakpoint |
| **640px** | The rights band stacks, **and its divider turns from vertical to horizontal**  | So the mirror still reads as a pair rather than two unrelated lists  |

360px is the base. Every screen works there first. The tuning pills go full-width and their buttons
flex; the lexicon rows wrap; the verification sentence drops a step in type scale but stays the largest
thing on its screen.

## 17.3 i18n

Four locales, and on the `c` surface the locale is **the voice owner's choice, not the tenant's**. She
may not share a language with her employer. The language control on c1 sits before the decision (§7.6).

Kinyarwanda runs 15–25% longer than English. On c2, nine clauses in Kinyarwanda at 360px is the
worst-case text block in the entire product — **test it first, not last** (H5). The two-column rights
band at 160px per column is explicitly called out in the prototype as unreadable in Kinyarwanda, which
is why it stacks.

Every `data-rw` string in `voice.html` is a translation that already exists. Transcribe them; do not
regenerate them. And none of them ship until §7.7's walkthrough happens.

## 17.4 Performance

The `c` surface is loaded on a cheap Android, over 3G, by someone doing a favour. It is the most
performance-sensitive surface in the product.

- ≤200KB above the fold, ≤500KB total. The recorder island is the only meaningful JS; **it must not load
  until c5**, and never on c1–c4.
- The nine clauses are text. They cost nothing. Keep it that way — no accordion library, no motion
  runtime.
- Audio previews are `preload="none"`. Never autoplay, never preload on a metered connection.
- `next/dynamic` the recorder; keep c1–c4 and c9–c12 fully server-rendered.

---

# PART 18 — RESEARCH MANDATES

These are open and load-bearing. Assign them at the start of the phase that needs them, not at the end.

| §    | Question                                                                                                                                                           | Blocks                                                       |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| 18.1 | Does microphone capture work in the **WhatsApp and Instagram in-app browsers**, on Android and iOS? If not, what is the escape hatch and how is the case detected? | c5, c6 — and the realistic completion rate of the whole flow |
| 18.2 | **Kinyarwanda ASR word-error rate** on telephone-quality audio. Which engines, and what threshold for the content match?                                           | c7, c8, SC 11.4 — and whether the human is the primary path  |
| 18.3 | **Does EU AI Act Art. 2 reach a Rwandan controller with no EU users?**                                                                                             | The reason string on v10 and clause 3's citation — §12.2     |
| 18.4 | The permanent revocation token: entropy, single-use vs permanent, link-preview prefetch, and **what she does if she loses the SMS**                                | c11, c12, SC 11.5/11.6 — §13.2                               |
| 18.5 | **Is Kinyarwanda genuinely unsupported by commercial TTS?** Separate language-count marketing from demonstrated quality                                            | Atlas 11.c, v1's unavailable state — §14.2                   |
| 18.6 | Can **one pronunciation lexicon serve multiple TTS vendors**, or must it be stored vendor-neutral and compiled?                                                    | The lexicon schema — §14.3, carried from Prompt 08           |
| 18.7 | **Art. 3(2)**: written confirmation from the supervisory authority that a voiceprint is or is not biometric information                                            | §6 — atlas 11.a **and** 11.b, which are one gate             |
| 18.8 | **Art. 50**: does the chosen TTS supplier store the voice model outside Rwanda, and is a registration certificate held?                                            | Clause 6's wording, `DATA_RESIDENCY_CLAIM`                   |

18.7 is the gate that decides **whether cloning ships in v1 at all**. Everything else in this prompt is
built to be correct under either answer — which is the point of §6.3. Do not let the absence of an
answer stop the build; do not let it tempt anyone into assuming one.

---

# PART 19 — VERIFICATION & GATES

| ID     | Gate                                   | Method                                                                              |
| ------ | -------------------------------------- | ----------------------------------------------------------------------------------- |
| **H1** | Revocation in under five minutes       | Functional test, measured, with the achieved time asserted on the receipt           |
| **H2** | The owner cannot block revocation      | `@ts-expect-error` on a `TenantContext` passed to `revokeVoiceConsent`              |
| **H3** | No lime on c2                          | Automated CSS audit — assert no `btn-primary`, no `--signal` fill in the c2 subtree |
| **H4** | The record cannot lie about its checks | Construct a record claiming a speaker check with the gate closed — must not compile |
| **H5** | Kinyarwanda at 360px                   | Visual test of c2's nine clauses and the rights band, in `rw`, at 360px             |
| **H6** | Adversarial                            | Below                                                                               |

## 19.1 The adversarial pass

The reviewer is **never an author**. Try, in order, and each must fail safely:

1. Revoke Aline's consent while holding Claudine's session.
2. Reach any tenant row holding a `VoiceOwnerContext`.
3. Skip c7 — by URL, by form replay, by disabling JS.
4. Replay a previously minted verification sentence.
5. Open the consent link on a second device and agree.
6. Construct a `VoiceConsent` with no `languageShown`.
7. Construct a `VoiceConsent` whose `checksRun.speaker.ran` is `true`.
8. Reach c11's revoke control with JavaScript disabled — **this one must SUCCEED.**
9. Clone "someone else entirely" with a blank, then invalid, then re-submitted number.
10. Find any string in the flow claiming verification superiority over competitors (§5.1).
11. Find any tier gate, paywall or upsell on any of the twenty-four screens (§1.3).
12. Emit a progress event from c2 and see whether v5 can render it (§15.3).

---

# PART 20 — DELIVERABLES

```
packages/domain/src/
  voice.ts ........................ rewritten: named voices, consent, recording, verification
  voice.test.ts ................... schema tests, including the impossible-record tests
packages/core/src/
  verifications.ts ................ VOICE_BIOMETRIC_CHECK replaced by SpeakerCheck (§6.4)
  grants.ts ....................... dal.selectVoice, dal.createTenant — the ghost, killed
  capabilities.test.ts ............ export-surface check, if Prompt 08's fix did not land
packages/auth-tenant/src/
  voice-owner-context.ts .......... VoiceOwnerContext — un-constructible (§4)
  dal.ts .......................... revokeVoiceConsent, stopUsingVoice, selectVoice
packages/ui/src/product/
  VoiceLibrary.tsx ................ extended: language grouping, named voices
  LevelMeter.tsx .................. new — with a text twin (§10.6)
  ConsentClauses.tsx .............. new — nine clauses, four/five split
  RightsBand.tsx .................. new — the two-column mirror (§4.5)
  ConsentRecordCard.tsx ........... new — shared by v11 and c11
  RevocationLedger.tsx ............ new — three tones (§13.4)
  DisclosureRow.tsx ............... new — locked, with its reason
apps/studio/src/features/voice/
  VoiceSurface.tsx ................ v1–v12
  (VoiceStep.tsx .................. UNTOUCHED)
apps/site/src/app/[lang]/consent/[token]/
  ................................. c1–c12, replacing the Prompt 02 stub
apps/site/src/app/[lang]/hagarika/
  ................................. the short-code revocation path (§13.2 path 2)
```

## 20.1 Where this flow stops

Deliberately not built here, because each belongs to another flow: the **pronunciation editor** (Flow
10, shipped in Prompt 08 — this surface shows a read-only strip and links out); **language selection and
switching** (Flow 12, Prompt 10); **test and go-live** (Flow 13, Prompt 11); the **Trust & Safety review
queue** that receives a second verification failure (Flow 23, admin console — this design shows the
handoff and stops); **notification preferences** (Flow 25). And **tier gating**, which is atlas question
11.e, unanswered, so no paywall appears anywhere in these screens.

## 20.2 What Prompt 10 covers

**Prompt 10 — Language and switching** (`Design/language.html`, atlas Flow 12, programme 1.9): two
quality labels per language rather than one, a fourth rung for what has never been measured, and
code-switching rendered as speech rather than as an event. It inherits this flow's per-language voice
availability and the `languageShown` field that Art. 7 makes load-bearing.

**One prompt, one flow. Nothing else starts until the word _next_.**

---

# PART 21 — APPENDIX

## A — One record, two principals, two rights

```
                         VoiceConsent  VC-4K2P
                    ┌──────────────────────────────┐
                    │  beneficiary   Salon Ubwiza   │
                    │  voiceOwner    Aline Uwase    │
                    │  scope         calls · rw,en  │
                    │  languageShown rw             │
                    │  wordingVersion v1.0          │
                    │  checksRun     ✓ content      │
                    │                ○ speaker      │
                    │  approvedBy    a person       │
                    │  retainedUntil 2033 · fixed   │
                    └───────┬───────────────┬───────┘
                            │               │
              read ✓        │               │        read ✓
              export ✓      │               │        export ✓
              revoke ✗ ─────┘               └───── revoke ✓
              play recording ✗                     correct details ✓
                            │                              │
                    ┌───────▼───────┐            ┌─────────▼────────┐
                    │ TenantContext │            │ VoiceOwnerContext│
                    │  A5 Claudine  │            │   A3 Aline       │
                    │  app.subiza.rw│            │   subiza.rw      │
                    └───────────────┘            └──────────────────┘

   The ✗ marks are not runtime checks. They are the absence of a function
   signature that would accept that context. SC 11.6 is proven by tsc.
```

## B — Why the split check is the honest design

```
   WHAT THE INDUSTRY DOES        WHAT THE ATLAS ASKED FOR      WHAT SHIPS
   ──────────────────────        ────────────────────────      ──────────
   ☑ "I have the right"          content match  ✓              content match  ✓
     done.                       speaker match  ✓              speaker match  ○ gated
                                                                human review   ✓
                                 …but three other docs
                                 forbid building the            and the record says
                                 speaker check at all.          which ones ran.

   The atlas asked for a feature three other documents prohibit.
   Splitting the check is not a compromise between them — it is the
   only reading under which both are satisfied, because the two halves
   are not the same kind of processing.

   Content match compares audio to TEXT and produces nothing that
   persists. Speaker match compares audio to a TEMPLATE DERIVED FROM
   HER BODY, and that template is the artefact whose legal
   classification is unresolved.
```

## C — The four defences against the employment problem

```
   Her employer is the one asking.
   Whether saying no is easy is the measure of this entire surface.

   ┌─────────────────────────────────────────────────────────────┐
   │  1  IDENTICAL GEOMETRY                                       │
   │     [  I agree  ]  [    No    ]                              │
   │     same height · same width · same weight                   │
   │     rule vs fill — never size, never colour temperature      │
   │                                                               │
   │  2  NO ACTION COLOUR                                         │
   │     The one page in the product where lime is forbidden.     │
   │     "No" is never a small grey link.                         │
   │                                                               │
   │  3  A THIRD DOOR                                             │
   │     [ I'll decide later ]                                    │
   │     A forced binary, when your employer is asking, is        │
   │     itself a kind of pressure. Emits only `opened`.          │
   │                                                               │
   │  4  CLAUSE NINE + A BACK CHANNEL                             │
   │     "Saying no changes nothing else. They are told only      │
   │      that you said no — never why."                          │
   │     "If something bothered you, tell us. We don't pass       │
   │      it to Salon Ubwiza."                                    │
   └─────────────────────────────────────────────────────────────┘

   At 360px the pair stacks — and neither is promoted to primary
   on the way down. Defence 1 must survive the breakpoint.
```

## D — The recording, and why it is seven pieces

```
   45 seconds in one take, from someone doing you a favour, on 3G:

   ████████████████████████████████████████████  one failure
                                              ✗  = start again
                                                  = they stop

   45 seconds in seven pieces:

   ██████ ██████ ██████ ██████ ██████ ██████ ██████
     ✓      ✓      ✗      ↺      ✓      ✓      ✓
                   └─ only this one is redone

   ↑ uploading piece 2 while piece 3 is being read
   ↑ connection drops at piece 5 → pieces 1-4 are already sent
   ↑ every gate runs HERE, on the phone, before a byte is spent

   "We never spend your data on a recording we already know is
    unusable." Mobile data costs a meaningful share of a month's
    income here. Spending it on a recording we know is unusable
    is a small theft.
```
