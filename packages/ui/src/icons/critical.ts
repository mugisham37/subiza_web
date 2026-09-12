import type { IconName } from "./names.generated";

export const CRITICAL_ICON_NAMES = [
  "phone-call",
  "check",
  "arrow-right",
  "info",
  "shield",
  "menu",
  "x",
  "chevron-down",
] as const satisfies readonly IconName[];

export const CRITICAL_ICON_COUNT = 8;
