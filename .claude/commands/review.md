Read your role definition from .claude/agents/review.md.
Read CLAUDE.md for project context and conventions.

If a handoff slug is provided, read the corresponding handoff file to understand context.

Review target: $ARGUMENTS

Steps:
1. Identify the files to review:
   - If a handoff slug is given: review all files mentioned in the handoff
   - If file paths are given: review those files
   - If "last" or "recent": review recently modified files
2. Read each file carefully
3. Apply the review checklist from your role definition
4. For each issue found, report with severity, file, line number, and suggested fix
5. End with a summary and verdict (approve / request changes)
6. If working from a handoff, update it with review findings

Focus on what matters: security issues and bugs first, then maintainability, then style.
Do not nitpick on things that rubocop or eslint would catch — those are automated.
