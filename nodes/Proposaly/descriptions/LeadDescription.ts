import type { INodeProperties } from 'n8n-workflow';

export const leadOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['lead'],
			},
		},
		options: [
			{
				name: 'Archive Lead',
				value: 'archiveLead',
				description: 'Archive a lead in a workspace',
				action: 'Archive a lead in a workspace',
			},
			{
				name: 'Create Lead',
				value: 'createLead',
				description: 'Create a new lead in a workspace',
				action: 'Create a new lead in a workspace',
			},
			{
				name: 'Delete Lead',
				value: 'deleteLead',
				description: 'Delete a lead in a workspace',
				action: 'Delete a lead in a workspace',
			},
			{
				name: 'Find Lead By ID',
				value: 'findLeadById',
				description: 'Find a lead in a workspace by ID',
				action: 'Find a lead in a workspace by ID',
			},
			{
				name: 'Reactivate Lead',
				value: 'reactivateLead',
				description: 'Reactivate an archived lead in a workspace',
				action: 'Reactivate an archived lead in a workspace',
			},
			{
				name: 'Update Lead',
				value: 'updateLead',
				description: 'Update a lead in a workspace',
				action: 'Update a lead in a workspace',
			},
		],
		default: 'createLead',
		noDataExpression: true,
	},
];

export const leadFields: INodeProperties[] = [
	{
		displayName: 'Lead ID To Find',
		name: 'leadIdString',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['findLeadById'],
			},
		},
		default: '',
		placeholder: 'ID of the lead to find',
		description: 'ID of the lead to find',
	},
	{
		displayName: 'Lead ID',
		name: 'leadId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['archiveLead', 'deleteLead', 'updateLead'],
			},
		},
		default: '',
		placeholder: '6879dc2d1364594cdb76bwg2',
		description: 'ID of the lead',
	},
	{
		displayName: 'Lead Type',
		name: 'leadType',
		required: true,
		type: 'options',
		options: [
			{
				name: 'Individual',
				value: 'individual',
			},
			{
				name: 'Business',
				value: 'business',
			},
		],
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['createLead'],
			},
		},
		default: 'individual',
		noDataExpression: true,
	},
	{
		displayName: 'Lead Type',
		name: 'leadTypeOptional',
		type: 'options',
		options: [
			{
				name: 'No Change',
				value: '',
			},
			{
				name: 'Individual',
				value: 'individual',
			},
			{
				name: 'Business',
				value: 'business',
			},
		],
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['updateLead'],
			},
		},
		default: '',
		noDataExpression: true,
	},
	{
		displayName: 'Website',
		name: 'website',
		type: 'string',
		validateType: 'url',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['createLead', 'updateLead'],
				leadType: ['business'],
			},
		},
		default: '',
		description: 'Website of the lead (optional)',
	},
	{
		displayName: 'Client Name',
		name: 'clientName',
		required: true,
		type: 'string',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['createLead'],
			},
		},
		default: '',
		description: 'Name of the client associated with the lead',
	},
	{
		displayName: 'Client Name',
		name: 'clientNameOptional',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['updateLead'],
			},
		},
		default: '',
		description: 'Name of the client associated with the lead',
	},
	{
		displayName: 'Company Address - Country Code',
		name: 'country',
		required: true,
		type: 'string',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['createLead'],
			},
		},
		default: '',
		description: '2-letter code, e.g., US, CA, UK',
	},
	{
		displayName: 'Company Address - Country Code',
		name: 'countryOptional',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['updateLead'],
			},
		},
		default: '',
		description: '2-letter code, e.g., US, CA, UK',
	},
	{
		displayName: 'Lead Source',
		name: 'leadSource',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['createLead'],
			},
		},
		type: 'options',
		required: true,
		// eslint-disable-next-line
		options: [
			{
				name: 'Google Ads',
				value: 'Google Ads',
			},
			{
				name: 'Meta Ads',
				value: 'Meta Ads',
			},
			{
				name: 'Microsoft Ads',
				value: 'Microsoft Ads',
			},
			{
				name: 'LinkedIn Ads',
				value: 'LinkedIn Ads',
			},
			{
				name: 'Email Campaigns',
				value: 'Email campaigns',
			},
			{
				name: 'SEO/Organic Search',
				value: 'SEO/Organic search',
			},
			{
				name: 'Referral',
				value: 'Referral',
			},
			{
				name: 'Partner',
				value: 'Partner',
			},
			{
				name: 'Affiliate Program',
				value: 'Affiliate program',
			},
			{
				name: 'Reseller',
				value: 'Reseller',
			},
			{
				name: 'Webinar',
				value: 'Webinar',
			},
			{
				name: 'Trade Show',
				value: 'Trade show',
			},
			{
				name: 'Conference',
				value: 'Conference',
			},
			{
				name: 'Networking Event',
				value: 'Networking event',
			},
			{
				name: 'Website Form Submission',
				value: 'Website form submission',
			},
			{
				name: 'Live Chat/Chatbot',
				value: 'Live chat/Chatbot',
			},
			{
				name: 'Social Media',
				value: 'Social media',
			},
			{
				name: 'Blog Post/Content Marketing',
				value: 'Blog post/Content marketing',
			},
			{
				name: 'Cold Email',
				value: 'Cold email',
			},
			{
				name: 'Cold Call',
				value: 'Cold call',
			},
			{
				name: 'LinkedIn',
				value: 'LinkedIn',
			},
			{
				name: 'Customer Referral',
				value: 'Customer referral',
			},
			{
				name: 'Existing Client Upsell',
				value: 'Existing client upsell',
			},
			{
				name: 'Internal Employee Referral',
				value: 'Internal employee referral',
			},
			{
				name: 'Walk-In',
				value: 'Walk-in',
			},
			{
				name: 'Other',
				value: 'Other',
			},
		],
		default: 'Google Ads',
		description:
			'Source from which the lead was obtained. If set to "Other", the field "Lead Source: Other" becomes mandatory.',
	},
	{
		displayName: 'Lead Source',
		name: 'leadSourceOptional',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['updateLead'],
			},
		},
		type: 'options',
		// eslint-disable-next-line
		options: [
			{
				name: 'No Change',
				value: '',
			},
			{
				name: 'Google Ads',
				value: 'Google Ads',
			},
			{
				name: 'Meta Ads',
				value: 'Meta Ads',
			},
			{
				name: 'Microsoft Ads',
				value: 'Microsoft Ads',
			},
			{
				name: 'LinkedIn Ads',
				value: 'LinkedIn Ads',
			},
			{
				name: 'Email Campaigns',
				value: 'Email campaigns',
			},
			{
				name: 'SEO/Organic Search',
				value: 'SEO/Organic search',
			},
			{
				name: 'Referral',
				value: 'Referral',
			},
			{
				name: 'Partner',
				value: 'Partner',
			},
			{
				name: 'Affiliate Program',
				value: 'Affiliate program',
			},
			{
				name: 'Reseller',
				value: 'Reseller',
			},
			{
				name: 'Webinar',
				value: 'Webinar',
			},
			{
				name: 'Trade Show',
				value: 'Trade show',
			},
			{
				name: 'Conference',
				value: 'Conference',
			},
			{
				name: 'Networking Event',
				value: 'Networking event',
			},
			{
				name: 'Website Form Submission',
				value: 'Website form submission',
			},
			{
				name: 'Live Chat/Chatbot',
				value: 'Live chat/Chatbot',
			},
			{
				name: 'Social Media',
				value: 'Social media',
			},
			{
				name: 'Blog Post/Content Marketing',
				value: 'Blog post/Content marketing',
			},
			{
				name: 'Cold Email',
				value: 'Cold email',
			},
			{
				name: 'Cold Call',
				value: 'Cold call',
			},
			{
				name: 'LinkedIn',
				value: 'LinkedIn',
			},
			{
				name: 'Customer Referral',
				value: 'Customer referral',
			},
			{
				name: 'Existing Client Upsell',
				value: 'Existing client upsell',
			},
			{
				name: 'Internal Employee Referral',
				value: 'Internal employee referral',
			},
			{
				name: 'Walk-In',
				value: 'Walk-in',
			},
			{
				name: 'Other',
				value: 'Other',
			},
		],
		default: '',
		description:
			'Source from which the lead was obtained. If set to "Other", the field "Lead Source: Other" becomes mandatory.',
	},
	{
		displayName: 'Lead Source: Other',
		name: 'leadSourceOther',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				leadSource: ['Other'],
			},
		},
		description: 'Specify the lead source',
	},
	{
		displayName: 'Lead Source: Other',
		name: 'leadSourceOther',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				leadSourceOptional: ['Other'],
			},
		},
		description: 'Specify the lead source',
	},
	{
		displayName: 'Owner Email',
		name: 'ownerEmail',
		type: 'string',
		default: '',
		required: true,
		description: 'Email address of the lead owner',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['createLead'],
			},
		},
	},
	{
		displayName: 'Owner Email',
		name: 'ownerEmailOptional',
		type: 'string',
		default: '',
		description: 'Email address of the lead owner (optional)',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['updateLead'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['createLead', 'updateLead'],
			},
		},
		options: [
			{
				displayName: 'Additional Comments',
				name: 'comment',
				type: 'string',
				default: '',
				description: 'Additional comment for the lead',
			},
			{
				displayName: 'Apartment',
				name: 'apartment',
				type: 'string',
				default: '',
				description: 'Apartment/suite number of the company (if applicable)',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City where the company is located',
			},

			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State or province where the company is located',
			},
			{
				displayName: 'Street Address',
				name: 'streetAddress',
				type: 'string',
				default: '',
				description: 'Street address of the company',
			},
			{
				displayName: 'Zip Code',
				name: 'zipCode',
				type: 'string',
				default: '',
				description: 'Postal or ZIP code',
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
				resource: ['lead'],
				operation: ['createLead', 'reactivateLead'],
			},
		},
		default: '',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Archived Lead Name or ID',
		name: 'archivedLeadId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getArchivedLeads',
			loadOptionsDependsOn: ['workspaceId'],
		},
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['reactivateLead'],
			},
		},
		default: '',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];
