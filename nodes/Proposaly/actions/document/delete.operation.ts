import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';

export async function deleteDocumentOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const documentId = context.getNodeParameter(Fields.DocumentId, itemIndex) as string;

	await proposalyRequest(context, {
		method: 'DELETE',
		path: `/documents/${documentId}`,
	});

	return { json: { deleted: true }, pairedItem: { item: itemIndex } };
}
