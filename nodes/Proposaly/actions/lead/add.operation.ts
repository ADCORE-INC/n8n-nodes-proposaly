import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { compact } from '../../utils';
import { proposalyRequest } from '../../transport';
import { LeadType } from '../../types';

export async function addLeadOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<INodeExecutionData> {
	const workspaceId = context.getNodeParameter('workspaceId', itemIndex) as string;
	const clientName = context.getNodeParameter('clientName', itemIndex) as string;
	const leadType = context.getNodeParameter('leadType', itemIndex) as LeadType;
	const website =
		leadType === 'business' ? (context.getNodeParameter('website', itemIndex) as string) : undefined;
	const country = context.getNodeParameter('country', itemIndex) as string;
	const leadSource = context.getNodeParameter('leadSource', itemIndex) as string;
	const leadSourceOther =
		leadSource === 'Other'
			? (context.getNodeParameter('leadSourceOther', itemIndex) as string)
			: '';
	const ownerEmail = context.getNodeParameter('ownerEmail', itemIndex) as string;
	const additionalFields = context.getNodeParameter('additionalFields', itemIndex) as IDataObject;

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

	return { json: responseData };
}
