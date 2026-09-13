import { Suspense } from "react";
import { VoiceSurface } from "@/views/console/ReadOnlySurfaces";

export default function Page() {
  return (
    <Suspense>
      <VoiceSurface />
    </Suspense>
  );
}
