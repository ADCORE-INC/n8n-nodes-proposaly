# docs-readme-and-examples (MEDIUM)

**Rule:** Your README is part of the product. Use a predictable structure and include enough context for real users to succeed.

---

## Why this matters

Community nodes are installed by users who may never read your source code.
If docs are weak, users churn to the HTTP Request node or abandon the integration.

n8n expects appropriate documentation (README in npm package or public repo).

---

## Recommended README structure (proven pattern)

Use a structure like many popular community nodes:

1. **What it is**
2. **Installation**
3. **Operations**
4. **Credentials**
5. **Compatibility** (tested n8n version)
6. **Usage** (common examples + gotchas)
7. **Resources** (API docs, n8n docs)
8. **Development**
9. **Version history / changelog**

---

## Minimum content that prevents support tickets

- Installation link to n8n community nodes docs
- Clear steps to obtain API key / OAuth credentials
- At least 1 worked example:
  - inputs
  - expected output shape
- Compatibility statement (which n8n versions you tested)

---

## Checklist

- [ ] Installation section links to official n8n community node installation docs
- [ ] Operations listed (resource + operation names)
- [ ] Credentials section explains how to obtain secrets
- [ ] Compatibility notes tested n8n version(s)
- [ ] Version history maintained

---

## References

- Example README structure: brave/n8n-nodes-brave-search
- Example README with AI tool usage section + version history: firecrawl/n8n-nodes-firecrawl
- n8n community nodes doc requires appropriate documentation: docs.n8n.io/integrations/community-nodes/build-community-nodes/
