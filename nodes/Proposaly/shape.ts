import type { IDataObject, INodeExecutionData } from 'n8n-workflow';
import type { Lead, Recipient } from './types';

export type LeadLike = Partial<Lead> & {
	client_name?: string | null;
	id?: string;
	email?: string | null;
	first_name?: string | null;
	last_name?: string | null;
	phone_number?: string | null;
};

export type FlattenedLead = LeadLike & {
	client_name: string | null;
	company: string | null;
	email: string | null;
	first_name: string | null;
	last_name: string | null;
	phone_number: string | null;
};

function firstRecipient(recipients: Recipient[] | null | undefined): Partial<Recipient> {
	return Array.isArray(recipients) && recipients.length > 0 ? recipients[0] : {};
}

export function flattenFirstRecipient(
	recipients: Recipient[] | null | undefined,
	fallbackLastName?: string | null,
): Pick<FlattenedLead, 'email' | 'first_name' | 'last_name' | 'phone_number'> {
	const first = firstRecipient(recipients);
	return {
		email: first.email ?? null,
		first_name: first.first_name ?? null,
		last_name: first.last_name || fallbackLastName || null,
		phone_number: first.phone_number ?? null,
	};
}

/**
 * Match Zapier/Make lead output: client_name alias plus first recipient at the top level.
 * Keeps the original recipients array.
 */
export function flattenLead(lead: LeadLike | null | undefined): FlattenedLead {
	const source = lead ?? {};
	const clientName = source.client_name || source.company || null;
	return {
		...source,
		id: source.lead_id || source.id,
		client_name: clientName,
		company: source.company || clientName,
		...flattenFirstRecipient(source.recipients, clientName),
	};
}

export function leadExecutionData(lead: unknown, itemIndex: number): INodeExecutionData {
	return {
		json: flattenLead(lead as LeadLike) as IDataObject,
		pairedItem: { item: itemIndex },
	};
}

export function toItems<T extends object>(
	records: T[],
	itemIndex: number,
): INodeExecutionData[] {
	return records.map((record) => ({
		json: record as IDataObject,
		pairedItem: { item: itemIndex },
	}));
}

export type PollDiffOptions<T> = {
	records: T[];
	lastId: string | undefined;
	getId: (record: T) => string | undefined;
	/** true = index 0 is newest (leads, documents, workspaces). false = last index is newest (recipients). */
	newestFirst: boolean;
	mode: string;
	limit?: number;
};

export type PollDiffResult<T> = {
	emit: T[];
	nextId: string | undefined;
};

/**
 * First production poll seeds the cursor and emits nothing.
 * Manual execute returns a sample so the editor still has test data.
 * Optional limit processes oldest-new records first so the cursor cannot skip items.
 */
export function diffPollRecords<T>(options: PollDiffOptions<T>): PollDiffResult<T> {
	const { records, lastId, getId, newestFirst, mode, limit } = options;

	if (records.length === 0) {
		return { emit: [], nextId: lastId };
	}

	const newestRecord = newestFirst ? records[0] : records[records.length - 1];
	const newestId = getId(newestRecord);

	if (!lastId) {
		if (mode === 'manual') {
			const ordered = newestFirst ? records : [...records].reverse();
			return { emit: ordered.slice(0, 1), nextId: newestId };
		}
		return { emit: [], nextId: newestId };
	}

	let newer: T[];
	const lastIndex = records.findIndex((record) => getId(record) === lastId);
	if (newestFirst) {
		newer = lastIndex === -1 ? records : records.slice(0, lastIndex);
	} else {
		newer = lastIndex === -1 ? records : records.slice(lastIndex + 1);
	}

	if (limit && limit > 0 && newer.length > limit) {
		newer = newestFirst ? newer.slice(newer.length - limit) : newer.slice(0, limit);
	}

	const nextId = newer.length
		? newestFirst
			? getId(newer[0])
			: getId(newer[newer.length - 1])
		: lastId;

	return { emit: newer, nextId };
}

export function resolvePollLimit(limit: unknown): number | undefined {
	if (typeof limit !== 'number' || !Number.isFinite(limit) || limit <= 0) {
		return undefined;
	}
	return Math.floor(limit);
}
