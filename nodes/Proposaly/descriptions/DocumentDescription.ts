import type { INodeProperties } from 'n8n-workflow';

export const documentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['document'],
			},
		},
		options: [
			{
				name: 'Create Document',
				value: 'createDocument',
				description: 'Create a new document in a workspace using the master template',
				action: 'Create a new document in a workspace using the master template',
			},
			{
				name: 'Create Document From Lead',
				value: 'createDocumentFromLead',
				description: 'Create a new document in a workspace from a lead',
				action: 'Create a new document in a workspace from a lead',
			},
			{
				name: 'Create Document From Template',
				value: 'createDocumentFromTemplate',
				description: 'Create a new document in a workspace from a template',
				action: 'Create a new document in a workspace from a template',
			},
			{
				name: 'Create Document View Only Link',
				value: 'createDocumentViewOnlyLink',
				description: 'Create a view only link for a document',
				action: 'Create a view only link for a document',
			},
			{
				name: 'Delete Document',
				value: 'deleteDocument',
				description: 'Delete a document in a workspace',
				action: 'Delete a document in a workspace',
			},
			{
				name: 'Duplicate Document',
				value: 'duplicateDocument',
				description: 'Creates a duplicate of an existing document within the same workspace',
				action: 'Creates a duplicate of an existing document within the same workspace',
			},
			{
				name: 'Find Document By ID',
				value: 'findDocumentById',
				description: 'Find a document in a workspace by ID',
				action: 'Find a document in a workspace by ID',
			},
			{
				name: 'Move Document Stage',
				value: 'moveDocumentStage',
				description: 'Move a document to a different stage',
				action: 'Move a document to a different stage',
			},
			{
				name: 'Share Document',
				value: 'shareDocument',
				description: 'Sends a share notification to recipients',
				action: 'Sends a share notification to recipients',
			},
			{
				name: 'Transfer Document Ownership',
				value: 'transferDocumentOwnership',
				description: 'Transfer ownership of a document to a new owner',
				action: 'Transfer ownership of a document to a new owner',
			},
			{
				name: 'Update Document',
				value: 'updateDocument',
				description: 'Update a document in a workspace',
				action: 'Update a document in a workspace',
			},
		],
		default: 'createDocument',
		noDataExpression: true,
	},
];

export const documentFields: INodeProperties[] = [
	{
		displayName: 'Workspace Name or ID',
		name: 'workspaceId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getWorkspaces',
		},
		displayOptions: {
			show: {
				resource: ['document'],
				operation: [
					'createDocument',
					'deleteDocument',
					'duplicateDocument',
					'moveDocumentStage',
					'shareDocument',
					'transferDocumentOwnership',
					'updateDocument',
					'createDocumentFromLead',
					'createDocumentFromTemplate',
					'createDocumentViewOnlyLink',
				],
			},
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
				resource: ['document'],
				operation: [
					'createDocumentViewOnlyLink',
					'deleteDocument',
					'duplicateDocument',
					'moveDocumentStage',
					'shareDocument',
					'transferDocumentOwnership',
					'updateDocument',
				],
			},
		},
		default: '',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Document Template Name or ID',
		name: 'documentTemplateId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDocumentTemplates',
			loadOptionsDependsOn: ['workspaceId'],
		},
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['createDocumentFromTemplate'],
			},
		},
		default: '',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Document ID',
		name: 'documentIdString',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['findDocumentById'],
			},
		},
		description: 'ID of the document to find',
	},
	{
		displayName: 'Document Title',
		name: 'documentTitle',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: [
					'createDocumentFromTemplate',
					'createDocument',
					'createDocumentFromLead',
					'duplicateDocument',
				],
			},
		},
		default: '',
		description: 'Title of the document to be created',
	},
	{
		displayName: 'New Title',
		name: 'documentTitleOptional',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['updateDocument'],
			},
		},
		default: '',
		description: 'New title of the document',
	},
	{
		displayName: 'Lead ID',
		name: 'leadId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['createDocumentFromLead'],
			},
		},
		default: '',
		placeholder: '6879dc2d1364594cdb76bwg2',
		description: 'ID of the lead',
	},
	{
		displayName: 'Recipients To Share With',
		name: 'recipients',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getRecipients',
			loadOptionsDependsOn: ['documentId'],
		},
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['shareDocument'],
			},
		},
		default: [],
		description:
			'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Expires After',
		name: 'expiresAfter',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['createDocumentViewOnlyLink'],
			},
		},
		options: [
			{
				name: '24 Hours',
				value: '24h',
			},
			{
				name: '7 Days',
				value: '7d',
			},
			{
				name: '30 Days',
				value: '30d',
			},
		],
		default: '7d',
		description: 'Time after which the link will expire',
	},
	{
		displayName: 'Copy Recipients? (Ignore By Default)',
		name: 'copyRecipients',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['createDocumentFromTemplate', 'duplicateDocument'],
			},
		},
	},
	{
		displayName: 'Copy Price Quote? (Ignore By Default)',
		name: 'copyPriceQuote',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['createDocumentFromTemplate', 'duplicateDocument'],
			},
		},
	},
	{
		displayName: 'Copy Add-Ons? (Ignore By Default)',
		name: 'copyAddons',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['createDocumentFromTemplate', 'duplicateDocument'],
			},
		},
	},
	{
		displayName: 'Copy Attachments? (Ignore By Default)',
		name: 'copyAttachments',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['createDocumentFromTemplate', 'duplicateDocument'],
			},
		},
	},
	{
		displayName: 'New Stage',
		name: 'newStage',
		required: true,
		type: 'options',
		// eslint-disable-next-line
		options: [
			{
				name: 'Lead',
				value: 'Lead',
			},
			{
				name: 'Draft',
				value: 'Draft',
			},
			{
				name: 'Prospect',
				value: 'Prospect',
			},
			{
				name: 'Partially Approved',
				value: 'PartiallyApproved',
			},
			{
				name: 'Approved',
				value: 'Approved',
			},
			{
				name: 'In Progress',
				value: 'InProgress',
			},
			{
				name: 'Completed',
				value: 'Completed',
			},
			{
				name: 'Archived',
				value: 'Archived',
			},
		],
		default: 'Draft',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['moveDocumentStage'],
			},
		},
	},
	{
		displayName: 'Reason Archived',
		name: 'reasonArchived',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				newStage: ['Archived'],
				newStageOptional: ['Archived'],
			},
		},
		description: 'Reason for archiving the document',
	},
	{
		displayName: 'New Owner Email',
		name: 'newOwnerEmail',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['transferDocumentOwnership'],
			},
		},
		description: 'Email of the owner to transfer the document to',
	},
	{
		displayName: 'New Owner Email',
		name: 'newOwnerEmail',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['updateDocument'],
			},
		},
		description: 'Email of the new owner',
	},
	{
		displayName: 'New Stage',
		name: 'newStageOptional',
		type: 'options',
		// eslint-disable-next-line
		options: [
			{
				name: 'No Change',
				value: '',
			},
			{
				name: 'Lead',
				value: 'Lead',
			},
			{
				name: 'Draft',
				value: 'Draft',
			},
			{
				name: 'Prospect',
				value: 'Prospect',
			},
			{
				name: 'Partially Approved',
				value: 'PartiallyApproved',
			},
			{
				name: 'Approved',
				value: 'Approved',
			},
			{
				name: 'In Progress',
				value: 'InProgress',
			},
			{
				name: 'Completed',
				value: 'Completed',
			},
			{
				name: 'Archived',
				value: 'Archived',
			},
		],
		default: '',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['updateDocument'],
			},
		},
		description: 'New stage of the document',
	},
];

