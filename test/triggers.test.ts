/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { pollDocumentTrigger } from '../nodes/Proposaly/triggers/document.triggers';
import { pollLeadTrigger } from '../nodes/Proposaly/triggers/lead.triggers';
import { pollRecipientTrigger } from '../nodes/Proposaly/triggers/recipient.triggers';
import { pollWorkspaceTrigger } from '../nodes/Proposaly/triggers/workspace.triggers';
import { pollCardTrigger } from '../nodes/Proposaly/triggers/card.triggers';
import { pollNoteTrigger } from '../nodes/Proposaly/triggers/note.triggers';
import { createNodeContext } from './helpers/context';

const lead = (id: string, dateCreated: number) => ({
	lead_id: id,
	workspace_id: 'ws-1',
	company: 'Acme',
	date_created: dateCreated,
	recipients: [
		{
			first_name: 'Ada',
			last_name: 'Lovelace',
			email: 'ada@example.com',
			phone_number: null,
			access_level: 'viewer',
			recipient_id: 'r1',
			document_id: 'd1',
			status: 'active',
			blocked: false,
		},
	],
});

describe('Proposaly Trigger', () => {
	it('seeds lead history on the first production poll and emits new leads later', async () => {
		const pollData: Record<string, unknown> = {};
		const first = createNodeContext({
			params: { workspaceId: 'ws-1', limit: 50 },
			mode: 'trigger',
			pollData,
			response: { entities: [lead('l1', 100)], pagination: {} },
		});

		const firstResult = await pollLeadTrigger(first.context, 'newLead');
		assert.equal(firstResult, null);
		assert.equal(pollData.lastAddedLeadId, 'l1');

		const second = createNodeContext({
			params: { workspaceId: 'ws-1', limit: 50 },
			mode: 'trigger',
			pollData,
			response: { entities: [lead('l2', 200), lead('l1', 100)], pagination: {} },
		});
		const secondResult = await pollLeadTrigger(second.context, 'newLead');
		assert.equal(secondResult?.length, 1);
		assert.equal(secondResult?.[0].json.lead_id, 'l2');
		assert.equal(secondResult?.[0].json.email, 'ada@example.com');
	});

	it('returns a sample lead when executing the trigger in the editor', async () => {
		const { context } = createNodeContext({
			params: { workspaceId: 'ws-1', limit: 50 },
			mode: 'manual',
			pollData: {},
			response: { entities: [lead('l9', 1), lead('l8', 0)], pagination: {} },
		});

		const result = await pollLeadTrigger(context, 'newLead');
		assert.equal(result?.length, 1);
		assert.equal(result?.[0].json.lead_id, 'l9');
	});

	it('seeds document, recipient, and workspace pollers on first production poll', async () => {
		const document = await pollDocumentTrigger(
			createNodeContext({
				params: { workspaceId: 'ws-1', limit: 50 },
				mode: 'trigger',
				pollData: {},
				response: { entities: [{ document_id: 'doc-1' }], pagination: {} },
			}).context,
			'newDocument',
		);
		assert.equal(document, null);

		const recipient = await pollRecipientTrigger(
			createNodeContext({
				params: { documentId: 'doc-1', limit: 50 },
				mode: 'trigger',
				pollData: {},
				response: [{ recipient_id: 'r1' }],
			}).context,
			'newRecipient',
		);
		assert.equal(recipient, null);

		const workspace = await pollWorkspaceTrigger(
			createNodeContext({
				params: { limit: 50 },
				mode: 'trigger',
				pollData: {},
				response: [{ workspace_id: 'ws-1' }],
			}).context,
			'newWorkspace',
		);
		assert.equal(workspace, null);
	});

	it('polls archived leads with the Archived status and resets when workspace changes', async () => {
		const pollData: Record<string, unknown> = {
			lastAddedLeadId: 'old',
			currentWorkspaceId: 'ws-old',
		};
		const { context, captured } = createNodeContext({
			params: { workspaceId: 'ws-new', limit: 50 },
			mode: 'trigger',
			pollData,
			response: { entities: [lead('l1', 100)], pagination: {} },
		});

		const result = await pollLeadTrigger(context, 'archivedLead');
		assert.equal(result, null);
		assert.equal(captured[0].qs?.lead_status, 'Archived');
		assert.equal(pollData.currentWorkspaceId, 'ws-new');
		assert.equal(pollData.lastAddedLeadId, undefined);
		assert.equal(pollData.lastArchivedLeadId, 'l1');
	});

	it('emits documents that moved stage after the cursor and respects limit', async () => {
		const pollData: Record<string, unknown> = {
			lastDocumentMovedToNewStageId: 'doc-1',
			currentWorkspaceId: 'ws-1',
			lastStageId: 'Approved',
		};
		const { context } = createNodeContext({
			params: { workspaceId: 'ws-1', stageId: 'Approved', limit: 1 },
			mode: 'trigger',
			pollData,
			response: {
				entities: [
					{ document_id: 'doc-3', status_changed_date: 300 },
					{ document_id: 'doc-2', status_changed_date: 200 },
					{ document_id: 'doc-1', status_changed_date: 100 },
				],
				pagination: {},
			},
		});

		const result = await pollDocumentTrigger(context, 'documentMovedToNewStage');
		assert.equal(result?.length, 1);
		assert.equal(result?.[0].json.document_id, 'doc-2');
		assert.equal(pollData.lastDocumentMovedToNewStageId, 'doc-2');
	});

	it('nests notes on emitted leads', async () => {
		const pollData: Record<string, unknown> = {
			lastAddedLeadId: 'l1',
			currentWorkspaceId: 'ws-1',
		};
		const { context } = createNodeContext({
			params: { workspaceId: 'ws-1', limit: 50 },
			mode: 'trigger',
			pollData,
			responses: [
				{ entities: [lead('l2', 200), lead('l1', 100)], pagination: {} },
				{ entities: [{ id: 'n1', title: 'Follow-up' }], pagination: {} },
			],
		});

		const result = await pollLeadTrigger(context, 'newLead');
		assert.equal(result?.[0].json.lead_id, 'l2');
		assert.deepEqual(result?.[0].json.notes, [{ id: 'n1', title: 'Follow-up' }]);
	});

	it('seeds new notes and later emits notes newer than the cursor', async () => {
		const pollData: Record<string, unknown> = {};
		const first = createNodeContext({
			params: { parentId: 'doc-1', noteSource: '', limit: 50 },
			mode: 'trigger',
			pollData,
			responses: [{ entities: [{ id: 'n1', title: 'Old' }], pagination: {} }],
		});
		assert.equal(await pollNoteTrigger(first.context), null);
		assert.equal(pollData.lastNewNoteId, 'n1');

		const second = createNodeContext({
			params: { parentId: 'doc-1', noteSource: '', limit: 50 },
			mode: 'trigger',
			pollData,
			responses: [
				{ entities: [{ id: 'n2', title: 'New' }, { id: 'n1', title: 'Old' }], pagination: {} },
			],
		});
		const emitted = await pollNoteTrigger(second.context);
		assert.equal(emitted?.length, 1);
		assert.equal(emitted?.[0].json.id, 'n2');
	});

	it('filters archived cards on new card and flattens lead metadata', async () => {
		const pollData: Record<string, unknown> = { lastNewCardId: 'doc-1', currentWorkspaceId: 'ws-card' };
		const { context } = createNodeContext({
			params: { workspaceId: 'ws-card', limit: 50 },
			mode: 'trigger',
			pollData,
			responses: [
				{
					entities: [
						{
							document_id: 'doc-2',
							document_title: 'Won',
							stage_id: 'Lead',
							lead_metadata: { client_name: 'Acme', recipients: [{ email: 'ada@example.com' }] },
						},
						{ document_id: 'doc-archived', stage_id: 'Archived' },
						{ document_id: 'doc-1', stage_id: 'Lead' },
					],
					pagination: {},
				},
				{ entities: [{ id: 'n1', title: 'Kickoff' }], pagination: {} },
			],
		});

		const result = await pollCardTrigger(context, 'newCard');
		assert.equal(result?.length, 1);
		assert.equal(result?.[0].json.document_id, 'doc-2');
		assert.equal(result?.[0].json.client_name, 'Acme');
		assert.equal(result?.[0].json.email, 'ada@example.com');
		assert.equal((result?.[0].json.notes as Array<{ id: string }>)[0].id, 'n1');
	});

	it('omits nested notes on leads when Include Notes is off', async () => {
		const pollData: Record<string, unknown> = {
			lastAddedLeadId: 'l1',
			currentWorkspaceId: 'ws-1',
		};
		const { context, captured } = createNodeContext({
			params: { workspaceId: 'ws-1', includeNotes: false, limit: 50 },
			mode: 'trigger',
			pollData,
			responses: [{ entities: [lead('l2', 200), lead('l1', 100)], pagination: {} }],
		});

		const result = await pollLeadTrigger(context, 'newLead');
		assert.equal(result?.[0].json.lead_id, 'l2');
		assert.equal('notes' in (result?.[0].json ?? {}), false);
		assert.equal(captured.filter((request) => (request.url ?? '').includes('/notes')).length, 0);
	});
});
