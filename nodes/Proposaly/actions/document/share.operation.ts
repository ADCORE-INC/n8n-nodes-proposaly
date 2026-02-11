import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';

type Response = {
	message: string;
};

export async function shareDocumentOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const documentId = context.getNodeParameter(Fields.DocumentId, itemIndex) as string;
	const recipients = context.getNodeParameter(Fields.Recipients, itemIndex) as string[];

	const body: IDataObject = {
		document_id: documentId,
		recipient_ids: recipients,
	};

	const responseData: Response = await proposalyRequest(context, {
		method: 'POST',
		path: '/documents/share',
		body,
	});

	return { json: responseData, pairedItem: { item: itemIndex } };
}
