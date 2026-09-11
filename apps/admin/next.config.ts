import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  transpilePackages: ["@subiza/ui", "@subiza/core", "@subiza/auth-staff"],
};

export default nextConfig;
