import type { INodeProperties } from 'n8n-workflow';
import { Fields, Resources, NoteOperations } from '../constants';

const noteParentOperations = [
	NoteOperations.Create,
	NoteOperations.Delete,
	NoteOperations.GetMany,
	NoteOperations.Update,
];

const noteIdOperations = [NoteOperations.Delete, NoteOperations.FindById, NoteOperations.Update];

export const noteOperations: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: Fields.Operation,
		type: 'options',
		displayOptions: {
			show: {
				resource: [Resources.Note],
			},
		},
		options: [
			{
				name: 'Create Note',
				value: NoteOperations.Create,
				description: 'Create a note on a document, card, or lead',
				action: 'Create a note',
			},
			{
				name: 'Delete Note',
				value: NoteOperations.Delete,
				description: 'Permanently delete a note. Server-generated notes cannot be deleted.',
				action: 'Delete a note',
			},
			{
				name: 'Find Note By ID',
				value: NoteOperations.FindById,
				description: 'Find a note by ID',
				action: 'Find a note',
			},
			{
				name: 'Get Many Notes',
				value: NoteOperations.GetMany,
				description: 'List notes on a document, card, or lead',
				action: 'Get many notes',
			},
			{
				name: 'Update Note',
				value: NoteOperations.Update,
				description: "Update a note's title and/or body. Server-generated notes cannot be updated.",
				action: 'Update a note',
			},
		],
		default: NoteOperations.Create,
		noDataExpression: true,
	},
];

export const noteFields: INodeProperties[] = [
	{
		displayName: 'Workspace Name or ID',
		name: Fields.WorkspaceId,
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getWorkspaces',
		},
		displayOptions: {
			show: {
				resource: [Resources.Note],
				operation: noteParentOperations,
			},
		},
		default: '',
		description:
			'Optional. Used to list parents below. Card workspaces load documents only; other workspaces load documents and leads. Skip this if you map an ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		// API values are IDs; the list only shows names as labels.
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
		displayName: 'Document, Card, or Lead ID',
		name: Fields.ParentId,
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getNoteParents',
			loadOptionsDependsOn: [Fields.WorkspaceId],
		},
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Note],
				operation: noteParentOperations,
			},
		},
		default: '',
		description:
			'Map an ID from a previous step, or pick one after selecting a workspace. Names are not accepted. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Note ID',
		name: Fields.NoteId,
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [Resources.Note],
				operation: noteIdOperations,
			},
		},
		default: '',
		description: 'ID of the note. Map from a previous step.',
	},
	{
		displayName: 'Title',
		name: Fields.NoteTitle,
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [Resources.Note],
				operation: [NoteOperations.Create, NoteOperations.Update],
			},
		},
		description:
			'Optional note title (maximum 150 characters). Title or body is required on create. Omit on update to leave unchanged.',
	},
	{
		displayName: 'Body',
		name: Fields.NoteBody,
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		displayOptions: {
			show: {
				resource: [Resources.Note],
				operation: [NoteOperations.Create, NoteOperations.Update],
			},
		},
		description:
			'Optional note body in markdown (maximum 20000 characters). Attachments cannot be added through the API.',
	},
	{
		displayName: 'Source',
		name: Fields.NoteSource,
		type: 'options',
		options: [
			{ name: 'Call', value: 'call' },
			{ name: 'Email', value: 'email' },
			{ name: 'Meeting', value: 'meeting' },
			{ name: 'Note', value: 'note' },
			{ name: 'Slack', value: 'slack' },
			{ name: 'Zoom', value: 'zoom' },
		],
		default: 'note',
		displayOptions: {
			show: {
				resource: [Resources.Note],
				operation: [NoteOperations.Create],
			},
		},
		description: 'Channel the note originated from. Server-generated sources cannot be set here.',
	},
	{
		displayName: 'Author Email',
		name: Fields.AuthorEmail,
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [Resources.Note],
				operation: [NoteOperations.Create],
			},
		},
		description: 'Optional email of an existing company user. Defaults to the API service account when omitted.',
	},
	{
		displayName: 'Source',
		name: Fields.NoteSource,
		type: 'options',
		options: [
			{ name: 'Agent', value: 'agent' },
			{ name: 'All', value: '' },
			{ name: 'Call', value: 'call' },
			{ name: 'Email', value: 'email' },
			{ name: 'Meeting', value: 'meeting' },
			{ name: 'Note', value: 'note' },
			{ name: 'Order Fields', value: 'order_fields' },
			{ name: 'Slack', value: 'slack' },
			{ name: 'Zoom', value: 'zoom' },
		],
		default: '',
		displayOptions: {
			show: {
				resource: [Resources.Note],
				operation: [NoteOperations.GetMany],
			},
		},
		description: 'Only return notes from this source. Leave empty for all sources.',
	},
	{
		displayName: 'Search',
		name: Fields.NoteSearch,
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [Resources.Note],
				operation: [NoteOperations.GetMany],
			},
		},
		description: 'Case-insensitive substring search over note title and body',
	},
	{
		displayName: 'Return All',
		name: Fields.ReturnAll,
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: [Resources.Note],
				operation: [NoteOperations.GetMany],
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
				resource: [Resources.Note],
				operation: [NoteOperations.GetMany],
				[Fields.ReturnAll]: [false],
			},
		},
		description: 'Max number of results to return',
	},
];
