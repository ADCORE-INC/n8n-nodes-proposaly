import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';

export async function createDocumentShareLinkOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
	documentId: string,
	expiration: string,
): Promise<INodeExecutionData> {
	const body: IDataObject = {
		document_id: documentId,
		expiration,
	};

	const responseData = await proposalyRequest(context, {
		method: 'POST',
		path: '/documents/share-link',
		body,
	});

	return { json: responseData };
}
