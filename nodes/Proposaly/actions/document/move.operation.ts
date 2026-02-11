import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { StageID } from '../../types';
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

export async function moveDocumentStageOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const documentId = context.getNodeParameter(Fields.DocumentId, itemIndex) as string;
	const newStage = context.getNodeParameter(Fields.NewStage, itemIndex) as string;
	const reasonArchived =
		newStage === StageID.ARCHIVED
			? (context.getNodeParameter(Fields.ReasonArchived, itemIndex) as string)
			: '';

	const body: IDataObject = {
		stage_id: newStage,
	};

	if (newStage === StageID.ARCHIVED) {
		body.reason = reasonArchived;
	}

	const responseData: Response = await proposalyRequest(context, {
		method: 'PUT',
		path: `/documents/${documentId}`,
		body,
	});

	return { json: responseData, pairedItem: { item: itemIndex } };
}
