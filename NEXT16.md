# NEXT16.md — correction sheet for Next.js 16.3.5

Verified against the installed docs at
`subiza/node_modules/next/dist/docs/` (and, after the monorepo move,
`apps/studio/node_modules/next/dist/docs/` or the hoisted copy).
Training data is stale. These docs outrank memory.

## Traps

| Instinct | This install | If wrong |
|---|---|---|
| `middleware.ts`, edge runtime | **`proxy.ts`**, `export function proxy()`, **Node.js runtime only**. `export const runtime` inside it **throws**. | Auth/locale layer silently never runs, or the build throws. |
| `params` / `searchParams` are objects | **Promises. Always.** `await props.params`. | Runtime error. |
| `cookies()` / `headers()` / `draftMode()` sync | **`await cookies()`**, `await headers()`. | Runtime error. |
| `error.tsx` gets `reset` | **`{ error, retry }`**. `retry` is stable since 16.3.0. | Recovery does not re-fetch. |
| `webpack` key in `next.config` | **Turbopack is default for `dev` AND `build`.** A `webpack` key makes `next build` fail. | Build fails. |
| `revalidateTag('tag')` | **`revalidateTag(tag, profile)`** — two arguments. | Type error or wrong cache. |
| `next lint` | **Removed.** So is the `eslint` key in `next.config`. Use the ESLint CLI. | Command not found. |
| `forwardRef` | React 19 takes `ref` as a plain prop. | Needless wrapper. |
| `experimental.ppr` / `dynamicIO` / `useCache` | Gone. One top-level `cacheComponents: true` replaces them. | Config error. |
| `export const dynamic` / `revalidate` / `fetchCache` under cacheComponents | Removed — they error. | Build error. |
| `<Image priority>` | Deprecated. Use `loading="eager"` + `fetchPriority="high"`. | Deprecation warning. |
| Parallel route slots optional | Every slot needs a `default.tsx`. | Build fails. |
| Tailwind `dark:` handles both | v4.3.3 default `dark` is **`@media (prefers-color-scheme: dark)` only**. | `[data-theme=dark]` silently does nothing. |

Confirmed in `01-app/03-api-reference/03-file-conventions/proxy.md`:

- Middleware is renamed to Proxy.
- Proxy defaults to the Node.js runtime.
- Setting `runtime` in a Proxy file throws.
- Without a `matcher`, Proxy runs on `_next/static`, `_next/image` and `public/`.
- Next’s own docs: Proxy “should not be used as a full session management or authorization solution.”

## Things we actually use

- `typedRoutes` — `PageProps<'/route'>`, `LayoutProps<'/(app)'>` are generated.
- `next/root-params` — `import { lang } from 'next/root-params'` (param must be a valid JS identifier: `[lang]`, never `[lang-code]`).
- `experimental.inlineCss: true` on **`apps/site` only**. Off on studio/admin.
- `useLinkStatus` — pending nav. Keep a fixed-size element; do not toggle presence (CLS).
- `next dev` writes `.next/dev`, `next build` writes `.next`. Check `process.env.NODE_ENV === 'development'`, not `process.argv`.
- React `<ViewTransition>` works with **no config flag**.

## Repo rules

1. NEVER create `middleware.ts`. Only `proxy.ts`, always with a `matcher`.
2. NEVER read the theme cookie with `cookies()` in the root layout.
3. NEVER assume `global-error.tsx` inherits theme or global CSS. Re-import both.
4. Do NOT enable `cacheComponents: true` in Phase 1.
5. NEVER delete the `<!-- BEGIN:nextjs-agent-rules -->` block from `AGENTS.md`.
