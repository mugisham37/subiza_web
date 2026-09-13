import { can, detectRwandaNetwork, type TenantCapability } from "@subiza/core";
import {
  applyVerificationOutcome,
  deactivationCodeFor,
  dispositionForCheck,
  emptyPhoneChannel,
  isReverificationDue,
  isSuccessOutcome,
  normalizePhoneChannel,
  observationForForce,
  outcomeFromObservation,
  propagationRetry,
  resolvedConditions,
  scopeFromChoice,
  type ForwardCondition,
  type PhoneChannel,
  type PhoneNetwork,
  type PhonePath,
  type PhoneStep,
  type ProvisioningState,
  type VerificationOutcome,
} from "@subiza/domain";
import { writeAudit } from "./audit";
import {
  SUBIZA_FORWARD_NUMBER,
  bundleOf,
  emit,
  verifiedE164,
} from "./activation";
import type { TenantContext } from "./context";
import { getTenant } from "./dal";

/**
 * AUTH STRENGTH DECISION — Prompt 05 §3.2 defect 4, option (b).
 *
 * The capability matrix marks `setupCallForwarding` elevated: changing the
 * forwarded-to destination after a verified forward is elevated-class.
 * Surface-initiated first-time registration (path, scope, the code, verify,
 * repair) accepts an `otp` session. We check `can(role)` and write the audit
 * row ourselves. `mintGrant(otp, setupCallForwarding)` would return null —
 * that is the matrix, not a forgotten check.
 *
 * Recovered sessions may register a first forward (they are not on
 * `recoveredDeniedCapabilities`) but may not change the destination.
 * Activation w8 stays on `completeSignupAndActivation`. PhoneStep is untouched.
 */
export const PHONE_SURFACE_AUTH = {
  decision: "b" as const,
  surfaceAccepts: "otp",
  destinationChangeRequires: "elevated",
  activationRemainsOn: "completeSignupAndActivation",
};

function deny(ctx: TenantContext, capability: TenantCapability, reason: string): never {
  writeAudit({
    tenantId: ctx.tenantId,
    actorType: ctx.actorType,
    actorId: ctx.personId,
    onBehalfOf: null,
    action: capability,
    capability,
    outcome: "denied",
    before: null,
    after: null,
    reason,
  });
  throw Object.assign(new Error("notFound"), { code: "notFound" as const });
}

function requireForwardingWrite(ctx: TenantContext, destinationChange = false): void {
  if (!can(ctx.role, "setupCallForwarding")) {
    deny(ctx, "setupCallForwarding", "missing-grant");
  }
  if (destinationChange && ctx.strength !== "elevated") {
    deny(ctx, "setupCallForwarding", "needs-elevated");
  }
  writeAudit({
    tenantId: ctx.tenantId,
    actorType: ctx.actorType,
    actorId: ctx.personId,
    onBehalfOf: null,
    action: "setupCallForwarding",
    capability: "setupCallForwarding",
    outcome: "allowed",
    before: null,
    after: { destinationChange, strength: ctx.strength, decision: PHONE_SURFACE_AUTH.decision },
    reason: "surface-otp-accepted",
  });
}

function phoneOf(ctx: TenantContext): PhoneChannel {
  const bundle = bundleOf(ctx);
  const phone = normalizePhoneChannel(bundle.phone ?? emptyPhoneChannel(SUBIZA_FORWARD_NUMBER), SUBIZA_FORWARD_NUMBER);
  bundle.phone = phone;
  return phone;
}

function writePhone(ctx: TenantContext, next: PhoneChannel): PhoneChannel {
  const bundle = bundleOf(ctx);
  bundle.phone = next;
  return next;
}

export function changeForwarding(
  ctx: TenantContext,
  patch: Partial<PhoneChannel>,
  destinationChange = false,
): PhoneChannel {
  requireForwardingWrite(ctx, destinationChange);
  const current = phoneOf(ctx);
  if (patch.subizaNumber && patch.subizaNumber !== current.subizaNumber && !destinationChange) {
    deny(ctx, "setupCallForwarding", "needs-elevated");
  }
  const next: PhoneChannel = {
    ...current,
    ...patch,
    verification: { ...current.verification, ...(patch.verification ?? {}) },
    provisioning: { ...current.provisioning, ...(patch.provisioning ?? {}) },
    deactivationCode: deactivationCodeFor(
      (patch.conditions ?? current.conditions)[0] ?? patch.condition ?? current.condition,
    ),
  };
  return writePhone(ctx, next);
}

export function choosePhonePath(ctx: TenantContext, path: PhonePath): PhoneChannel {
  requireForwardingWrite(ctx);
  emit(ctx, { name: "phone.path_chosen", path }, "setupCallForwarding");
  if (path === "new-number") {
    return changeForwarding(ctx, {
      path,
      surfaceStep: "number",
      provisioning: {
        state: "documents-ready",
        startedAt: Date.now(),
        expectedDaysMin: 3,
        expectedDaysMax: 7,
      },
    });
  }
  return changeForwarding(ctx, { path, surfaceStep: "scope" });
}

export function setPhoneScope(ctx: TenantContext, choice: "miss" | "no-reply" | "all"): PhoneChannel {
  requireForwardingWrite(ctx);
  const conditions = scopeFromChoice(choice);
  changeForwarding(ctx, {
    conditions,
    condition: conditions[0] ?? "no-reply",
    currentCodeIndex: 0,
    surfaceStep: "code",
    voicemailConflictAcknowledgedAt: Date.now(),
  });
  return markCodeShown(ctx);
}

export function detectPhoneNetwork(ctx: TenantContext, override?: PhoneNetwork): PhoneChannel {
  requireForwardingWrite(ctx);
  const owner = verifiedE164(ctx);
  const detected = override ?? detectRwandaNetwork(owner);
  const current = phoneOf(ctx);
  const corrected = override != null && override !== detectRwandaNetwork(owner);
  emit(
    ctx,
    { name: "phone.network_detected", network: detected, correctedManually: corrected },
    "setupCallForwarding",
  );
  return changeForwarding(ctx, {
    network: detected,
    networkCorrectedManually: current.networkCorrectedManually || corrected,
  });
}

export function markCodeShown(ctx: TenantContext): PhoneChannel {
  requireForwardingWrite(ctx);
  const phone = phoneOf(ctx);
  const row = resolvedConditions(phone)[phone.currentCodeIndex] ?? phone.condition;
  emit(
    ctx,
    { name: "phone.code_shown", codeType: row, network: phone.network },
    "setupCallForwarding",
  );
  return changeForwarding(ctx, { surfaceStep: "code" });
}

export function advancePhoneCode(ctx: TenantContext): PhoneChannel {
  requireForwardingWrite(ctx);
  const phone = phoneOf(ctx);
  const nextIndex = phone.currentCodeIndex + 1;
  if (nextIndex < resolvedConditions(phone).length) {
    changeForwarding(ctx, { currentCodeIndex: nextIndex, surfaceStep: "code" });
    return markCodeShown(ctx);
  }
  return changeForwarding(ctx, { surfaceStep: "verify" });
}

export function requestPhoneVerification(
  ctx: TenantContext,
  kind: "activation" | "recurring" = "activation",
): PhoneChannel {
  requireForwardingWrite(ctx);
  const phone = phoneOf(ctx);
  if (phone.verification.status === "calling") {
    throw Object.assign(new Error("in-flight"), { code: "in-flight" as const });
  }
  const reject = dispositionForCheck(kind) === "reject-486";
  emit(
    ctx,
    { name: "phone.verification_attempted", attempt: phone.verification.attempts + 1 },
    "setupCallForwarding",
  );
  return changeForwarding(ctx, {
    surfaceStep: "verify",
    verification: {
      ...phone.verification,
      status: "calling",
      kind,
      rejectWith486: reject,
      lastAttemptAt: Date.now(),
    },
  });
}

export function settlePhoneVerification(
  ctx: TenantContext,
  forceState?: VerificationOutcome,
): PhoneChannel {
  requireForwardingWrite(ctx);
  const phone = phoneOf(ctx);
  const now = Date.now();
  const owner = verifiedE164(ctx);
  if (phone.verification.status === "retrying") {
    const decision = propagationRetry({
      attempts: phone.verification.attempts,
      lastAttemptAt: phone.verification.lastAttemptAt,
      lastOutcome: phone.verification.outcome,
      now,
    });
    if (decision.action === "wait") {
      return phone;
    }
  }
  if (phone.verification.status !== "calling" && phone.verification.status !== "retrying" && !forceState) {
    return phone;
  }
  const observation = observationForForce(forceState ?? "diverted", phone.subizaNumber, owner, now);
  const outcome = outcomeFromObservation(observation, phone.subizaNumber);
  let next = applyVerificationOutcome(phone, outcome, observation, now);
  if (outcome === "not-diverted") {
    const decision = propagationRetry({
      attempts: next.verification.attempts,
      lastAttemptAt: next.verification.lastAttemptAt,
      lastOutcome: outcome,
      now,
    });
    if (decision.action !== "report") {
      next = {
        ...next,
        surfaceStep: "verify",
        verification: { ...next.verification, status: "retrying" },
      };
      return writePhone(ctx, next);
    }
  }
  next = {
    ...next,
    surfaceStep: isSuccessOutcome(outcome) ? "result" : outcome === "owner-answered" || outcome === "inconclusive" ? "result" : "result",
  };
  writePhone(ctx, next);
  emit(ctx, { name: "phone.verification_result", outcome }, "setupCallForwarding");
  if (next.verification.callerIdSurvived != null) {
    emit(ctx, { name: "phone.caller_id_preserved", preserved: next.verification.callerIdSurvived }, "setupCallForwarding");
  }
  return next;
}

export function requestAssistedCall(ctx: TenantContext, step: string): PhoneChannel {
  requireForwardingWrite(ctx);
  emit(ctx, { name: "phone.assisted_requested", step }, "setupCallForwarding");
  return changeForwarding(ctx, { assistedRequestedAt: Date.now(), surfaceStep: "repair" });
}

export function setRepairRung(ctx: TenantContext, rung: number, prepaid = false): PhoneChannel {
  requireForwardingWrite(ctx);
  changeForwarding(ctx, {
    repairRung: rung,
    prepaidBlocked: prepaid,
    surfaceStep: prepaid ? "repair" : "code",
  });
  return prepaid ? phoneOf(ctx) : markCodeShown(ctx);
}

export function markPhoneDone(ctx: TenantContext): PhoneChannel {
  requireForwardingWrite(ctx);
  return changeForwarding(ctx, { surfaceStep: "done" });
}

export function startNewNumber(ctx: TenantContext): PhoneChannel {
  requireForwardingWrite(ctx);
  const startedAt = Date.now();
  emit(
    ctx,
    { name: "number.provisioning_state_changed", state: "regulatory-review", daysElapsed: 0 },
    "setupCallForwarding",
  );
  return changeForwarding(ctx, {
    path: "new-number",
    surfaceStep: "number",
    provisioning: {
      state: "regulatory-review",
      startedAt,
      expectedDaysMin: 3,
      expectedDaysMax: 7,
    },
  });
}

export function setProvisioningState(ctx: TenantContext, state: ProvisioningState): PhoneChannel {
  requireForwardingWrite(ctx);
  const phone = phoneOf(ctx);
  const days = phone.provisioning.startedAt
    ? Math.max(0, Math.floor((Date.now() - phone.provisioning.startedAt) / 86_400_000))
    : 0;
  emit(ctx, { name: "number.provisioning_state_changed", state, daysElapsed: days }, "setupCallForwarding");
  return changeForwarding(ctx, {
    provisioning: { ...phone.provisioning, state },
    surfaceStep: "number",
  });
}

export function markForwardingLost(ctx: TenantContext, now = Date.now()): PhoneChannel {
  requireForwardingWrite(ctx);
  const phone = phoneOf(ctx);
  const last = phone.verification.lastVerifiedAt ?? phone.verification.verifiedAt ?? now;
  const days = Math.max(0, Math.floor((now - last) / 86_400_000));
  emit(ctx, { name: "phone.forwarding_lost_detected", daysSinceLastVerified: days }, "setupCallForwarding");
  return changeForwarding(ctx, { forwardingLostAt: now, surfaceStep: "lost" });
}

export function maybeDetectSilentFailure(ctx: TenantContext, now = Date.now()): PhoneChannel {
  const phone = phoneOf(ctx);
  if (!isReverificationDue(phone, now)) return phone;
  if (!can(ctx.role, "setupCallForwarding")) return phone;
  return markForwardingLost(ctx, now);
}

export function setPhoneSurfaceStep(ctx: TenantContext, step: PhoneStep): PhoneChannel {
  requireForwardingWrite(ctx);
  return changeForwarding(ctx, { surfaceStep: step });
}

export function ownerNumber(ctx: TenantContext): string {
  return verifiedE164(ctx);
}

export function tenantName(ctx: TenantContext): string {
  return getTenant(ctx).name;
}

export type { ForwardCondition };
