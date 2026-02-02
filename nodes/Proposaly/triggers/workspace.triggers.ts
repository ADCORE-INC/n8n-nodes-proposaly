import { INodeExecutionData, IPollFunctions, IDataObject } from 'n8n-workflow';
import { PollData, Workspace } from '../types';
import { isRetryableProposalyError, proposalyRequest } from '../transport';

export async function pollWorkspaceTrigger(
	context: IPollFunctions,
	event: string,
): Promise<INodeExecutionData[] | null> {
	try {
		if (event === 'newWorkspace') {
			const result = await pollNewWorkspace(context);
			return result;
		}

		return null;
	} catch (error) {
		if (isRetryableProposalyError(error)) {
			return null;
		}
		throw error;
	}
}

async function pollNewWorkspace(context: IPollFunctions): Promise<INodeExecutionData[] | null> {
	const pollData = context.getWorkflowStaticData('node') as PollData;

	const lastNewWorkspaceId = pollData.lastNewWorkspaceId;

	const workspaces: Workspace[] = await proposalyRequest(context, {
		method: 'GET',
		path: '/workspaces',
	});

	if (workspaces.length === 0) {
		return null;
	}

	let newWorkspaces: Workspace[] = [];

	if (!lastNewWorkspaceId) {
		// First time polling, return all workspaces
		newWorkspaces = workspaces;
	} else {
		// Find the index of the last workspace we've seen
		const lastWorkspaceIndex = workspaces.findIndex(
			(workspace) => workspace.workspace_id === lastNewWorkspaceId,
		);

		if (lastWorkspaceIndex !== -1) {
			// Found the last workspace, return only newer workspaces
			newWorkspaces = workspaces.slice(0, lastWorkspaceIndex);
		} else {
			// Last workspace not found, return all workspaces (something changed)
			newWorkspaces = workspaces;
		}
	}

	if (newWorkspaces.length === 0) {
		return null;
	}

	// Update the stored last workspace_id to the most recent workspace (first in array)
	const newLastWorkspaceId = newWorkspaces[0].workspace_id;
	if (newLastWorkspaceId) {
		pollData.lastNewWorkspaceId = newLastWorkspaceId;
	}

	return newWorkspaces.map((workspace) => ({ json: workspace as unknown as IDataObject }));
}
