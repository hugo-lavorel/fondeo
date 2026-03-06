Manage handoffs between agents.

Action: $ARGUMENTS

Supported actions:

1. **create <slug> <agent> <description>** — Create a new handoff
   - Read the template from .claude/handoffs/TEMPLATE.md
   - Create .claude/handoffs/<slug>.md from the template
   - Add the task to .claude/handoffs/queue.json
   - Status: "todo"

2. **start <slug>** — Mark a handoff as in progress
   - Update status to "in_progress" in both the handoff file and queue.json
   - Display the handoff content for context

3. **done <slug>** — Mark a handoff as complete
   - Update status to "done" in both the handoff file and queue.json
   - Prompt to update the handoff with a completion summary

4. **block <slug> <reason>** — Mark a handoff as blocked
   - Update status to "blocked" in both the handoff file and queue.json
   - Add the blocker reason

5. **list** — Show all tasks and their status from queue.json

6. **show <slug>** — Display the full handoff file

7. **cleanup** — Archive completed handoffs
   - Move done handoffs to .claude/handoffs/archive/
   - Remove them from queue.json

Always keep queue.json and handoff files in sync.
