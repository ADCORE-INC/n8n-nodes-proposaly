import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Fields } from '../../constants';
import { toItems } from '../../shape';
import { attachNotesToRecords, includeNotesForItem, includeNotesQuery } from '../../notes';
import { proposalyRequestLimited } from '../../transport';
import { Document } from '../../types';

export async function getManyDocumentsOperation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const workspaceId = context.getNodeParameter(Fields.WorkspaceId, itemIndex) as string;
	const returnAll = context.getNodeParameter(Fields.ReturnAll, itemIndex, false) as boolean;
	const limit = returnAll
		? undefined
		: (context.getNodeParameter(Fields.Limit, itemIndex, 50) as number);

	const documents = await proposalyRequestLimited<Document>(
		context,
		'/documents',
		{
			workspace_id: workspaceId,
			...includeNotesQuery(includeNotesForItem(context, itemIndex)),
		},
		limit,
	);

	const withNotes = await attachNotesToRecords(
		context,
		documents,
		(document) => document.document_id,
		includeNotesForItem(context, itemIndex),
	);
	return toItems(withNotes, itemIndex);
}
