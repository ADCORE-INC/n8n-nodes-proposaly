# n8n Community Node Best Practices

Build production-quality **n8n community nodes** (npm packages) that feel native in the n8n editor, pass linting, and are _verification-ready_ when you want them to be.

This skill is designed to be loaded by AI coding agents (Cursor, Claude Code, etc.) when generating or reviewing code for:

- `*.node.ts` node files
- `*Description.ts` resource/operation descriptions
- `*.credentials.ts` credentials
- `package.json` metadata for community packages
- README/docs for publishing and user onboarding

---

## When to Apply

Use these guidelines when you are:

- Creating a new **community node package** (starting a repo / scaffolding).
- Implementing **resources + operations** for a REST API integration.
- Adding or changing **credentials** (API key, OAuth2, etc.).
- Implementing **pagination**, “Get Many”, “Search”, or dynamic dropdowns (`loadOptions`).
- Publishing to npm and/or preparing for **n8n verification**.
- Making a community node usable as a **Tool for AI Agents** (tool-mode UX & parameter descriptions).

Trigger phrases to treat as “apply this skill”:

- “n8n community node”, “custom n8n node”, “n8n-node CLI”
- “declarative node”, “routing”, “requestDefaults”
- “credentials file”, “API key / OAuth2”
- “node linter”, “eslint-plugin-n8n-nodes-base”
- “verified community node”, “no runtime dependencies”
- “usableAsTool”, “$fromAI”, “tool parameters”

---

## Rule Categories by Priority

| Priority | Category                    | Impact     | Prefix           |
| -------: | --------------------------- | ---------- | ---------------- |
|        1 | Community Package Standards | CRITICAL   | `std-`           |
|        2 | Node Style & Architecture   | CRITICAL   | `style-`         |
|        3 | Auth, HTTP, Errors          | HIGH       | `api-`, `error-` |
|        4 | UX & Output Contracts       | HIGH       | `ux-`            |
|        5 | Tooling, Linting, Release   | MEDIUM     | `tooling-`       |
|        6 | AI Tool Compatibility       | LOW–MEDIUM | `ai-`            |
|        7 | Security Hardening          | LOW–MEDIUM | `sec-`           |

---

## Quick Reference

### 1) Community Package Standards (CRITICAL)

- `std-package-standards` — Correct name prefix, keywords, package metadata.
- `std-package-json-n8n-field` — Correct `package.json.n8n` entrypoints for nodes/credentials.
- `std-verified-no-runtime-deps` — Verified nodes: **no runtime deps** (plan for it early).

### 2) Node Style & Architecture (CRITICAL)

- `style-choose-declarative-first` — Use declarative style for most REST nodes.
- `style-declarative-routing-patterns` — Use `requestDefaults` + per-operation `routing`.
- `style-programmatic-http-helper` — If programmatic, use n8n HTTP helpers (not axios).

### 3) Auth, HTTP, Errors (HIGH)

- `api-credentials-best-practices` — Credentials UX + secure handling.
- `api-pagination-and-get-all` — “Return All / Limit” patterns + safe pagination.
- `error-actionable-errors` — Surface actionable errors; support “Continue On Fail”.

### 4) UX & Output Contracts (HIGH)

- `ux-resource-locator-and-load-options` — Use Resource Locator; add dynamic dropdowns.
- `ux-simplify-delete-consistency` — Simplify output, delete output contract, consistent UX.

### 5) Tooling & Release (MEDIUM)

- `tooling-n8n-node-cli-lint-test` — Scaffold, dev, build, lint, release.
- `docs-readme-and-examples` — README structure + examples + compatibility + version history.

### 6) AI Tool Compatibility (LOW–MEDIUM)

- `ai-usable-as-tool-and-fromai` — `usableAsTool`, parameter descriptions, `$fromAI`.

### 7) Security Hardening (LOW–MEDIUM)

- `sec-secrets-and-logging` — Don’t leak secrets; validate URLs; minimize SSRF risk.

---

## How to Use

1. Start from the **n8n-node CLI** scaffolding for the right structure and metadata.
2. Choose **declarative style by default** (REST APIs).
3. Add **resources** and **operations** with consistent UX patterns.
4. Implement credentials securely and use n8n helpers for HTTP requests.
5. Run linting and test locally before publishing.
6. Publish to npm; optionally submit for verification when you meet constraints.
7. If you want AI Agent tool usage, optimize parameter descriptions and tool-mode UX.

---

## “Good Node” Output Contract (for AI Agents)

When generating or editing a community node:

- Prefer **declarative routing** for REST operations.
- Keep **runtime dependencies at zero** if verification is a goal.
- Ensure `package.json` includes proper `n8n` entrypoints.
- Follow n8n UX rules: Resource Locator where appropriate, Simplify for wide outputs, delete returns `{"deleted": true}`.
- Provide a README with: Installation, Operations, Credentials, Compatibility, Usage, Resources, Development, Version history.

See `AGENTS.md` for the consolidated checklist and the `rules/` folder for details.
