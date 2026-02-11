import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';

export async function addWorkspaceOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const workspaceName = context.getNodeParameter(Fields.WorkspaceName, itemIndex) as string;
	const workspaceType = context.getNodeParameter(Fields.WorkspaceType, itemIndex) as string;

	const data: IDataObject = {
		workspace_name: workspaceName,
		workspace_type: workspaceType,
	};

	const responseData = await proposalyRequest(context, {
		method: 'POST',
		path: '/workspace',
		body: data,
	});

	return { json: responseData, pairedItem: { item: itemIndex } };
}
