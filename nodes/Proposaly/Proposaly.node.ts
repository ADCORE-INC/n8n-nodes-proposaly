/**
 * This node uses programmatic style because:
 * 1. Operations require conditional request building
 * 2. Consistent pattern with the companion trigger node
 * 3. Pagination requires manual handling
 */
import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import { createDocumentOperation } from './actions/document/create.operation';
import { deleteDocumentOperation } from './actions/document/delete.operation';
import { duplicateDocumentOperation } from './actions/document/duplicate.operation';
import { findDocumentOperation } from './actions/document/find.operation';
import { moveDocumentStageOperation } from './actions/document/move.operation';
import { createDocumentShareLinkOperation } from './actions/document/share-link.operation';
import { shareDocumentOperation } from './actions/document/share.operation';
import { transferDocumentOwnershipOperation } from './actions/document/transfer.operation';
import { updateDocumentOperation } from './actions/document/update.operation';
import { addLeadOperation } from './actions/lead/add.operation';
import { archiveLeadOperation } from './actions/lead/archive.operation';
import { deleteLeadOperation } from './actions/lead/delete.operation';
import { findLeadByIdOperation } from './actions/lead/find.operation';
import { reactivateLeadOperation } from './actions/lead/reactivate.operation';
import { updateLeadOperation } from './actions/lead/update.operation';
import { addRecipientOperation } from './actions/recipient/add.operation';
import { deleteRecipientOperation } from './actions/recipient/delete.operation';
import { findRecipientOperation } from './actions/recipient/find.operation';
import { getRecipientNotificationSettingsOperation } from './actions/recipient/get-notification.operation';
import { updateRecipientNotificationOperation } from './actions/recipient/update-notification.operation';
import { updateRecipientOperation } from './actions/recipient/update.operation';
import { addWorkspaceOperation } from './actions/workspace/add.operation';
import { findWorkspaceOperation } from './actions/workspace/find.operation';
import { Document, Lead, Recipient, Workspace } from './types';

import { documentFields, documentOperations } from './descriptions/DocumentDescription';
import { leadFields, leadOperations } from './descriptions/LeadDescription';
import { recipientFields, recipientOperations } from './descriptions/RecipientDescription';
import { workspaceFields, workspaceOperations } from './descriptions/WorkspaceDescription';
import { proposalyRequest, proposalyRequestAll } from './transport';

async function executeItems(
	context: IExecuteFunctions,
	handler: (index: number) => Promise<INodeExecutionData>,
): Promise<INodeExecutionData[][]> {
	const items = context.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const result = await handler(i);
			returnData.push(result);
		} catch (error) {
			if (context.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}
	return [returnData];
}

export class Proposaly implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Proposaly',
		name: 'proposaly',
		icon: 'file:proposaly.svg',
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		description: 'Consume Proposaly API',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		defaults: {
			name: 'Proposaly',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [
			{
				name: 'proposalyApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Lead',
						value: 'lead',
					},
					{
						name: 'Recipient',
						value: 'recipient',
					},
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Workspace',
						value: 'workspace',
					},
				],
				default: 'lead',
				noDataExpression: true,
				required: true,
			},
			...leadOperations,
			...leadFields,
			...recipientOperations,
			...recipientFields,
			...documentOperations,
			...documentFields,
			...workspaceOperations,
			...workspaceFields,
		],
	};

	methods = {
		loadOptions: {
			async getWorkspaces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const workspaces = await proposalyRequest(this, {
					method: 'GET',
					path: '/workspaces',
				});

				// API now always returns an array of workspaces
				const items: Workspace[] = Array.isArray(workspaces) ? workspaces : [];

				return items.map((workspace) => ({
					name: workspace.workspace_name,
					value: workspace.workspace_id,
				}));
			},
			async getDocumentTemplates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const workspaceId = this.getNodeParameter('workspaceId', 0) as string;

				if (!workspaceId) {
					throw new NodeOperationError(
						this.getNode(),
						'The parameter "Workspace ID" has to be set to load document templates!',
					);
				}

				const allDocuments = await proposalyRequestAll<Document>(this, '/documents', {
					workspace_id: workspaceId,
				});

				const templates = allDocuments.filter((doc) => doc.is_template === true);
				return templates.map((template) => ({
					name: template.document_title,
					value: template.document_id,
				}));
			},
			async getDocuments(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const workspaceId = this.getNodeParameter('workspaceId', 0) as string;

				if (!workspaceId) {
					throw new NodeOperationError(
						this.getNode(),
						'The parameter "Workspace ID" has to be set to load documents!',
					);
				}

				const allDocuments = await proposalyRequestAll<Document>(this, '/documents', {
					workspace_id: workspaceId,
				});

				return allDocuments.map((doc) => ({
					name: doc.document_title,
					value: doc.document_id,
				}));
			},
			async getArchivedLeads(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const workspaceId = this.getNodeParameter('workspaceId', 0) as string;

				if (!workspaceId) {
					throw new NodeOperationError(
						this.getNode(),
						'The parameter "Workspace ID" has to be set to load archived leads!',
					);
				}

				const leads = await proposalyRequestAll<Lead>(this, '/leads', {
					workspace_id: workspaceId,
					lead_status: 'Archived',
				});

				return leads.map((lead) => ({
					name: lead.company || lead.lead_id,
					value: lead.lead_id,
				}));
			},
			async getRecipients(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const documentId = this.getNodeParameter('documentId', 0) as string;

				if (!documentId) {
					throw new NodeOperationError(
						this.getNode(),
						'The parameter "Document ID" has to be set to load recipients!',
					);
				}

				const recipients: Recipient[] = await proposalyRequest(this, {
					method: 'GET',
					path: '/recipients',
					qs: {
						document_id: documentId,
					},
				});

				return recipients.map((recipient) => ({
					name: recipient.email
						? `${recipient.first_name} ${recipient.last_name} (${recipient.email})`
						: `${recipient.first_name} ${recipient.last_name}`,
					value: recipient.recipient_id,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | null> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// LEAD ACTIONS
		if (resource === 'lead') {
			if (operation === 'createLead') {
				return executeItems(this, (i) => addLeadOperation(this, items, i));
			}

			if (operation === 'archiveLead') {
				return executeItems(this, (i) => archiveLeadOperation(this, items, i));
			}

			if (operation === 'deleteLead') {
				return executeItems(this, (i) => deleteLeadOperation(this, items, i));
			}

			if (operation === 'updateLead') {
				return executeItems(this, (i) => updateLeadOperation(this, items, i));
			}

			if (operation === 'reactivateLead') {
				return executeItems(this, (i) => reactivateLeadOperation(this, items, i));
			}

			if (operation === 'findLeadById') {
				return executeItems(this, (i) => findLeadByIdOperation(this, items, i));
			}
		}

		// DOCUMENT ACTIONS
		if (resource === 'document') {
			if (operation === 'createDocument') {
				return executeItems(this, (i) => {
					const workspaceId = this.getNodeParameter('workspaceId', i) as string;
					const title = this.getNodeParameter('documentTitle', i) as string;
					return createDocumentOperation(this, items, i, {
						workspaceId,
						title,
					});
				});
			}

			if (operation === 'createDocumentFromLead') {
				return executeItems(this, (i) => {
					const workspaceId = this.getNodeParameter('workspaceId', i) as string;
					const title = this.getNodeParameter('documentTitle', i) as string;
					const leadId = this.getNodeParameter('leadId', i) as string;
					return createDocumentOperation(this, items, i, {
						workspaceId,
						title,
						leadId,
					});
				});
			}

			if (operation === 'createDocumentFromTemplate') {
				return executeItems(this, (i) => {
					const workspaceId = this.getNodeParameter('workspaceId', i) as string;
					const title = this.getNodeParameter('documentTitle', i) as string;
					const templateDocumentId = this.getNodeParameter('documentTemplateId', i) as string;
					const copyRecipients = this.getNodeParameter('copyRecipients', i, false) as boolean;
					const copyPriceQuote = this.getNodeParameter('copyPriceQuote', i, false) as boolean;
					const copyAddons = this.getNodeParameter('copyAddons', i, false) as boolean;
					const copyAttachments = this.getNodeParameter('copyAttachments', i, false) as boolean;
					return createDocumentOperation(this, items, i, {
						workspaceId,
						title,
						templateDocumentId,
						copyRecipients,
						copyPriceQuote,
						copyAddons,
						copyAttachments,
					});
				});
			}

			if (operation === 'createDocumentViewOnlyLink') {
				return executeItems(this, (i) => {
					const documentId = this.getNodeParameter('documentId', i) as string;
					const expiresAfter = this.getNodeParameter('expiresAfter', i) as string;
					return createDocumentShareLinkOperation(this, items, i, documentId, expiresAfter);
				});
			}

			if (operation === 'deleteDocument') {
				return executeItems(this, (i) => deleteDocumentOperation(this, items, i));
			}

			if (operation === 'duplicateDocument') {
				return executeItems(this, (i) => duplicateDocumentOperation(this, items, i));
			}

			if (operation === 'moveDocumentStage') {
				return executeItems(this, (i) => moveDocumentStageOperation(this, items, i));
			}

			if (operation === 'shareDocument') {
				return executeItems(this, (i) => shareDocumentOperation(this, items, i));
			}

			if (operation === 'transferDocumentOwnership') {
				return executeItems(this, (i) => transferDocumentOwnershipOperation(this, items, i));
			}

			if (operation === 'updateDocument') {
				return executeItems(this, (i) => updateDocumentOperation(this, items, i));
			}

			if (operation === 'findDocumentById') {
				return executeItems(this, (i) => findDocumentOperation(this, items, i));
			}
		}

		// RECIPIENT ACTIONS
		if (resource === 'recipient') {
			if (operation === 'addRecipient') {
				return executeItems(this, (i) => addRecipientOperation(this, items, i));
			}

			if (operation === 'updateRecipient') {
				return executeItems(this, (i) => updateRecipientOperation(this, items, i));
			}

			if (operation === 'deleteRecipient') {
				return executeItems(this, (i) => deleteRecipientOperation(this, items, i));
			}

			if (operation === 'findRecipient') {
				return executeItems(this, (i) => findRecipientOperation(this, items, i));
			}

			if (operation === 'updateRecipientNotificationSettings') {
				return executeItems(this, (i) => updateRecipientNotificationOperation(this, items, i));
			}

			if (operation === 'getRecipientNotificationSettings') {
				return executeItems(this, (i) => getRecipientNotificationSettingsOperation(this, items, i));
			}
		}

		// WORKSPACE ACTIONS
		if (resource === 'workspace') {
			if (operation === 'addWorkspace') {
				return executeItems(this, (i) => addWorkspaceOperation(this, items, i));
			}

			if (operation === 'findWorkspaceById') {
				return executeItems(this, (i) => findWorkspaceOperation(this, items, i));
			}
		}

		return null;
	}
}
