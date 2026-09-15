import type { IDataObject, INodeExecutionData, IPollFunctions } from 'n8n-workflow';
import { Note, PollData } from '../types';
import { isRetryableProposalyError } from '../transport';
import { fetchNotesList } from '../notes';
import { diffPollRecords, resolvePollLimit } from '../shape';

export async function pollNoteTrigger(
	context: IPollFunctions,
): Promise<INodeExecutionData[] | null> {
	try {
		const parentId = context.getNodeParameter('parentId') as string;
		const source = (context.getNodeParameter('noteSource', '') as string) || undefined;
		const pollData = context.getWorkflowStaticData('node') as PollData;
		const limit = resolvePollLimit(context.getNodeParameter('limit', 0));

		if (pollData.currentParentId !== parentId) {
			pollData.lastNewNoteId = undefined;
			pollData.currentParentId = parentId;
		}

		const notes = await fetchNotesList(context, parentId, { source });
		const { emit, nextId } = diffPollRecords({
			records: notes,
			lastId: pollData.lastNewNoteId,
			getId: (note: Note) => note.id,
			newestFirst: true,
			mode: context.getMode(),
			limit,
		});

		if (nextId) {
			pollData.lastNewNoteId = nextId;
		}

		if (emit.length === 0) {
			return null;
		}

		return emit.map((note) => ({
			json: note as unknown as IDataObject,
		}));
	} catch (error) {
		if (isRetryableProposalyError(error)) {
			return null;
		}
		throw error;
	}
}
