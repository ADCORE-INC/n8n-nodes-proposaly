import { INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { Lead, PaginatedApiResponse } from '../../types';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';
import { leadExecutionData } from '../../shape';

export async function findLeadByIdOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const leadId = context.getNodeParameter(Fields.LeadIdString, itemIndex) as string;

	const responseData: PaginatedApiResponse<Lead> = await proposalyRequest(context, {
		method: 'GET',
		path: '/leads',
		qs: {
			lead_id: leadId,
		},
	});

	if (responseData && responseData.entities.length > 0) {
		return leadExecutionData(responseData.entities[0], itemIndex);
	}

	return leadExecutionData({}, itemIndex);
}
