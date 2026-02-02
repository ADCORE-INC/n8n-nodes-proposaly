# style-choose-declarative-first (CRITICAL)

**Rule:** Use **declarative** style for most nodes. Use **programmatic** style only when you must.

---

## Why this matters

n8n supports two node-building styles:

- **Declarative:** JSON-like configuration + `routing` objects, simpler and more future-proof for REST APIs.
- **Programmatic:** `execute()` method builds requests and transforms data manually.

n8n explicitly recommends declarative style for most nodes.

---

## Use Declarative Style When

- You’re integrating with a REST API.
- Operations map cleanly to HTTP methods.
- You can express request building via `requestDefaults` + per-operation `routing`.

---

## Use Programmatic Style When

You _must_ use programmatic style for:

- Trigger nodes
- Non-REST integrations (e.g., GraphQL)
- Nodes that need to transform incoming data
- Nodes that require external dependencies
- Full node versioning (advanced)

---

## Checklist

- [ ] REST API integration? Start declarative.
- [ ] Trigger or GraphQL or heavy transforms? Use programmatic.
- [ ] If you choose programmatic, document _why_ in code comments.

---

## References

- Choose node building approach: docs.n8n.io/integrations/creating-nodes/plan/choose-node-method/
