import { INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';
import { leadItemWithNotes } from '../../notes';

export async function reactivateLeadOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const leadId = context.getNodeParameter(Fields.ArchivedLeadId, itemIndex) as string;

	const responseData = await proposalyRequest(context, {
		method: 'PUT',
		path: `/leads/${leadId}`,
		body: {
			status: 'Active',
		},
	});

	return leadItemWithNotes(context, responseData, itemIndex);
}
