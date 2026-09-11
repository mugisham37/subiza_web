# 18 — Flow: Team & Permissions

*Part of the [Subiza Flow Atlas](../README.md)*

---

| | |
|---|---|
| **Flow ID** | F-18 |
| **Actor** | A5 Owner (invites) · A6 Manager (limited) · A7 Agent, A8 Viewer (accept) |
| **Entry points** | Settings → Team · Home checklist · during escalation setup |
| **Exit states** | Member active · invitation pending · declined · removed |
| **Depends on** | 05 |
| **Blocks** | Escalation routing to anyone but the owner |
| **Frequency** | Rare |
| **Criticality** | Important |

---

## 1. Purpose

Let a business bring its staff into Subiza so escalations reach the right person, work is shared, and nobody sees more than they should.

**What breaks if this is wrong:** either escalations pile up on one overloaded owner, or a staff member sees customer data or billing they should not. And — the quieter failure — a staff member who experiences Subiza as a threat quietly routes around it.

---

## 2. The design position

**Most tenants will have one person.** Rwanda's business population is 80.7% micro-enterprises of 1–3 employees. Team management must therefore be genuinely optional, entirely absent from the critical path, and trivially simple when used.

**But the escalation design depends on it.** The moment a business has a second person, escalation routing ([Flow 15](15-flow-escalation-and-handover.md)) becomes far more useful. So Team is offered at exactly one natural moment: when the owner sets up escalation and realises they are the only target.

**And the receiving human's experience is the real design problem.** A7 the staff member is the actor most able to kill adoption from inside. If Subiza makes Aline's job feel diminished, she will stop trusting it. Every screen she sees must make her more effective, not more supervised.

---

## 3. Overview

```
   SETTINGS ▸ TEAM
        │
        ▼
   ┌─────────────────────────────────────────────────┐
   │  Claudine Uwase        Owner        you          │
   │  Aline M.              Agent        active       │
   │  +250 78x xxx xxx      Agent        invited      │
   │                                                  │
   │  [ + Invite someone ]                            │
   └────────────────────┬────────────────────────────┘
                        ▼
   ┌─────────────────────────────────────────────────┐
   │  INVITE                                          │
   │  Phone number                                    │
   │  What can they do?                               │
   │    ○ Answer customers        (Agent)             │
   │    ○ Answer + change settings (Manager)          │
   │    ○ See reports only        (Viewer)            │
   │  Get escalations?  ☑  When?  [ business hours ▾ ]│
   └────────────────────┬────────────────────────────┘
                        ▼
       SMS / WhatsApp invitation → accept → active
```

Three roles, described by what the person **does**, not by an abstract permission name. Full matrix in [Flow 01 §5.1](01-actors-roles-and-permissions.md).

---

## 4. Detailed flow

### 4.1 Invite

| | |
|---|---|
| **Sees** | A phone number field and three role cards written as job descriptions: *"Answer customers"* · *"Answer customers and change how Subiza works"* · *"See reports only"* |
| **Does** | Enters a number, picks a role, optionally ticks "get escalations" with hours |
| **System** | Creates a pending invitation, sends a link by SMS with a WhatsApp fallback, and adds them to the escalation rota if ticked |
| **Can fail** | Already a member of another business → allowed; a person can belong to more than one tenant. Invalid number → inline. Invitation unopened after 48h → one reminder, then it expires at 7 days |

### 4.2 Accept

The invitee opens the link and sees, before anything else:

```
   Claudine invited you to help answer customers
   at Salon Ubwiza using Subiza.

   You'll be able to:
   • See conversations that need a person
   • Reply to customers and take over from Subiza
   • Get a call or message when a customer needs help

   You won't see: billing, or conversations not sent to you.

   [ Join ]     [ No thanks ]
```

**Stating what they will *not* see is deliberate.** It reassures the invitee about surveillance and sets an accurate expectation about scope. Verification is by OTP on their own number, the same as signup — no password, no email.

### 4.3 First-run for a new team member

Not the owner's activation. A different, much shorter orientation, in three cards:

1. *"When Subiza can't help a customer, it will call or message you. You'll see what they need before you talk to them."*
2. *"You can take over any conversation. Subiza stops and you continue."*
3. *"You can pause Subiza at any time if something looks wrong."*

**That third card matters most.** Giving a front-desk employee the kill switch on day one is what turns Subiza from something done *to* her into something she controls.

### 4.4 Escalation rota

| Setting | Options |
|---|---|
| Who is on the rota | Any member with escalations enabled |
| Order | Sequence, or everyone at once |
| Hours | Per person — Aline during business hours, the owner otherwise |
| Skills | Optional: bookings to one person, complaints to another |
| Language | Route a French-speaking caller to a French speaker |
| **Fallback** | **Always message-and-promise. Never nothing** |

### 4.5 Remove a member

One tap, confirmed, immediate. Their access ends, they are removed from the rota, escalations reroute, and their prior conversation notes remain attributed. The person is notified — being silently removed from a workplace tool is a poor experience and generates a support call.

---

## 5. Screens, states, decisions

| Screen | States |
|---|---|
| Team list | Solo owner · members · pending invitations · expired |
| Invite | Composing · sent · reminded · expired · accepted · declined |
| Accept | Viewing · verifying · joined · declined |
| Member detail | Role · escalation settings · activity summary |
| Rota | Configured · gaps warned (nobody covers Sunday) · fallback confirmed |

| Decision | Branches |
|---|---|
| Which role? | Agent · Manager · Viewer |
| On the rota? | Yes with hours · no |
| Invitation accepted? | Active · declined (owner notified) · expired |
| Rota gap? | Warn and default to message-and-promise |
| Remove? | Confirm → reroute → notify |

---

## 6. Platform constraints

| Constraint | Effect |
|---|---|
| **I3 — Instagram Human Agent tag must be applied by a real human** | Only available to team members taking over, never to the AI. Enforced by role |
| Phone-based identity (from [Flow 05](05-flow-signup-and-account-creation.md)) | Invitations go to phone numbers; no email required anywhere |
| Law 058/2021 | Every team member with conversation access is processing personal data. Their access is scoped, logged, and included in the tenant's audit log |
| G14 low bandwidth | The team-member experience is notification-first — most of their interaction is a message and a tap, not a dashboard session |

---

## 7. Edge cases and failures

| Case | Behaviour |
|---|---|
| Owner is the only person and never invites anyone | Entirely fine. Escalation defaults to the owner and message-and-promise. Never nagged |
| Staff member leaves the business | Owner removes them; access ends immediately; escalations reroute |
| Staff member is also a customer | Separate identities. Their personal number in the conversation list is not linked to their staff account |
| Two people take over the same conversation | Presence indicator; second person sees who has it |
| Rota gap (nobody covers Sunday) | Warned at configuration, and message-and-promise fills it automatically |
| Invitee already has an account with another business | Allowed. They switch context in the app |
| Owner loses their phone | **Account recovery is a support flow** ([Flow 21](21-admin-tenant-lifecycle.md)) with identity verification, not a self-serve reset |
| Manager tries to remove the owner | Blocked |
| Staff member feels monitored | Their activity summary shows conversations handled, not response times or scores. **Subiza is not a staff-surveillance tool** and must not become one by accident |

That last row is a genuine design commitment. The moment the product becomes a way for owners to monitor employees, the employees stop cooperating with it.

---

## 8. Retention rationale

| Decision | Reason |
|---|---|
| Team is entirely optional | 80.7% of tenants will be 1–3 people; forcing team setup would be friction for almost everyone |
| Offered at the escalation moment | The one point where its value is self-evident |
| Roles described as jobs, not permissions | "Answer customers" is comprehensible; "Agent role with scoped read" is not |
| Invitation states what they will *not* see | Reassures against surveillance; prevents a common support question |
| Kill switch on the new member's first screen | Turns a staff member from a passive subject into a participant |
| Removal notifies the person | Silent removal generates a support call and bad feeling |
| No staff performance scoring | Protects the adoption of the people who make escalation work |

---

## 9. Success criteria

| # | Criterion | Measure | Target |
|---|---|---|---|
| 18.1 | A solo owner is never blocked or nagged by team features | UI audit | Pass |
| 18.2 | Invitations are accepted | Accepted ÷ sent | > 70% |
| 18.3 | Invitation to active takes under 3 minutes | Median | < 3 min |
| 18.4 | Role permissions are enforced | Test every capability against every role | 100% |
| 18.5 | A rota gap always falls back to message-and-promise | Functional test | Pass |
| 18.6 | Removal takes effect immediately | Access revoked within 60s | Pass |
| 18.7 | Team members can pause the AI | Permission test | Pass |
| 18.8 | Team members cannot resume it | Permission test | Pass |
| 18.9 | No staff performance metrics are exposed to owners | Feature audit | Pass |
| 18.10 | Team access appears in the tenant audit log | Functional test | Pass |

---

## 10. Instrumentation

| Event | Properties |
|---|---|
| `team.invited` | role, escalation enabled, channel |
| `team.invitation_opened` / `accepted` / `declined` / `expired` | hours to respond |
| `team.member_removed` | by whom, role |
| `team.role_changed` | from, to |
| `team.rota_gap_warned` | day, hours |
| `team.member_first_action` | days since joining, action type |
| `team.takeover_by_member` | role, conversation channel |

---

## 11. Open questions

| # | Question | Blocks |
|---|---|---|
| 18.a | Do Rwandan SMEs actually use multi-user accounts, or is it one owner with one phone? If the latter, roles A6–A8 are over-engineered for v1 | Scope |
| 18.b | Should Manager exist at all in v1, or only Owner and Agent? | Role model |
| 18.c | Do staff want a dedicated mobile view, or is notification-plus-takeover enough? | Staff experience |
| 18.d | How do we handle a shared phone used by several staff? | Identity |
| 18.e | Is account recovery via support acceptable, or does a lost phone need a self-serve path? | Support load, security |

---

*Next: [19 — Compliance, Consent & Data Rights](19-flow-compliance-and-data-rights.md)*
