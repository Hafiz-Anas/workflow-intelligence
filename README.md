# Workflow Intelligence Platform (frontend demo)

Decision support and workflow optimization for senior decision-makers, approvers and administrators.
This build is a **vision demo**: every figure, name and recommendation is sample data, and the app says so
with a "Demo mode" banner under the top bar.

## Run it

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (type-checks and lints)
npm start          # serve the production build
npm run lint
npm run typecheck
```

> On Windows, start the dev server from the folder's real on-disk casing (for example
> `C:\Users\<you>\Documents\Raid-techs\dashboard`). If the path casing differs, webpack warns about
> "multiple modules with names that only differ in casing".

## Screens

| Route | Screen |
|---|---|
| `/priority-queue` | Priority Queue with summary cards, a sortable and filterable request table, and the Attention Clock |
| `/decision-brief/[id]` | Decision Brief: relationship strip, document sections with clickable phrases, Connected Context panel, timeline and sign-off. `/decision-brief` opens the highest-priority request |
| `/authority-map` | Authority and Routing Map: KPIs, tier hierarchy, active policy sources, and the Rule Tester |
| `/bottlenecks` | Bottlenecks and Performance: alert, charts, detected patterns, improvement over time, process simplification, and the most delayed requests |
| `/risk-matrix` | Risk Matrix: KPIs, 5×5 heatmap, contract health table, and signal diagnostics |
| `/connectors` | Connectors and Policy Library: pipeline strip, policy upload, repository manifest, and the connectors grid |

## Folder structure

```
src/
  app/
    layout.tsx                 Root layout: fonts, providers
    providers.tsx              TanStack Query, next-themes, tooltips, toasts
    (app)/layout.tsx           App shell (sidebar, top bar, demo banner)
    (app)/<screen>/page.tsx    One folder per screen
  components/
    layout/                    Sidebar, Topbar, PageHeader, DemoBanner, GlobalSearch, MiniTimer
    ui/                        shadcn/ui primitives (Radix based)
    shared/                    DetailDrawer, PolicyDrawer, StatCard, StatusBadge, DataTable, EmptyState, ...
    queue/ brief/ authority/ bottlenecks/ risk/ connectors/   Screen components
  lib/
    schemas/                   Zod schemas and inferred types for every entity
    mock/                      DEMO sample data (each file is marked "DEMO")
    api/                       Data-access functions; the only layer that touches data
    hooks/                     TanStack Query hooks used by components
    store/                     Zustand stores: attention clock, queue filters, UI
    config/                    locale.ts (currency, language, org, user) and nav.ts
    rules.ts                   Authority routing rule shared by the Rule Tester and the queue
    format.ts                  formatMoney, formatDuration, formatDate, ...
  styles/globals.css           Design tokens (CSS variables) for light and dark mode
```

### How data flows

```
component  →  hook (lib/hooks)  →  api function (lib/api)  →  mock data (lib/mock, via lib/api/db.ts)
```

Components never import mock data. Every API function returns a Promise, validates its output with the
matching Zod schema, and waits 300 to 600 ms so loading skeletons are visible.

## Swapping the mock layer for a real backend

Only `src/lib/api` needs to change. Each function has a typed input and output, for example:

| Function | Returns |
|---|---|
| `getRequests()`, `getQueueSummary()`, `getTopRequestId()` | queue data |
| `getDecisionBrief(id)`, `submitDecision(input)` | brief and sign-off |
| `getTiers()`, `getAuthorityKpis()`, `testRule(input)` | authority map |
| `getPolicies()`, `getPolicy(id)`, `uploadPolicy(input)`, `replacePolicy(input)` | policy library |
| `getContracts()`, `getContractRisk(id)`, `getRiskKpis()`, `recordRiskAction(id)` | risk matrix |
| `getBottleneckReport()`, `getPatterns()`, `updatePatternStatus(input)` | performance |
| `getConnectors()`, `configureConnector(input)`, `testConnection(input)`, `getPipelineStatus()` | connectors |

Steps:

1. Replace each function body with a `fetch` call to your API, and keep the `schema.parse(...)` call on the response.
2. Throw `ApiError` (from `lib/api/errors.ts`) with the HTTP status so screens show the right error state.
3. Delete `src/lib/api/db.ts` and `src/lib/mock/`.
4. `src/lib/rules.ts` holds the tier routing logic used by the mock `testRule`. Keep it on the server or remove it.

Screens, hooks and stores do not need to change.

## Locale, currency and organization

Edit `src/lib/config/locale.ts`:

```ts
export const currency = "USD";                      // any ISO 4217 code, e.g. "EUR", "AED", "SAR"
export const locale = "en";                         // BCP 47 tag used by Intl formatting and <html lang>
export const organizationName = "Regional Utilities Authority";
export const currentUser = { name: "Sample User", role: "Director of Operations" };
export const direction = "ltr";                     // set "rtl" for right-to-left languages
```

All money goes through `formatMoney()`, so no currency symbol is hardcoded. Layout uses logical
utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) so RTL can be enabled later.

## Drawers

Extra, detailed or secondary data opens in a side drawer, not a centered modal, and is never squeezed into the
main layout. Use `DetailDrawer` (`src/components/shared/DetailDrawer.tsx`), built on the shadcn Sheet:

```tsx
<DetailDrawer
  open={selected !== null}
  onOpenChange={(open) => !open && setSelected(null)}
  title="Contract Risk Review"
  subtitle="REQ-2026-0422 · Asset Management"
  side="right"            // default; "left" only when a right-side drawer is also used on the screen
  width="md"              // "md" = 480px, "lg" = 640px
  isLoading={isLoading}   // built-in skeleton
  isEmpty={!data}         // built-in empty state
  footer={<Button>Primary action</Button>}  // sticky action area
>
  …
</DetailDrawer>
```

- Escape and a click on the overlay close it. Focus stays inside while it is open and returns to the trigger
  when it closes. The title labels the drawer (`aria-labelledby`).
- The drawer and its overlay start below the top bar, so the Attention Clock indicator is never covered.
- It slides in over 200 ms (150 ms out), with no animation when the user prefers reduced motion.
- Open state lives in the page (one `drawer` union per screen, so only one drawer is open at a time). It is not
  in the URL.
- `DrawerFacts` and `DrawerSection` give drawer bodies a consistent layout. `useLastDefined` keeps content in
  place while the close animation plays.

Use a centered `Dialog` only for a short, focused confirmation that collects no browsing data. In this app that
is only the Decision Brief sign-off (Approve, Decline, Escalate, each with a required comment of at least 15
characters).

## Design tokens

Colors are CSS variables in `src/styles/globals.css`, with light values on `:root` and dark values on
`.dark`. Tailwind maps them to classes such as `bg-card`, `text-muted-foreground`, `text-danger` and
`bg-heat-3`. Components never use raw color values.

The spec's `--success` and `--warning` in light mode are below WCAG AA contrast for small text on white.
They are kept for fills (bars, dots, borders), and `--success-fg` and `--warning-fg` (`text-success-fg`,
`text-warning-fg`) are darker variants for text.

## Sample data

- Every file in `src/lib/mock` starts with a `DEMO:` comment.
- The recommendation's confidence is labelled "Sample confidence" and is illustrative only.
- Decisions, uploads and connector changes are stored in memory and reset when the page is reloaded.
