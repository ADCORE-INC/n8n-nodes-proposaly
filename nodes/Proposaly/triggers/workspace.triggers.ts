import { INodeExecutionData, IPollFunctions, IDataObject } from 'n8n-workflow';
import { PollData, Workspace } from '../types';
import { isRetryableProposalyError, proposalyRequest, rethrowAsNodeError } from '../transport';
import { diffPollRecords, resolvePollLimit } from '../shape';

export async function pollWorkspaceTrigger(
	context: IPollFunctions,
	event: string,
): Promise<INodeExecutionData[] | null> {
	try {
		if (event === 'newWorkspace') {
			return await pollNewWorkspace(context);
		}

		return null;
	} catch (error) {
		if (isRetryableProposalyError(error)) {
			return null;
		}
		rethrowAsNodeError(context, error);
	}
}

async function pollNewWorkspace(context: IPollFunctions): Promise<INodeExecutionData[] | null> {
	const pollData = context.getWorkflowStaticData('node') as PollData;
	const limit = resolvePollLimit(context.getNodeParameter('limit', 0));

	const workspaces: Workspace[] = await proposalyRequest(context, {
		method: 'GET',
		path: '/workspaces',
	});

	const { emit, nextId } = diffPollRecords({
		records: Array.isArray(workspaces) ? workspaces : [],
		lastId: pollData.lastNewWorkspaceId,
		getId: (workspace) => workspace.workspace_id,
		newestFirst: true,
		mode: context.getMode(),
		limit,
	});

	if (nextId) {
		pollData.lastNewWorkspaceId = nextId;
	}

	if (emit.length === 0) {
		return null;
	}

	return emit.map((workspace) => ({ json: workspace as unknown as IDataObject }));
}
