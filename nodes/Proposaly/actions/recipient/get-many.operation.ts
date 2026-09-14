import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Fields } from '../../constants';
import { toItems } from '../../shape';
import { proposalyRequest } from '../../transport';
import { Recipient } from '../../types';

export async function getManyRecipientsOperation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const documentId = context.getNodeParameter(Fields.DocumentId, itemIndex) as string;
	const includeBlocked = context.getNodeParameter(
		Fields.IncludeBlocked,
		itemIndex,
		false,
	) as boolean;
	const returnAll = context.getNodeParameter(Fields.ReturnAll, itemIndex, false) as boolean;
	const limit = returnAll
		? undefined
		: (context.getNodeParameter(Fields.Limit, itemIndex, 50) as number);

	const recipients: Recipient[] = await proposalyRequest(context, {
		method: 'GET',
		path: '/recipients',
		qs: {
			document_id: documentId,
			include_blocked: includeBlocked,
		},
	});

	const items = Array.isArray(recipients) ? recipients : [];
	return toItems(limit === undefined ? items : items.slice(0, limit), itemIndex);
}
