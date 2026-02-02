import { INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';

export async function getRecipientNotificationSettingsOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const recipientId = context.getNodeParameter(Fields.RecipientId, itemIndex) as string;

	const responseData = await proposalyRequest(context, {
		method: 'GET',
		path: `/recipients/${recipientId}/notifications`,
	});

	return { json: responseData };
}
