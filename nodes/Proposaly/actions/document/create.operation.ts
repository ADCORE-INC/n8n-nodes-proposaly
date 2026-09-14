import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { proposalyRequest } from '../../transport';

interface CreateDocumentParams {
	workspaceId: string;
	title: string;
	templateDocumentId?: string;
	copyRecipients?: boolean;
	copyPriceQuote?: boolean;
	copyAddons?: boolean;
	copyAttachments?: boolean;
	copyTeamMembers?: boolean;
	leadId?: string;
	labels?: string[];
}

export async function createDocumentOperation(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
	params: CreateDocumentParams,
): Promise<INodeExecutionData> {
	const body: IDataObject = {
		workspace_id: params.workspaceId,
		title: params.title,
	};

	if (params.templateDocumentId) {
		body.template_document_id = params.templateDocumentId;
	}
	if (params.copyRecipients !== undefined) {
		body.copy_recipients = params.copyRecipients;
	}
	if (params.copyPriceQuote !== undefined) {
		body.copy_price_quote = params.copyPriceQuote;
	}
	if (params.copyAddons !== undefined) {
		body.copy_addons = params.copyAddons;
	}
	if (params.copyAttachments !== undefined) {
		body.copy_attachments = params.copyAttachments;
	}
	if (params.copyTeamMembers !== undefined) {
		body.copy_team_members = params.copyTeamMembers;
	}
	if (params.leadId) {
		body.lead_id = params.leadId;
	}
	if (params.labels && params.labels.length > 0) {
		body.labels = params.labels;
	}

	const responseData = await proposalyRequest(context, {
		method: 'POST',
		path: '/documents',
		body,
	});

	return { json: responseData, pairedItem: { item: itemIndex } };
}
