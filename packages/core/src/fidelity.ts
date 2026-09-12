import type { Fidelity } from "./view-state";

export function fidelityFromHeaders(headers: {
  get(name: string): string | null;
}): Fidelity {
  const saveData = headers.get("save-data");
  const reducedData = headers.get("sec-ch-prefers-reduced-data");
  const ect = headers.get("ect");
  if (saveData === "on") return "lite";
  if (reducedData === "on") return "lite";
  if (ect === "slow-2g" || ect === "2g") return "lite";
  return "full";
}
