/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Fields } from '../nodes/Proposaly/constants';
import { createDocumentOperation } from '../nodes/Proposaly/actions/document/create.operation';
import { deleteDocumentOperation } from '../nodes/Proposaly/actions/document/delete.operation';
import { duplicateDocumentOperation } from '../nodes/Proposaly/actions/document/duplicate.operation';
import { findDocumentOperation } from '../nodes/Proposaly/actions/document/find.operation';
import { getManyDocumentsOperation } from '../nodes/Proposaly/actions/document/get-many.operation';
import { moveDocumentStageOperation } from '../nodes/Proposaly/actions/document/move.operation';
import { createDocumentShareLinkOperation } from '../nodes/Proposaly/actions/document/share-link.operation';
import { shareDocumentOperation } from '../nodes/Proposaly/actions/document/share.operation';
import { transferDocumentOwnershipOperation } from '../nodes/Proposaly/actions/document/transfer.operation';
import { updateDocumentOperation } from '../nodes/Proposaly/actions/document/update.operation';
import { addLeadOperation } from '../nodes/Proposaly/actions/lead/add.operation';
import { archiveLeadOperation } from '../nodes/Proposaly/actions/lead/archive.operation';
import { deleteLeadOperation } from '../nodes/Proposaly/actions/lead/delete.operation';
import { findLeadByIdOperation } from '../nodes/Proposaly/actions/lead/find.operation';
import { getManyLeadsOperation } from '../nodes/Proposaly/actions/lead/get-many.operation';
import { reactivateLeadOperation } from '../nodes/Proposaly/actions/lead/reactivate.operation';
import { updateLeadOperation } from '../nodes/Proposaly/actions/lead/update.operation';
import { addRecipientOperation } from '../nodes/Proposaly/actions/recipient/add.operation';
import { deleteRecipientOperation } from '../nodes/Proposaly/actions/recipient/delete.operation';
import { findRecipientOperation } from '../nodes/Proposaly/actions/recipient/find.operation';
import { getManyRecipientsOperation } from '../nodes/Proposaly/actions/recipient/get-many.operation';
import { getRecipientNotificationSettingsOperation } from '../nodes/Proposaly/actions/recipient/get-notification.operation';
import { updateRecipientOperation } from '../nodes/Proposaly/actions/recipient/update.operation';
import { updateRecipientNotificationOperation } from '../nodes/Proposaly/actions/recipient/update-notification.operation';
import { addWorkspaceOperation } from '../nodes/Proposaly/actions/workspace/add.operation';
import { findWorkspaceOperation } from '../nodes/Proposaly/actions/workspace/find.operation';
import { getManyWorkspacesOperation } from '../nodes/Proposaly/actions/workspace/get-many.operation';
import { getWorkspaceStagesOperation } from '../nodes/Proposaly/actions/workspace/get-stages.operation';
import { createNodeContext, runOperation } from './helpers/context';

const leadResponse = {
	lead_id: 'lead-1',
	workspace_id: 'ws-1',
	company: 'Acme',
	recipients: [
		{
			first_name: 'Ada',
			last_name: 'Lovelace',
			email: 'ada@example.com',
			phone_number: '+1',
			access_level: 'viewer',
			recipient_id: 'r1',
			document_id: 'd1',
			status: 'active',
			blocked: false,
		},
	],
};

describe('Lead operations', () => {
	it('creates a lead and flattens the first recipient', async () => {
		const { result, request, path } = await runOperation(
			addLeadOperation,
			{
				[Fields.WorkspaceId]: 'ws-1',
				[Fields.ClientName]: 'Acme',
				[Fields.LeadType]: 'individual',
				[Fields.Country]: 'US',
				[Fields.LeadSource]: 'Referral',
				[Fields.OwnerEmail]: 'owner@example.com',
				[Fields.AdditionalFields]: { comment: 'via n8n' },
			},
			leadResponse,
		);

		assert.equal(request.method, 'POST');
		assert.equal(path, '/v2/public-api/leads');
		assert.equal(request.body?.client_name, 'Acme');
		assert.equal(request.body?.comment, 'via n8n');
		assert.equal(result.json.email, 'ada@example.com');
		assert.equal(result.json.client_name, 'Acme');
	});

	it('updates, archives, reactivates, finds, and deletes a lead', async () => {
		const update = await runOperation(
			updateLeadOperation,
			{
				[Fields.LeadId]: 'lead-1',
				[Fields.LeadTypeOptional]: '',
				[Fields.ClientNameOptional]: 'Acme Inc',
				[Fields.CountryOptional]: '',
				[Fields.LeadSourceOptional]: '',
				[Fields.OwnerEmailOptional]: '',
				[Fields.AdditionalFields]: {},
			},
			leadResponse,
		);
		assert.equal(update.request.method, 'PUT');
		assert.equal(update.path, '/v2/public-api/leads/lead-1');
		assert.equal(update.request.body?.client_name, 'Acme Inc');

		const archive = await runOperation(archiveLeadOperation, { [Fields.LeadId]: 'lead-1' }, leadResponse);
		assert.equal(archive.request.body?.status, 'Archived');

		const reactivate = await runOperation(
			reactivateLeadOperation,
			{ [Fields.ArchivedLeadId]: 'lead-1' },
			leadResponse,
		);
		assert.equal(reactivate.request.body?.status, 'Active');

		const found = await runOperation(
			findLeadByIdOperation,
			{ [Fields.LeadIdString]: 'lead-1' },
			{ entities: [leadResponse], pagination: {} },
		);
		assert.equal(found.request.method, 'GET');
		assert.equal(found.request.qs?.lead_id, 'lead-1');
		assert.equal(found.result.json.email, 'ada@example.com');

		const deleted = await runOperation(deleteLeadOperation, { [Fields.LeadId]: 'lead-1' }, {});
		assert.equal(deleted.request.method, 'DELETE');
		assert.deepEqual(deleted.result.json, { deleted: true });
	});

	it('gets many leads as one item per record', async () => {
		const { context, captured, pathOf } = createNodeContext({
			params: {
				[Fields.WorkspaceId]: 'ws-1',
				[Fields.ReturnAll]: false,
				[Fields.LeadStatus]: 'Active',
				[Fields.Limit]: 50,
			},
			response: { entities: [leadResponse, { ...leadResponse, lead_id: 'lead-2' }], pagination: {} },
		});

		const result = await getManyLeadsOperation(context, 0);
		assert.equal(captured[0].method, 'GET');
		assert.equal(pathOf(0), '/v2/public-api/leads');
		assert.equal(captured[0].qs?.workspace_id, 'ws-1');
		assert.equal(captured[0].qs?.lead_status, 'Active');
		assert.equal(result.length, 2);
		assert.equal(result[0].json.lead_id, 'lead-1');
		assert.equal(result[1].json.lead_id, 'lead-2');
	});
});

describe('Document operations', () => {
	it('creates from master, lead, and template', async () => {
		const { context, captured, pathOf } = createNodeContext({
			response: { document_id: 'doc-1' },
		});

		await createDocumentOperation(context, [], 0, {
			workspaceId: 'ws-1',
			title: 'Proposal',
			labels: ['hot'],
		});
		assert.equal(captured[0].method, 'POST');
		assert.equal(pathOf(0), '/v2/public-api/documents');
		assert.deepEqual(captured[0].body?.labels, ['hot']);

		await createDocumentOperation(context, [], 0, {
			workspaceId: 'ws-1',
			title: 'From lead',
			leadId: 'lead-1',
		});
		assert.equal(captured[1].body?.lead_id, 'lead-1');

		await createDocumentOperation(context, [], 0, {
			workspaceId: 'ws-1',
			title: 'From template',
			templateDocumentId: 'tpl-1',
			copyRecipients: true,
			copyTeamMembers: true,
		});
		assert.equal(captured[2].body?.template_document_id, 'tpl-1');
		assert.equal(captured[2].body?.copy_team_members, true);
	});

	it('duplicates, updates, moves, shares, transfers, and deletes', async () => {
		const duplicate = await runOperation(
			duplicateDocumentOperation,
			{
				[Fields.DocumentId]: 'doc-1',
				[Fields.DocumentTitle]: 'Copy',
				[Fields.CopyRecipients]: false,
				[Fields.CopyPriceQuote]: false,
				[Fields.CopyAddons]: false,
				[Fields.CopyAttachments]: false,
				[Fields.CopyTeamMembers]: true,
			},
			{ document_id: 'doc-2' },
		);
		assert.equal(duplicate.path, '/v2/public-api/documents/duplicate');
		assert.equal(duplicate.request.body?.copy_team_members, true);
		assert.equal(duplicate.request.body?.new_title, 'Copy');

		const update = await runOperation(
			updateDocumentOperation,
			{
				[Fields.DocumentId]: 'doc-1',
				[Fields.DocumentTitleOptional]: 'New title',
				[Fields.NewStageOptional]: '',
				[Fields.NewOwnerEmail]: '',
			},
			{ message: 'ok' },
		);
		assert.equal(update.path, '/v2/public-api/documents/doc-1');
		assert.equal(update.request.body?.title, 'New title');

		const move = await runOperation(
			moveDocumentStageOperation,
			{ [Fields.DocumentId]: 'doc-1', [Fields.NewStage]: 'Approved' },
			{ document_id: 'doc-1', stage_id: 'Approved' },
		);
		assert.equal(move.request.body?.stage_id, 'Approved');

		const share = await runOperation(
			shareDocumentOperation,
			{ [Fields.DocumentId]: 'doc-1', [Fields.Recipients]: ['r1'] },
			{ message: 'shared' },
		);
		assert.equal(share.path, '/v2/public-api/documents/share');
		assert.deepEqual(share.request.body?.recipient_ids, ['r1']);

		const { context, pathOf } = createNodeContext({ response: { url: 'https://link' } });
		await createDocumentShareLinkOperation(context, [], 0, 'doc-1', '7d');
		assert.equal(pathOf(0), '/v2/public-api/documents/share-link');

		const transfer = await runOperation(
			transferDocumentOwnershipOperation,
			{ [Fields.DocumentId]: 'doc-1', [Fields.NewOwnerEmail]: 'new@example.com' },
			{ document_id: 'doc-1' },
		);
		assert.equal(transfer.request.body?.owner_email, 'new@example.com');

		const deleted = await runOperation(deleteDocumentOperation, { [Fields.DocumentId]: 'doc-1' }, {});
		assert.equal(deleted.request.method, 'DELETE');
		assert.deepEqual(deleted.result.json, { deleted: true });
	});

	it('finds and lists documents', async () => {
		const found = await runOperation(
			findDocumentOperation,
			{ [Fields.DocumentIdString]: 'doc-1' },
			{ entities: [{ document_id: 'doc-1', document_title: 'Proposal' }], pagination: {} },
		);
		assert.equal(found.request.qs?.document_id, 'doc-1');
		assert.equal(found.result.json.document_id, 'doc-1');

		const { context } = createNodeContext({
			params: { [Fields.WorkspaceId]: 'ws-1', [Fields.ReturnAll]: false, [Fields.Limit]: 50 },
			response: {
				entities: [{ document_id: 'doc-1' }, { document_id: 'doc-2' }],
				pagination: {},
			},
		});
		const listed = await getManyDocumentsOperation(context, 0);
		assert.equal(listed.length, 2);
	});
});

describe('Recipient operations', () => {
	it('adds, updates, finds, lists, and deletes recipients', async () => {
		const added = await runOperation(
			addRecipientOperation,
			{
				[Fields.DocumentId]: 'doc-1',
				[Fields.FirstName]: 'Ada',
				[Fields.LastName]: 'Lovelace',
				[Fields.Email]: 'ada@example.com',
				[Fields.PhoneNumber]: '+1',
				[Fields.AccessLevel]: 'viewer',
			},
			{ recipient_id: 'r1' },
		);
		assert.equal(added.path, '/v2/public-api/recipients');
		assert.equal(added.request.body?.email, 'ada@example.com');

		const updated = await runOperation(
			updateRecipientOperation,
			{
				[Fields.WorkspaceId]: 'ws-1',
				[Fields.RecipientId]: 'r1',
				[Fields.FirstNameOptional]: 'Ada',
				[Fields.LastNameOptional]: '',
				[Fields.EmailOptional]: '',
				[Fields.PhoneNumberOptional]: '',
				[Fields.AccessLevelOptional]: '',
				[Fields.StatusOptional]: 'block',
			},
			{ recipient_id: 'r1' },
		);
		assert.equal(updated.path, '/v2/public-api/recipients/r1');
		assert.equal(updated.request.body?.status, 'block');

		const found = await runOperation(
			findRecipientOperation,
			{ [Fields.RecipientIdString]: 'r1' },
			[{ recipient_id: 'r1', email: 'ada@example.com' }],
		);
		assert.equal(found.request.qs?.recipient_id, 'r1');
		assert.equal(found.result.json.recipient_id, 'r1');

		const { context } = createNodeContext({
			params: {
				[Fields.DocumentId]: 'doc-1',
				[Fields.IncludeBlocked]: true,
				[Fields.ReturnAll]: false,
				[Fields.Limit]: 50,
			},
			response: [{ recipient_id: 'r1' }, { recipient_id: 'r2' }],
		});
		const listed = await getManyRecipientsOperation(context, 0);
		assert.equal(listed.length, 2);

		const deleted = await runOperation(deleteRecipientOperation, { [Fields.RecipientId]: 'r1' }, {});
		assert.deepEqual(deleted.result.json, { deleted: true });
	});

	it('gets and updates notification settings', async () => {
		const got = await runOperation(
			getRecipientNotificationSettingsOperation,
			{ [Fields.RecipientId]: 'r1' },
			{ agreement_signed: 'email' },
		);
		assert.equal(got.path, '/v2/public-api/recipients/r1/notifications');

		const updated = await runOperation(
			updateRecipientNotificationOperation,
			{
				[Fields.WorkspaceId]: 'ws-1',
				[Fields.RecipientId]: 'r1',
				[Fields.AgreementSigned]: 'email',
				[Fields.AddonAdded]: '',
				[Fields.PaymentMade]: '',
				[Fields.MessageReceived]: '',
				[Fields.MediaAdded]: '',
				[Fields.DocumentStatusChanged]: '',
			},
			{ ok: true },
		);
		assert.equal(updated.request.method, 'PUT');
		assert.equal(updated.request.body?.agreement_signed, 'email');
	});
});

describe('Workspace operations', () => {
	it('creates, finds, lists workspaces, and lists stages', async () => {
		const created = await runOperation(
			addWorkspaceOperation,
			{ [Fields.WorkspaceName]: 'Sales', [Fields.WorkspaceType]: 'proposal' },
			{ workspace_id: 'ws-1' },
		);
		assert.equal(created.path, '/v2/public-api/workspace');
		assert.equal(created.request.body?.workspace_name, 'Sales');

		const found = await runOperation(
			findWorkspaceOperation,
			{ [Fields.WorkspaceIdString]: 'ws-1' },
			[{ workspace_id: 'ws-1', workspace_name: 'Sales', stages: [], labels: [] }],
		);
		assert.equal(found.result.json.workspace_id, 'ws-1');

		const listedCtx = createNodeContext({
			params: { [Fields.ReturnAll]: false, [Fields.Limit]: 50 },
			response: [{ workspace_id: 'ws-1' }, { workspace_id: 'ws-2' }],
		});
		const listed = await getManyWorkspacesOperation(listedCtx.context, 0);
		assert.equal(listed.length, 2);

		const stagesCtx = createNodeContext({
			params: { [Fields.WorkspaceId]: 'ws-1' },
			response: [
				{
					workspace_id: 'ws-1',
					stages: [
						{ stage_id: 'Lead', stage_label: 'Lead', stage_status: 'unhide' },
						{ stage_id: 'Draft', stage_label: 'Draft', stage_status: 'unhide' },
					],
				},
			],
		});
		const stages = await getWorkspaceStagesOperation(stagesCtx.context, 0);
		assert.equal(stages.length, 2);
		assert.equal(stages[0].json.stage_id, 'Lead');
	});
});

describe('Conditional payloads and empty results', () => {
	it('sends website only for business leads and other-source text when needed', async () => {
		const business = await runOperation(
			addLeadOperation,
			{
				[Fields.WorkspaceId]: 'ws-1',
				[Fields.ClientName]: 'Acme',
				[Fields.LeadType]: 'business',
				[Fields.Website]: 'https://acme.test',
				[Fields.Country]: 'US',
				[Fields.LeadSource]: 'Other',
				[Fields.LeadSourceOther]: 'Billboard',
				[Fields.OwnerEmail]: 'owner@example.com',
				[Fields.AdditionalFields]: { streetAddress: '', comment: 'keep' },
			},
			leadResponse,
		);
		assert.equal(business.request.body?.website, 'https://acme.test');
		assert.equal(business.request.body?.lead_source_other, 'Billboard');
		assert.equal(business.request.body?.comment, 'keep');
		assert.equal('street_address' in (business.request.body ?? {}), false);

		const individual = await runOperation(
			addLeadOperation,
			{
				[Fields.WorkspaceId]: 'ws-1',
				[Fields.ClientName]: 'Ada',
				[Fields.LeadType]: 'individual',
				[Fields.Country]: 'US',
				[Fields.LeadSource]: 'Referral',
				[Fields.OwnerEmail]: 'owner@example.com',
				[Fields.AdditionalFields]: {},
			},
			leadResponse,
		);
		assert.equal('website' in (individual.request.body ?? {}), false);
		assert.equal(individual.request.body?.lead_source_other, undefined);
	});

	it('returns empty find results and omits empty document labels', async () => {
		const missingLead = await runOperation(
			findLeadByIdOperation,
			{ [Fields.LeadIdString]: 'missing' },
			{ entities: [], pagination: {} },
		);
		assert.equal(missingLead.result.json.email, null);

		const missingDocument = await runOperation(
			findDocumentOperation,
			{ [Fields.DocumentIdString]: 'missing' },
			{ entities: [], pagination: {} },
		);
		assert.equal(missingDocument.result.json.message, 'Document not found');

		const { context, captured } = createNodeContext({ response: { document_id: 'doc-1' } });
		await createDocumentOperation(context, [], 0, {
			workspaceId: 'ws-1',
			title: 'No labels',
			labels: [],
		});
		assert.equal('labels' in (captured[0].body ?? {}), false);
	});

	it('sends an archive reason when a document moves to Archived', async () => {
		const moved = await runOperation(
			moveDocumentStageOperation,
			{
				[Fields.DocumentId]: 'doc-1',
				[Fields.NewStage]: 'Archived',
				[Fields.ReasonArchived]: 'Lost deal',
			},
			{ document_id: 'doc-1', stage_id: 'Archived' },
		);
		assert.equal(moved.request.body?.stage_id, 'Archived');
		assert.equal(moved.request.body?.reason, 'Lost deal');
	});

	it('paginates Get Many when returnAll is true and slices when limited', async () => {
		const allPages = createNodeContext({
			params: {
				[Fields.WorkspaceId]: 'ws-1',
				[Fields.ReturnAll]: true,
				[Fields.LeadStatus]: '',
			},
			responses: [
				{ entities: [{ ...leadResponse, lead_id: 'lead-1' }], pagination: { next_page: 2 } },
				{ entities: [{ ...leadResponse, lead_id: 'lead-2' }], pagination: {} },
			],
		});
		const all = await getManyLeadsOperation(allPages.context, 0);
		assert.equal(allPages.captured.length, 2);
		assert.equal(all.length, 2);

		const limited = createNodeContext({
			params: {
				[Fields.WorkspaceId]: 'ws-1',
				[Fields.ReturnAll]: false,
				[Fields.LeadStatus]: 'Active',
				[Fields.Limit]: 1,
			},
			response: {
				entities: [
					{ ...leadResponse, lead_id: 'lead-1' },
					{ ...leadResponse, lead_id: 'lead-2' },
				],
				pagination: {},
			},
		});
		const sliced = await getManyLeadsOperation(limited.context, 0);
		assert.equal(sliced.length, 1);
		assert.equal(sliced[0].json.lead_id, 'lead-1');
	});
});
