# Next-native App Router conversion

Changes:
- Removed react-router-dom dependency: True
- Added `src/lib/router.ts` compat helpers for `useNavigate`, `useLocation`, and `useRRParams` (Next `useParams`).
- Converted internal `<a href="/...">` to `next/link` where safe.
- Tailwind CSS v4: ensured `globals.css` uses `@import "tailwindcss";` and `tailwindcss` devDependency is v4.

Remaining `react-router-dom` references: 1
