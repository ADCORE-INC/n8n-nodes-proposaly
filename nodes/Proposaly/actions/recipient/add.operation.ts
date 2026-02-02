import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';

export async function addRecipientOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const documentId = context.getNodeParameter(Fields.DocumentId, itemIndex) as string;
	const firstName = context.getNodeParameter(Fields.FirstName, itemIndex) as string;
	const lastName = context.getNodeParameter(Fields.LastName, itemIndex) as string;
	const email = context.getNodeParameter(Fields.Email, itemIndex) as string;
	const phoneNumber = context.getNodeParameter(Fields.PhoneNumber, itemIndex, '') as string;
	const accessLevel = context.getNodeParameter(Fields.AccessLevel, itemIndex) as string;

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
