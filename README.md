# Mural Pay – Coding Challenge Summary

This project is a Single Page Application (SPA) built for the Mural Pay Coding Challenge (2025). It enables users to create customers and accounts, request and execute payouts, view payout statuses, and integrates with two public APIs (JSONPlaceholder and IP-API) to enhance functionality, using the Mural Pay API Sandbox (mocked due to access constraints). The app is developed with TypeScript, React, and modern tooling.

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

- Full integration with the real Sandbox API
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

- **JSONPlaceholder** (`https://jsonplaceholder.typicode.com/users`): Provides mock recipient data for payout requests, simulating realistic user information.
- **IP-API** (`http://ip-api.com/json/`): Fetches the user's geolocation to prioritize currency options based on proximity to each currency’s country. Currencies are sorted with the closest one first (e.g., USD for a US-based user). This enhances UX by presenting the most relevant currency by default.

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

- Full integration with Sandbox API
- Execution and cancellation of payouts
- Component testing with Testing Library
- Full CRUD emulation and client-side validation
- Shared type normalization
- UI/UX polish (toasts, error states, loading skeletons)
- Recipient filtering and business/multi-method support

## 🛠 Getting Started

```bash
pnpm dev
```

## 🧪 Running Tests

### Unit tests

```bash
pnpm test
```

### Cypress (E2E) tests

To open the runner:

```bash
pnpm cy:open
```

To run headless:

```bash
pnpm cy:run
```
