# Agent instructions

This repo is the Proposaly n8n community node (`Proposaly` + `Proposaly Trigger`).

Cursor-only files under `.cursor/rules/` are not loaded by other agents. Treat this file as canonical.

## Test new node work

When adding or changing a resource, operation, trigger, loadOptions method, or request payload, add tests in the same change. Do not ship node work without `npm test` passing.

- Put tests under `test/`. Mock HTTP with `test/helpers/context.ts`; never call the live Proposaly API.
- Exercise `Proposaly.execute()` or `ProposalyTrigger.poll()`, not only the operation handler.
- Cover the happy path plus empty results, optional/omitted fields, pagination vs limit, and first-poll seed vs later emit when those apply.
- Run `npm test`. If node files changed, also run `npm run lint`.
- Do not edit `eslint.config.mjs` (`n8n.strict` forbids it). Test files may disable the `node:test` import rule.

Example: a new Get Many operation needs an `execute()` routing case, a payload/pagination assertion, and a list-to-items check — not a handler-only happy path.
