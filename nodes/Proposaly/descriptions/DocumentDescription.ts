import type { INodeProperties } from 'n8n-workflow';
import { Fields, Resources, DocumentOperations } from '../constants';

export const documentOperations: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: Fields.Operation,
		type: 'options',
		displayOptions: {
			show: {
				resource: [Resources.Document],
			},
		},
		options: [
			{
				name: 'Create Document',
				value: DocumentOperations.Create,
				description: 'Create a new document in a workspace using the master template',
				action: 'Create a new document in a workspace using the master template',
			},
			{
				name: 'Create Document From Lead',
				value: DocumentOperations.CreateFromLead,
				description: 'Create a new document in a workspace from a lead',
				action: 'Create a new document in a workspace from a lead',
			},
			{
				name: 'Create Document From Template',
				value: DocumentOperations.CreateFromTemplate,
				description: 'Create a new document in a workspace from a template',
				action: 'Create a new document in a workspace from a template',
			},
			{
				name: 'Create Document View Only Link',
				value: DocumentOperations.CreateViewOnlyLink,
				description: 'Create a view only link for a document',
				action: 'Create a view only link for a document',
			},
			{
				name: 'Delete Document',
				value: DocumentOperations.Delete,
				description: 'Delete a document in a workspace',
				action: 'Delete a document in a workspace',
			},
			{
				name: 'Duplicate Document',
				value: DocumentOperations.Duplicate,
				description: 'Creates a duplicate of an existing document within the same workspace',
				action: 'Creates a duplicate of an existing document within the same workspace',
			},
			{
				name: 'Find Document By ID',
				value: DocumentOperations.FindById,
				description: 'Find a document in a workspace by ID',
				action: 'Find a document in a workspace by ID',
			},
			{
				name: 'Move Document Stage',
				value: DocumentOperations.MoveStage,
				description: 'Move a document to a different stage',
				action: 'Move a document to a different stage',
			},
			{
				name: 'Share Document',
				value: DocumentOperations.Share,
				description: 'Sends a share notification to recipients',
				action: 'Sends a share notification to recipients',
			},
			{
				name: 'Transfer Document Ownership',
				value: DocumentOperations.TransferOwnership,
				description: 'Transfer ownership of a document to a new owner',
				action: 'Transfer ownership of a document to a new owner',
			},
			{
				name: 'Update Document',
				value: DocumentOperations.Update,
				description: 'Update a document in a workspace',
				action: 'Update a document in a workspace',
			},
		],
		default: DocumentOperations.Create,
		noDataExpression: true,
	},
];

export const documentFields: INodeProperties[] = [
	{
		displayName: 'Workspace Name or ID',
		name: Fields.WorkspaceId,
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getWorkspaces',
		},
		displayOptions: {
			show: {
				resource: [Resources.Document],
				operation: [
					DocumentOperations.Create,
					DocumentOperations.Delete,
					DocumentOperations.Duplicate,
					DocumentOperations.MoveStage,
					DocumentOperations.Share,
					DocumentOperations.TransferOwnership,
					DocumentOperations.Update,
					DocumentOperations.CreateFromLead,
					DocumentOperations.CreateFromTemplate,
					DocumentOperations.CreateViewOnlyLink,
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
		name: Fields.DocumentId,
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDocuments',
			loadOptionsDependsOn: [Fields.WorkspaceId],
		},
		displayOptions: {
			show: {
				resource: [Resources.Document],
				operation: [
					DocumentOperations.CreateViewOnlyLink,
					DocumentOperations.Delete,
					DocumentOperations.Duplicate,
					DocumentOperations.MoveStage,
					DocumentOperations.Share,
					DocumentOperations.TransferOwnership,
					DocumentOperations.Update,
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
		name: Fields.DocumentTemplateId,
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDocumentTemplates',
			loadOptionsDependsOn: [Fields.WorkspaceId],
		},
		displayOptions: {
			show: {
				resource: [Resources.Document],
				operation: [DocumentOperations.CreateFromTemplate],
			},
		},
		default: '',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Document ID',
		name: Fields.DocumentIdString,
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Document],
				operation: [DocumentOperations.FindById],
			},
		},
		description: 'ID of the document to find',
	},
	{
		displayName: 'Document Title',
		name: Fields.DocumentTitle,
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Document],
				operation: [
					DocumentOperations.CreateFromTemplate,
					DocumentOperations.Create,
					DocumentOperations.CreateFromLead,
					DocumentOperations.Duplicate,
				],
			},
		},
		default: '',
		description: 'Title of the document to be created',
	},
	{
		displayName: 'New Title',
		name: Fields.DocumentTitleOptional,
		type: 'string',
		displayOptions: {
			show: {
				resource: [Resources.Document],
				operation: [DocumentOperations.Update],
			},
		},
		default: '',
		description: 'New title of the document',
	},
	{
		displayName: 'Lead ID',
		name: Fields.LeadId,
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Document],
				operation: [DocumentOperations.CreateFromLead],
			},
		},
		default: '',
		placeholder: '6879dc2d1364594cdb76bwg2',
		description: 'ID of the lead',
	},
	{
		displayName: 'Recipients To Share With',
		name: Fields.Recipients,
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getRecipients',
			loadOptionsDependsOn: [Fields.DocumentId],
		},
		displayOptions: {
			show: {
				resource: [Resources.Document],
				operation: [DocumentOperations.Share],
			},
		},
		default: [],
		description:
			'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Expires After',
		name: Fields.ExpiresAfter,
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Document],
				operation: [DocumentOperations.CreateViewOnlyLink],
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
		name: Fields.CopyRecipients,
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: [Resources.Document],
				operation: [DocumentOperations.CreateFromTemplate, DocumentOperations.Duplicate],
			},
		},
	},
	{
		displayName: 'Copy Price Quote? (Ignore By Default)',
		name: Fields.CopyPriceQuote,
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: [Resources.Document],
				operation: [DocumentOperations.CreateFromTemplate, DocumentOperations.Duplicate],
			},
		},
	},
	{
		displayName: 'Copy Add-Ons? (Ignore By Default)',
		name: Fields.CopyAddons,
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: [Resources.Document],
				operation: [DocumentOperations.CreateFromTemplate, DocumentOperations.Duplicate],
			},
		},
	},
	{
		displayName: 'Copy Attachments? (Ignore By Default)',
		name: Fields.CopyAttachments,
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: [Resources.Document],
				operation: [DocumentOperations.CreateFromTemplate, DocumentOperations.Duplicate],
			},
		},
	},
	{
		displayName: 'New Stage',
		name: Fields.NewStage,
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
				resource: [Resources.Document],
				operation: [DocumentOperations.MoveStage],
			},
		},
	},
	{
		displayName: 'Reason Archived',
		name: Fields.ReasonArchived,
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Document],
				newStage: ['Archived'],
				newStageOptional: ['Archived'],
			},
		},
		description: 'Reason for archiving the document',
	},
	{
		displayName: 'New Owner Email',
		name: Fields.NewOwnerEmail,
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Document],
				operation: [DocumentOperations.TransferOwnership],
			},
		},
		description: 'Email of the owner to transfer the document to',
	},
	{
		displayName: 'New Owner Email',
		name: Fields.NewOwnerEmail,
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [Resources.Document],
				operation: [DocumentOperations.Update],
			},
		},
		description: 'Email of the new owner',
	},
	{
		displayName: 'New Stage',
		name: Fields.NewStageOptional,
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
				resource: [Resources.Document],
				operation: [DocumentOperations.Update],
			},
		},
		description: 'New stage of the document',
	},
];
