import type { INodeProperties } from 'n8n-workflow';
import { Fields, Resources, WorkspaceOperations } from '../constants';

export const workspaceOperations: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: Fields.Operation,
		type: 'options',
		displayOptions: {
			show: {
				resource: [Resources.Workspace],
			},
		},
		options: [
			{
				name: 'Create Workspace',
				value: WorkspaceOperations.Add,
				description: 'Create a new workspace',
				action: 'Create a new workspace',
			},
			{
				name: 'Find Workspace By ID',
				value: WorkspaceOperations.FindById,
				description: 'Find a workspace by ID',
				action: 'Find a workspace by ID',
			},
		],
		default: WorkspaceOperations.Add,
		noDataExpression: true,
	},
];

export const workspaceFields: INodeProperties[] = [
	{
		displayName: 'Workspace ID To Find',
		name: Fields.WorkspaceIdString,
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Workspace],
				operation: [WorkspaceOperations.FindById],
			},
		},
		default: '',
		placeholder: 'ID of the workspace to find',
		description: 'ID of the workspace to find',
	},
	{
		displayName: 'Workspace Name',
		name: Fields.WorkspaceName,
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Workspace],
				operation: [WorkspaceOperations.Add],
			},
		},
		description: 'Name of the workspace',
	},
	{
		displayName: 'Workspace Type',
		name: Fields.WorkspaceType,
		type: 'options',
		options: [
			{ name: 'Proposal', value: 'proposal' },
			{ name: 'Agreement', value: 'agreement' },
			{ name: 'Presentation', value: 'presentation' },
			{ name: 'Payment', value: 'payment' },
		],
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Workspace],
				operation: [WorkspaceOperations.Add],
			},
		},
		default: 'proposal',
	},
];
