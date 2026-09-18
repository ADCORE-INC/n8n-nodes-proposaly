/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { INodeProperties } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import {
	CardOperations,
	DocumentOperations,
	Fields,
	LeadOperations,
	NoteOperations,
	RecipientOperations,
	Resources,
	WorkspaceOperations,
} from '../nodes/Proposaly/constants';
import { Proposaly } from '../nodes/Proposaly/Proposaly.node';
import { ProposalyTrigger } from '../nodes/Proposaly/ProposalyTrigger.node';
import { ProposalyApiUrls } from '../nodes/Proposaly/environments';
import { createNodeContext, runExecute } from './helpers/context';

const leadResponse = {
	lead_id: 'lead-1',
	workspace_id: 'ws-1',
	company: 'Acme',
	recipients: [],
};

const documentResponse = { document_id: 'doc-1', document_title: 'Proposal' };
const recipientResponse = { recipient_id: 'r1', email: 'ada@example.com' };
const workspaceResponse = {
	workspace_id: 'ws-1',
	workspace_name: 'Sales',
	stages: [{ stage_id: 'Lead', stage_label: 'Lead', stage_status: 'unhide' }],
	labels: [{ label_key: 'hot', title: 'Hot', color: '#f00' }],
};

function operationValues(resource: string): string[] {
	const node = new Proposaly();
	const property = node.description.properties.find(
		(item) =>
			item.name === Fields.Operation &&
			item.displayOptions?.show?.resource?.includes(resource),
	) as INodeProperties | undefined;

	return (property?.options ?? [])
		.map((option) => ('value' in option ? String(option.value) : ''))
		.filter(Boolean);
}

describe('Proposaly.execute routing', () => {
	it('exposes every resource operation in the node UI', () => {
		assert.deepEqual(operationValues(Resources.Lead).sort(), Object.values(LeadOperations).sort());
		assert.deepEqual(
			operationValues(Resources.Document).sort(),
			Object.values(DocumentOperations).sort(),
		);
		assert.deepEqual(
			operationValues(Resources.Recipient).sort(),
			Object.values(RecipientOperations).sort(),
		);
		assert.deepEqual(
			operationValues(Resources.Workspace).sort(),
			Object.values(WorkspaceOperations).sort(),
		);
		assert.deepEqual(operationValues(Resources.Note).sort(), Object.values(NoteOperations).sort());
		assert.deepEqual(operationValues(Resources.Card).sort(), Object.values(CardOperations).sort());
	});

	it('sends execute requests to the credential Environment URL', async () => {
		const node = new Proposaly();
		const { captured } = await runExecute(
			node.execute,
			{
				[Fields.Resource]: Resources.Lead,
				[Fields.Operation]: LeadOperations.FindById,
				[Fields.LeadIdString]: 'lead-1',
			},
			{ entities: [leadResponse], pagination: {} },
			{ credentialUrl: ProposalyApiUrls.test },
		);

		assert.equal(new URL(captured[0]?.url ?? '').origin, 'https://test-api.proposaly.io');
	});

	it('routes every lead operation through execute()', async () => {
		const node = new Proposaly();
		const cases: Array<[string, Record<string, unknown>, unknown, string]> = [
			[
				LeadOperations.Create,
				{
					[Fields.WorkspaceId]: 'ws-1',
					[Fields.ClientName]: 'Acme',
					[Fields.LeadType]: 'individual',
					[Fields.Country]: 'US',
					[Fields.LeadSource]: 'Referral',
					[Fields.OwnerEmail]: 'owner@example.com',
					[Fields.AdditionalFields]: {},
				},
				leadResponse,
				'/v2/public-api/leads',
			],
			[LeadOperations.Archive, { [Fields.LeadId]: 'lead-1' }, leadResponse, '/v2/public-api/leads/lead-1'],
			[LeadOperations.Delete, { [Fields.LeadId]: 'lead-1' }, {}, '/v2/public-api/leads/lead-1'],
			[
				LeadOperations.Update,
				{
					[Fields.LeadId]: 'lead-1',
					[Fields.LeadTypeOptional]: '',
					[Fields.ClientNameOptional]: 'Acme',
					[Fields.CountryOptional]: '',
					[Fields.LeadSourceOptional]: '',
					[Fields.OwnerEmailOptional]: '',
					[Fields.AdditionalFields]: {},
				},
				leadResponse,
				'/v2/public-api/leads/lead-1',
			],
			[
				LeadOperations.Reactivate,
				{ [Fields.ArchivedLeadId]: 'lead-1' },
				leadResponse,
				'/v2/public-api/leads/lead-1',
			],
			[
				LeadOperations.FindById,
				{ [Fields.LeadIdString]: 'lead-1' },
				{ entities: [leadResponse], pagination: {} },
				'/v2/public-api/leads',
			],
			[
				LeadOperations.GetMany,
				{
					[Fields.WorkspaceId]: 'ws-1',
					[Fields.ReturnAll]: false,
					[Fields.LeadStatus]: '',
					[Fields.Limit]: 50,
				},
				{ entities: [leadResponse], pagination: {} },
				'/v2/public-api/leads',
			],
		];

		for (const [operation, fields, response, path] of cases) {
			const executed = await runExecute(node.execute, {
				[Fields.Resource]: Resources.Lead,
				[Fields.Operation]: operation,
				...fields,
			}, response);
			assert.ok(executed.result, `lead ${operation} should not return null`);
			assert.equal(executed.path, path, `lead ${operation} path`);
		}
	});

	it('routes every document operation through execute()', async () => {
		const node = new Proposaly();
		const cases: Array<[string, Record<string, unknown>, unknown]> = [
			[
				DocumentOperations.Create,
				{ [Fields.WorkspaceId]: 'ws-1', [Fields.DocumentTitle]: 'Proposal', [Fields.Labels]: [] },
				documentResponse,
			],
			[
				DocumentOperations.CreateFromLead,
				{
					[Fields.WorkspaceId]: 'ws-1',
					[Fields.DocumentTitle]: 'Proposal',
					[Fields.LeadId]: 'lead-1',
					[Fields.Labels]: [],
				},
				documentResponse,
			],
			[
				DocumentOperations.CreateFromTemplate,
				{
					[Fields.WorkspaceId]: 'ws-1',
					[Fields.DocumentTitle]: 'Proposal',
					[Fields.DocumentTemplateId]: 'tpl-1',
					[Fields.CopyRecipients]: false,
					[Fields.CopyPriceQuote]: false,
					[Fields.CopyAddons]: false,
					[Fields.CopyAttachments]: false,
					[Fields.CopyTeamMembers]: false,
					[Fields.Labels]: [],
				},
				documentResponse,
			],
			[
				DocumentOperations.CreateViewOnlyLink,
				{ [Fields.DocumentId]: 'doc-1', [Fields.ExpiresAfter]: '7d' },
				{ url: 'https://link' },
			],
			[DocumentOperations.Delete, { [Fields.DocumentId]: 'doc-1' }, {}],
			[
				DocumentOperations.Duplicate,
				{
					[Fields.DocumentId]: 'doc-1',
					[Fields.DocumentTitle]: 'Copy',
					[Fields.CopyRecipients]: false,
					[Fields.CopyPriceQuote]: false,
					[Fields.CopyAddons]: false,
					[Fields.CopyAttachments]: false,
					[Fields.CopyTeamMembers]: false,
				},
				{ document_id: 'doc-2' },
			],
			[
				DocumentOperations.MoveStage,
				{ [Fields.DocumentId]: 'doc-1', [Fields.NewStage]: 'Approved' },
				documentResponse,
			],
			[
				DocumentOperations.Share,
				{ [Fields.DocumentId]: 'doc-1', [Fields.Recipients]: ['r1'] },
				{ message: 'ok' },
			],
			[
				DocumentOperations.TransferOwnership,
				{ [Fields.DocumentId]: 'doc-1', [Fields.NewOwnerEmail]: 'new@example.com' },
				documentResponse,
			],
			[
				DocumentOperations.Update,
				{
					[Fields.DocumentId]: 'doc-1',
					[Fields.DocumentTitleOptional]: 'New',
					[Fields.NewStageOptional]: '',
					[Fields.NewOwnerEmail]: '',
				},
				{ message: 'ok' },
			],
			[
				DocumentOperations.FindById,
				{ [Fields.DocumentIdString]: 'doc-1' },
				{ entities: [documentResponse], pagination: {} },
			],
			[
				DocumentOperations.GetMany,
				{ [Fields.WorkspaceId]: 'ws-1', [Fields.ReturnAll]: false, [Fields.Limit]: 50 },
				{ entities: [documentResponse], pagination: {} },
			],
		];

		for (const [operation, fields, response] of cases) {
			const executed = await runExecute(node.execute, {
				[Fields.Resource]: Resources.Document,
				[Fields.Operation]: operation,
				...fields,
			}, response);
			assert.ok(executed.result, `document ${operation} should not return null`);
			assert.ok(executed.captured.length > 0, `document ${operation} should call the API`);
		}
	});

	it('routes recipient and workspace operations through execute()', async () => {
		const node = new Proposaly();
		const cases: Array<[string, string, Record<string, unknown>, unknown]> = [
			[
				Resources.Recipient,
				RecipientOperations.Add,
				{
					[Fields.DocumentId]: 'doc-1',
					[Fields.FirstName]: 'Ada',
					[Fields.LastName]: 'Lovelace',
					[Fields.Email]: 'ada@example.com',
					[Fields.PhoneNumber]: '',
					[Fields.AccessLevel]: 'viewer',
				},
				recipientResponse,
			],
			[
				Resources.Recipient,
				RecipientOperations.Update,
				{
					[Fields.WorkspaceId]: 'ws-1',
					[Fields.RecipientId]: 'r1',
					[Fields.FirstNameOptional]: '',
					[Fields.LastNameOptional]: '',
					[Fields.EmailOptional]: '',
					[Fields.PhoneNumberOptional]: '',
					[Fields.AccessLevelOptional]: '',
					[Fields.StatusOptional]: '',
				},
				recipientResponse,
			],
			[Resources.Recipient, RecipientOperations.Delete, { [Fields.RecipientId]: 'r1' }, {}],
			[
				Resources.Recipient,
				RecipientOperations.Find,
				{ [Fields.RecipientIdString]: 'r1' },
				[recipientResponse],
			],
			[
				Resources.Recipient,
				RecipientOperations.GetMany,
				{
					[Fields.DocumentId]: 'doc-1',
					[Fields.IncludeBlocked]: false,
					[Fields.ReturnAll]: false,
					[Fields.Limit]: 50,
				},
				[recipientResponse],
			],
			[
				Resources.Recipient,
				RecipientOperations.GetNotificationSettings,
				{ [Fields.RecipientId]: 'r1' },
				{ agreement_signed: 'email' },
			],
			[
				Resources.Recipient,
				RecipientOperations.UpdateNotificationSettings,
				{
					[Fields.WorkspaceId]: 'ws-1',
					[Fields.RecipientId]: 'r1',
					[Fields.AgreementSigned]: '',
					[Fields.AddonAdded]: '',
					[Fields.PaymentMade]: '',
					[Fields.MessageReceived]: '',
					[Fields.MediaAdded]: '',
					[Fields.DocumentStatusChanged]: '',
				},
				{ ok: true },
			],
			[
				Resources.Workspace,
				WorkspaceOperations.Add,
				{ [Fields.WorkspaceName]: 'Sales', [Fields.WorkspaceType]: 'proposal' },
				workspaceResponse,
			],
			[
				Resources.Workspace,
				WorkspaceOperations.FindById,
				{ [Fields.WorkspaceIdString]: 'ws-1' },
				[workspaceResponse],
			],
			[
				Resources.Workspace,
				WorkspaceOperations.GetMany,
				{ [Fields.ReturnAll]: false, [Fields.Limit]: 50 },
				[workspaceResponse],
			],
			[
				Resources.Workspace,
				WorkspaceOperations.GetStages,
				{ [Fields.WorkspaceId]: 'ws-1' },
				[workspaceResponse],
			],
		];

		for (const [resource, operation, fields, response] of cases) {
			const executed = await runExecute(node.execute, {
				[Fields.Resource]: resource,
				[Fields.Operation]: operation,
				...fields,
			}, response);
			assert.ok(executed.result, `${resource} ${operation} should not return null`);
			assert.ok(executed.captured.length > 0, `${resource} ${operation} should call the API`);
		}
	});

	it('routes note and card operations through execute()', async () => {
		const node = new Proposaly();
		const note = { id: 'n1', title: 'Follow-up' };
		const cases: Array<[string, string, Record<string, unknown>, unknown]> = [
			[
				Resources.Note,
				NoteOperations.Create,
				{
					[Fields.ParentId]: 'doc-1',
					[Fields.NoteTitle]: 'Follow-up',
					[Fields.NoteBody]: 'Hi',
					[Fields.NoteSource]: 'note',
					[Fields.AuthorEmail]: '',
				},
				note,
			],
			[
				Resources.Note,
				NoteOperations.Update,
				{
					[Fields.ParentId]: 'doc-1',
					[Fields.NoteId]: 'n1',
					[Fields.NoteTitle]: 'Updated',
					[Fields.NoteBody]: '',
				},
				note,
			],
			[Resources.Note, NoteOperations.Delete, { [Fields.ParentId]: 'doc-1', [Fields.NoteId]: 'n1' }, {}],
			[Resources.Note, NoteOperations.FindById, { [Fields.NoteId]: 'n1' }, note],
			[
				Resources.Note,
				NoteOperations.GetMany,
				{
					[Fields.ParentId]: 'doc-1',
					[Fields.NoteSource]: '',
					[Fields.NoteSearch]: '',
					[Fields.ReturnAll]: false,
					[Fields.Limit]: 50,
				},
				{ entities: [note], pagination: {} },
			],
			[
				Resources.Card,
				CardOperations.FindById,
				{ [Fields.DocumentIdString]: 'doc-1' },
				{ entities: [{ document_id: 'doc-1', document_title: 'Card' }], pagination: {} },
			],
			[
				Resources.Card,
				CardOperations.GetMany,
				{ [Fields.WorkspaceId]: 'ws-card', [Fields.ReturnAll]: false, [Fields.Limit]: 50 },
				{ entities: [{ document_id: 'doc-1' }], pagination: {} },
			],
		];

		for (const [resource, operation, fields, response] of cases) {
			const executed = await runExecute(node.execute, {
				[Fields.Resource]: resource,
				[Fields.Operation]: operation,
				...fields,
			}, response);
			assert.ok(executed.result, `${resource} ${operation} should not return null`);
			assert.ok(executed.captured.length > 0, `${resource} ${operation} should call the API`);
		}
	});

	it('continues on fail when the API throws', async () => {
		const node = new Proposaly();
		const { context } = createNodeContext({
			params: {
				[Fields.Resource]: Resources.Lead,
				[Fields.Operation]: LeadOperations.Delete,
				[Fields.LeadId]: 'lead-1',
			},
			continueOnFail: true,
		});
		(context as { helpers: { httpRequestWithAuthentication: () => Promise<never> } }).helpers
			.httpRequestWithAuthentication = async () => {
			throw new Error('API down');
		};

		const result = (await node.execute.call(context)) as Array<Array<{ json: { error: string } }>>;
		assert.equal(result[0][0].json.error, 'Proposaly API request failed (DELETE /leads/lead-1). Check your connection and URL.');
	});

	it('wraps API errors in NodeOperationError when continue on fail is off', async () => {
		const node = new Proposaly();
		const { context } = createNodeContext({
			params: {
				[Fields.Resource]: Resources.Lead,
				[Fields.Operation]: LeadOperations.Delete,
				[Fields.LeadId]: 'lead-1',
			},
		});
		(context as { helpers: { httpRequestWithAuthentication: () => Promise<never> } }).helpers
			.httpRequestWithAuthentication = async () => {
			throw new Error('API down');
		};

		await assert.rejects(
			() => node.execute.call(context),
			(error: unknown) => {
				assert.ok(error instanceof NodeOperationError);
				assert.match(error.message, /Proposaly API request failed \(DELETE \/leads\/lead-1\)/);
				return true;
			},
		);
	});

	it('includes notes on GET leads and documents without a second /notes call', async () => {
		const node = new Proposaly();
		const note = { id: 'n1', title: 'Follow-up', body: 'Called', source: 'note' };
		const executed = await runExecute(
			node.execute,
			{
				[Fields.Resource]: Resources.Lead,
				[Fields.Operation]: LeadOperations.FindById,
				[Fields.LeadIdString]: 'lead-1',
			},
			{
				entities: [{ ...leadResponse, notes: [note], notes_total: 1 }],
				pagination: {},
			},
		);

		assert.equal(executed.captured.length, 1);
		assert.equal(executed.request.qs?.include_notes, true);
		const items = executed.result as Array<Array<{ json: { notes?: Array<{ id: string }>; notes_total?: number } }>>;
		assert.equal(items[0][0].json.notes?.[0].id, 'n1');
		assert.equal(items[0][0].json.notes_total, 1);
	});
});

describe('ProposalyTrigger.poll routing', () => {
	it('routes every trigger event', async () => {
		const trigger = new ProposalyTrigger();
		const events = (trigger.description.properties.find((property) => property.name === 'event')
			?.options ?? []) as Array<{ value: string }>;

		assert.deepEqual(
			events.map((event) => event.value).sort(),
			[
				'archivedLead',
				'cardMovedToNewStage',
				'deletedLead',
				'documentMovedToNewStage',
				'newCard',
				'newDocument',
				'newLead',
				'newNote',
				'newRecipient',
				'newWorkspace',
			].sort(),
		);

		for (const event of events) {
			const response =
				event.value === 'newWorkspace'
					? [{ workspace_id: 'ws-1' }]
					: event.value === 'newRecipient'
						? [{ recipient_id: 'r1' }]
						: { entities: [{ lead_id: 'l1', document_id: 'd1', date_created: 1, status_changed_date: 1 }], pagination: {} };

			const executed = await runExecute(
				trigger.poll,
				{
					event: event.value,
					workspaceId: 'ws-1',
					documentId: 'doc-1',
					stageId: 'Approved',
					parentId: 'doc-1',
					noteSource: '',
					limit: 50,
				},
				response,
				{ mode: 'trigger', pollData: {} },
			);
			assert.equal(executed.result, null, `${event.value} first poll should seed only`);
		}
	});
});

describe('loadOptions', () => {
	it('loads workspaces, labels, templates, documents, archived leads, and recipients', async () => {
		const node = new Proposaly();
		const { context } = createNodeContext({
			params: { [Fields.WorkspaceId]: 'ws-1', [Fields.DocumentId]: 'doc-1' },
			responses: [
				[workspaceResponse],
				{ entities: [{ document_id: 'tpl-1', document_title: 'Template', is_template: true }], pagination: {} },
				{ entities: [{ document_id: 'doc-1', document_title: 'Proposal', is_template: false }], pagination: {} },
				{ entities: [{ lead_id: 'lead-1', company: 'Acme' }], pagination: {} },
				[{ recipient_id: 'r1', first_name: 'Ada', last_name: 'Lovelace', email: 'ada@example.com' }],
				[workspaceResponse],
			],
		});

		const workspaces = await node.methods.loadOptions.getWorkspaces.call(context);
		assert.deepEqual(workspaces, [{ name: 'Sales', value: 'ws-1' }]);

		const templates = await node.methods.loadOptions.getDocumentTemplates.call(context);
		assert.equal(templates[0].value, 'tpl-1');

		const documents = await node.methods.loadOptions.getDocuments.call(context);
		assert.equal(documents[0].value, 'doc-1');

		const archived = await node.methods.loadOptions.getArchivedLeads.call(context);
		assert.equal(archived[0].value, 'lead-1');

		const recipients = await node.methods.loadOptions.getRecipients.call(context);
		assert.match(String(recipients[0].name), /Ada Lovelace/);

		const labels = await node.methods.loadOptions.getWorkspaceLabels.call(context);
		assert.deepEqual(labels, [{ name: 'Hot', value: 'hot' }]);
	});

	it('loads documents only for card workspaces, and documents plus leads otherwise', async () => {
		const node = new Proposaly();
		const empty = createNodeContext({ params: {}, responses: [] });
		assert.deepEqual(await node.methods.loadOptions.getNoteParents.call(empty.context), []);
		assert.equal(empty.captured.length, 0);

		const card = createNodeContext({
			params: { [Fields.WorkspaceId]: 'ws-card' },
			responses: [
				[{ workspace_id: 'ws-card', workspace_name: 'Cards', workspace_type: 'card' }],
				{ entities: [{ document_id: 'doc-1', document_title: 'Acme card' }], pagination: {} },
			],
		});
		assert.deepEqual(await node.methods.loadOptions.getNoteParents.call(card.context), [
			{ name: 'Acme card', value: 'doc-1' },
		]);
		assert.equal(card.captured.some((request) => (request.url ?? '').includes('/leads')), false);

		const mixed = createNodeContext({
			params: { [Fields.WorkspaceId]: 'ws-1' },
			responses: [
				[{ workspace_id: 'ws-1', workspace_name: 'Sales', workspace_type: 'proposal' }],
				{ entities: [{ document_id: 'doc-1', document_title: 'Proposal' }], pagination: {} },
				{ entities: [{ lead_id: 'lead-1', client_name: 'Acme' }], pagination: {} },
			],
		});
		assert.deepEqual(await node.methods.loadOptions.getNoteParents.call(mixed.context), [
			{ name: 'Proposal', value: 'doc-1' },
			{ name: 'Lead: Acme', value: 'lead-1' },
		]);
	});

	it('does not expose parent type; note IDs are strings', () => {
		const node = new Proposaly();
		const trigger = new ProposalyTrigger();
		assert.equal(
			node.description.properties.some((property) => property.name === 'parentType'),
			false,
		);
		assert.equal(
			trigger.description.properties.some((property) => property.name === 'parentType'),
			false,
		);

		const parent = node.description.properties.find((property) => property.name === Fields.ParentId);
		assert.equal(parent?.displayName, 'Parent Name or ID');

		const triggerParent = trigger.description.properties.find(
			(property) => property.name === 'parentId',
		);
		assert.equal(triggerParent?.displayName, 'Parent Name or ID');
		assert.equal(trigger.description.usableAsTool, undefined);
		assert.deepEqual(node.description.icon, {
			light: 'file:proposaly.svg',
			dark: 'file:proposaly-dark.svg',
		});
		assert.deepEqual(trigger.description.icon, {
			light: 'file:proposaly.svg',
			dark: 'file:proposaly-dark.svg',
		});

		const noteId = node.description.properties.find((property) => property.name === Fields.NoteId);
		assert.equal(noteId?.type, 'string');
		assert.equal(noteId?.displayName, 'Note ID');
	});
});
