# CLAUDE.md

## Project overview

Fondeo is a SaaS that helps businesses in the agro-food sector discover and apply for public subsidies. Monorepo with a Rails API backend and a React TypeScript frontend.

## Repository structure

- `api/` — Rails 8.1 API (Ruby 4.0.1, PostgreSQL)
- `web/` — React + TypeScript + Vite frontend

## Commands

### API (from `api/`)

- `bundle exec rails server` — Start the API server
- `bundle exec rails test` — Run all tests
- `bundle exec rails test test/path/to/test.rb` — Run a specific test file
- `bundle exec rails db:migrate` — Run migrations
- `bundle exec rubocop` — Lint Ruby code
- `bundle exec brakeman` — Security analysis

### Web (from `web/`)

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — Lint TypeScript/React code

## Architecture decisions

### Subsidy matching engine

Subsidies have structured eligibility rules stored in an `eligibility_rules` table. Each rule defines:
- `field` — The attribute to check (e.g., `company.sector`, `company.employee_count`, `project.budget`)
- `operator` — Comparison operator (`eq`, `neq`, `in`, `not_in`, `gte`, `lte`, `between`, `contains`)
- `value` — Expected value (stored as JSONB for flexibility)

This allows automatic matching of projects/companies against subsidies via SQL queries.

### Project data architecture

Project data is stored in flat columns on the `projects` table (for AI-queryable structured data) plus separate tables for nested concerns:
- `project_permits` — optional 1:1 building permit block, managed via `accepts_nested_attributes_for` with `_destroy` support
- `expenses` — project cost items with investment type, financing details, and timeline dates
- `process_items` — production process inputs/outputs with customs codes, percentages (sum ≤ 100% per direction), and certifications (JSONB array)

### API conventions

- Rails API-only mode (no views, no asset pipeline)
- PostgreSQL with JSONB for flexible data
- Cookie-based session authentication (14-day expiry, httponly, SameSite=Lax)
- RESTful JSON API under `/api/v1/`

### API routes

```
POST   /api/v1/signup, login, DELETE logout, GET me
GET/POST /api/v1/company (singular resource)
CRUD   /api/v1/projects
CRUD   /api/v1/projects/:id/expenses
CRUD   /api/v1/projects/:id/process_items
```

### Frontend conventions

- React 19 with TypeScript (strict mode)
- Vite for build tooling
- shadcn/ui component library (Tailwind CSS)
- BAN API (Base Adresse Nationale) for French address autocomplete — free, no API key

### Frontend pages

- `LandingPage` — Public landing
- `LoginPage` / `SignupPage` — Authentication
- `OnboardingPage` — Company creation with NAF code autocomplete and address autocomplete
- `DashboardPage` — Company info cards + project grid (cards with expense summaries)
- `SettingsPage` — Company edit form
- `NewProjectPage` — Multi-step project creation (4 steps: General, Location & Contact, Conditionnement, Immobilier)
- `ProjectPage` — Full project view with editable sections (hover-reveal edit buttons), expense table, process items (inputs/outputs)

## Key domain models

- **User** — Authentication (cookie-based sessions) and account
- **Company** — Business entity (name, SIREN, NAF code, sector, employee range, revenue range, legal form, address with street/postal_code/city/department/region)
- **Project** — Initiative within a company seeking funding (name, objective, process_before/process_after descriptions, location fields, contact person, building permit flag)
- **ProjectPermit** — Optional building permit details (belongs_to project; submission date, is_extension, area_sqm, usage, works dates/duration). Managed via `accepts_nested_attributes_for`
- **Expense** — Project cost item (name, amount HT, investment_type, financing_type with conditional loan fields, quotes_count, quote/works/commissioning dates). Investment types: building, equipment, software, consulting, training, r_and_d. Financing types: self_funded, loan, leasing (leasing expenses are not subsidy-eligible)
- **ProcessItem** — Production process input/output (belongs_to project; direction input/output, name, customs_code, percentage, certifications as JSONB array). Total percentage per direction is validated to not exceed 100%
- **Subsidy** — Public funding opportunity (source level, deadlines, amounts, required documents) *(planned)*
- **EligibilityRule** — Structured criterion linked to a subsidy for automatic matching *(planned)*
- **Application** — Generated dossier for a specific subsidy + project combination *(planned)*

## Code style

- Ruby: follow rubocop-rails-omakase conventions
- TypeScript: strict mode, functional components, hooks
- Write tests for all new features
- French user-facing content, English code and comments

## Agent system

### Agents

Six specialized agents, defined in `.claude/agents/`:

| Agent | File | Scope |
|-------|------|-------|
| Orchestrator | `orchestrator.md` | Plan features, decompose tasks, manage workflow |
| Backend | `backend.md` | Rails models, services, controllers, migrations |
| Frontend | `frontend.md` | React components, hooks, pages, API client |
| Tests | `tests.md` | Minitest (backend) + Vitest/RTL (frontend) |
| Review | `review.md` | Code review: security, quality, conventions |
| Docs | `docs.md` | README, CLAUDE.md, ADRs, API docs, changelog |

### Slash commands

| Command | Description |
|---------|-------------|
| `/plan <feature>` | Orchestrator decomposes a feature into tasks |
| `/backend <task or slug>` | Backend dev work |
| `/frontend <task or slug>` | Frontend dev work |
| `/test <task or slug>` | Write and run tests |
| `/review <slug or files>` | Code review |
| `/docs <task or slug>` | Update documentation |
| `/handoff <action> [args]` | Manage handoffs (create, start, done, block, list, show, cleanup) |
| `/status` | Show project status and task health check |

### Handoff system

Handoffs track work between agents and across sessions:

- **Queue**: `.claude/handoffs/queue.json` — index of all tasks with status
- **Handoff files**: `.claude/handoffs/<slug>.md` — detailed context per task (uses YAML frontmatter)
- **Template**: `.claude/handoffs/TEMPLATE.md` — structure for new handoffs
- **Archive**: `.claude/handoffs/archive/` — completed handoffs

Statuses: `todo` -> `in_progress` -> `done` (or `blocked`)

### Workflow

1. `/plan <feature>` — Orchestrator creates handoffs for each task
2. `/backend <slug>` or `/frontend <slug>` — Dev agent works from the handoff
3. `/test <slug>` — Tests agent writes and runs tests
4. `/review <slug>` — Review agent checks the implementation
5. `/docs <slug>` — Docs agent updates documentation
6. `/handoff done <slug>` — Mark task complete
