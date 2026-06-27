# IMPLEMENTATION_PLAN.md — Master Index

> Detailed per-phase documentation lives in `docs/phases/`.  
> Each phase file is self-contained: context map, atomic steps, full LLM prompts, test plans.

---

## How to Execute

1. Read `AGENT.md` to load project context (GitNexus + Context7 sources)
2. Open the current phase doc in `docs/phases/`
3. For every step: fetch Context7 docs → run prompt → execute tests → record result
4. At phase end: run regression suite → write report to `docs/reports/phase-N-report.md`
5. Move to the next phase

---

## Phase Map

| Phase | Doc | Description | Status |
|---|---|---|---|
| 0 | [docs/phases/phase-0.md](docs/phases/phase-0.md) | Scaffold · Bun · bunfig · Docker · CI/CD · Pre-commit hooks · CSP | ⬜ |
| 1 | [docs/phases/phase-1.md](docs/phases/phase-1.md) | Types · Zod schemas · AI Provider (Mock + Claude) | ⬜ |
| 2 | [docs/phases/phase-2.md](docs/phases/phase-2.md) | Supabase clients · SQL migrations · RLS · Server Actions · Seed script | ⬜ |
| 3 | [docs/phases/phase-3.md](docs/phases/phase-3.md) | Landing Page (Hero · Features · Demo · FAQ · Pricing · CTA · Schema.org) | ⬜ |
| 4 | [docs/phases/phase-4.md](docs/phases/phase-4.md) | Auth Pages (Login · Register forms) | ⬜ |
| 5 | [docs/phases/phase-5.md](docs/phases/phase-5.md) | Dashboard (Layout · Generator · History · Profile) | ⬜ |
| 6 | [docs/phases/phase-6.md](docs/phases/phase-6.md) | Pricing Page · i18n · Sentry · Final Polish · Deploy | ⬜ |

---

## Toolchain Reference

| Task | Command |
|---|---|
| Install deps | `bun install` |
| Dev server | `bun dev` |
| Unit tests | `bun test` |
| Component tests (DOM) | `bun test --dom` |
| Test watch | `bun test --watch` |
| Coverage | `bun test --coverage` |
| E2E tests | `bun run test:e2e` |
| Type check | `bun run typecheck` |
| Lint | `bun run lint` |
| Build | `bun run build` |
| Add package | `bun add <pkg>` |
| Add dev package | `bun add -d <pkg>` |
| Run binary | `bunx <pkg>` |
| Supabase types | `bun run gen:types` |
| Seed dev data | `bun run db:seed` |
| Install hooks | `bun run prepare` |

---

## Regression Checklist (run at every phase end)

```bash
bun run typecheck      # 0 TypeScript errors
bun run lint           # 0 ESLint warnings
bun test               # all unit/integration tests green
bun run build          # production build succeeds
```

E2E (Phase 4+):

```bash
bun run test:e2e
```

---

## Reports

```
docs/reports/
├── phase-0-report.md
├── phase-1-report.md
├── phase-2-report.md
├── phase-3-report.md
├── phase-4-report.md
├── phase-5-report.md
├── phase-6-report.md
└── final-report.md
```
