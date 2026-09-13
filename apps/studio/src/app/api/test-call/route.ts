import { advanceTestCall, bundleOf, requestTestCall } from "@subiza/auth-tenant";
import { requireStudioContext } from "@/lib/session";

export async function GET() {
  const ctx = await requireStudioContext();
  const bundle = bundleOf(ctx);
  const call = bundle.testCall;
  if (call?.status === "ringing") {
    advanceTestCall(ctx, "live");
  }
  return Response.json({
    status: bundleOf(ctx).testCall?.status ?? "ready",
    turns: bundleOf(ctx).testCall?.turns ?? [],
  });
}

export async function POST(request: Request) {
  const ctx = await requireStudioContext();
  const bundle = bundleOf(ctx);
  if (!bundle.inFlightCallId) {
    try {
      requestTestCall(ctx, "browser");
    } catch {
      /* already in flight or ceiling */
    }
  }
  const live = bundleOf(ctx).testCall;
  if (live?.status === "ringing") {
    advanceTestCall(ctx, "live");
  }
  await request.text();
  const answer = [
    "v=0",
    "o=- 0 0 IN IP4 127.0.0.1",
    "s=Subiza",
    "t=0 0",
    "m=audio 9 UDP/TLS/RTP/SAVPF 111",
    "c=IN IP4 0.0.0.0",
    "a=recvonly",
    "a=rtcp-mux",
  ].join("\r\n");
  return new Response(`${answer}\r\n`, { headers: { "content-type": "application/sdp" } });
}
