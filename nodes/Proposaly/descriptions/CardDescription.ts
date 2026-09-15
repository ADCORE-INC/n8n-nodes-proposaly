import type { INodeProperties } from 'n8n-workflow';
import { CardOperations, Fields, Resources } from '../constants';

export const cardOperations: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: Fields.Operation,
		type: 'options',
		displayOptions: {
			show: {
				resource: [Resources.Card],
			},
		},
		options: [
			{
				name: 'Find Card By ID',
				value: CardOperations.FindById,
				description: 'Find a card by its document ID, including lead metadata for CRM mapping',
				action: 'Find a card',
			},
			{
				name: 'Get Many Cards',
				value: CardOperations.GetMany,
				description: 'List cards in a Card workspace, including lead metadata for CRM mapping',
				action: 'Get many cards',
			},
		],
		default: CardOperations.FindById,
		noDataExpression: true,
	},
];

export const cardFields: INodeProperties[] = [
	{
		displayName: 'Card ID To Find',
		name: Fields.DocumentIdString,
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Card],
				operation: [CardOperations.FindById],
			},
		},
		default: '',
		placeholder: 'Document ID of the card',
		description: 'Document ID of the card to find',
	},
	{
		displayName: 'Card Workspace Name or ID',
		name: Fields.WorkspaceId,
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getCardWorkspaces',
		},
		displayOptions: {
			show: {
				resource: [Resources.Card],
				operation: [CardOperations.GetMany],
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
				resource: [Resources.Card],
				operation: [CardOperations.GetMany],
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
				resource: [Resources.Card],
				operation: [CardOperations.GetMany],
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
				resource: [Resources.Card],
				operation: [CardOperations.FindById, CardOperations.GetMany],
			},
		},
		description:
			'Whether to fetch nested notes. Turn off to save API credits; each record can use extra API calls.',
	},
];
