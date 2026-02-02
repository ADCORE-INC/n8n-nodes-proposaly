import { INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';

export async function getRecipientNotificationSettingsOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const recipientId = context.getNodeParameter('recipientId', itemIndex) as string;

	const responseData = await proposalyRequest(context, {
		method: 'GET',
		path: `/recipients/${recipientId}/notifications`,
	});

	return { json: responseData };
}
