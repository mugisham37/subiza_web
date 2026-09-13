import { Suspense } from "react";
import { ConnectionsSurface } from "@/views/console/ReadOnlySurfaces";

export default function Page() {
  return (
    <Suspense>
      <ConnectionsSurface />
    </Suspense>
  );
}
