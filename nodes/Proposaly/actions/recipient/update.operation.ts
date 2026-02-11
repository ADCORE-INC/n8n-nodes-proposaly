import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';

export async function updateRecipientOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const workspaceId = context.getNodeParameter(Fields.WorkspaceId, itemIndex) as string;
	const recipientId = context.getNodeParameter(Fields.RecipientId, itemIndex) as string;
	const firstName = context.getNodeParameter(Fields.FirstNameOptional, itemIndex, '') as string;
	const lastName = context.getNodeParameter(Fields.LastNameOptional, itemIndex, '') as string;
	const email = context.getNodeParameter(Fields.EmailOptional, itemIndex, '') as string;
	const phoneNumber = context.getNodeParameter(Fields.PhoneNumberOptional, itemIndex, '') as string;
	const accessLevel = context.getNodeParameter(Fields.AccessLevelOptional, itemIndex, '') as string;
	const status = context.getNodeParameter(Fields.StatusOptional, itemIndex, '') as string;

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

	return { json: responseData, pairedItem: { item: itemIndex } };
}
