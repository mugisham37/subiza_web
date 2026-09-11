import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";
import boundaries from "eslint-plugin-boundaries";

const banned = [
  "framer-motion",
  "motion",
  "motion/react",
  "motion-one",
  "animejs",
  "gsap",
  "@gsap/react",
  "lenis",
  "recharts",
  "chart.js",
  "d3",
  "tremor",
  "lucide-react",
  "react-icons",
  "@heroicons/react",
  "@fortawesome/fontawesome-svg-core",
  "@fortawesome/free-solid-svg-icons",
  "@fortawesome/react-fontawesome",
  "@base-ui/react",
  "@mui/material",
  "antd",
  "daisyui",
  "bootstrap",
  "normalize.css",
  "clsx",
  "classnames",
  "tailwind-merge",
];

const bannedPatterns = [
  { group: ["@radix-ui/*", "!@radix-ui/react-slot"], message: "Only @radix-ui/react-slot is allowed." },
  { group: ["@fortawesome/*"], message: "Icon fonts are banned. Use the Lucide sprite." },
];

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      "jsx-a11y": jsxA11y,
      boundaries,
    },
    settings: {
      "boundaries/elements": [
        { type: "route", pattern: "src/app/**/*" },
        { type: "view", pattern: "src/views/**/*" },
        { type: "feature", pattern: "src/features/**/*" },
        { type: "organism", pattern: "src/organisms/**/*" },
        { type: "molecule", pattern: "src/molecules/**/*" },
        { type: "atom", pattern: "src/atoms/**/*" },
        { type: "product", pattern: "src/product/**/*" },
        { type: "core", pattern: "**/packages/core/**/*" },
      ],
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      "no-restricted-imports": [
        "error",
        {
          paths: banned.map((name) => ({
            name,
            message: `${name} is banned by the design-system budget (Prompt 01 §6.4).`,
          })),
          patterns: bannedPatterns,
        },
      ],
      "boundaries/element-types": [
        "error",
        {
          default: "allow",
          rules: [
            { from: "atom", disallow: ["molecule", "organism", "product", "feature", "view", "route"] },
            { from: "molecule", disallow: ["organism", "feature", "view", "route"] },
            { from: "organism", disallow: ["feature", "view", "route"] },
            { from: "feature", disallow: ["view", "route"] },
            { from: "view", disallow: ["route"] },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "next-env.d.ts",
    "**/names.generated.ts",
  ]),
]);
