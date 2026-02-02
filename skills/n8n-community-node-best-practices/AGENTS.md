# n8n Community Node Best Practices (Agent Playbook)

This document is a consolidated playbook for building _native-feeling_ n8n community nodes.

Use the `rules/` folder for the detailed rule writeups and examples.

---

## “Ship Checklist” (copy/paste)

### Package & Standards

- [ ] Package name starts with `n8n-nodes-` or `@scope/n8n-nodes-`
- [ ] `keywords` includes `n8n-community-node-package`
- [ ] `package.json.n8n` lists compiled entrypoints for nodes + credentials
- [ ] If aiming for verification: **no runtime dependencies**

### Node Style

- [ ] REST integration implemented in **declarative style** unless there’s a strong reason not to
- [ ] `requestDefaults` set for base URL + shared headers (declarative)
- [ ] Operations include `action` text that reads well in the UI

### UX

- [ ] Uses Resource Locator where selecting a single item makes sense
- [ ] “Get Many / Search” supports Return All + Limit
- [ ] Delete returns `[{ "deleted": true }]`
- [ ] If response is wide (10+ fields), provide `Simplify` toggle

### Auth & HTTP

- [ ] Credentials are defined in a `*.credentials.ts` file
- [ ] Requests use n8n HTTP helper (programmatic) or `routing` (declarative)
- [ ] Errors are actionable (status, message, hint), without leaking secrets
- [ ] “Continue On Fail” respected (when applicable)

### Tooling

- [ ] `npm run lint` passes
- [ ] Node tested locally via `n8n-node dev` (or equivalent)
- [ ] README includes Installation, Operations, Credentials, Compatibility, Usage, Resources, Development, Version history

### AI Tool Mode (Optional)

- [ ] Node supports tool usage cleanly (clear parameter descriptions, concise outputs)
- [ ] If supported by your n8n version/setup, node can be marked usable as a tool (`usableAsTool: true`)
- [ ] Docs mention any required env vars for tool usage and show `$fromAI()` examples

---

## Rule Index

### 1) Community Package Standards (CRITICAL)

- rules/std-package-standards.md
- rules/std-package-json-n8n-field.md
- rules/std-verified-no-runtime-deps.md

### 2) Node Style & Architecture (CRITICAL)

- rules/style-choose-declarative-first.md
- rules/style-declarative-routing-patterns.md
- rules/style-programmatic-http-helper.md

### 3) Auth, HTTP, Errors (HIGH)

- rules/api-credentials-best-practices.md
- rules/api-pagination-and-get-all.md
- rules/error-actionable-errors.md

### 4) UX & Output Contracts (HIGH)

- rules/ux-resource-locator-and-load-options.md
- rules/ux-simplify-delete-consistency.md

### 5) Tooling, Linting, Release (MEDIUM)

- rules/tooling-n8n-node-cli-lint-test.md
- rules/docs-readme-and-examples.md

### 6) AI Tool Compatibility (LOW–MEDIUM)

- rules/ai-usable-as-tool-and-fromai.md

### 7) Security Hardening (LOW–MEDIUM)

- rules/sec-secrets-and-logging.md

---

## References

See `references/official-docs.md` and `references/popular-nodes.md`.
