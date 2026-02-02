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
import { proposalyRequest, proposalyRequestAll } from './transport';

export class ProposalyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Proposaly Trigger',
		name: 'proposalyTrigger',
		icon: 'file:proposaly.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts a workflow when a new event occurs on Proposaly',
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
						name: 'Deleted Lead',
						value: 'deletedLead',
					},
					{
						name: 'Document Moved to New Stage',
						value: 'documentMovedToNewStage',
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
						event: ['newWorkspace'],
					},
				},
				default: '',
				required: true,
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Stage Name or ID',
				name: 'stageId',
				type: 'options',
				displayOptions: {
					show: {
						event: ['documentMovedToNewStage'],
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
		],
	};

	methods = {
		loadOptions: {
			async getWorkspaces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const workspaces = await proposalyRequest(this, {
					method: 'GET',
					path: '/workspaces',
				});

				// API might return array directly or object with data
				const items: Workspace[] = Array.isArray(workspaces) ? workspaces : workspaces.data || [];

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

			default:
				return null;
		}
	}
}
