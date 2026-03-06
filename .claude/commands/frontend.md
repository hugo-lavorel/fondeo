Read your role definition from .claude/agents/frontend.md.
Read CLAUDE.md for project context and conventions.

If a handoff slug is provided, read the corresponding handoff file from .claude/handoffs/.
Otherwise, treat the arguments as a direct task description.

Task: $ARGUMENTS

Steps:
1. Understand the requirements (from handoff or arguments)
2. Check that required API endpoints exist (read api/config/routes.rb and relevant controllers)
3. Read existing related frontend code before making changes
4. Implement the solution following React/TS conventions
5. If working from a handoff, update the handoff file with:
   - What was implemented
   - Decisions made and why
   - Any blockers or open questions
   - Update status to "done" if complete
6. Update .claude/handoffs/queue.json status

Always work in the web/ directory (except when reading API code for context).
