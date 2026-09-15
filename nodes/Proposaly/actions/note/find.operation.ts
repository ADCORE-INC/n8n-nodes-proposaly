import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Fields } from '../../constants';
import { proposalyRequest } from '../../transport';
import { Note } from '../../types';
import { normalizeNote } from '../../notes';

export async function findNoteOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const noteId = context.getNodeParameter(Fields.NoteId, itemIndex) as string;

	const responseData = await proposalyRequest<Note>(context, {
		method: 'GET',
		path: `/notes/${noteId}`,
	});

	const note = normalizeNote(responseData);
	if (note && note.id) {
		return { json: note as IDataObject, pairedItem: { item: itemIndex } };
	}

	return { json: { message: 'Note not found' }, pairedItem: { item: itemIndex } };
}
