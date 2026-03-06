Read your role definition from .claude/agents/tests.md.
Read CLAUDE.md for project context and conventions.

If a handoff slug is provided, read the corresponding handoff file from .claude/handoffs/.
Otherwise, treat the arguments as a direct task description.

Task: $ARGUMENTS

Steps:
1. Read the source code that needs testing
2. Identify what needs test coverage: models, services, controllers, components, hooks
3. Write tests following the conventions in your role definition
4. Run the tests:
   - Backend: cd api && bundle exec rails test
   - Frontend: cd web && npm run test
5. If tests fail, read the error carefully:
   - If it's a test bug, fix the test
   - If it's a source bug, document it in the handoff and flag it
6. Iterate until all tests pass
7. Update the handoff with test coverage summary

When writing tests, prioritize:
1. Happy path (the feature works as expected)
2. Validation errors (bad input is rejected)
3. Edge cases (empty data, boundary values)
4. Authorization (users can only access their own data)
