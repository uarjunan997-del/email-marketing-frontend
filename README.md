# Email Marketing Frontend (React + Vite)

Phase 1 evolving into a richer editor + campaign management UI. Integrates with backend template, AI draft, and variable analysis endpoints.

## Stack
* React 18 + TypeScript + Vite
* Tailwind CSS (dark mode via class)
* React Router v6
* React Hook Form + Zod
* GrapesJS (newsletter preset) – replacing legacy Unlayer gradually (toggle present)
* Unlayer (legacy editor kept temporarily for comparison / fallback)
* Axios API layer with auth token attach + 401/403 logout
* Vitest + Testing Library for unit tests

## Implemented UI Features
* Auth: Login / Register pages wired to backend (`/auth/login`, `/auth/register`), redirect + user DTO fix applied.
* Protected layout shell with sidebar, header, theme toggle.
* Dashboard sample metrics (stub recharts line chart).
* Template Editor page with GrapesJS integration + export/save flow (WIP hooking to `/api/templates`).
* Editor toggle between legacy Unlayer and new GrapesJS component.
* Toast notifications via `react-hot-toast`.

## Upcoming Enhancements (Planned)
* Call `/api/templates/ai/draft` for AI starter content injection.
* Invoke `/api/templates/{id}/analyze` post-save to surface variable checklist & required warnings (e.g. missing `unsubscribe`).
* MJML authoring tab (dual-pane: MJML source ↔ rendered HTML once real renderer available).
* Template gallery + version history viewer.
* Campaign create/run wizard + scheduling UI.
* Role / plan gating visual cues (upgrade badges, disabled actions).
* Contact segmentation & audience filters.

## Environment
Create `.env` (or `.env.local`):
```
VITE_API_BASE_URL=http://localhost:8080
VITE_UNLAYER_PROJECT_ID=
VITE_TEMPLATES_BACKEND=local
```
Future variables (planned):
```
VITE_ENABLE_AI_DRAFT=true
VITE_MJML_TAB=true
```

## Scripts
```
npm install
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview built assets
npm run lint     # eslint
npm run typecheck
npm test         # vitest unit tests
```

## Project Structure (Key Directories)
```
frontend/
	src/
		api/          # axios wrappers & interceptors
		components/   # reusable UI components
		contexts/     # AuthContext, Theme etc.
		features/     # domain feature modules (campaigns, templates...)
		hooks/        # shared hooks
		layouts/      # layout shells
		pages/        # route pages
		types/        # TypeScript definitions
		utils/        # helpers (api.ts, formatting)
```

## GrapesJS Integration Notes
* Using `grapesjs@0.21.x` with `grapesjs-preset-newsletter`.
* Saving: extract HTML from editor, send to backend `PUT /api/templates/{id}`.
* For variable placeholders use `{{variable_name}}`; they'll be detected by backend analyzer.
* Consider custom blocks for CTA button, header, footer (with `{{unsubscribe}}`).

## Variable Workflow (Planned UX)
1. User edits template and inserts tokens like `{{first_name}}`, `{{primary_link}}`.
2. On save, frontend triggers analyze endpoint -> receives `variables`, `missingRequired`.
3. Display checklist panel; allow marking required or setting default values (POST `/variables`).
4. Warn and block send if required missing.

## Testing
* Unit tests via Vitest: `npm test`.
* Add tests around AuthContext, editor wrapper, variable panel once implemented.

## Theming & Accessibility
* `dark` class toggled on `<html>`; extend Tailwind config for brand palette.
* Use semantic landmarks (`<nav>`, `<main>`, `<header>`). Run Lighthouse / axe before release.

## Contributing Workflow
* Branch naming: `feat/`, `fix/`, `chore/`.
* Run lint + typecheck before PR.
* Keep editor-related dependencies pinned to avoid breaking CSS.

## Next Backend Alignments Needed
* Add OpenAPI docs to auto-generate client types (e.g. using `openapi-typescript`).
* Provide template version diff endpoint for UI comparison view.

## License
Internal reuse. Add explicit license if distributing externally.
