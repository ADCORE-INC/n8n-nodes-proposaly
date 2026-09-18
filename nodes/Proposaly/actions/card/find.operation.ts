import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Fields } from '../../constants';
import { cardItemWithNotes, includeNotesForItem, includeNotesQuery } from '../../notes';
import { proposalyRequest } from '../../transport';
import { Document, PaginatedApiResponse } from '../../types';

export async function findCardOperation(
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
		return cardItemWithNotes(context, responseData.entities[0], itemIndex);
	}

	return { json: { message: 'Card not found' } as IDataObject, pairedItem: { item: itemIndex } };
}
