import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodePropertyOptions,
} from 'n8n-workflow';
import { Fields } from './constants';
import { compact } from './utils';
import { flattenCard, flattenLead, type FlattenedCard, type LeadLike } from './shape';
import { proposalyRequest, proposalyRequestLimited, type ProposalyContext } from './transport';
import type { Document, Lead, Note, PaginatedApiResponse, Workspace } from './types';

export const NOTE_PAGE_SIZE = 10;
export const NOTE_MAX_PAGES = 10;
export const NOTE_LIST_LIMIT = 100;

export function normalizeNote(note: Note | IDataObject | null | undefined): Note {
	const source = (note ?? {}) as Note;
	return {
		...source,
		id: source.id,
	};
}

function noteEntities(body: unknown): Note[] {
	if (Array.isArray(body)) {
		return body.map((note) => normalizeNote(note as Note));
	}
	if (!body || typeof body !== 'object') {
		return [];
	}
	const entities = (body as PaginatedApiResponse<Note>).entities;
	if (!Array.isArray(entities)) {
		return [];
	}
	return entities.map((note) => normalizeNote(note));
}

function nextPage(body: unknown): number | null {
	if (!body || typeof body !== 'object') {
		return null;
	}
	const page = (body as PaginatedApiResponse<Note>).pagination?.next_page;
	if (typeof page !== 'number' || page <= 0) {
		return null;
	}
	return page;
}

export async function fetchNotesPage(
	context: ProposalyContext,
	parentId: string,
	page: number,
	extras: { limit?: number; source?: string; search?: string } = {},
): Promise<{ notes: Note[]; nextPage: number | null }> {
	const body = await proposalyRequest(context, {
		method: 'GET',
		path: '/notes',
		qs: compact({
			document_id: parentId,
			page,
			limit: extras.limit ?? NOTE_PAGE_SIZE,
			source: extras.source,
			search: extras.search,
		}) as IDataObject,
	});
	return {
		notes: noteEntities(body),
		nextPage: nextPage(body),
	};
}

export async function fetchNotes(
	context: ProposalyContext,
	parentId: string,
	extras: { source?: string; search?: string; maxPages?: number } = {},
): Promise<Note[]> {
	if (!parentId) {
		return [];
	}

	const maxPages = extras.maxPages ?? NOTE_MAX_PAGES;
	const notes: Note[] = [];
	for (let page = 1; page <= maxPages; page++) {
		const result = await fetchNotesPage(context, parentId, page, extras);
		notes.push(...result.notes);
		if (!result.nextPage || result.notes.length === 0) {
			break;
		}
	}
	return notes;
}

export async function fetchNotesList(
	context: ProposalyContext,
	parentId: string,
	extras: { source?: string; search?: string } = {},
): Promise<Note[]> {
	if (!parentId) {
		return [];
	}
	const result = await fetchNotesPage(context, parentId, 1, {
		...extras,
		limit: NOTE_LIST_LIMIT,
	});
	return result.notes;
}

export function includeNotesForItem(context: IExecuteFunctions, itemIndex: number): boolean {
	return context.getNodeParameter(Fields.IncludeNotes, itemIndex, true) !== false;
}

export function includeNotesForPoll(context: {
	getNodeParameter: (name: string, fallback?: unknown) => unknown;
}): boolean {
	return context.getNodeParameter(Fields.IncludeNotes, true) !== false;
}

export function includeNotesQuery(includeNotes: boolean): IDataObject {
	return includeNotes ? { include_notes: true } : {};
}

function withoutNotesFields<T extends object>(record: T): T {
	const rest = { ...(record as T & { notes?: unknown; notes_total?: unknown }) };
	delete rest.notes;
	delete rest.notes_total;
	return rest as T;
}

export async function attachNotes<T extends object>(
	context: ProposalyContext,
	record: T,
	parentId: string | undefined,
	includeNotes = true,
): Promise<T & { notes?: Note[]; notes_total?: number }> {
	if (!includeNotes) {
		return withoutNotesFields(record);
	}

	const nested = (record as { notes?: unknown }).notes;
	if (Array.isArray(nested)) {
		const notes = nested.map((note) => normalizeNote(note as Note));
		const notesTotal = (record as { notes_total?: unknown }).notes_total;
		return {
			...record,
			notes,
			notes_total: typeof notesTotal === 'number' ? notesTotal : notes.length,
		};
	}

	const notes = parentId ? await fetchNotes(context, parentId) : [];
	return { ...withoutNotesFields(record), notes, notes_total: notes.length };
}

export async function attachNotesToRecords<T extends object>(
	context: ProposalyContext,
	records: T[],
	getParentId: (record: T) => string | undefined,
	includeNotes = true,
): Promise<Array<T & { notes?: Note[] }>> {
	return Promise.all(
		records.map((record) => attachNotes(context, record, getParentId(record), includeNotes)),
	);
}

export async function leadItemWithNotes(
	context: IExecuteFunctions,
	lead: unknown,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const flattened = flattenLead(lead as LeadLike);
	const json = await attachNotes(
		context,
		flattened as IDataObject,
		flattened.lead_id || flattened.id,
		includeNotesForItem(context, itemIndex),
	);
	return { json, pairedItem: { item: itemIndex } };
}

export async function documentItemWithNotes(
	context: IExecuteFunctions,
	document: Document | IDataObject,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const json = await attachNotes(
		context,
		document as IDataObject,
		(document as Document).document_id,
		includeNotesForItem(context, itemIndex),
	);
	return { json, pairedItem: { item: itemIndex } };
}

export async function cardItemWithNotes(
	context: IExecuteFunctions,
	document: Document | IDataObject,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const flattened = flattenCard(document as Document);
	const json = await attachNotes(
		context,
		flattened as IDataObject,
		flattened.document_id,
		includeNotesForItem(context, itemIndex),
	);
	return { json, pairedItem: { item: itemIndex } };
}

async function workspaceTypeFor(
	context: ProposalyContext,
	workspaceId: string,
): Promise<string | undefined> {
	const response = await proposalyRequest(context, {
		method: 'GET',
		path: '/workspaces',
		qs: { workspace_id: workspaceId },
	});
	const workspaces: Workspace[] = Array.isArray(response) ? response : [];
	return workspaces[0]?.workspace_type;
}

function documentParentOptions(documents: Document[]): INodePropertyOptions[] {
	return documents.map((document) => ({
		name: document.document_title || document.document_id,
		value: document.document_id,
	}));
}

function leadParentOptions(leads: Lead[]): INodePropertyOptions[] {
	return leads.map((lead) => ({
		name: `Lead: ${lead.client_name || lead.company || lead.lead_id}`,
		value: lead.lead_id,
	}));
}

export async function listNoteParentOptions(
	context: ProposalyContext,
	workspaceId: string,
): Promise<INodePropertyOptions[]> {
	if (!workspaceId) {
		return [];
	}

	const workspaceType = await workspaceTypeFor(context, workspaceId).catch(() => undefined);
	const documents = await proposalyRequestLimited<Document>(
		context,
		'/documents',
		{ workspace_id: workspaceId },
		100,
	);

	if (workspaceType === 'card') {
		return documentParentOptions(documents);
	}

	const leads = await proposalyRequestLimited<Lead>(
		context,
		'/leads',
		{ workspace_id: workspaceId, lead_status: 'Active' },
		100,
	).catch(() => [] as Lead[]);

	return [...documentParentOptions(documents), ...leadParentOptions(leads)];
}

export async function cardsWithNotes(
	context: ProposalyContext,
	documents: Document[],
	includeNotes = true,
): Promise<Array<FlattenedCard & { notes?: Note[] }>> {
	const cards = documents.map(flattenCard);
	return attachNotesToRecords(context, cards, (card) => card.document_id, includeNotes);
}
