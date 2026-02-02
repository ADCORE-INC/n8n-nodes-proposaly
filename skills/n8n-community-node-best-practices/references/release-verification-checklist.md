# Release & Verification Checklist

## Before publishing to npm

- [ ] `npm run build` produces `dist/`
- [ ] `npm run lint` passes
- [ ] Node shows up in local n8n and runs end-to-end
- [ ] README includes install/credentials/usage/compatibility
- [ ] Package includes `files: ["dist"]` (or equivalent)

## If submitting for verification

- [ ] Built from n8n-node scaffolding
- [ ] Meets technical guidelines
- [ ] Follows UX guidelines
- [ ] **No runtime dependencies**
- [ ] Documentation is public and complete
- [ ] All automated checks pass

Helpful links:

- Verification guidelines: https://docs.n8n.io/integrations/creating-nodes/build/reference/verification-guidelines/
- Node linter: https://docs.n8n.io/integrations/creating-nodes/test/node-linter/
- Build community nodes: https://docs.n8n.io/integrations/community-nodes/build-community-nodes/
