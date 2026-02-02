import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Document, PaginatedApiResponse } from '../../types';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';

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
		},
	});

	if (responseData && responseData.entities.length > 0) {
		return { json: responseData.entities[0] as unknown as IDataObject };
	}

	return { json: { message: 'Document not found' } };
}
