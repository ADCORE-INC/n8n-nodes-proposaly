import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { compact } from '../../utils';
import { proposalyRequest } from '../../transport';

export async function updateLeadOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const leadId = context.getNodeParameter('leadId', itemIndex) as string;
	const leadTypeOptional = context.getNodeParameter('leadTypeOptional', itemIndex) as string;
	const clientNameOptional = context.getNodeParameter('clientNameOptional', itemIndex) as string;
	const countryOptional = context.getNodeParameter('countryOptional', itemIndex) as string;
	const leadSourceOptional = context.getNodeParameter('leadSourceOptional', itemIndex) as string;
	const leadSourceOther =
		leadSourceOptional === 'Other'
			? (context.getNodeParameter('leadSourceOther', itemIndex) as string)
			: '';
	const ownerEmailOptional = context.getNodeParameter('ownerEmailOptional', itemIndex) as string;
	const additionalFields = context.getNodeParameter('additionalFields', itemIndex) as IDataObject;

	const data: IDataObject = compact({
		lead_type: leadTypeOptional,
		client_name: clientNameOptional,
		country: countryOptional,
		lead_source: leadSourceOptional,
		lead_source_other: leadSourceOptional === 'Other' ? leadSourceOther : undefined,
		owner_email: ownerEmailOptional,
		comment: additionalFields.comment,
		apartment: additionalFields.apartment,
		city: additionalFields.city,
		state: additionalFields.state,
		street_address: additionalFields.streetAddress,
		website: additionalFields.website,
		zip_code: additionalFields.zipCode,
	});

	const responseData = await proposalyRequest(context, {
		method: 'PUT',
		path: `/leads/${leadId}`,
		body: data,
	});

	return { json: responseData };
}
