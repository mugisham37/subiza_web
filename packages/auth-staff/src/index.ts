/** Staff-session types. Never imported by apps/site or apps/studio. */
export type StaffSession = {
  staffId: string;
  role:
    | "supportL1"
    | "supportL2"
    | "onboarding"
    | "billing"
    | "engineer"
    | "quality"
    | "trustSafety"
    | "dpo"
    | "superAdmin";
};
