# Mural Pay – Coding Challenge Summary

## ✅ Implemented

### Required by the challenge

> All required interactions with the Mural API are implemented using **mocked responses via MSW** due to lack of Sandbox access.

- Customer and account creation (mocked)
- Payout request creation (mocked)
- Payout request execution (mocked)
- Viewing payout requests and their statuses (mocked)
- Integration with a public API (extended to **two**)

### Additional features and tooling

- Integration with **two** external APIs:
  - **JSONPlaceholder** for recipient mock data (`/users`)
  - **IP-API** for geolocation to prioritize currency options
- Responsive UI with **Tailwind CSS** and **shadcn/ui** components
- Form managed via **React Hook Form** + **Zod** validation
- State management with **Zustand** (persisted to localStorage)
- Data fetching & mutations with **TanStack Query** (`useQuery`, `useMutation`, `useInfiniteQuery`)
- HTTP client choice: **Ky** for quick setup (would use `fetch` wrapper in production)
- Mock API layer powered by **MSW**
- Cypress E2E test for account creation
- Unit test for geo-distance utility

## ⏳ Pending (due to time constraints)

- Full integration with the real Sandbox API (remove `worker.start()` and adjust)
- Component-level tests with Testing Library

## 🔐 Security & API Key Disclaimer

API keys are exposed on the client side, which is insecure in production. This was necessary to meet the SPA requirement without a backend. In a real-world app, keys would be kept secret on a secure server proxy.

## 📁 Project Structure

Technology-based layout, grouping by role rather than feature or domain:

```
src/
├── api/          # HTTP clients & service wrappers
├── components/   # UI components (incl. shadcn/ui)
├── hooks/        # Custom data-fetching & state hooks
├── layouts/      # Layout components
├── lib/          # Utilities & toasts
├── mocks/        # MSW handlers
├── pages/        # Next.js/Vite routes
├── stores/       # Zustand stores
├── types/        # Core domain types
└── main.tsx
```

## 🧾 Type Organization

- Core Mural API and domain types in `src/types`
- Inline types for infra or third‑party APIs (e.g. JSONPlaceholder, IP‑API) to keep them close to usage
- Mix of `type` and `interface` due to QuickType generation

## 🧠 Data Fetching & Caching

- **TanStack Query** for declarative fetch/caching
- No custom `staleTime`/`cacheTime` due to time constraints; would tune in a production setting

## 🧱 Component & Page Structure

Pages use a single “smart” component handling data logic via hooks. In production, pages would handle routing/layout and delegate UI to presentational components.

## 🧪 Automated Testing

- **E2E**: account creation (Cypress)
- **Unit**: geo-distance utility
- Component tests were omitted due to initial setup overhead and time prioritization.

## 🌐 Additional Public APIs

- **JSONPlaceholder**: `https://jsonplaceholder.typicode.com/users`
- **IP‑API**: `http://ip-api.com/json/` — used to calculate user's proximity to each currency’s country using airport coordinates

## ⏱ Time Spent

Total development time was approximately **6 hours**, including full project setup, type definitions, and core implementation work.

This estimate does **not** include:

- Time spent waiting or being blocked due to environment/setup issues
- Time spent thinking through architecture or UX flow
- Time invested in understanding the Mural API
- Final refactoring or polish
- Building the MSW-based workaround for the lack of Sandbox access

## 🤖 Use of AI Tools

- **Cursor autocompletion** (no agent) used to speed up boilerplate
- **AI-generated mock data** for realism
- **UI refinements** using AI prompts (no Figma available)
- **V0** used to scaffold Create Payout Request UI in late stages

## 🔮 Potential Improvements

- Add client-side filters for payout table (status, currency)
- Simulate API effects with in-memory CRUD
- Enforce full client-side validation on amount and currency
- Support multiple payout methods per recipient
- Refactor and reuse shared types across modules
- Add component tests with Testing Library
- Improve UX: error handling, toasts, loading indicators

## 🛠 Getting Started

```bash
pnpm dev       # start local dev server
pnpm test      # run unit tests
pnpm cy:open   # open Cypress runner
pnpm cy:run    # run Cypress headless
```
