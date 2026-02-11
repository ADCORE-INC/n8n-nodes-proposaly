import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';

type Response = {
	document_id: string;
};

export async function duplicateDocumentOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const documentId = context.getNodeParameter(Fields.DocumentId, itemIndex) as string;
	const newTitle = context.getNodeParameter(Fields.DocumentTitle, itemIndex) as string;
	const copyRecipients = context.getNodeParameter(Fields.CopyRecipients, itemIndex) as boolean;
	const copyPriceQuote = context.getNodeParameter(Fields.CopyPriceQuote, itemIndex) as boolean;
	const copyAddons = context.getNodeParameter(Fields.CopyAddons, itemIndex) as boolean;
	const copyAttachments = context.getNodeParameter(Fields.CopyAttachments, itemIndex) as boolean;

	const body: IDataObject = {
		document_id: documentId,
		copy_recipients: copyRecipients,
		copy_price_quote: copyPriceQuote,
		copy_addons: copyAddons,
		copy_attachments: copyAttachments,
	};

	if (newTitle) {
		body.new_title = newTitle;
	}

	const responseData: Response = await proposalyRequest(context, {
		method: 'POST',
		path: '/documents/duplicate',
		body,
	});

	return { json: responseData, pairedItem: { item: itemIndex } };
}
