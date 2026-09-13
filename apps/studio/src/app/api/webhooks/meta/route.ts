import { ingestMetaWebhook, metaHandshake, verifyMetaSignature } from "@subiza/auth-tenant";

export const dynamic = "force-dynamic";

function secret(): string {
  return process.env["META_APP_SECRET"] ?? "test-meta-secret";
}

function verifyToken(): string {
  return process.env["META_VERIFY_TOKEN"] ?? "subiza-verify";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const handshake = metaHandshake(url.searchParams, verifyToken());
  if (!handshake.ok) return new Response("forbidden", { status: 403 });
  return new Response(handshake.challenge, { status: 200, headers: { "content-type": "text/plain" } });
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyMetaSignature(raw, request.headers.get("x-hub-signature-256"), secret())) {
    return new Response("forbidden", { status: 403 });
  }
  ingestMetaWebhook(raw, "webhook");
  return new Response("ok", { status: 200 });
}
