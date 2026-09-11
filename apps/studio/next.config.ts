import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  transpilePackages: ["@subiza/ui", "@subiza/core", "@subiza/i18n", "@subiza/auth-tenant"],
};

export default nextConfig;
