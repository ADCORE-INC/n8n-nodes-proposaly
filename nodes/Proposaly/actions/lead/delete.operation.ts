import { INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';

export async function deleteLeadOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const leadId = context.getNodeParameter('leadId', itemIndex) as string;

	await proposalyRequest(context, {
		method: 'DELETE',
		path: `/leads/${leadId}`,
	});

	return { json: { deleted: true } };
}
