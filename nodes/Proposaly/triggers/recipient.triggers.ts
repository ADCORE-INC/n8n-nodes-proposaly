import { INodeExecutionData, IPollFunctions, IDataObject } from 'n8n-workflow';
import { PollData, Recipient } from '../types';
import { isRetryableProposalyError, proposalyRequest } from '../transport';
import { diffPollRecords, resolvePollLimit } from '../shape';

export async function pollRecipientTrigger(
	context: IPollFunctions,
	event: string,
): Promise<INodeExecutionData[] | null> {
	try {
		if (event === 'newRecipient') {
			return await pollNewRecipient(context);
		}

		return null;
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
	const limit = resolvePollLimit(context.getNodeParameter('limit', 0));

	const recipients: Recipient[] = await proposalyRequest(context, {
		method: 'GET',
		path: '/recipients',
		qs: {
			document_id: documentId,
		},
	});

	const { emit, nextId } = diffPollRecords({
		records: Array.isArray(recipients) ? recipients : [],
		lastId: pollData.lastNewRecipientId,
		getId: (recipient) => recipient.recipient_id,
		newestFirst: false,
		mode: context.getMode(),
		limit,
	});

	if (nextId) {
		pollData.lastNewRecipientId = nextId;
	}

	if (emit.length === 0) {
		return null;
	}

	return emit.map((recipient) => ({ json: recipient as unknown as IDataObject }));
}
