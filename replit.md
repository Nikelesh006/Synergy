# Synergy — Electrical Hardware E-Commerce

A production-grade electrical hardware e-commerce website for the Indian market. Synergy serves contractors, electricians, builders, maintenance teams, workshops, and institutions with MCBs, distribution boards, cables, tools, safety equipment, and industrial electrical components.

## Run & Operate

- `pnpm --filter @workspace/synergy run dev` — run the Synergy frontend (Vite dev server)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `DATABASE_URL` — Postgres connection string (not needed for frontend-only build)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Wouter (routing), Framer Motion
- API: Express 5 (api-server artifact)
- DB: PostgreSQL + Drizzle ORM (not used in frontend-only build)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: Vite (frontend), esbuild (API server)

## Where things live

- `artifacts/synergy/` — Main Synergy e-commerce frontend
  - `src/pages/` — Page components (Home, Shop, Product, Cart, etc.)
  - `src/components/` — Reusable UI components (Header, ProductCard, FilterSidebar, etc.)
  - `src/data/` — Mock product, category, brand, and blog data
  - `src/context/` — Cart, Wishlist, Compare context providers
  - `src/types/` — TypeScript types for all entities
  - `src/models/` — MongoDB model placeholder interfaces
  - `src/lib/db.ts` — MongoDB connection placeholder (intentionally unconnected)
- `artifacts/api-server/` — Express API server
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `lib/db/src/schema/` — Drizzle ORM schema

## Architecture decisions

- **Frontend-only with mock data**: The Synergy frontend uses mock data in `src/data/`. MongoDB model files are included as placeholder TypeScript interfaces with comments indicating where real connections should be added.
- **Wouter for routing**: React Router-style routing via Wouter instead of Next.js App Router, matching the Vite-based monorepo setup.
- **Cart/Wishlist via React Context**: Local state management with React Context + useReducer for cart, wishlist, and compare — clean abstraction for later backend integration.
- **INR pricing**: All prices in Indian Rupees (₹) with 18% GST calculations.
- **Separate API server**: The `api-server` artifact handles backend logic; the frontend artifact is statically served.

## Product

- 18+ pages: Home, Shop, Category, Product Detail, Cart, Checkout, Wishlist, Account, Order Tracking, Bulk Enquiry, Services, Brands, Blog, Contact, About, FAQ, Policy pages
- 20+ mock electrical products with realistic specs, pricing, brands
- Full commerce flow: product discovery → cart → checkout → order tracking
- B2B features: bulk enquiry, custom quotation, GST invoice support
- Knowledge center: blog with buying guides, product comparisons, installation tips

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- MongoDB is intentionally unconnected. `src/lib/db.ts` and `src/models/` are placeholder files only.
- All prices are in INR (₹) with 18% GST applied at checkout.
- The BASE_URL for Vite routing is handled in `App.tsx` via `import.meta.env.BASE_URL`.
- Run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec changes before using updated types.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
