import { Suspense } from "react";
import { AgentSurface } from "@/views/console/ReadOnlySurfaces";

export default function Page() {
  return (
    <Suspense>
      <AgentSurface />
    </Suspense>
  );
}
