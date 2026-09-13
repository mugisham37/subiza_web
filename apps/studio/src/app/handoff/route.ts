import { consumeHandoff, materializeHandoff } from "@subiza/auth-tenant";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, hostCookie } from "@subiza/auth-tenant";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  const snapshot = consumeHandoff(token);
  if (!snapshot) {
    return NextResponse.redirect(new URL("/sign-in", url.origin));
  }
  const sessionId = materializeHandoff(snapshot);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, sessionId, hostCookie(14 * 24 * 60 * 60));
  return NextResponse.redirect(new URL("/activate", url.origin));
}
