import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

const handle = createMiddleware(routing);

export function proxy(...args: Parameters<typeof handle>) {
  return handle(...args);
}

export const config = {
  matcher: ["/", "/(rw|en|fr|sw)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
