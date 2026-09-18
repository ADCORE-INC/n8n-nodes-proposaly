import type { INodeProperties } from 'n8n-workflow';
import { Fields, Resources, WorkspaceOperations } from '../constants';

export const workspaceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: Fields.Operation,
		type: 'options',
		noDataExpression: true,
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
			{
				name: 'Get Many Workspaces',
				value: WorkspaceOperations.GetMany,
				description: 'List workspaces in your company',
				action: 'Get many workspaces',
			},
			{
				name: 'Get Workspace Stages',
				value: WorkspaceOperations.GetStages,
				description: 'List stages in a workspace',
				action: 'Get workspace stages',
			},
		],
		default: 'addWorkspace',
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
			{ name: 'Agreement', value: 'agreement' },
			{ name: 'Payment', value: 'payment' },
			{ name: 'Presentation', value: 'presentation' },
			{ name: 'Proposal', value: 'proposal' },
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
	{
		displayName: 'Workspace Name or ID',
		name: Fields.WorkspaceId,
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getWorkspaces',
		},
		displayOptions: {
			show: {
				resource: [Resources.Workspace],
				operation: [WorkspaceOperations.GetStages],
			},
		},
		default: '',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Return All',
		name: Fields.ReturnAll,
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: [Resources.Workspace],
				operation: [WorkspaceOperations.GetMany],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: Fields.Limit,
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		displayOptions: {
			show: {
				resource: [Resources.Workspace],
				operation: [WorkspaceOperations.GetMany],
				[Fields.ReturnAll]: [false],
			},
		},
		description: 'Max number of results to return',
	},
];
