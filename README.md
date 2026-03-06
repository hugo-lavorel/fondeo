# Fondeo

SaaS platform that helps businesses find and apply for public subsidies (departmental, regional, national, European).

## How it works

1. **Company & Project setup** - Users create an account, register their company, and describe their projects
2. **Subsidy matching** - The platform matches projects against all available subsidies based on eligibility criteria
3. **Information gathering** - For each eligible subsidy, the platform requests all required documents and additional information
4. **Application generation** - Once all documents are provided, the platform automatically generates the application files for each subsidy

## Tech stack

- **API**: Ruby on Rails 8.1 (API mode) — `api/`
- **Web**: React + TypeScript + Vite — `web/`
- **Database**: PostgreSQL
- **Ruby**: 4.0.1

## Project structure

```
fondeo/
├── api/          # Rails API backend
├── web/          # React TypeScript frontend (Vite)
└── mise.toml     # Tool version management
```

## Getting started

### Prerequisites

- Ruby 4.0.1 (managed via mise)
- Node.js
- PostgreSQL

### API

```bash
cd api
bundle install
rails db:setup
rails server
```

### Web

```bash
cd web
npm install
npm run dev
```

## Domain concepts

- **User** - Platform account
- **Company** - A user's business entity with its characteristics (sector, size, location, revenue, etc.)
- **Project** - A specific initiative within a company that may qualify for subsidies
- **Subsidy** - A public funding opportunity with eligibility criteria and required documents
- **Eligibility Rule** - A structured criterion that determines if a project/company qualifies for a subsidy
- **Application** - A generated dossier combining project info and required documents for a specific subsidy
