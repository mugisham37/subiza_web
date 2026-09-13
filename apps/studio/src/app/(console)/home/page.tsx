import { Suspense } from "react";
import { HomeView } from "@/views/HomeView/HomeView";

export default async function Page({ searchParams }: PageProps<"/home">) {
  const q = await searchParams;
  return (
    <Suspense>
      <HomeView paused={q["paused"] === "1"} />
    </Suspense>
  );
}
