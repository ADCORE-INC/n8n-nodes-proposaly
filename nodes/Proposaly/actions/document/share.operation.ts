import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';

type Response = {
	message: string;
};

export async function shareDocumentOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const documentId = context.getNodeParameter('documentId', itemIndex) as string;
	const recipients = context.getNodeParameter('recipients', itemIndex) as string[];

	const body: IDataObject = {
		document_id: documentId,
		recipient_ids: recipients,
	};

	const responseData: Response = await proposalyRequest(context, {
		method: 'POST',
		path: '/documents/share',
		body,
	});

	return { json: responseData };
}
