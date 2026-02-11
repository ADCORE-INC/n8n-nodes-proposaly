import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';

export async function updateRecipientNotificationOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const workspaceId = context.getNodeParameter(Fields.WorkspaceId, itemIndex) as string;
	const recipientId = context.getNodeParameter(Fields.RecipientId, itemIndex) as string;
	const agreementSigned = context.getNodeParameter(Fields.AgreementSigned, itemIndex, '') as string;
	const addonAdded = context.getNodeParameter(Fields.AddonAdded, itemIndex, '') as string;
	const paymentMade = context.getNodeParameter(Fields.PaymentMade, itemIndex, '') as string;
	const messageReceived = context.getNodeParameter(Fields.MessageReceived, itemIndex, '') as string;
	const mediaAdded = context.getNodeParameter(Fields.MediaAdded, itemIndex, '') as string;
	const documentStatusChanged = context.getNodeParameter(
		Fields.DocumentStatusChanged,
		itemIndex,
		'',
	) as string;

	const body: IDataObject = {
		workspace_id: workspaceId,
		recipient_id: recipientId,
	};

	// Only include fields that are not empty
	if (agreementSigned) {
		body.agreement_signed = agreementSigned;
	}
	if (addonAdded) {
		body.addon_added = addonAdded;
	}
	if (paymentMade) {
		body.payment_made = paymentMade;
	}
	if (messageReceived) {
		body.message_received = messageReceived;
	}
	if (mediaAdded) {
		body.media_added = mediaAdded;
	}
	if (documentStatusChanged) {
		body.document_status_changed = documentStatusChanged;
	}

	const responseData = await proposalyRequest(context, {
		method: 'PUT',
		path: `/recipients/${recipientId}/notifications`,
		body,
	});

	return { json: responseData, pairedItem: { item: itemIndex } };
}
