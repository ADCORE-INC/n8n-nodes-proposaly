import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';

import { Workspace } from '../../types';
import { proposalyRequest } from '../../transport';

export async function findWorkspaceOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const workspaceId = context.getNodeParameter('workspaceIdString', itemIndex) as string;

	const responseData: Workspace[] = await proposalyRequest(context, {
		method: 'GET',
		path: '/workspaces',
		qs: {
			workspace_id: workspaceId,
		},
	});

	if (responseData.length > 0) {
		return { json: responseData[0] as unknown as IDataObject };
	}

	return { json: {} };
}
