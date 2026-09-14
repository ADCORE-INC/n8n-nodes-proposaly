import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { Fields } from '../../constants';
import { toItems } from '../../shape';
import { proposalyRequest } from '../../transport';
import { Stage, Workspace } from '../../types';

export async function getWorkspaceStagesOperation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const workspaceId = context.getNodeParameter(Fields.WorkspaceId, itemIndex) as string;

	if (!workspaceId) {
		throw new NodeOperationError(context.getNode(), 'Workspace ID is required to list stages.');
	}

	const response: Workspace[] = await proposalyRequest(context, {
		method: 'GET',
		path: '/workspaces',
		qs: {
			workspace_id: workspaceId,
		},
	});

	const stages: Stage[] = Array.isArray(response) && response[0]?.stages ? response[0].stages : [];
	return toItems(stages, itemIndex);
}
