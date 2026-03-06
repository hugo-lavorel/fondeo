Read your role definition from .claude/agents/docs.md.
Read CLAUDE.md for current project documentation state.

If a handoff slug is provided, read the corresponding handoff file to understand what changed.
Otherwise, treat the arguments as a direct documentation task.

Task: $ARGUMENTS

Steps:
1. Identify what documentation needs creating or updating
2. Read the current state of relevant docs
3. Make targeted, minimal updates
4. If a significant architectural decision was made, create an ADR in docs/adr/
5. If API endpoints were added/changed, update docs/api/
6. If working from a handoff, update it with what was documented

Keep documentation:
- Concise and example-driven
- Accurate with the current state of the code
- In English for technical docs, French for user-facing content
