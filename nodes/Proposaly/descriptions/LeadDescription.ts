import type { INodeProperties } from 'n8n-workflow';
import { Fields, Resources, LeadOperations, AdditionalFieldKeys } from '../constants';

export const leadOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: Fields.Operation,
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [Resources.Lead],
			},
		},
		options: [
			{
				name: 'Archive Lead',
				value: LeadOperations.Archive,
				description: 'Archive a lead in a workspace',
				action: 'Archive a lead in a workspace',
			},
			{
				name: 'Create Lead',
				value: LeadOperations.Create,
				description: 'Create a new lead in a workspace',
				action: 'Create a new lead in a workspace',
			},
			{
				name: 'Delete Lead',
				value: LeadOperations.Delete,
				description: 'Delete a lead in a workspace',
				action: 'Delete a lead in a workspace',
			},
			{
				name: 'Find Lead By ID',
				value: LeadOperations.FindById,
				description: 'Find a lead in a workspace by ID',
				action: 'Find a lead in a workspace by ID',
			},
			{
				name: 'Get Many Leads',
				value: LeadOperations.GetMany,
				description: 'List leads in a workspace',
				action: 'Get many leads',
			},
			{
				name: 'Reactivate Lead',
				value: LeadOperations.Reactivate,
				description: 'Reactivate an archived lead in a workspace',
				action: 'Reactivate an archived lead in a workspace',
			},
			{
				name: 'Update Lead',
				value: LeadOperations.Update,
				description: 'Update a lead in a workspace',
				action: 'Update a lead in a workspace',
			},
		],
		default: 'createLead',
	},
];

export const leadFields: INodeProperties[] = [
	{
		displayName: 'Lead ID To Find',
		name: Fields.LeadIdString,
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.FindById],
			},
		},
		default: '',
		placeholder: 'ID of the lead to find',
		description: 'ID of the lead to find',
	},
	{
		displayName: 'Lead ID',
		name: Fields.LeadId,
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.Archive, LeadOperations.Delete, LeadOperations.Update],
			},
		},
		default: '',
		placeholder: '6879dc2d1364594cdb76bwg2',
		description: 'ID of the lead',
	},
	{
		displayName: 'Lead Type',
		name: Fields.LeadType,
		required: true,
		type: 'options',
		options: [
			{
				name: 'Business',
				value: 'business',
			},
			{
				name: 'Individual',
				value: 'individual',
			},
		],
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.Create],
			},
		},
		default: 'individual',
		noDataExpression: true,
	},
	{
		displayName: 'Lead Type',
		name: Fields.LeadTypeOptional,
		type: 'options',
		options: [
			{
				name: 'Business',
				value: 'business',
			},
			{
				name: 'Individual',
				value: 'individual',
			},
			{
				name: 'No Change',
				value: '',
			},
		],
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.Update],
			},
		},
		default: '',
		noDataExpression: true,
	},
	{
		displayName: 'Website',
		name: Fields.Website,
		type: 'string',
		validateType: 'url',
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.Create, LeadOperations.Update],
				leadType: ['business'],
			},
		},
		default: '',
		description: 'Website of the lead (optional)',
	},
	{
		displayName: 'Client Name',
		name: Fields.ClientName,
		required: true,
		type: 'string',
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.Create],
			},
		},
		default: '',
		description: 'Name of the client associated with the lead',
	},
	{
		displayName: 'Client Name',
		name: Fields.ClientNameOptional,
		type: 'string',
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.Update],
			},
		},
		default: '',
		description: 'Name of the client associated with the lead',
	},
	{
		displayName: 'Company Address - Country Code',
		name: Fields.Country,
		required: true,
		type: 'string',
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.Create],
			},
		},
		default: '',
		description: '2-letter code, e.g., US, CA, UK',
	},
	{
		displayName: 'Company Address - Country Code',
		name: Fields.CountryOptional,
		type: 'string',
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.Update],
			},
		},
		default: '',
		description: '2-letter code, e.g., US, CA, UK',
	},
	{
		displayName: 'Lead Source',
		name: Fields.LeadSource,
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.Create],
			},
		},
		type: 'options',
		required: true,
		options: [
			{
				name: 'Affiliate Program',
				value: 'Affiliate program',
			},
			{
				name: 'Blog Post/Content Marketing',
				value: 'Blog post/Content marketing',
			},
			{
				name: 'Cold Call',
				value: 'Cold call',
			},
			{
				name: 'Cold Email',
				value: 'Cold email',
			},
			{
				name: 'Conference',
				value: 'Conference',
			},
			{
				name: 'Customer Referral',
				value: 'Customer referral',
			},
			{
				name: 'Email Campaigns',
				value: 'Email campaigns',
			},
			{
				name: 'Existing Client Upsell',
				value: 'Existing client upsell',
			},
			{
				name: 'Google Ads',
				value: 'Google Ads',
			},
			{
				name: 'Internal Employee Referral',
				value: 'Internal employee referral',
			},
			{
				name: 'LinkedIn',
				value: 'LinkedIn',
			},
			{
				name: 'LinkedIn Ads',
				value: 'LinkedIn Ads',
			},
			{
				name: 'Live Chat/Chatbot',
				value: 'Live chat/Chatbot',
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
				name: 'Networking Event',
				value: 'Networking event',
			},
			{
				name: 'Other',
				value: 'Other',
			},
			{
				name: 'Partner',
				value: 'Partner',
			},
			{
				name: 'Referral',
				value: 'Referral',
			},
			{
				name: 'Reseller',
				value: 'Reseller',
			},
			{
				name: 'SEO/Organic Search',
				value: 'SEO/Organic search',
			},
			{
				name: 'Social Media',
				value: 'Social media',
			},
			{
				name: 'Trade Show',
				value: 'Trade show',
			},
			{
				name: 'Walk-In',
				value: 'Walk-in',
			},
			{
				name: 'Webinar',
				value: 'Webinar',
			},
			{
				name: 'Website Form Submission',
				value: 'Website form submission',
			},
		],
		default: 'Google Ads',
		description:
			'Source from which the lead was obtained. If set to "Other", the field "Lead Source: Other" becomes mandatory.',
	},
	{
		displayName: 'Lead Source',
		name: Fields.LeadSourceOptional,
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.Update],
			},
		},
		type: 'options',
		options: [
			{
				name: 'Affiliate Program',
				value: 'Affiliate program',
			},
			{
				name: 'Blog Post/Content Marketing',
				value: 'Blog post/Content marketing',
			},
			{
				name: 'Cold Call',
				value: 'Cold call',
			},
			{
				name: 'Cold Email',
				value: 'Cold email',
			},
			{
				name: 'Conference',
				value: 'Conference',
			},
			{
				name: 'Customer Referral',
				value: 'Customer referral',
			},
			{
				name: 'Email Campaigns',
				value: 'Email campaigns',
			},
			{
				name: 'Existing Client Upsell',
				value: 'Existing client upsell',
			},
			{
				name: 'Google Ads',
				value: 'Google Ads',
			},
			{
				name: 'Internal Employee Referral',
				value: 'Internal employee referral',
			},
			{
				name: 'LinkedIn',
				value: 'LinkedIn',
			},
			{
				name: 'LinkedIn Ads',
				value: 'LinkedIn Ads',
			},
			{
				name: 'Live Chat/Chatbot',
				value: 'Live chat/Chatbot',
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
				name: 'Networking Event',
				value: 'Networking event',
			},
			{
				name: 'No Change',
				value: '',
			},
			{
				name: 'Other',
				value: 'Other',
			},
			{
				name: 'Partner',
				value: 'Partner',
			},
			{
				name: 'Referral',
				value: 'Referral',
			},
			{
				name: 'Reseller',
				value: 'Reseller',
			},
			{
				name: 'SEO/Organic Search',
				value: 'SEO/Organic search',
			},
			{
				name: 'Social Media',
				value: 'Social media',
			},
			{
				name: 'Trade Show',
				value: 'Trade show',
			},
			{
				name: 'Walk-In',
				value: 'Walk-in',
			},
			{
				name: 'Webinar',
				value: 'Webinar',
			},
			{
				name: 'Website Form Submission',
				value: 'Website form submission',
			},
		],
		default: '',
		description:
			'Source from which the lead was obtained. If set to "Other", the field "Lead Source: Other" becomes mandatory.',
	},
	{
		displayName: 'Lead Source: Other',
		name: Fields.LeadSourceOther,
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				leadSource: ['Other'],
			},
		},
		description: 'Specify the lead source',
	},
	{
		displayName: 'Lead Source: Other',
		name: Fields.LeadSourceOther,
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				leadSourceOptional: ['Other'],
			},
		},
		description: 'Specify the lead source',
	},
	{
		displayName: 'Owner Email',
		name: Fields.OwnerEmail,
		type: 'string',
		default: '',
		required: true,
		description: 'Email address of the lead owner',
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.Create],
			},
		},
	},
	{
		displayName: 'Owner Email',
		name: Fields.OwnerEmailOptional,
		type: 'string',
		default: '',
		description: 'Email address of the lead owner (optional)',
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.Update],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: Fields.AdditionalFields,
		type: 'collection',
		default: {},
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.Create, LeadOperations.Update],
			},
		},
		options: [
			{
				displayName: 'Additional Comments',
				name: AdditionalFieldKeys.Comment,
				type: 'string',
				default: '',
				description: 'Additional comment for the lead',
			},
			{
				displayName: 'Apartment',
				name: AdditionalFieldKeys.Apartment,
				type: 'string',
				default: '',
				description: 'Apartment/suite number of the company (if applicable)',
			},
			{
				displayName: 'City',
				name: AdditionalFieldKeys.City,
				type: 'string',
				default: '',
				description: 'City where the company is located',
			},

			{
				displayName: 'State',
				name: AdditionalFieldKeys.State,
				type: 'string',
				default: '',
				description: 'State or province where the company is located',
			},
			{
				displayName: 'Street Address',
				name: AdditionalFieldKeys.StreetAddress,
				type: 'string',
				default: '',
				description: 'Street address of the company',
			},
			{
				displayName: 'Zip Code',
				name: AdditionalFieldKeys.ZipCode,
				type: 'string',
				default: '',
				description: 'Postal or ZIP code',
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
				resource: [Resources.Lead],
				operation: [LeadOperations.Create, LeadOperations.Reactivate, LeadOperations.GetMany],
			},
		},
		default: '',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Archived Lead Name or ID',
		name: Fields.ArchivedLeadId,
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getArchivedLeads',
			loadOptionsDependsOn: [Fields.WorkspaceId],
		},
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.Reactivate],
			},
		},
		default: '',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Status',
		name: Fields.LeadStatus,
		type: 'options',
		options: [
			{
				name: 'Active',
				value: 'Active',
			},
			{
				name: 'All',
				value: '',
			},
			{
				name: 'Archived',
				value: 'Archived',
			},
			{
				name: 'Deleted',
				value: 'Deleted',
			},
		],
		default: '',
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.GetMany],
			},
		},
		description: 'If empty, get leads of all statuses',
	},
	{
		displayName: 'Return All',
		name: Fields.ReturnAll,
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.GetMany],
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
				resource: [Resources.Lead],
				operation: [LeadOperations.GetMany],
				[Fields.ReturnAll]: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Include Notes',
		name: Fields.IncludeNotes,
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [
					LeadOperations.Archive,
					LeadOperations.Create,
					LeadOperations.FindById,
					LeadOperations.GetMany,
					LeadOperations.Reactivate,
					LeadOperations.Update,
				],
			},
		},
		description:
			'Whether to include nested notes on each record in the same API call. Turn off for smaller pages.',
	},
];
