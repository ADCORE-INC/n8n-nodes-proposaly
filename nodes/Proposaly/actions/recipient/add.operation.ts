import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';

export async function addRecipientOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const documentId = context.getNodeParameter('documentId', itemIndex) as string;
	const firstName = context.getNodeParameter('firstName', itemIndex) as string;
	const lastName = context.getNodeParameter('lastName', itemIndex) as string;
	const email = context.getNodeParameter('email', itemIndex) as string;
	const phoneNumber = context.getNodeParameter('phoneNumber', itemIndex, '') as string;
	const accessLevel = context.getNodeParameter('accessLevel', itemIndex) as string;

	const body: IDataObject = {
		document_id: documentId,
		first_name: firstName,
		last_name: lastName,
		email,
		access_level: accessLevel,
	};

	if (phoneNumber) {
		body.phone_number = phoneNumber;
	}

	const responseData = await proposalyRequest(context, {
		method: 'POST',
		path: '/recipients',
		body,
	});

	return { json: responseData };
}
