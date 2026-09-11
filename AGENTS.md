<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Subiza — four-rung ladder

- `page.tsx` is a route. Thin. Params → view. No markup beyond Suspense.
- `src/views/` is composition. Owns the eight states. Knows the product.
- `src/features/` is domain logic and server actions.
- `packages/ui` is domain-free except `src/product/`.

Imports flow downward only. An atom that says "conversation", "tenant" or
"escalation" belongs in `packages/ui/src/product/`.

Never create `template.tsx` for atomic-design reasons. Never create
`middleware.ts` — only `proxy.ts`.

# Banned dependencies

framer-motion, motion, motion-one, animejs, gsap, @gsap/react, lenis,
recharts, chart.js, d3, tremor, lucide-react, react-icons, @heroicons/react,
@fortawesome/*, @radix-ui/* except react-slot, @base-ui/react, @mui/*, antd,
daisyui, bootstrap, normalize.css, clsx, tailwind-merge.

# Internal names

Ijwi and Ubwenge never appear in UI copy.
