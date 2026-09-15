import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Fields } from '../../constants';
import { proposalyRequest } from '../../transport';

export async function deleteNoteOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const parentId = context.getNodeParameter(Fields.ParentId, itemIndex) as string;
	const noteId = context.getNodeParameter(Fields.NoteId, itemIndex) as string;

	await proposalyRequest(context, {
		method: 'DELETE',
		path: `/notes/${noteId}`,
		qs: { document_id: parentId },
	});

	return {
		json: {
			id: noteId,
			document_id: parentId,
			status: 'deleted',
		} as IDataObject,
		pairedItem: { item: itemIndex },
	};
}
