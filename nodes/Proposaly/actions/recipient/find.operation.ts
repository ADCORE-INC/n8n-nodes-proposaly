import { IDataObject, INodeExecutionData, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

import { Recipient } from '../../types';
import { proposalyRequest } from '../../transport';

export async function findRecipientOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const recipientId = context.getNodeParameter('recipientIdString', itemIndex) as string;

	if (!recipientId) {
		throw new NodeOperationError(
			context.getNode(),
			'The parameter "Recipient ID" has to be set to find recipients!',
		);
	}

	const responseData: Recipient[] = await proposalyRequest(context, {
		method: 'GET',
		path: '/recipients',
		qs: {
			recipient_id: recipientId,
		},
	});

	// Return the first element if there are multiple entries in the entities array
	if (responseData && responseData.length > 0) {
		return { json: responseData[0] as unknown as IDataObject };
	}

	// Return empty result if no entities found
	return { json: {} };
}
