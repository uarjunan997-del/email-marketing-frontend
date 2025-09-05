# Email Marketing SaaS Frontend

Tech Stack:
- React 18 + Vite + TypeScript
- Tailwind CSS (dark mode via class)
- React Router v6
- React Hook Form + Zod validation
- Recharts for charts
- Unlayer Email Editor for template building

## Functional Scope
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

## Backend Integration: Campaign Feature

This frontend now needs to integrate with the enhanced campaign backend (`/api/campaigns` domain). Below is a complete guide.

### 1. Auth & Base URL
All campaign endpoints are under: `${VITE_API_BASE_URL}/api/campaigns` and require an `Authorization: Bearer <token>` header (token obtained from login flow already implemented in the Auth context).

### 2. Endpoints Summary
Base path: `/api/campaigns`

| Operation | Method | Path | Body (JSON) | Notes |
|-----------|--------|------|-------------|-------|
| List campaigns | GET | `/api/campaigns` | — | Returns array of Campaign objects |
| Get campaign | GET | `/api/campaigns/{id}` | — | Single campaign |
| Create | POST | `/api/campaigns` | `{name, segment, templateId, subject, preheader, scheduledAt?}` | `scheduledAt` (ISO) sets status SCHEDULED else DRAFT |
| Update | PUT | `/api/campaigns/{id}` | same as create body | Only if status in DRAFT/REVIEW |
| Schedule | POST | `/api/campaigns/{id}/schedule` | `{scheduledAt, timezone, windowStart, windowEnd, optimizationStrategy}` | Moves to SCHEDULED |
| Send Now | POST | `/api/campaigns/{id}/send-now` | — | Forces immediate send (status -> SENDING) |
| Cancel | POST | `/api/campaigns/{id}/cancel` | — | Only SCHEDULED/REVIEW/DRAFT |
| Preview | GET | `/api/campaigns/{id}/preview` | — | Returns sample HTML placeholder |
| A/B Test Setup | POST | `/api/campaigns/{id}/ab-test` | `{variants:[{code,subject,templateId,splitPercent?}], samplePercent?}` | Only in DRAFT |
| Progress | GET | `/api/campaigns/{id}/progress` | — | `{status,total,sent,opens,clicks}` |
| Analytics | GET | `/api/campaigns/{id}/analytics` | — | Detailed metrics + ROI fields |
| Run Analysis | POST | `/api/campaigns/{id}/analyze` | — | Triggers revenue/ROI calc |
| Summary Analytics | GET | `/api/campaigns/summary/analytics` | — | Portfolio summary |
| Request Approval | POST | `/api/campaigns/{id}/request-approval` | — | Status -> REVIEW + approvalStatus=PENDING |
| Approve | POST | `/api/campaigns/{id}/approve` | — | approvalStatus -> APPROVED |
| Reject | POST | `/api/campaigns/{id}/reject` | `{notes?}` | Sets approvalStatus=REJECTED & status=DRAFT |

### 3. Data Shapes
Minimal Campaign (inferred fields – adjust if backend adds more):
```
interface Campaign {
	id: number;
	userId: number;
	name: string;
	segment?: string | null;
	templateId?: number | null;
	subject?: string | null;
	preheader?: string | null;
	status: 'DRAFT'|'REVIEW'|'SCHEDULED'|'SENDING'|'SENT'|'CANCELLED';
	approvalStatus?: 'PENDING'|'APPROVED'|'REJECTED'|null;
	scheduledAt?: string | null; // ISO timestamp
	totalRecipients?: number;
	sentCount?: number;
	openCount?: number;
	clickCount?: number;
	createdAt?: string;
	updatedAt?: string;
}
```

Progress response:
```
interface CampaignProgress { status:string; total:number; sent:number; opens:number; clicks:number; }
```

Analytics response:
```
interface CampaignAnalytics {
	status:string; sent:number; opens:number; clicks:number;
	revenue?: number|null; orders?: number|null; ctr:number; openRate:number; roi?: number|null;
}
```

Summary analytics:
```
interface CampaignSummaryAnalytics {
	campaigns:number; totalSent:number; totalOpens:number; totalClicks:number;
	avgOpenRate:number; avgCtr:number; totalRevenue?:number|null; avgRoi?:number|null;
}
```

AB test setup body:
```
interface ABTestVariant { code:string; subject:string; templateId:number; splitPercent?:number; }
interface ABTestRequest { variants:ABTestVariant[]; samplePercent?:number; }
```

### 4. Frontend API Layer Additions (`src/api/campaigns.ts`)
Create a dedicated file encapsulating calls; each returns typed data and handles auth via existing axios instance.
Suggested functions:
```
listCampaigns()
getCampaign(id:number)
createCampaign(payload: CreateCampaignInput)
updateCampaign(id:number, payload: CreateCampaignInput)
scheduleCampaign(id:number, payload: ScheduleInput)
sendNow(id:number)
cancelCampaign(id:number)
getPreview(id:number)
setupAbTest(id:number, body: ABTestRequest)
getProgress(id:number)
getAnalytics(id:number)
runAnalysis(id:number)
getSummaryAnalytics()
requestApproval(id:number)
approveCampaign(id:number)
rejectCampaign(id:number, notes?:string)
```

### 5. State Management Pattern
Use React Query or lightweight custom hooks (if not yet installed) for caching & stale revalidation. If adding React Query:
```
npm install @tanstack/react-query
```
Create a `QueryClientProvider` in `main.tsx` and implement hooks: `useCampaigns`, `useCampaign(id)`, `useCampaignProgress(id, {pollMs})`.

Polling: progress & analytics should poll while status in `SENDING`.

### 6. UI Integration Plan
1. Replace placeholder Campaigns table with real data from `listCampaigns()`.
2. Add “Create Campaign” modal/dialog that collects: name, segment, template (autocomplete), subject, preheader, optional schedule datetime.
3. Detail page route: `/campaigns/:id`
	 - Tabs: Overview | A/B Test | Progress | Analytics | Approvals
	 - Overview: metadata + actions (Send Now, Schedule, Cancel, Request Approval)
	 - A/B Test: variant table + add/remove variant UI -> calls `setupAbTest`.
	 - Progress: show sent bar + opens/clicks; poll every 5–10s until status SENT.
	 - Analytics: fetch `getAnalytics` after status SENDING/SENT; show open rate, CTR, revenue, ROI (format as % where applicable).
	 - Approvals: if status REVIEW show Approve / Reject (with optional notes) buttons.
4. Summary analytics widget on dashboard using `getSummaryAnalytics()` (sparkline ready for future) .

### 7. Error Handling & Edge Cases
| Scenario | UX Handling |
|----------|-------------|
| 401 / 403 | Auto logout via existing interceptor |
| 409 / Illegal state (attempt invalid action) | Show toast with backend message |
| Empty segment result | Back-end returns recipients count as 0 – warn user before sending |
| A/B test variant split mismatch | Service normalizes; front-end may show recalculated splits after save |
| Polling after campaign completes | Stop polling when status `SENT` or `CANCELLED` |
| ROI values null | Display placeholder `—` not `0.00` |

### 8. Scheduling & Timezones
`scheduledAt`, `windowStart`, `windowEnd` are backend-local (send as UTC ISO). Frontend: always convert user local -> UTC before POST. Display using user locale with a timezone badge.

### 9. Approval Workflow
Statuses interplay:
```
DRAFT -> (requestApproval) REVIEW (approvalStatus=PENDING)
REVIEW -> (approve) stays REVIEW (approvalStatus=APPROVED) -> can schedule/send
REVIEW -> (reject) DRAFT (approvalStatus=REJECTED)
```
Disable editing form fields when not DRAFT or REVIEW. Hide Send Now if approval pending.

### 10. Progress & Analytics Polling Helper
Add a hook:
```
function usePolling(fn:()=>Promise<any>, enabled:boolean, intervalMs:number){ /* setInterval + clear + visibility pause */ }
```
Use `document.visibilityState` to pause when tab hidden.

### 11. ROI & Formatting
Open Rate = opens / sent (display percent with 1 decimal). CTR same. ROI = (revenue - cost)/cost (already precomputed). For `null` ROI show “N/A”. Revenue format with locale currency (configurable future multi-currency).

### 12. Types File (`src/types/campaign.ts`)
Centralize all interfaces & export them to avoid duplication in components.

### 13. Testing Strategy (Vitest)
Add tests for:
- Campaign API wrapper (mock axios)
- A/B variant setup form validation
- Status-based action enable/disable
- Polling hook stops at SENT

### 14. Performance Considerations
Batch refetch on tab focus using React Query’s `refetchOnWindowFocus`. Avoid aggressive polling (<5s) for large accounts. Consider WebSocket upgrade later.

### 15. Feature Flags / Progressive Delivery
Wrap A/B Test tab & Approval workflow behind a simple boolean env flag:
```
VITE_FEATURE_AB_TESTING=true
VITE_FEATURE_APPROVALS=true
```
Conditionally render UI if active; keeps deployment safe.

### 16. Suggested Folder Additions
```
src/
	api/campaigns.ts
	types/campaign.ts
	features/campaigns/
		components/
			CampaignList.tsx
			CampaignForm.tsx
			CampaignDetailTabs.tsx
			AbTestEditor.tsx
			AnalyticsPanel.tsx
			ProgressPanel.tsx
		pages/
			CampaignListPage.tsx
			CampaignDetailPage.tsx
		hooks/
			useCampaigns.ts
			useCampaign.ts
			useCampaignProgress.ts
			useCampaignAnalytics.ts
```

### 17. Minimal API Wrapper Example (`src/api/campaigns.ts`)
```
import api from './api';
import { Campaign, CampaignAnalytics, CampaignProgress, CampaignSummaryAnalytics, ABTestRequest } from '../types/campaign';

export const listCampaigns = () => api.get<Campaign[]>('/api/campaigns').then(r=>r.data);
export const getCampaign = (id:number) => api.get<Campaign>(`/api/campaigns/${id}`).then(r=>r.data);
export const createCampaign = (body:any) => api.post<Campaign>('/api/campaigns', body).then(r=>r.data);
export const updateCampaign = (id:number, body:any) => api.put<Campaign>(`/api/campaigns/${id}`, body).then(r=>r.data);
export const scheduleCampaign = (id:number, body:any) => api.post<Campaign>(`/api/campaigns/${id}/schedule`, body).then(r=>r.data);
export const sendNow = (id:number) => api.post<Campaign>(`/api/campaigns/${id}/send-now`,{}).then(r=>r.data);
export const cancelCampaign = (id:number) => api.post<Campaign>(`/api/campaigns/${id}/cancel`,{}).then(r=>r.data);
export const getPreview = (id:number) => api.get(`/api/campaigns/${id}/preview`).then(r=>r.data);
export const setupAbTest = (id:number, body:ABTestRequest) => api.post(`/api/campaigns/${id}/ab-test`, body).then(r=>r.data);
export const getProgress = (id:number) => api.get<CampaignProgress>(`/api/campaigns/${id}/progress`).then(r=>r.data);
export const getAnalytics = (id:number) => api.get<CampaignAnalytics>(`/api/campaigns/${id}/analytics`).then(r=>r.data);
export const runAnalysis = (id:number) => api.post(`/api/campaigns/${id}/analyze`,{}).then(r=>r.data);
export const getSummaryAnalytics = () => api.get<CampaignSummaryAnalytics>('/api/campaigns/summary/analytics').then(r=>r.data);
export const requestApproval = (id:number) => api.post(`/api/campaigns/${id}/request-approval`,{}).then(r=>r.data);
export const approveCampaign = (id:number) => api.post(`/api/campaigns/${id}/approve`,{}).then(r=>r.data);
export const rejectCampaign = (id:number, notes?:string) => api.post(`/api/campaigns/${id}/reject`, notes?{notes}:{ }).then(r=>r.data);
```

### 18. Security & Validation
Frontend should validate before POST:
| Field | Rule |
|-------|------|
| name | min length 2 |
| subject | not empty when sending/scheduling |
| segment | optional string |
| templateId | required for sending (enforce in UI) |
| scheduledAt | ISO future time |

### 19. Manual Test Checklist
1. Create draft campaign -> verify appears in list.
2. Update name & subject in DRAFT.
3. Request approval -> status REVIEW.
4. Approve -> schedule -> verify status SCHEDULED.
5. Send Now (or activate scheduled) -> status SENDING -> progress polling updates sent count.
6. Run Analyze -> ROI fields appear (if revenue computed).
7. Setup A/B test with 2 variants -> verify variants persisted.
8. Cancel a SCHEDULED campaign -> status CANCELLED.
9. View Summary analytics on dashboard.

### 20. Future Enhancements
| Area | Idea |
|------|------|
| Real-time | WebSocket push for progress instead of polling |
| Templates | Inline subject line suggestions (AI) |
| Segments | Dynamic builder UI & preview count pre-save |
| Analytics | Cohort & time-series overlays per campaign |
| ROI | Show cost breakdown & margin projections |

---

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
