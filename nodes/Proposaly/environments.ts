/**
 * Canonical Proposaly public API hosts. Same values as Zapier `.env` and Make `baseUrl`.
 * n8n Cloud forbids `process.env` in community nodes, so the credential Environment
 * field is how a workflow picks test vs production. Local `.env` documents intent only.
 */
export const ProposalyApiUrls = {
	production: 'https://api.proposaly.io/v2/public-api',
	test: 'https://test-api.proposaly.io/v2/public-api',
} as const;

export type ProposalyEnvironment = keyof typeof ProposalyApiUrls;

export function resolveProposalyApiUrl(credentials: { url?: unknown }): string {
	const custom = typeof credentials.url === 'string' ? credentials.url.trim() : '';
	if (custom) {
		return custom.replace(/\/+$/, '');
	}
	return ProposalyApiUrls.production;
}
