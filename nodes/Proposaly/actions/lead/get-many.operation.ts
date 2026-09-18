import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { compact } from '../../utils';
import { Fields } from '../../constants';
import { flattenLead, toItems } from '../../shape';
import { attachNotesToRecords, includeNotesForItem, includeNotesQuery } from '../../notes';
import { proposalyRequestLimited } from '../../transport';
import { Lead } from '../../types';

export async function getManyLeadsOperation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const workspaceId = context.getNodeParameter(Fields.WorkspaceId, itemIndex) as string;
	const returnAll = context.getNodeParameter(Fields.ReturnAll, itemIndex, false) as boolean;
	const status = context.getNodeParameter(Fields.LeadStatus, itemIndex, '') as string;
	const limit = returnAll
		? undefined
		: (context.getNodeParameter(Fields.Limit, itemIndex, 50) as number);

	const leads = await proposalyRequestLimited<Lead>(
		context,
		'/leads',
		compact({
			workspace_id: workspaceId,
			lead_status: status || undefined,
			...includeNotesQuery(includeNotesForItem(context, itemIndex)),
		}) as IDataObject,
		limit,
	);

	const flattened = leads.map(flattenLead);
	const withNotes = await attachNotesToRecords(
		context,
		flattened,
		(lead) => lead.lead_id || lead.id,
		includeNotesForItem(context, itemIndex),
	);
	return toItems(withNotes, itemIndex);
}
