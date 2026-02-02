# ai-usable-as-tool-and-fromai (LOW–MEDIUM)

**Rule:** If your node should be used by AI Agents as a tool, optimize parameter descriptions and tool-mode behavior explicitly.

---

## Why this matters

Tools used by an agent are only as good as:

- their parameter descriptions,
- how predictable the outputs are,
- how safely they handle ambiguous inputs.

Some community nodes document that they can be used as AI tools and mention:

- adding a `usableAsTool: true` flag (depending on n8n version/types),
- setting an environment variable to allow community nodes as tools.

Also, n8n supports `$fromAI()` to let the model fill tool parameters based on context.

---

## Do (tool-ready UX)

- Make field descriptions explicit and “agent-readable”:
  - Include constraints (“must be a URL”, “ISO 8601 date”, “max 50”)
  - Clarify what happens on failure
- Prefer fewer required fields; use safe defaults.
- Keep output shape stable and concise.
- For “search” style tools, return the most useful fields first.

---

## Don’t

- Don’t rely on implicit meaning (“id”, “query”) without description.
- Don’t output huge nested blobs by default if the tool is meant for reasoning.

---

## $fromAI() examples (for users)

Users can enable AI-filled parameters in tool mode and customize expressions.

```js
{
	{
		$fromAI('url', 'The URL to scrape', 'string');
	}
}
{
	{
		$fromAI('query', 'Search query to run', 'string');
	}
}
```
