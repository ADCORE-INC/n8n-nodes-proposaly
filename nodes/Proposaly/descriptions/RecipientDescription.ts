import type { INodeProperties } from 'n8n-workflow';

export const recipientOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['recipient'],
			},
		},
		// eslint-disable-next-line
		options: [
			{
				name: 'Add Recipient',
				value: 'addRecipient',
				description: 'Add a recipient to a document',
				action: 'Add a recipient to a document',
			},
			{
				name: 'Delete Recipient',
				value: 'deleteRecipient',
				description: 'Delete a recipient from a document',
				action: 'Delete a recipient from a document',
			},
			{
				name: 'Find Recipient',
				value: 'findRecipient',
				description: 'Find a recipient by ID',
				action: 'Find a recipient by ID',
			},
			{
				name: 'Update Recipient',
				value: 'updateRecipient',
				description: 'Update a recipient in a document',
				action: 'Update a recipient in a document',
			},
			{
				name: 'Get Recipient Notification Settings',
				value: 'getRecipientNotificationSettings',
				description: 'Retrieve notification preferences of a recipient',
				action: 'Retrieve notification preferences of a recipient',
			},
			{
				name: 'Update Recipient Notification Settings',
				value: 'updateRecipientNotificationSettings',
				description: 'Update notification preferences of a recipient',
				action: 'Update notification preferences of a recipient',
			},
		],
		default: 'addRecipient',
		noDataExpression: true,
	},
];

export const recipientFields: INodeProperties[] = [
	{
		displayName: 'Recipient Name or ID',
		name: 'recipientId',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getRecipients',
			loadOptionsDependsOn: ['documentId'],
		},
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: [
					'updateRecipient',
					'deleteRecipient',
					'updateRecipientNotificationSettings',
					'getRecipientNotificationSettings',
				],
			},
		},
		default: '',
		noDataExpression: true,
	},
	{
		displayName: 'Recipient ID To Find',
		name: 'recipientIdString',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['findRecipient'],
			},
		},
		default: '',
		placeholder: 'ID of the recipient to find',
		description: 'ID of the recipient to find',
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['addRecipient'],
			},
		},
		default: '',
		description: 'First name of the recipient',
	},
	{
		displayName: 'First Name',
		name: 'firstNameOptional',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['updateRecipient'],
			},
		},
		default: '',
		description: 'First name of the recipient (optional)',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['addRecipient'],
			},
		},
		default: '',
		description: 'Last name of the recipient',
	},
	{
		displayName: 'Last Name',
		name: 'lastNameOptional',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['updateRecipient'],
			},
		},
		default: '',
		description: 'Last name of the recipient (optional)',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['addRecipient'],
			},
		},
		default: '',
		placeholder: 'name@example.com',
		description: 'Email address of the recipient',
	},
	{
		displayName: 'Email',
		name: 'emailOptional',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['updateRecipient'],
			},
		},
		default: '',
		placeholder: 'name@example.com',
		description: 'Email address of the recipient (optional)',
	},
	{
		displayName: 'Phone Number',
		name: 'phoneNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['addRecipient'],
			},
		},
		default: '',
		placeholder: '+1234567890',
		description: 'Phone number of the recipient',
	},
	{
		displayName: 'Phone Number',
		name: 'phoneNumberOptional',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['updateRecipient'],
			},
		},
		default: '',
		placeholder: '+1234567890',
		description: 'Phone number of the recipient (optional)',
	},
	{
		displayName: 'Access Level',
		name: 'accessLevel',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['addRecipient'],
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
		name: 'accessLevelOptional',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['updateRecipient'],
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
		name: 'statusOptional',
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
				resource: ['recipient'],
				operation: ['updateRecipient'],
			},
		},
		description: 'Block or unblock the recipient (optional)',
	},
	{
		displayName: 'Notification For Agreement Signed',
		name: 'agreementSigned',
		type: 'options',
		default: '',
		description: 'Notification method for agreement signed',
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['updateRecipientNotificationSettings'],
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
		name: 'addonAdded',
		type: 'options',
		default: '',
		description: 'Notification method for addon added',
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['updateRecipientNotificationSettings'],
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
		name: 'paymentMade',
		type: 'options',
		default: '',
		description: 'Notification method for payment made',
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['updateRecipientNotificationSettings'],
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
		name: 'messageReceived',
		type: 'options',
		default: '',
		description: 'Notification method for message received',
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['updateRecipientNotificationSettings'],
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
		name: 'mediaAdded',
		type: 'options',
		default: '',
		description: 'Notification method for media added',
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['updateRecipientNotificationSettings'],
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
		name: 'documentStatusChanged',
		type: 'options',
		default: '',
		description: 'Notification method for document status changed',
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: ['updateRecipientNotificationSettings'],
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
		name: 'workspaceId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getWorkspaces',
		},
		displayOptions: {
			show: {
				resource: ['recipient'],
				operation: [
					'addRecipient',
					'deleteRecipient',
					'updateRecipient',
					'updateRecipientNotificationSettings',
					'getRecipientNotificationSettings',
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
				resource: ['recipient'],
				operation: [
					'addRecipient',
					'updateRecipient',
					'deleteRecipient',
					'updateRecipientNotificationSettings',
					'getRecipientNotificationSettings',
				],
			},
		},
		default: '',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];

