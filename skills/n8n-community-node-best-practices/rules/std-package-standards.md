# std-package-standards (CRITICAL)

**Rule:** Community node packages must follow n8n naming + metadata standards so they can be discovered, installed, and linted reliably.

---

## Why this matters

n8n community nodes are distributed as **npm packages**. n8n expects specific naming and metadata conventions to:

- recognize the package as a community node,
- load node + credential entrypoints,
- run the community node linter,
- (optionally) prepare for verification.

---

## Do

- Name your package:
  - `n8n-nodes-yourservice` **or**
  - `@scope/n8n-nodes-yourservice`
- Include the keyword: `n8n-community-node-package`
- Use the **n8n-node CLI** scaffolding to avoid missing required metadata.
- Keep your package metadata complete:
  - `license`
  - `repository`
  - `author`
  - `homepage` / `bugs` (recommended)
  - `files` includes your build output (`dist/`)

---

## Don’t

- Don’t publish packages that don’t follow the naming prefix. They won’t meet community standards.
- Don’t omit `n8n-community-node-package` from `keywords`.
- Don’t rely on “it works locally” if metadata is wrong — n8n won’t discover/load it properly.

---

## Example: minimal community-node-friendly package.json (illustrative)

```json
{
	"name": "n8n-nodes-acme",
	"version": "0.1.0",
	"description": "Acme integration for n8n",
	"license": "MIT",
	"keywords": ["n8n-community-node-package"],
	"files": ["dist"],
	"main": "index.js",
	"scripts": {
		"dev": "n8n-node dev",
		"build": "n8n-node build",
		"lint": "n8n-node lint",
		"release": "n8n-node release"
	},
	"engines": {
		"node": ">=18.17.0"
	}
}
```
