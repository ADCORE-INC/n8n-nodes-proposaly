import type {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { pollLeadTrigger } from './triggers/lead.triggers';
import { Document, Stage, Workspace } from './types';
import { pollDocumentTrigger } from './triggers/document.triggers';
import { pollWorkspaceTrigger } from './triggers/workspace.triggers';
import { pollRecipientTrigger } from './triggers/recipient.triggers';
import { pollNoteTrigger } from './triggers/note.triggers';
import { pollCardTrigger } from './triggers/card.triggers';
import { listNoteParentOptions } from './notes';
import { proposalyRequest, proposalyRequestAll } from './transport';

// Trigger nodes cannot be invoked as AI tools.
// eslint-disable-next-line @n8n/community-nodes/node-usable-as-tool
export class ProposalyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Proposaly Trigger',
		name: 'proposalyTrigger',
		icon: { light: 'file:proposaly.svg', dark: 'file:proposaly-dark.svg' },
		group: ['trigger'],
		version: 1,
		description: 'Unify presentations, proposals, agreements, and payments in Proposaly',
		subtitle: '={{$parameter["event"]}}',
		defaults: {
			name: 'Proposaly Trigger',
		},
		polling: true,
		inputs: [],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [
			{
				name: 'proposalyApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Trigger On',
				name: 'event',
				type: 'options',
				description: 'Trigger on a specific event',
				options: [
					{
						name: 'Archived Lead',
						value: 'archivedLead',
					},
					{
						name: 'Card Moved to New Stage',
						value: 'cardMovedToNewStage',
					},
					{
						name: 'Deleted Lead',
						value: 'deletedLead',
					},
					{
						name: 'Document Moved to New Stage',
						value: 'documentMovedToNewStage',
					},
					{
						name: 'New Card',
						value: 'newCard',
					},
					{
						name: 'New Document',
						value: 'newDocument',
					},
					{
						name: 'New Lead',
						value: 'newLead',
					},
					{
						name: 'New Note',
						value: 'newNote',
					},
					{
						name: 'New Recipient',
						value: 'newRecipient',
					},
					{
						name: 'New Workspace',
						value: 'newWorkspace',
					},
				],
				default: 'newLead',
			},
			{
				displayName: 'Workspace Name or ID',
				name: 'workspaceId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getWorkspaces',
				},
				displayOptions: {
					hide: {
						event: ['newWorkspace', 'newCard', 'cardMovedToNewStage', 'newNote'],
					},
				},
				default: '',
				required: true,
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Card Workspace Name or ID',
				name: 'workspaceId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCardWorkspaces',
				},
				displayOptions: {
					show: {
						event: ['newCard', 'cardMovedToNewStage'],
					},
				},
				default: '',
				required: true,
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Workspace Name or ID',
				name: 'workspaceId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getWorkspaces',
				},
				displayOptions: {
					show: {
						event: ['newNote'],
					},
				},
				default: '',
				description:
					'Optional. Used to list parents below. Card workspaces load documents only; other workspaces load documents and leads. Skip this if you map an ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Parent Name or ID',
				name: 'parentId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getNoteParents',
					loadOptionsDependsOn: ['workspaceId'],
				},
				required: true,
				displayOptions: {
					show: {
						event: ['newNote'],
					},
				},
				default: '',
				description:
					'Map an ID from a previous step, or pick one after selecting a workspace. Names are not accepted. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Source',
				name: 'noteSource',
				type: 'options',
				options: [
					{ name: 'Agent', value: 'agent' },
					{ name: 'All', value: '' },
					{ name: 'Call', value: 'call' },
					{ name: 'Email', value: 'email' },
					{ name: 'Meeting', value: 'meeting' },
					{ name: 'Note', value: 'note' },
					{ name: 'Order Fields', value: 'order_fields' },
					{ name: 'Slack', value: 'slack' },
					{ name: 'Zoom', value: 'zoom' },
				],
				default: '',
				displayOptions: {
					show: {
						event: ['newNote'],
					},
				},
				description: 'Only watch notes from this source. Leave empty for all sources.',
			},
			{
				displayName: 'Stage Name or ID',
				name: 'stageId',
				type: 'options',
				displayOptions: {
					show: {
						event: ['documentMovedToNewStage', 'cardMovedToNewStage'],
					},
				},
				typeOptions: {
					loadOptionsMethod: 'getWorkspaceStages',
					loadOptionsDependsOn: ['workspaceId'],
				},
				default: '',
				required: true,
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Document Name or ID',
				name: 'documentId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getDocuments',
					loadOptionsDependsOn: ['workspaceId'],
				},
				displayOptions: {
					show: {
						event: ['newRecipient'],
					},
				},
				default: '',
				required: true,
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Include Notes',
				name: 'includeNotes',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						event: [
							'archivedLead',
							'cardMovedToNewStage',
							'deletedLead',
							'documentMovedToNewStage',
							'newCard',
							'newDocument',
							'newLead',
						],
					},
				},
				description:
					'Whether to include nested notes on each record in the same API call. Turn off for smaller pages.',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
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
			async getWorkspaceStages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const workspaceId = this.getNodeParameter('workspaceId') as string;

				if (!workspaceId) {
					throw new NodeOperationError(
						this.getNode(),
						'The parameter "Workspace ID" has to be set to load stages!',
					);
				}

				const response = await proposalyRequest(this, {
					method: 'GET',
					path: '/workspaces',
					qs: {
						workspace_id: workspaceId,
					},
				});

				const stages: Stage[] = Array.isArray(response) ? response[0].stages : [];

				return stages.map((stage) => ({
					name: stage.stage_label,
					value: stage.stage_id,
				}));
			},
			async getDocuments(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const workspaceId = this.getNodeParameter('workspaceId') as string;

				if (!workspaceId) {
					throw new NodeOperationError(
						this.getNode(),
						'The parameter "Workspace" has to be set to load documents!',
					);
				}

				const documents = await proposalyRequestAll<Document>(this, '/documents', {
					workspace_id: workspaceId,
				});

				return documents.map((document) => ({
					name: document.document_title,
					value: document.document_id,
				}));
			},
			async getCardWorkspaces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const workspaces = await proposalyRequest(this, {
					method: 'GET',
					path: '/workspaces',
				});
				const items: Workspace[] = Array.isArray(workspaces) ? workspaces : [];
				return items
					.filter((workspace) => workspace.workspace_type === 'card')
					.map((workspace) => ({
						name: workspace.workspace_name,
						value: workspace.workspace_id,
					}));
			},
			async getNoteParents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const workspaceId = (this.getNodeParameter('workspaceId') as string) || '';
				return listNoteParentOptions(this, workspaceId);
			},
		},
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const event = this.getNodeParameter('event', 0) as string;

		switch (event) {
			case 'newLead':
			case 'archivedLead':
			case 'deletedLead': {
				const result = await pollLeadTrigger(this, event);
				return result ? [result] : null;
			}

			case 'newDocument':
			case 'documentMovedToNewStage': {
				const result = await pollDocumentTrigger(this, event);
				return result ? [result] : null;
			}

			case 'newWorkspace': {
				const result = await pollWorkspaceTrigger(this, event);
				return result ? [result] : null;
			}

			case 'newRecipient': {
				const result = await pollRecipientTrigger(this, event);
				return result ? [result] : null;
			}

			case 'newNote': {
				const result = await pollNoteTrigger(this);
				return result ? [result] : null;
			}

			case 'newCard':
			case 'cardMovedToNewStage': {
				const result = await pollCardTrigger(this, event);
				return result ? [result] : null;
			}

			default:
				return null;
		}
	}
}
