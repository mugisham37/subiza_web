# 14 — Flow: Daily Operations — the Inbox

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-14 |
| **Actors** | A5 Owner, A6 Manager, A7 Agent |
| **Entry points** | Home · notification deep link · Conversations · a search |
| **Exit states** | Reviewed · replied · taken over · escalated · marked done |
| **Depends on** | Live traffic, or sandbox conversations |
| **Blocks** | 15, 16 |
| **Frequency** | **Daily — this is the habit loop** |
| **Criticality** | Critical |
| **Target duration** | **Under 2 minutes per session** |

---

## 1. Purpose

Let the owner see what happened, deal with what needs them, and close the app — in under two minutes — while giving them the permanent proof that the AI is doing its job well.

**What breaks if this is wrong:** the daily habit never forms. An owner who does not open the app does not see the value, does not correct mistakes, and does not renew. The Inbox is where trust is either accumulated or lost, one conversation at a time.

---

## 2. The design position

Two decisions distinguish this from every competitor's inbox.

**First: channel is metadata, not structure.** Marie called on Tuesday and messaged on WhatsApp on Thursday. That is one relationship. The teardown found that voice products keep call logs and chat products keep threads, and **nobody unifies them** — the closest competitor keeps a pipeline view but is chat-only, with call transcripts living in a separate monitoring tool with no per-customer rollup. A unified per-customer timeline across voice and chat is unclaimed territory and it is exactly how a shop owner thinks.

**Second: the Inbox is not a to-do list.** Most conversations need nothing. Presenting fifty handled conversations as fifty items to process manufactures work and anxiety. The Inbox leads with **what needs you** — usually two or three items — and summarises the rest.

---

## 3. Overview

```
   NOTIFICATION  ·  or opens the app
        │
        ▼
   ┌────────────────────────────────────────────────┐
   │  HOME                                           │
   │   ⬤ NEEDS YOU (2)      ← the only actionable    │
   │   ✓ HANDLED TODAY (10) ← summary only           │
   │   ▲ THIS WEEK: 31 you would have missed         │
   └───────────────────┬────────────────────────────┘
                       ▼
   ┌────────────────────────────────────────────────┐
   │  CONVERSATION                                   │
   │   who · channel · when · outcome                │
   │   transcript, turn by turn, AI or human         │
   │   "why did it say that?"  per turn              │
   │   what it did: booking · lead · message sent    │
   │   ── CUSTOMER TIMELINE ──                       │
   │   every prior contact, every channel            │
   └───────────────────┬────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        ▼              ▼              ▼              ▼
   Call back      Reply here     Take over      Mark done
   (tap to dial)  (WhatsApp)     (live)         (2 min total)
                                     │
                                     ▼
                              Flow 15 handover
```

---

## 4. Detailed flow

### 4.1 The conversation list

| | |
|---|---|
| **Sees** | A single list, newest first. Each row: who (name if known, otherwise number), a channel icon, time, a one-line summary of what they wanted, and an outcome chip — *Booked* · *Answered* · *Message taken* · *Needs you* · *Escalated* |
| **Does** | Scans. Taps anything interesting |
| **System** | Groups by customer where identity is resolved. Surfaces "needs you" above everything else regardless of recency |
| **Filters** | All · Needs you · Calls · Messages · Escalated · Today |
| **Search** | By name, by number, and **by what was said** — searching transcripts is far more useful than searching contacts, because owners remember "the woman who asked about Saturday" not a phone number |

**The one-line summary is generated, not the first line of the transcript.** "Asked about braid prices and booked for Saturday 10am" is scannable. "Muraho, ndashaka..." is not.

### 4.2 The conversation detail

Five zones, in order of what the owner actually wants:

| Zone | Content |
|---|---|
| **1. What happened** | One line, plus outcome and duration |
| **2. What it did** | Actions taken — booking created, lead captured, WhatsApp follow-up sent — each linked to the record |
| **3. The transcript** | Turn by turn, clearly labelled AI or human, with audio playback per turn for calls |
| **4. Why it said that** | Expandable per AI turn: which price row, which FAQ, which rule. Plus 👍/👎 |
| **5. This customer** | The cross-channel timeline |

**Zone 4 is the trust mechanism.** The teardown found per-answer citation essentially absent across the category. An owner who can see *why* the agent said 5,000 francs — and that it came from row 3 of their own price list — stops worrying that it invents things. And the 👎 path writes a correction straight into the knowledge base ([Flow 10](10-flow-knowledge-base.md)), so review produces improvement rather than just reassurance.

### 4.3 Acting

Four actions, always visible, sized for a thumb:

| Action | What happens |
|---|---|
| **Call back** | Tap-to-dial. The most common action for a voice-first market |
| **Reply here** | Opens a composer on the original channel, with the 24-hour window state shown and free-form composition disabled with an explanation when the window has closed |
| **Take over** | For a live conversation — the AI stops, the human continues ([Flow 15](15-flow-escalation-and-handover.md)) |
| **Mark done** | Removes it from "needs you." Nothing else |

Plus: add a note, tag, and share a transcript link with a colleague.

### 4.4 The customer timeline

```
   MARIE KABERA  ·  +250 78x xxx xxx

   Today 14:22    📞 call      group booking for 8, Saturday   NEEDS YOU
   12 Aug         💬 WhatsApp  asked about opening hours       answered
   28 Jul         📞 call      booked braids                   booked · attended
   14 Jul         📞 call      asked prices                    answered

   3 bookings · first contact 14 July · usually books Saturdays
```

Identity resolution is deliberately conservative: **phone number is the primary key**, which covers voice, WhatsApp and SMS. Instagram and Messenger identities link only when a customer volunteers a number. Weak-signal merging is never automatic, because **a wrong merge exposes one customer's history to another** — a privacy failure far worse than a missing link.

### 4.5 Live conversation monitoring

For calls in progress: a live transcript, the current state (listening / thinking / speaking), and two buttons — **Take over** and **Pause**. Rarely used, but its existence is what makes owners comfortable, and it is the same surface used during activation's test call, so it is already familiar.

---

## 5. Screens, states, decisions

| Screen | States |
|---|---|
| Conversation list | Populated · empty (never blank — sample conversation shown) · filtered · searching · loading |
| Conversation detail | Complete · in progress (live) · failed/incomplete · escalated · awaiting human |
| Transcript turn | AI · human · system event · low confidence · escalation trigger |
| Window state (chat) | Open (with countdown) · closed (free-form disabled, explained) |
| Customer timeline | Resolved · partial · unlinked identities |
| Take over | Available · unavailable (call ended) · in progress |

| Decision | Branches |
|---|---|
| Needs attention? | Escalated · low confidence · explicit request · owner-flagged intent · unresolved |
| Reply channel | Same channel · call back · migrate to WhatsApp when a window is closing |
| Take over? | Live → immediate handover · ended → call back |
| Identity match? | Phone number → merge · weak signal → keep separate |
| 👎 given? | Prompt for the correct answer → write to knowledge |

---

## 6. Platform constraints

| Constraint | Effect |
|---|---|
| **W6 / I2 — 24-hour windows** | Window state shown per conversation with a countdown; free-form composition disabled with an explanation when closed, never a silent send failure |
| **I4 — no Instagram template equivalent** | When an Instagram window is closing on an unresolved conversation, offer to migrate the customer to WhatsApp or SMS |
| **I3 — Human Agent tag must be applied by a human** | Only available when a real person takes over. The product enforces this rather than documenting it |
| **X6 — each platform has its own identity** | Cross-channel identity is ours to build; phone number is the key |
| Low bandwidth (G14) | Transcripts paginate; audio is streamed on demand, never preloaded; list rows are text-only |

---

## 7. Edge cases and failures

| Case | Behaviour |
|---|---|
| No conversations yet | Sample conversation with a clear "this is an example" label, plus a re-test action. **Never a blank screen** |
| A conversation ended badly | Flagged with the reason (caller hung up during a failure, three failed attempts) and surfaced in "needs you" |
| Call recording missing | Transcript still shown; the gap explained rather than shown as a broken player |
| Two staff open the same conversation | Presence indicator; second person sees "Aline is handling this" |
| Owner replies after the window closed | Blocked with an explanation and alternatives, before they type |
| Customer asks to be deleted mid-conversation | Routed to [Flow 19](19-flow-compliance-and-data-rights.md); the request is logged as a rights request, not a support note |
| Very long conversation | Paginated, with a summary at the top |
| Caller ID unavailable (forwarding stripped it) | Shown as "Unknown caller" with whatever the agent learned in-conversation; timeline linking is unavailable and this is stated rather than silently degraded |

---

## 8. Retention rationale

| Decision | Reason |
|---|---|
| "Needs you" first, everything else summarised | Under two minutes a day is achievable; fifty items is not. A product that manufactures work gets closed |
| Generated one-line summaries | Scannable. The whole session depends on being able to triage in one glance |
| "Why did it say that?" | The single strongest trust mechanism available, and largely absent from the category |
| 👎 writes a correction | Turns review into improvement, so time in the Inbox compounds instead of just reassuring |
| Cross-channel timeline | Matches how owners think about customers; unclaimed by competitors |
| Take over always available | The kill switch made concrete. Its presence matters more than its use |
| Sample conversation when empty | Silence reading as "broken" is a real churn cause in the first week |
| Search by what was said | How people actually remember conversations |

---

## 9. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 14.1 | Daily session is short | Median session duration | < 2 min |
| 14.2 | Daily habit forms | Tenants opening the app ≥4 days/week in month 1 | > 50% |
| 14.3 | "Needs you" is accurate | Items marked done with no action taken | < 20% |
| 14.4 | Transcript is always available | Conversations with a viewable transcript | 100% |
| 14.5 | Citations present | AI turns with a "why" trace | 100% |
| 14.6 | 👎 produces a correction | Thumbs-down leading to a knowledge change | > 60% |
| 14.7 | Take over works within 3 seconds | Latency test on a live call | Pass |
| 14.8 | Window state prevents failed sends | Failed sends due to a closed window | ~0 |
| 14.9 | No wrong identity merges | Audit of merged timelines | 0 |
| 14.10 | Loads on 3G | List of 50 conversations | < 3s |
| 14.11 | Empty state is never blank | Screenshot audit | Pass |

---

## 10. Instrumentation

| Event | Properties |
|---|---|
| `inbox.opened` | entry point, needs-you count |
| `inbox.session_ended` | duration, items viewed, actions taken |
| `conversation.viewed` | channel, outcome, from notification? |
| `conversation.trace_expanded` | turn, source type |
| `conversation.feedback` | 👍/👎, correction made? |
| `conversation.action` | call back / reply / take over / mark done |
| `conversation.taken_over` | seconds into the conversation, by whom |
| `inbox.searched` | query type (name / number / content), results |
| `timeline.viewed` | prior contacts, channels spanned |
| `window.send_blocked` | channel, migration offered? |

**Session duration and days-active-per-week are the habit metrics.** They predict retention earlier and more reliably than any satisfaction survey.

---

## 11. Open questions

| # | Question | Blocks |
|---|---|---|
| 14.a | Do owners want to read transcripts, or only outcomes? Transcript-open rate in the pilot will tell us | Detail-screen priority |
| 14.b | Is the cross-channel timeline valued, or an idea we like more than they do? | Feature investment |
| 14.c | How often is "take over" actually used, versus merely reassuring? | Live-monitoring investment |
| 14.d | Should the Inbox be reachable *through WhatsApp* for owners who rarely open the app? | Channel-as-interface (G17) |
| 14.e | What triggers "needs you" beyond escalation — and can it be tuned per business? | Triage quality |

---

*Next: [15 — Escalation & Human Handover](15-flow-escalation-and-handover.md)*
