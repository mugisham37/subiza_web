import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const locale = request.cookies.get("subiza-locale")?.value ?? "rw";
  const response = NextResponse.next();
  response.headers.set("x-subiza-locale", locale);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
