import { Suspense } from "react";
import { KnowledgeSurface } from "@/views/console/ReadOnlySurfaces";

export default function Page() {
  return (
    <Suspense>
      <KnowledgeSurface />
    </Suspense>
  );
}
