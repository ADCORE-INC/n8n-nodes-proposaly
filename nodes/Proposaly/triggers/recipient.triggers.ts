import { INodeExecutionData, IPollFunctions, IDataObject } from 'n8n-workflow';
import { PollData, Recipient } from '../types';
import { isRetryableProposalyError, proposalyRequest } from '../transport';

export async function pollRecipientTrigger(
	context: IPollFunctions,
	event: string,
): Promise<INodeExecutionData[] | null> {
	try {
		switch (event) {
			case 'newRecipient': {
				const result = await pollNewRecipient(context);
				return result;
			}

			default:
				return null;
		}
	} catch (error) {
		if (isRetryableProposalyError(error)) {
			return null;
		}
		throw error;
	}
}

async function pollNewRecipient(context: IPollFunctions): Promise<INodeExecutionData[] | null> {
	const pollData = context.getWorkflowStaticData('node') as PollData;

	const documentId = context.getNodeParameter('documentId') as string;
	const lastNewRecipientId = pollData.lastNewRecipientId;

	const recipients: Recipient[] = await proposalyRequest(context, {
		method: 'GET',
		path: '/recipients',
		qs: {
			document_id: documentId,
		},
	});

	if (recipients.length === 0) {
		return null;
	}

	// Note: Recipients are returned in the order they were added to the document
	// So the first recipient is the oldest and the last recipient is the newest in the response array

	const newRecipients = [];
	let foundLastProcessed = false;

	for (const recipient of recipients) {
		if (recipient.recipient_id === lastNewRecipientId) {
			foundLastProcessed = true;
			continue;
		}

		if (foundLastProcessed) {
			newRecipients.push(recipient);
		} else if (!lastNewRecipientId) {
			newRecipients.push(recipient);
		}
	}

	if (newRecipients.length === 0) {
		return null;
	}

	// Update the last processed recipient ID to the newest one we processed
	pollData.lastNewRecipientId = newRecipients[newRecipients.length - 1].recipient_id;

	return newRecipients.map((recipient) => ({ json: recipient as unknown as IDataObject }));
}
