# CLAUDE.md

## Project overview

Fondeo is a SaaS that helps businesses discover and apply for public subsidies. Monorepo with a Rails API backend and a React TypeScript frontend.

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

### API conventions

- Rails API-only mode (no views, no asset pipeline)
- PostgreSQL with JSONB for flexible data
- RESTful JSON API

### Frontend conventions

- React with TypeScript (strict mode)
- Vite for build tooling

## Key domain models

- **User** — Authentication and account
- **Company** — Business entity (sector, size, location, SIRET, revenue, legal form, etc.)
- **Project** — Initiative within a company seeking funding
- **Subsidy** — Public funding opportunity (source level, deadlines, amounts, required documents)
- **EligibilityRule** — Structured criterion linked to a subsidy for automatic matching
- **Application** — Generated dossier for a specific subsidy + project combination

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
