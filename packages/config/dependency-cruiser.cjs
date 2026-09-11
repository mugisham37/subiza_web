/** @type {import("dependency-cruiser").IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-banned-packages",
      severity: "error",
      from: {},
      to: {
        path: "(framer-motion|motion-one|animejs|gsap|lenis|recharts|chart\\.js|lucide-react|react-icons|@heroicons|@fortawesome|@base-ui|@mui/|antd|daisyui|bootstrap|clsx|tailwind-merge)",
      },
    },
    {
      name: "no-admin-auth-in-tenant",
      severity: "error",
      from: { path: "(apps/site|apps/studio|packages/auth-tenant)" },
      to: { path: "packages/auth-staff" },
    },
    {
      name: "no-tenant-auth-in-admin",
      severity: "error",
      from: { path: "(apps/admin|packages/auth-staff)" },
      to: { path: "packages/auth-tenant" },
    },
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
  },
};
