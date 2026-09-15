import { INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';
import { leadItemWithNotes } from '../../notes';

export async function archiveLeadOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const leadId = context.getNodeParameter(Fields.LeadId, itemIndex) as string;

	const responseData = await proposalyRequest(context, {
		method: 'PUT',
		path: `/leads/${leadId}`,
		body: {
			status: 'Archived',
		},
	});

	return leadItemWithNotes(context, responseData, itemIndex);
}
