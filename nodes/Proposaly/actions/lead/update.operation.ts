import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { compact } from '../../utils';
import { proposalyRequest } from '../../transport';
import { Fields } from '../../constants';

export async function updateLeadOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const leadId = context.getNodeParameter(Fields.LeadId, itemIndex) as string;
	const leadTypeOptional = context.getNodeParameter(Fields.LeadTypeOptional, itemIndex) as string;
	const clientNameOptional = context.getNodeParameter(
		Fields.ClientNameOptional,
		itemIndex,
	) as string;
	const countryOptional = context.getNodeParameter(Fields.CountryOptional, itemIndex) as string;
	const leadSourceOptional = context.getNodeParameter(
		Fields.LeadSourceOptional,
		itemIndex,
	) as string;
	const leadSourceOther =
		leadSourceOptional === 'Other'
			? (context.getNodeParameter(Fields.LeadSourceOther, itemIndex) as string)
			: '';
	const ownerEmailOptional = context.getNodeParameter(
		Fields.OwnerEmailOptional,
		itemIndex,
	) as string;
	const additionalFields = context.getNodeParameter(
		Fields.AdditionalFields,
		itemIndex,
	) as IDataObject;

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

	return { json: responseData, pairedItem: { item: itemIndex } };
}
