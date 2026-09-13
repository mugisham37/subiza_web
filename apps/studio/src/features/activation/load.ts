import {
  bundleOf,
  currentStep,
  destinationForTestCall,
  documentsOf,
  forceResume,
  getTenant,
  markStarted,
  markStepViewed,
} from "@subiza/auth-tenant";
import {
  BACK_STEPS,
  PARTS,
  canVisit,
  deriveChecklist,
  stepIndex,
  type ActivationStep,
} from "@subiza/domain";
import { formatRwandaPhone } from "@subiza/core";
import { requireStudioContext } from "@/lib/session";

export async function loadActivation(step: ActivationStep, showResume = false) {
  const ctx = await requireStudioContext();
  markStarted(ctx, getTenant(ctx).language, "studio");
  if (showResume) forceResume(ctx);
  const docs = documentsOf(ctx);
  const bundle = bundleOf(ctx);
  if (!canVisit(step, docs, bundle.cursor.skipSet)) {
    return { redirectTo: currentStep(ctx) as ActivationStep };
  }
  markStepViewed(ctx, step);
  const tenant = getTenant(ctx);
  let destination = "";
  try {
    destination = formatRwandaPhone(destinationForTestCall(ctx));
  } catch {
    destination = "";
  }
  const derived = currentStep(ctx);
  const resume = bundle.cursor.resumedFrom;
  return {
    ctx,
    tenant,
    docs,
    bundle,
    step,
    part: PARTS[step],
    index: stepIndex(step),
    back: BACK_STEPS.includes(step),
    destination,
    inbound: bundle.inboundNumber,
    checklist: deriveChecklist(docs, true),
    derived,
    resume,
    language: tenant.language === "en" ? "en" : "rw",
  };
}

export async function loadConsole() {
  const ctx = await requireStudioContext();
  const tenant = getTenant(ctx);
  const docs = documentsOf(ctx);
  const bundle = bundleOf(ctx);
  return {
    ctx,
    tenant,
    docs,
    bundle,
    checklist: deriveChecklist(docs, true),
    live: docs.goLive != null && docs.goLive.rung !== "sandbox" && docs.goLive.pausedAt === null,
  };
}
