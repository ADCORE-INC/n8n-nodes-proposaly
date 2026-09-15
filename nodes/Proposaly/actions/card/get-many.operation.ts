import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Fields } from '../../constants';
import { cardsWithNotes, includeNotesForItem } from '../../notes';
import { toItems } from '../../shape';
import { proposalyRequestLimited } from '../../transport';
import { Document } from '../../types';

export async function getManyCardsOperation(
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
		{ workspace_id: workspaceId },
		limit,
	);

	return toItems(await cardsWithNotes(context, documents, includeNotesForItem(context, itemIndex)), itemIndex);
}
