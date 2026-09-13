import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  typedRoutes: true,
  transpilePackages: [
    "@subiza/ui",
    "@subiza/core",
    "@subiza/i18n",
    "@subiza/auth-tenant",
    "@subiza/domain",
    "@subiza/fixtures",
  ],
};

export default withNextIntl(nextConfig);
