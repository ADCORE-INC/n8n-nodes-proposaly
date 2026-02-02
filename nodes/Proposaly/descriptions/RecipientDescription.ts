import type { INodeProperties } from 'n8n-workflow';
import { Fields, Resources, RecipientOperations } from '../constants';

export const recipientOperations: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: Fields.Operation,
		type: 'options',
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
			},
		},
		options: [
			{
				name: 'Add Recipient',
				value: RecipientOperations.Add,
				description: 'Add a recipient to a document',
				action: 'Add a recipient to a document',
			},
			{
				name: 'Delete Recipient',
				value: RecipientOperations.Delete,
				description: 'Delete a recipient from a document',
				action: 'Delete a recipient from a document',
			},
			{
				name: 'Find Recipient',
				value: RecipientOperations.Find,
				description: 'Find a recipient by ID',
				action: 'Find a recipient by ID',
			},
			{
				name: 'Update Recipient',
				value: RecipientOperations.Update,
				description: 'Update a recipient in a document',
				action: 'Update a recipient in a document',
			},
			{
				name: 'Get Recipient Notification Settings',
				value: RecipientOperations.GetNotificationSettings,
				description: 'Retrieve notification preferences of a recipient',
				action: 'Retrieve notification preferences of a recipient',
			},
			{
				name: 'Update Recipient Notification Settings',
				value: RecipientOperations.UpdateNotificationSettings,
				description: 'Update notification preferences of a recipient',
				action: 'Update notification preferences of a recipient',
			},
		],
		default: RecipientOperations.Add,
		noDataExpression: true,
	},
];

export const recipientFields: INodeProperties[] = [
	{
		displayName: 'Recipient Name or ID',
		name: Fields.RecipientId,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getRecipients',
			loadOptionsDependsOn: [Fields.DocumentId],
		},
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [
					RecipientOperations.Update,
					RecipientOperations.Delete,
					RecipientOperations.UpdateNotificationSettings,
					RecipientOperations.GetNotificationSettings,
				],
			},
		},
		default: '',
		noDataExpression: true,
	},
	{
		displayName: 'Recipient ID To Find',
		name: Fields.RecipientIdString,
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.Find],
			},
		},
		default: '',
		placeholder: 'ID of the recipient to find',
		description: 'ID of the recipient to find',
	},
	{
		displayName: 'First Name',
		name: Fields.FirstName,
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.Add],
			},
		},
		default: '',
		description: 'First name of the recipient',
	},
	{
		displayName: 'First Name',
		name: Fields.FirstNameOptional,
		type: 'string',
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.Update],
			},
		},
		default: '',
		description: 'First name of the recipient (optional)',
	},
	{
		displayName: 'Last Name',
		name: Fields.LastName,
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.Add],
			},
		},
		default: '',
		description: 'Last name of the recipient',
	},
	{
		displayName: 'Last Name',
		name: Fields.LastNameOptional,
		type: 'string',
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.Update],
			},
		},
		default: '',
		description: 'Last name of the recipient (optional)',
	},
	{
		displayName: 'Email',
		name: Fields.Email,
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.Add],
			},
		},
		default: '',
		placeholder: 'name@example.com',
		description: 'Email address of the recipient',
	},
	{
		displayName: 'Email',
		name: Fields.EmailOptional,
		type: 'string',
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.Update],
			},
		},
		default: '',
		placeholder: 'name@example.com',
		description: 'Email address of the recipient (optional)',
	},
	{
		displayName: 'Phone Number',
		name: Fields.PhoneNumber,
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.Add],
			},
		},
		default: '',
		placeholder: '+1234567890',
		description: 'Phone number of the recipient',
	},
	{
		displayName: 'Phone Number',
		name: Fields.PhoneNumberOptional,
		type: 'string',
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.Update],
			},
		},
		default: '',
		placeholder: '+1234567890',
		description: 'Phone number of the recipient (optional)',
	},
	{
		displayName: 'Access Level',
		name: Fields.AccessLevel,
		type: 'options',
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.Add],
			},
		},
		options: [
			{
				name: 'Editor',
				value: 'editor',
			},
			{
				name: 'Viewer',
				value: 'viewer',
			},
		],
		default: 'viewer',
		description: 'Access level of the recipient',
		required: true,
	},
	{
		displayName: 'Access Level',
		name: Fields.AccessLevelOptional,
		type: 'options',
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.Update],
			},
		},
		options: [
			{
				name: 'No Change',
				value: '',
			},
			{
				name: 'Editor',
				value: 'editor',
			},
			{
				name: 'Viewer',
				value: 'viewer',
			},
		],
		default: '',
		description: 'Access level of the recipient (optional)',
	},
	{
		displayName: 'Status',
		name: Fields.StatusOptional,
		type: 'options',
		default: '',
		options: [
			{
				name: 'No Change',
				value: '',
			},
			{
				name: 'Active',
				value: 'active',
			},
			{
				name: 'Block',
				value: 'block',
			},
		],
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.Update],
			},
		},
		description: 'Block or unblock the recipient (optional)',
	},
	{
		displayName: 'Notification For Agreement Signed',
		name: Fields.AgreementSigned,
		type: 'options',
		default: '',
		description: 'Notification method for agreement signed',
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.UpdateNotificationSettings],
			},
		},
		// eslint-disable-next-line
		options: [
			{
				name: 'No Change',
				value: '',
			},
			{
				name: 'SMS',
				value: 'sms',
			},
			{
				name: 'Email',
				value: 'email',
			},
			{
				name: 'Both Email & SMS',
				value: 'email_sms',
			},
			{
				name: 'None',
				value: 'none',
			},
		],
	},
	{
		displayName: 'Notification For Addon Added',
		name: Fields.AddonAdded,
		type: 'options',
		default: '',
		description: 'Notification method for addon added',
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.UpdateNotificationSettings],
			},
		},
		// eslint-disable-next-line
		options: [
			{
				name: 'No Change',
				value: '',
			},
			{
				name: 'SMS',
				value: 'sms',
			},
			{
				name: 'Email',
				value: 'email',
			},
			{
				name: 'Both Email & SMS',
				value: 'email_sms',
			},
			{
				name: 'None',
				value: 'none',
			},
		],
	},
	{
		displayName: 'Notification For Payment Made',
		name: Fields.PaymentMade,
		type: 'options',
		default: '',
		description: 'Notification method for payment made',
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.UpdateNotificationSettings],
			},
		},
		// eslint-disable-next-line
		options: [
			{
				name: 'No Change',
				value: '',
			},
			{
				name: 'SMS',
				value: 'sms',
			},
			{
				name: 'Email',
				value: 'email',
			},
			{
				name: 'Both Email & SMS',
				value: 'email_sms',
			},
			{
				name: 'None',
				value: 'none',
			},
		],
	},
	{
		displayName: 'Notification For Message Received',
		name: Fields.MessageReceived,
		type: 'options',
		default: '',
		description: 'Notification method for message received',
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.UpdateNotificationSettings],
			},
		},
		// eslint-disable-next-line
		options: [
			{
				name: 'No Change',
				value: '',
			},
			{
				name: 'SMS',
				value: 'sms',
			},
			{
				name: 'Email',
				value: 'email',
			},
			{
				name: 'Both Email & SMS',
				value: 'email_sms',
			},
			{
				name: 'None',
				value: 'none',
			},
		],
	},
	{
		displayName: 'Notification For Media Added',
		name: Fields.MediaAdded,
		type: 'options',
		default: '',
		description: 'Notification method for media added',
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.UpdateNotificationSettings],
			},
		},
		// eslint-disable-next-line
		options: [
			{
				name: 'No Change',
				value: '',
			},
			{
				name: 'SMS',
				value: 'sms',
			},
			{
				name: 'Email',
				value: 'email',
			},
			{
				name: 'Both Email & SMS',
				value: 'email_sms',
			},
			{
				name: 'None',
				value: 'none',
			},
		],
	},
	{
		displayName: 'Notification For Document Status Changed',
		name: Fields.DocumentStatusChanged,
		type: 'options',
		default: '',
		description: 'Notification method for document status changed',
		displayOptions: {
			show: {
				resource: [Resources.Recipient],
				operation: [RecipientOperations.UpdateNotificationSettings],
			},
		},
		// eslint-disable-next-line
		options: [
			{
				name: 'No Change',
				value: '',
			},
			{
				name: 'SMS',
				value: 'sms',
			},
			{
				name: 'Email',
				value: 'email',
			},
			{
				name: 'Both Email & SMS',
				value: 'email_sms',
			},
			{
				name: 'None',
				value: 'none',
			},
		],
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
				resource: [Resources.Recipient],
				operation: [
					RecipientOperations.Add,
					RecipientOperations.Delete,
					RecipientOperations.Update,
					RecipientOperations.UpdateNotificationSettings,
					RecipientOperations.GetNotificationSettings,
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
				resource: [Resources.Recipient],
				operation: [
					RecipientOperations.Add,
					RecipientOperations.Update,
					RecipientOperations.Delete,
					RecipientOperations.UpdateNotificationSettings,
					RecipientOperations.GetNotificationSettings,
				],
			},
		},
		default: '',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];
