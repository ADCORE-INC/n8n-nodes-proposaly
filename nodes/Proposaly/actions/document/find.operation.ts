import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Document, PaginatedApiResponse } from '../../types';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';
import { documentItemWithNotes, includeNotesForItem, includeNotesQuery } from '../../notes';

export async function findDocumentOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const documentId = context.getNodeParameter(Fields.DocumentIdString, itemIndex) as string;

	const responseData: PaginatedApiResponse<Document> = await proposalyRequest(context, {
		method: 'GET',
		path: '/documents',
		qs: {
			document_id: documentId,
			...includeNotesQuery(includeNotesForItem(context, itemIndex)),
		},
	});

	if (responseData && responseData.entities.length > 0) {
		return documentItemWithNotes(context, responseData.entities[0], itemIndex);
	}

	return { json: { message: 'Document not found' }, pairedItem: { item: itemIndex } };
}
