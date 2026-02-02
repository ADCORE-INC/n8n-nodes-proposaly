# style-declarative-routing-patterns (CRITICAL)

**Rule:** In declarative nodes, centralize shared HTTP config in `requestDefaults`, and define each operation’s HTTP call via `routing.request`.

---

## Why this matters

Declarative nodes are easier to maintain when:

- base URL and shared headers live in one place,
- each operation is a small diff: method, path, and any query/body config,
- dynamic dropdowns (`loadOptions`) use the same routing primitives.

---

## Pattern: requestDefaults + routing.request

### ✅ Good: shared defaults

```ts
description: INodeTypeDescription = {
	// ...
	requestDefaults: {
		baseURL: 'https://api.acme.com',
		url: '',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	},
	properties: [
		// resource + operations + fields
	],
};
```
