import { INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { Lead, PaginatedApiResponse } from '../../types';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';

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

	// Return the first element if there are multiple entries in the entities array
	if (responseData && responseData.entities.length > 0) {
		return { json: responseData.entities[0] as unknown as Lead };
	}

	// Return empty result if no entities found
	return { json: {} };
}
