# Email Marketing SaaS Frontend (Phase 1 MVP)

Tech Stack:
- React 18 + Vite + TypeScript
- Tailwind CSS (dark mode via class)
- React Router v6
- React Hook Form + Zod validation
- Recharts for charts
- Unlayer Email Editor for template building

## MVP Scope
- Login / Register pages (hit `/auth/login` & `/auth/register`).
- Protected application shell with sidebar, header & theme toggle.
- Dashboard with sample weekly performance line chart.
- Campaigns list placeholder table (stub data).
- Template editor page with export HTML action.
- Settings placeholder.
- Atomic component structure (atoms / molecules / organisms) + feature folders scaffold.
- Auth context with token persistence + interceptor-based logout on 401/403.
- Environment config via `import.meta.env`.

## Environment
Copy `.env.example` to `.env` and adjust:
```
VITE_API_BASE_URL=http://localhost:8080
VITE_UNLAYER_PROJECT_ID=
VITE_TEMPLATES_BACKEND=local
```

## Scripts
```
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Project Structure
```
src/
	api/          # API wrappers (axios based)
	components/   # atomic design (atoms/molecules/organisms)
	contexts/     # shared contexts (Auth, etc.)
	features/     # feature modules (campaigns, contacts, analytics)
	hooks/        # custom hooks
	layouts/      # layout shells (AppLayout)
	pages/        # route-level pages
	types/        # global ambient types
	utils/        # helpers (api.ts)
```

## Adding A New Form
Use `react-hook-form` + Zod:
```
const schema = z.object({ name: z.string().min(2) });
type Form = z.infer<typeof schema>;
const { register, handleSubmit, formState:{errors} } = useForm<Form>({ resolver: zodResolver(schema) });
```

## Theming
`ThemeToggle` toggles a `dark` class on `<html>` and persists preference in `localStorage`.

## Next Steps (Recommended)
- Replace stubbed campaign data with real backend endpoints.
- Implement contacts CRUD + segmentation tags.
- Integrate analytics endpoints for charts (open rate, CTR, bounce rate, unsubscribes).
- Add template gallery & versioning.
- Add role/plan gating UI affordances (hide/disable premium-only actions).
- Unit tests (Jest + React Testing Library) & component storybook.
- Performance budgets & bundle analysis.

## Accessibility
Baseline semantic HTML + focus styles; run an audit (axe / Lighthouse) before production hardening.

## License
Internal template – add license prior to public distribution.
