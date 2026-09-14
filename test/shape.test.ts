/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diffPollRecords, flattenLead, resolvePollLimit } from '../nodes/Proposaly/shape';

test('flattenLead lifts the first recipient and aliases client_name', () => {
	const flattened = flattenLead({
		lead_id: 'lead-1',
		workspace_id: 'ws-1',
		company: 'Acme',
		date_created: 1,
		recipients: [
			{
				first_name: 'Ada',
				last_name: 'Lovelace',
				email: 'ada@example.com',
				phone_number: '+1555',
				access_level: 'viewer',
				recipient_id: 'r1',
				document_id: 'd1',
				status: 'active',
				blocked: false,
			},
		],
	});

	assert.equal(flattened.id, 'lead-1');
	assert.equal(flattened.client_name, 'Acme');
	assert.equal(flattened.company, 'Acme');
	assert.equal(flattened.email, 'ada@example.com');
	assert.equal(flattened.first_name, 'Ada');
	assert.equal(flattened.last_name, 'Lovelace');
	assert.equal(flattened.phone_number, '+1555');
	assert.equal(flattened.recipients?.length, 1);
});

test('flattenLead keeps recipients and uses client_name when company is missing', () => {
	const flattened = flattenLead({
		lead_id: 'lead-2',
		client_name: 'Jamie',
		recipients: [],
	});

	assert.equal(flattened.client_name, 'Jamie');
	assert.equal(flattened.company, 'Jamie');
	assert.equal(flattened.email, null);
	assert.equal(flattened.last_name, 'Jamie');
});

test('first production poll seeds the cursor and emits nothing', () => {
	const result = diffPollRecords({
		records: [{ id: 'c' }, { id: 'b' }, { id: 'a' }],
		lastId: undefined,
		getId: (record) => record.id,
		newestFirst: true,
		mode: 'trigger',
	});

	assert.deepEqual(result.emit, []);
	assert.equal(result.nextId, 'c');
});

test('manual first poll returns a sample without replaying the full history', () => {
	const result = diffPollRecords({
		records: [{ id: 'c' }, { id: 'b' }, { id: 'a' }],
		lastId: undefined,
		getId: (record) => record.id,
		newestFirst: true,
		mode: 'manual',
	});

	assert.deepEqual(
		result.emit.map((record) => record.id),
		['c'],
	);
	assert.equal(result.nextId, 'c');
});

test('subsequent newest-first polls emit only records newer than the cursor', () => {
	const result = diffPollRecords({
		records: [{ id: 'e' }, { id: 'd' }, { id: 'c' }, { id: 'b' }],
		lastId: 'c',
		getId: (record) => record.id,
		newestFirst: true,
		mode: 'trigger',
	});

	assert.deepEqual(
		result.emit.map((record) => record.id),
		['e', 'd'],
	);
	assert.equal(result.nextId, 'e');
});

test('limit on newest-first polls processes oldest new records first', () => {
	const result = diffPollRecords({
		records: [{ id: 'e' }, { id: 'd' }, { id: 'c' }, { id: 'b' }],
		lastId: 'b',
		getId: (record) => record.id,
		newestFirst: true,
		mode: 'trigger',
		limit: 2,
	});

	assert.deepEqual(
		result.emit.map((record) => record.id),
		['d', 'c'],
	);
	assert.equal(result.nextId, 'd');
});

test('oldest-first recipient polls emit records after the cursor', () => {
	const result = diffPollRecords({
		records: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
		lastId: 'a',
		getId: (record) => record.id,
		newestFirst: false,
		mode: 'trigger',
	});

	assert.deepEqual(
		result.emit.map((record) => record.id),
		['b', 'c'],
	);
	assert.equal(result.nextId, 'c');
});

test('resolvePollLimit ignores zero and non-positive values', () => {
	assert.equal(resolvePollLimit(0), undefined);
	assert.equal(resolvePollLimit(-1), undefined);
	assert.equal(resolvePollLimit(3.9), 3);
});
