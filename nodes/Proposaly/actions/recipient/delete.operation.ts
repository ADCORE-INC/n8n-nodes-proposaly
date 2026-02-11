import { INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';

export async function deleteRecipientOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const recipientId = context.getNodeParameter(Fields.RecipientId, itemIndex) as string;

	await proposalyRequest(context, {
		method: 'DELETE',
		path: `/recipients/${recipientId}`,
	});

	return { json: { deleted: true }, pairedItem: { item: itemIndex } };
}
