export default async function ConsentPlaceholder({
  params,
}: PageProps<"/[lang]/consent/[token]">) {
  await params;
  return (
    <main id="content" className="wrap">
      <h1>Voice consent</h1>
      <p>Prompt 12. No account.</p>
    </main>
  );
}
