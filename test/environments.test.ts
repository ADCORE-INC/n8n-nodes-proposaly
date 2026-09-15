/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ProposalyApiUrls, resolveProposalyApiUrl } from '../nodes/Proposaly/environments';

describe('Proposaly API environments', () => {
	it('lists the same test and production hosts as Zapier and Make', () => {
		assert.equal(ProposalyApiUrls.production, 'https://api.proposaly.io/v2/public-api');
		assert.equal(ProposalyApiUrls.test, 'https://test-api.proposaly.io/v2/public-api');
	});

	it('uses the saved credential URL', () => {
		assert.equal(
			resolveProposalyApiUrl({ url: ProposalyApiUrls.test }),
			ProposalyApiUrls.test,
		);
	});

	it('trims trailing slashes from the credential URL', () => {
		assert.equal(
			resolveProposalyApiUrl({ url: `${ProposalyApiUrls.test}/` }),
			ProposalyApiUrls.test,
		);
	});

	it('falls back to production when the credential URL is empty', () => {
		assert.equal(resolveProposalyApiUrl({ url: '  ' }), ProposalyApiUrls.production);
	});
});
