import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { compact } from '../../utils';
import { proposalyRequest } from '../../transport';
import { LeadType } from '../../types';
import { Fields } from '../../constants';

export async function addLeadOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const workspaceId = context.getNodeParameter(Fields.WorkspaceId, itemIndex) as string;
	const clientName = context.getNodeParameter(Fields.ClientName, itemIndex) as string;
	const leadType = context.getNodeParameter(Fields.LeadType, itemIndex) as LeadType;
	const website =
		leadType === 'business'
			? (context.getNodeParameter(Fields.Website, itemIndex) as string)
			: undefined;
	const country = context.getNodeParameter(Fields.Country, itemIndex) as string;
	const leadSource = context.getNodeParameter(Fields.LeadSource, itemIndex) as string;
	const leadSourceOther =
		leadSource === 'Other'
			? (context.getNodeParameter(Fields.LeadSourceOther, itemIndex) as string)
			: '';
	const ownerEmail = context.getNodeParameter(Fields.OwnerEmail, itemIndex) as string;
	const additionalFields = context.getNodeParameter(
		Fields.AdditionalFields,
		itemIndex,
	) as IDataObject;

	const additional = {
		street_address: additionalFields?.streetAddress as string | undefined,
		apartment: additionalFields?.apartment as string | undefined,
		state: additionalFields?.state as string | undefined,
		city: additionalFields?.city as string | undefined,
		zip_code: additionalFields?.zipCode as string | undefined,
		comment: additionalFields?.comment as string | undefined,
	};

	const data: IDataObject = compact({
		workspace_id: workspaceId,
		lead_type: leadType,
		client_name: clientName,
		country,
		lead_source: leadSource,
		lead_source_other: leadSourceOther,
		owner_email: ownerEmail,
		website,
		...additional,
	});

	const responseData = await proposalyRequest(context, {
		method: 'POST',
		path: '/leads',
		body: data,
	});

	return { json: responseData, pairedItem: { item: itemIndex } };
}
