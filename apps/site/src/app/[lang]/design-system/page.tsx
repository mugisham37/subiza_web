import { ViewTransition } from "react";
import { DesignSystemView } from "@/views/DesignSystemView/DesignSystemView";

export default async function DesignSystemPage({
  params,
}: PageProps<"/[lang]/design-system">) {
  const { lang } = await params;
  return (
    <ViewTransition>
      <DesignSystemView lang={lang} />
    </ViewTransition>
  );
}
