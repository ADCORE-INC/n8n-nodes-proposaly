import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Fields } from '../../constants';
import { toItems } from '../../shape';
import { proposalyRequest } from '../../transport';
import { Workspace } from '../../types';

export async function getManyWorkspacesOperation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const returnAll = context.getNodeParameter(Fields.ReturnAll, itemIndex, false) as boolean;
	const limit = returnAll
		? undefined
		: (context.getNodeParameter(Fields.Limit, itemIndex, 50) as number);

	const workspaces: Workspace[] = await proposalyRequest(context, {
		method: 'GET',
		path: '/workspaces',
	});

	const items = Array.isArray(workspaces) ? workspaces : [];
	return toItems(limit === undefined ? items : items.slice(0, limit), itemIndex);
}
