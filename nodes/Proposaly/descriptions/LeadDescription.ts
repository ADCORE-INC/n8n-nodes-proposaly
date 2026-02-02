import type { INodeProperties } from 'n8n-workflow';
import { Fields, Resources, LeadOperations, AdditionalFieldKeys } from '../constants';

export const leadOperations: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: Fields.Operation,
		type: 'options',
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
		default: LeadOperations.Create,
		noDataExpression: true,
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
		name: Fields.LeadSourceOptional,
		displayOptions: {
			show: {
				resource: [Resources.Lead],
				operation: [LeadOperations.Update],
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
				operation: [LeadOperations.Create, LeadOperations.Reactivate],
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
];
