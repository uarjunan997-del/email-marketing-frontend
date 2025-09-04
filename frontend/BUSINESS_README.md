# Email Marketing Frontend – Business Overview

This document explains the product value, core workflows, KPIs, and future commercial considerations for non‑engineering stakeholders.

## 1. Product Value Proposition
Enable marketing teams (SMBs → mid‑market) to design, manage, and analyze email campaigns faster with:
- Drag‑and‑drop template editing (Unlayer) + version history
- Centralized template library with tagging, search, and cloning
- Performance dashboard (engagement, growth, quality signals)
- Extensible architecture for campaigns, contacts, automation, and analytics

## 2. Primary User Personas
| Persona | Goals | Key Needs |
|---------|-------|-----------|
| Marketing Manager | Launch consistent branded campaigns | Fast iteration, approvals, reporting snapshots |
| Email Specialist | Build and optimize templates | Reusable blocks, A/B support (future), version rollback |
| Growth Lead | Track funnel impact | KPI visibility, trend deltas, segmentation insights |
| Compliance / Brand Reviewer | Ensure brand & legal adherence | Locked components (future), audit trail |

## 3. Core Functional Modules (Phase 1 Implemented vs Planned)
Implemented (MVP):
- Auth (login/register, token persistence)
- Dashboard (sample metrics + chart placeholder)
- Template Editor (design, save, clone, test send stub)
- Template Gallery (tagging, search, version history, restore)
- Dark/Light theming

In Progress / Ready for Backend Wiring:
- Template backend abstraction (local vs REST switch via `VITE_TEMPLATES_BACKEND`)
- Metadata auto‑save (debounced) & version capture

Future (Prioritized Roadmap):
1. Campaign Execution (schedule, test groups, throttling)
2. Contact Management (lists, segments, suppression, enrichment)
3. Automation Flows (drip/onboarding triggers)
4. Deliverability & Health (bounce classifications, spam rate, domain warmup)
5. A/B & Multivariate Testing
6. Role-Based Access & Plan Limits
7. Marketplace for Template Packs / Blocks

## 4. Success Metrics (Initial KPI Set)
Foundational (pre‑revenue validation):
- Weekly Active Template Editors (WATE)
- Templates Created per Account
- Save → Send Test Conversion Rate
- Time-to-First-Saved Template (TTFST)

Growth / Engagement (post-campaign features):
- Campaign Send Volume / Account
- Open Rate, Click‑Through Rate (CTR), Unsubscribe Rate
- Version Rollback Frequency (quality indicator)
- Template Reuse Ratio (clones / total templates)

Retention / Expansion:
- Active Accounts (Last 30d)
- Feature Adoption Breadth (# modules used/account)
- Churn % and Expansion MRR (once billing live)

## 5. Data Model Highlights (Frontend Perspective)
Template Record:
- id, name, subject, preheader, tags[], status, updatedAt
- design (Unlayer JSON)
- versions[] (id, createdAt, design, htmlSnippet)
- thumbnail (declarative preview placeholder; can be upgraded to rendered image)

Abstraction Layer:
- `templatesBackend` chooses localStorage vs REST (`VITE_TEMPLATES_BACKEND=rest`).
- Allows incremental backend rollout without refactoring UI components.

## 6. Competitive Differentiators (Target Direction)
| Area | Direction |
|------|-----------|
| Speed to iterate | Live auto‑save + diffable version stack |
| Personalization | Variable insertion + future dynamic data APIs |
| Governance | Version restore + audit trail (planned) |
| Extensibility | Pluggable backends, modular UI primitives |
| Insight Depth | Cohort + deliverability analytics (future) |

## 7. Go-To-Market Phases
Phase A (Internal / Alpha): Template builder reliability, feedback loop.
Phase B (Private Beta): Early design partners, manual onboarding, add campaign send MVP.
Phase C (Public Beta): Pricing toggles, usage metering, documentation, deliverability metrics.
Phase D (Scale): Automation flows, marketplace, advanced segmentation, compliance tooling.

## 8. Pricing & Packaging (Draft Concepts)
- Free Tier: Limited templates, capped sends, basic analytics.
- Pro: Higher template versions, A/B testing, segmentation, priority support.
- Growth: Advanced automation, deliverability panel, role-based access, SLA.
- Add‑Ons: Dedicated IP warmup, template marketplace credits.

## 9. Risk & Mitigation (Early)
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Vendor lock on editor | Hard to switch | Abstract template design API |
| Deliverability complexity | Customer dissatisfaction | Partner with ESP / seed inbox monitoring vendors |
| Performance regressions | Editor UX friction | Incremental profiling & CI perf budgets |
| Inconsistent branding | Brand dilution | Future locked blocks + approval workflow |

## 10. Near-Term Engineering Enhancements (High Leverage)
- Implement real thumbnail capture (html2canvas) + async meta update
- Add version diff (JSON hash or semantic diff)
- Introduce optimistic UI for auto-saves (toast or status badge)
- Add integration tests around backend mode switching

## 11. Operational Notes
Environment Flags:
- `VITE_TEMPLATES_BACKEND=local|rest`
- `VITE_API_BASE` for REST base URL

Security (frontend scope):
- Token stored (should move to httpOnly cookie server-side for production)
- Future: CSRF protection when cookie-based auth implemented

## 12. Hand-off & Documentation
This business overview complements `README.md` (developer-focused). Keep both updated when shipping:
- New feature flags
- Pricing changes
- KPI definition adjustments

---
Owned by: Product & Engineering (shared). Update cadence: review quarterly or alongside major release.
