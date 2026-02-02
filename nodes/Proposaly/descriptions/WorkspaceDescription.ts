import type { INodeProperties } from 'n8n-workflow';

export const workspaceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['workspace'],
			},
		},
		options: [
			{
				name: 'Create Workspace',
				value: 'addWorkspace',
				description: 'Create a new workspace',
				action: 'Create a new workspace',
			},
			{
				name: 'Find Workspace By ID',
				value: 'findWorkspaceById',
				description: 'Find a workspace by ID',
				action: 'Find a workspace by ID',
			},
		],
		default: 'addWorkspace',
		noDataExpression: true,
	},
];

export const workspaceFields: INodeProperties[] = [
	{
		displayName: 'Workspace ID To Find',
		name: 'workspaceIdString',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['workspace'],
				operation: ['findWorkspaceById'],
			},
		},
		default: '',
		placeholder: 'ID of the workspace to find',
		description: 'ID of the workspace to find',
	},
	{
		displayName: 'Workspace Name',
		name: 'workspaceName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['workspace'],
				operation: ['addWorkspace'],
			},
		},
		description: 'Name of the workspace',
	},
	{
		displayName: 'Workspace Type',
		name: 'workspaceType',
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
				resource: ['workspace'],
				operation: ['addWorkspace'],
			},
		},
		default: 'proposal',
	},
];

