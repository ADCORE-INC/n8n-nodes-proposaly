import { INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';

export async function archiveLeadOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const leadId = context.getNodeParameter('leadId', itemIndex) as string;

	const responseData = await proposalyRequest(context, {
		method: 'PUT',
		path: `/leads/${leadId}`,
		body: {
			status: 'Archived',
		},
	});

	return { json: responseData };
}
