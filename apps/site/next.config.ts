import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    inlineCss: true,
  },
  transpilePackages: ["@subiza/ui", "@subiza/core", "@subiza/i18n"],
  images: {
    qualities: [50, 75],
  },
};

export default withNextIntl(nextConfig);
