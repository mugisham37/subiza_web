import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./src/i18n/routing";

const handle = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (/^\/(fr|sw)(\/|$)/.test(pathname)) {
    return NextResponse.next();
  }
  return handle(request);
}

export const config = {
  matcher: ["/", "/(rw|en|fr|sw)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
