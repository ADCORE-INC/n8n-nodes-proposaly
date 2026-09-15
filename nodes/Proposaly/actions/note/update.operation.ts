import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { compact } from '../../utils';
import { Fields } from '../../constants';
import { proposalyRequest } from '../../transport';
import { Note } from '../../types';
import { normalizeNote } from '../../notes';

export async function updateNoteOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const parentId = context.getNodeParameter(Fields.ParentId, itemIndex) as string;
	const noteId = context.getNodeParameter(Fields.NoteId, itemIndex) as string;
	const title = context.getNodeParameter(Fields.NoteTitle, itemIndex, '') as string;
	const body = context.getNodeParameter(Fields.NoteBody, itemIndex, '') as string;

	const responseData = await proposalyRequest<Note>(context, {
		method: 'PUT',
		path: `/notes/${noteId}`,
		qs: { document_id: parentId },
		body: compact({ title, body }) as IDataObject,
	});

	return {
		json: normalizeNote(responseData) as IDataObject,
		pairedItem: { item: itemIndex },
	};
}
