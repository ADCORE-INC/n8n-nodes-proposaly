import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { compact } from '../../utils';
import { Fields } from '../../constants';
import { proposalyRequest } from '../../transport';
import { Note } from '../../types';
import { normalizeNote } from '../../notes';

export async function createNoteOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const parentId = context.getNodeParameter(Fields.ParentId, itemIndex) as string;
	const title = context.getNodeParameter(Fields.NoteTitle, itemIndex, '') as string;
	const body = context.getNodeParameter(Fields.NoteBody, itemIndex, '') as string;
	const source = context.getNodeParameter(Fields.NoteSource, itemIndex, 'note') as string;
	const authorEmail = context.getNodeParameter(Fields.AuthorEmail, itemIndex, '') as string;

	const responseData = await proposalyRequest<Note>(context, {
		method: 'POST',
		path: '/notes',
		body: compact({
			document_id: parentId,
			title,
			body,
			source: source || 'note',
			author_email: authorEmail,
		}) as IDataObject,
	});

	return {
		json: normalizeNote(responseData) as IDataObject,
		pairedItem: { item: itemIndex },
	};
}
