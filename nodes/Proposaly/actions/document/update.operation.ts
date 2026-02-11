import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { StageID } from '../../types';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';

type Response = {
	message: string;
};

export async function updateDocumentOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const documentId = context.getNodeParameter(Fields.DocumentId, itemIndex) as string;
	const documentTitleOptional = context.getNodeParameter(
		Fields.DocumentTitleOptional,
		itemIndex,
	) as string;
	const newStageOptional = context.getNodeParameter(Fields.NewStageOptional, itemIndex) as string;
	const newOwnerEmail = context.getNodeParameter(Fields.NewOwnerEmail, itemIndex) as string;
	const reasonArchived =
		newStageOptional === StageID.ARCHIVED
			? (context.getNodeParameter(Fields.ReasonArchived, itemIndex) as string)
			: '';

	const body: IDataObject = {
		document_id: documentId,
	};

	if (documentTitleOptional) {
		body.title = documentTitleOptional;
	}

	if (newStageOptional) {
		body.stage_id = newStageOptional;
	}

	if (newOwnerEmail) {
		body.owner_email = newOwnerEmail;
	}

	if (reasonArchived) {
		body.reason = reasonArchived;
	}

	const responseData: Response = await proposalyRequest(context, {
		method: 'PUT',
		path: `/documents/${documentId}`,
		body,
	});

	return { json: responseData, pairedItem: { item: itemIndex } };
}
