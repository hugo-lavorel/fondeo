Read your role definition from .claude/agents/orchestrator.md.
Read the current handoff queue from .claude/handoffs/queue.json.
Read CLAUDE.md for project context and conventions.

Your task: Plan and decompose the following feature into actionable tasks.

Feature request: $ARGUMENTS

Steps:
1. Analyze the feature and identify what needs to change in backend, frontend, or both
2. Break it down into tasks (max 5-8 files per task)
3. Define dependencies between tasks
4. For each task, create a handoff file using the template at .claude/handoffs/TEMPLATE.md
5. Update .claude/handoffs/queue.json with all new tasks
6. Present the plan as a numbered list with task slugs, assigned agents, and dependency order

Important:
- Backend tasks before frontend tasks when there are API dependencies
- Always include a test task for each dev task
- Include a review task at the end
- Include a docs task if the feature changes public API or architecture
