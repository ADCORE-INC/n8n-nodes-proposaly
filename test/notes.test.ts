/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Fields } from '../nodes/Proposaly/constants';
import { fetchNotes, fetchNotesList, attachNotes, listNoteParentOptions } from '../nodes/Proposaly/notes';
import { createNoteOperation } from '../nodes/Proposaly/actions/note/create.operation';
import { updateNoteOperation } from '../nodes/Proposaly/actions/note/update.operation';
import { deleteNoteOperation } from '../nodes/Proposaly/actions/note/delete.operation';
import { findNoteOperation } from '../nodes/Proposaly/actions/note/find.operation';
import { getManyNotesOperation } from '../nodes/Proposaly/actions/note/get-many.operation';
import { findCardOperation } from '../nodes/Proposaly/actions/card/find.operation';
import { getManyCardsOperation } from '../nodes/Proposaly/actions/card/get-many.operation';
import { findLeadByIdOperation } from '../nodes/Proposaly/actions/lead/find.operation';
import { findDocumentOperation } from '../nodes/Proposaly/actions/document/find.operation';
import { createNodeContext, runOperation } from './helpers/context';

const note = { id: 'n1', title: 'Follow-up', body: 'Called', source: 'note' };
const cardDocument = {
	document_id: 'doc-1',
	document_title: 'Acme card',
	document_type: 'card',
	lead_metadata: {
		client_name: 'Acme',
		recipients: [{ email: 'ada@example.com', first_name: 'Ada', last_name: 'Lovelace' }],
	},
};

describe('fetchNotes', () => {
	it('returns an empty list without a parent id', async () => {
		const { context, captured } = createNodeContext({ responses: [] });
		assert.deepEqual(await fetchNotes(context, ''), []);
		assert.equal(captured.length, 0);
	});

	it('paginates until next_page is 0', async () => {
		const { context, captured } = createNodeContext({
			responses: [
				{ entities: [{ id: '1', title: 'One' }], pagination: { next_page: 2 } },
				{ entities: [{ id: '2', title: 'Two' }], pagination: { next_page: 0 } },
			],
		});
		const notes = await fetchNotes(context, 'doc-1');
		assert.deepEqual(
			notes.map((item) => item.id),
			['1', '2'],
		);
		assert.equal(captured.length, 2);
	});

	it('list fetch uses a single page of 100', async () => {
		const { context, captured } = createNodeContext({
			responses: [{ entities: [{ id: '1' }], pagination: { next_page: 2 } }],
		});
		await fetchNotesList(context, 'doc-1');
		assert.equal(captured.length, 1);
		assert.equal(captured[0].qs?.limit, 100);
	});

	it('attachNotes adds a notes array', async () => {
		const { context } = createNodeContext({
			responses: [{ entities: [{ id: 'n1', title: 'Hi' }], pagination: {} }],
		});
		const result = await attachNotes(context, { document_id: 'd1' }, 'd1');
		assert.deepEqual(result.notes, [{ id: 'n1', title: 'Hi' }]);
	});

	it('attachNotes uses nested notes without a second /notes request', async () => {
		const { context, captured } = createNodeContext({ responses: [] });
		const nested = [
			{ id: 'n1', title: 'From n8n', body: '', source: 'note' },
			{ id: 'n2', title: 'Kickoff', body: 'New card', source: 'note' },
		];
		const result = await attachNotes(
			context,
			{ document_id: 'd1', notes: nested, notes_total: 2 },
			'd1',
		);
		assert.equal(captured.length, 0);
		assert.equal(result.notes_total, 2);
		assert.deepEqual(
			result.notes?.map((note) => note.id),
			['n1', 'n2'],
		);
	});
});

describe('listNoteParentOptions', () => {
	it('returns nothing without a workspace', async () => {
		const { context, captured } = createNodeContext({ responses: [] });
		assert.deepEqual(await listNoteParentOptions(context, ''), []);
		assert.equal(captured.length, 0);
	});

	it('lists only documents in a card workspace', async () => {
		const { context, captured } = createNodeContext({
			responses: [
				[{ workspace_id: 'ws-card', workspace_name: 'Cards', workspace_type: 'card' }],
				{ entities: [{ document_id: 'doc-1', document_title: 'Acme card' }], pagination: {} },
			],
		});
		const options = await listNoteParentOptions(context, 'ws-card');
		assert.deepEqual(options, [{ name: 'Acme card', value: 'doc-1' }]);
		assert.equal(captured.some((request) => (request.url ?? '').includes('/leads')), false);
		assert.equal(captured.filter((request) => (request.url ?? '').includes('/documents')).length, 1);
	});

	it('lists documents and leads in a non-card workspace', async () => {
		const { context, captured } = createNodeContext({
			responses: [
				[{ workspace_id: 'ws-1', workspace_name: 'Sales', workspace_type: 'proposal' }],
				{ entities: [{ document_id: 'doc-1', document_title: 'Proposal' }], pagination: {} },
				{ entities: [{ lead_id: 'lead-1', client_name: 'Acme' }], pagination: {} },
			],
		});
		const options = await listNoteParentOptions(context, 'ws-1');
		assert.deepEqual(options, [
			{ name: 'Proposal', value: 'doc-1' },
			{ name: 'Lead: Acme', value: 'lead-1' },
		]);
		assert.equal(captured[2]?.qs?.lead_status, 'Active');
	});

	it('still lists documents when leads fail on a non-card workspace', async () => {
		const { context } = createNodeContext({
			throwOnUrlIncludes: '/leads',
			responses: [
				[{ workspace_id: 'ws-1', workspace_name: 'Sales', workspace_type: 'proposal' }],
				{ entities: [{ document_id: 'doc-1', document_title: 'Proposal' }], pagination: {} },
			],
		});
		const options = await listNoteParentOptions(context, 'ws-1');
		assert.deepEqual(options, [{ name: 'Proposal', value: 'doc-1' }]);
	});
});

describe('Note operations', () => {
	it('creates, updates, finds, lists, and deletes notes', async () => {
		const created = await runOperation(
			createNoteOperation,
			{
				[Fields.ParentId]: 'doc-1',
				[Fields.NoteTitle]: 'Follow-up',
				[Fields.NoteBody]: 'Called the client.',
				[Fields.NoteSource]: 'call',
				[Fields.AuthorEmail]: 'owner@example.com',
			},
			note,
		);
		assert.equal(created.request.method, 'POST');
		assert.equal(created.path, '/v2/public-api/notes');
		assert.equal(created.request.body?.document_id, 'doc-1');
		assert.equal(created.request.body?.source, 'call');
		assert.equal(created.result.json.id, 'n1');

		const updated = await runOperation(
			updateNoteOperation,
			{
				[Fields.ParentId]: 'doc-1',
				[Fields.NoteId]: 'n1',
				[Fields.NoteTitle]: 'Updated',
				[Fields.NoteBody]: '',
			},
			{ ...note, title: 'Updated' },
		);
		assert.equal(updated.request.method, 'PUT');
		assert.equal(updated.path, '/v2/public-api/notes/n1');
		assert.equal(updated.request.qs?.document_id, 'doc-1');
		assert.equal(updated.request.body?.title, 'Updated');
		assert.equal('body' in (updated.request.body ?? {}), false);

		const found = await runOperation(findNoteOperation, { [Fields.NoteId]: 'n1' }, note);
		assert.equal(found.path, '/v2/public-api/notes/n1');
		assert.equal(found.result.json.id, 'n1');

		const { context } = createNodeContext({
			params: {
				[Fields.ParentId]: 'doc-1',
				[Fields.NoteSource]: 'email',
				[Fields.NoteSearch]: 'called',
				[Fields.ReturnAll]: false,
				[Fields.Limit]: 50,
			},
			responses: [{ entities: [note, { id: 'n2', title: 'Other' }], pagination: {} }],
		});
		const listed = await getManyNotesOperation(context, 0);
		assert.equal(listed.length, 2);
		assert.equal(listed[0].json.id, 'n1');

		const deleted = await runOperation(
			deleteNoteOperation,
			{ [Fields.ParentId]: 'doc-1', [Fields.NoteId]: 'n1' },
			{},
		);
		assert.equal(deleted.request.method, 'DELETE');
		assert.deepEqual(deleted.result.json, { id: 'n1', document_id: 'doc-1', status: 'deleted' });
	});
});

describe('Card operations', () => {
	it('finds and lists cards with flattened metadata and nested notes', async () => {
		const found = createNodeContext({
			params: { [Fields.DocumentIdString]: 'doc-1' },
			responses: [
				{
					entities: [{ ...cardDocument, notes: [note], notes_total: 1 }],
					pagination: {},
				},
			],
		});
		const card = await findCardOperation(found.context, [], 0);
		assert.equal(found.captured.length, 1);
		assert.equal(found.captured[0].qs?.document_id, 'doc-1');
		assert.equal(found.captured[0].qs?.include_notes, true);
		assert.equal(card.json.client_name, 'Acme');
		assert.equal(card.json.email, 'ada@example.com');
		assert.equal((card.json.notes as Array<{ id: string }>)[0].id, 'n1');
		assert.equal(card.json.notes_total, 1);

		const listed = createNodeContext({
			params: { [Fields.WorkspaceId]: 'ws-card', [Fields.ReturnAll]: false, [Fields.Limit]: 50 },
			responses: [
				{
					entities: [{ ...cardDocument, notes: [note], notes_total: 1 }],
					pagination: {},
				},
			],
		});
		const cards = await getManyCardsOperation(listed.context, 0);
		assert.equal(listed.captured.length, 1);
		assert.equal(listed.captured[0].qs?.include_notes, true);
		assert.equal(cards.length, 1);
		assert.equal(cards[0].json.document_id, 'doc-1');
		assert.equal((cards[0].json.notes as Array<{ id: string }>).length, 1);
		assert.equal(cards[0].json.notes_total, 1);
	});
});

describe('Nested notes on existing resources', () => {
	it('attaches notes when finding a lead or document', async () => {
		const lead = createNodeContext({
			params: { [Fields.LeadIdString]: 'lead-1' },
			responses: [
				{
					entities: [
						{ lead_id: 'lead-1', company: 'Acme', recipients: [], notes: [note], notes_total: 1 },
					],
					pagination: {},
				},
			],
		});
		const foundLead = await findLeadByIdOperation(lead.context, [], 0);
		assert.equal(lead.captured.length, 1);
		assert.equal(lead.captured[0].qs?.lead_id, 'lead-1');
		assert.equal(lead.captured[0].qs?.include_notes, true);
		assert.equal(foundLead.json.lead_id, 'lead-1');
		assert.equal((foundLead.json.notes as Array<{ id: string }>)[0].id, 'n1');
		assert.equal(foundLead.json.notes_total, 1);

		const document = createNodeContext({
			params: { [Fields.DocumentIdString]: 'doc-1' },
			responses: [
				{
					entities: [
						{ document_id: 'doc-1', document_title: 'Proposal', notes: [note], notes_total: 1 },
					],
					pagination: {},
				},
			],
		});
		const foundDocument = await findDocumentOperation(document.context, [], 0);
		assert.equal(document.captured.length, 1);
		assert.equal(document.captured[0].qs?.include_notes, true);
		assert.equal(foundDocument.json.document_id, 'doc-1');
		assert.equal((foundDocument.json.notes as Array<{ id: string }>)[0].id, 'n1');
		assert.equal(foundDocument.json.notes_total, 1);
	});

	it('skips nested notes and extra API calls when Include Notes is off', async () => {
		const skipped = await attachNotes(createNodeContext({ responses: [] }).context, { document_id: 'd1' }, 'd1', false);
		assert.equal('notes' in skipped, false);

		const lead = createNodeContext({
			params: { [Fields.LeadIdString]: 'lead-1', [Fields.IncludeNotes]: false },
			responses: [
				{
					entities: [
						{
							lead_id: 'lead-1',
							company: 'Acme',
							recipients: [],
							notes: null,
							notes_total: null,
						},
					],
					pagination: {},
				},
			],
		});
		const foundLead = await findLeadByIdOperation(lead.context, [], 0);
		assert.equal(foundLead.json.lead_id, 'lead-1');
		assert.equal('notes' in foundLead.json, false);
		assert.equal('notes_total' in foundLead.json, false);
		assert.equal(lead.captured[0].qs?.include_notes, undefined);
		assert.equal(
			lead.captured.filter((request) => (request.url ?? '').includes('/notes')).length,
			0,
		);

		const card = createNodeContext({
			params: { [Fields.DocumentIdString]: 'doc-1', [Fields.IncludeNotes]: false },
			responses: [{ entities: [{ ...cardDocument, notes: null, notes_total: null }], pagination: {} }],
		});
		const foundCard = await findCardOperation(card.context, [], 0);
		assert.equal(foundCard.json.client_name, 'Acme');
		assert.equal('notes' in foundCard.json, false);
		assert.equal(card.captured[0].qs?.include_notes, undefined);
		assert.equal(
			card.captured.filter((request) => (request.url ?? '').includes('/notes')).length,
			0,
		);
	});
});
