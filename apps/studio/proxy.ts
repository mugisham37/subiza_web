import { SESSION_COOKIE } from "@subiza/auth-tenant";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC = ["/sign-in", "/handoff", "/api/voice-preview", "/api/webhooks/meta", "/dev/enter"];

export function proxy(request: NextRequest) {
  const locale = request.cookies.get("subiza-locale")?.value ?? "rw";
  const path = request.nextUrl.pathname;
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const publicPath = PUBLIC.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
  if (!session && !publicPath && path !== "/") {
    const to = request.nextUrl.clone();
    to.pathname = "/sign-in";
    const response = NextResponse.redirect(to);
    response.headers.set("x-subiza-locale", locale);
    return response;
  }
  const response = NextResponse.next();
  response.headers.set("x-subiza-locale", locale);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
