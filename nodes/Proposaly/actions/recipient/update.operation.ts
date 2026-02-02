import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';

export async function updateRecipientOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const workspaceId = context.getNodeParameter('workspaceId', itemIndex) as string;
	const recipientId = context.getNodeParameter('recipientId', itemIndex) as string;
	const firstName = context.getNodeParameter('firstNameOptional', itemIndex, '') as string;
	const lastName = context.getNodeParameter('lastNameOptional', itemIndex, '') as string;
	const email = context.getNodeParameter('emailOptional', itemIndex, '') as string;
	const phoneNumber = context.getNodeParameter('phoneNumberOptional', itemIndex, '') as string;
	const accessLevel = context.getNodeParameter('accessLevelOptional', itemIndex, '') as string;
	const status = context.getNodeParameter('statusOptional', itemIndex, '') as string;

	const body: IDataObject = {
		workspace_id: workspaceId,
		recipient_id: recipientId,
	};

	// Only include fields that are not empty
	if (firstName) {
		body.first_name = firstName;
	}
	if (lastName) {
		body.last_name = lastName;
	}
	if (email) {
		body.email = email;
	}
	if (phoneNumber) {
		body.phone_number = phoneNumber;
	}
	if (accessLevel) {
		body.access_level = accessLevel;
	}
	if (status) {
		body.status = status;
	}

	const responseData = await proposalyRequest(context, {
		method: 'PUT',
		path: `/recipients/${recipientId}`,
		body,
	});

	return { json: responseData };
}
