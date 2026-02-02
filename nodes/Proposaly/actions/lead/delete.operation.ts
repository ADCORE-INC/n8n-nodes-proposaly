import { INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';

export async function deleteLeadOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const leadId = context.getNodeParameter(Fields.LeadId, itemIndex) as string;

	await proposalyRequest(context, {
		method: 'DELETE',
		path: `/leads/${leadId}`,
	});

	return { json: { deleted: true } };
}
