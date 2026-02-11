import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';

type Response = {
	document_id: string;
	workspace_id: string;
	title: string;
	owner_email: string;
	stage_id: string;
	date_updated: number;
};

export async function transferDocumentOwnershipOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const documentId = context.getNodeParameter(Fields.DocumentId, itemIndex) as string;
	const newOwnerEmail = context.getNodeParameter(Fields.NewOwnerEmail, itemIndex) as string;

	const body: IDataObject = {
		owner_email: newOwnerEmail,
	};

	const responseData: Response = await proposalyRequest(context, {
		method: 'PUT',
		path: `/documents/${documentId}`,
		body,
	});

	return { json: responseData, pairedItem: { item: itemIndex } };
}
