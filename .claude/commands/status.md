Show the current project status.

Read .claude/handoffs/queue.json and display:

1. **Active tasks** — Tasks with status "in_progress"
2. **Blocked tasks** — Tasks with status "blocked" (show the reason)
3. **Todo tasks** — Tasks with status "todo", ordered by priority
4. **Recently completed** — Tasks with status "done" (last 5)

For each task, show: slug, assigned agent, status, brief description.

Then do a quick health check:
- Are there any handoff files not tracked in queue.json?
- Are there any queue.json entries without a corresponding handoff file?
- Are there any tasks stuck in "in_progress" for too long (check dates)?

Report any inconsistencies found.
