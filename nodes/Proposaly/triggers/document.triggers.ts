import { IDataObject, INodeExecutionData, IPollFunctions } from 'n8n-workflow';
import { Document, PaginatedApiResponse, PollData } from '../types';
import { isRetryableProposalyError, proposalyRequest } from '../transport';
import { diffPollRecords, resolvePollLimit } from '../shape';

function resetDocumentPollDataWorkspace(pollData: PollData) {
	pollData.lastNewDocumentId = undefined;
	pollData.lastDocumentMovedToNewStageId = undefined;
	pollData.lastStageId = undefined;
}

function resetDocumentPollDataStageId(pollData: PollData) {
	pollData.lastDocumentMovedToNewStageId = undefined;
}

export async function pollDocumentTrigger(
	context: IPollFunctions,
	event: string,
): Promise<INodeExecutionData[] | null> {
	try {
		if (event === 'newDocument') {
			return await pollNewDocument(context);
		}
		if (event === 'documentMovedToNewStage') {
			return await pollDocumentMovedToNewStage(context);
		}

		return null;
	} catch (error) {
		if (isRetryableProposalyError(error)) {
			return null;
		}
		throw error;
	}
}

async function pollNewDocument(context: IPollFunctions): Promise<INodeExecutionData[] | null> {
	const pollData = context.getWorkflowStaticData('node') as PollData;
	const workspaceId = context.getNodeParameter('workspaceId') as string;
	const limit = resolvePollLimit(context.getNodeParameter('limit', 0));

	const currentWorkspaceId = pollData.currentWorkspaceId;
	if (currentWorkspaceId !== workspaceId) {
		resetDocumentPollDataWorkspace(pollData);
		pollData.currentWorkspaceId = workspaceId;
	}

	let page: number | null = 1;
	let allDocuments: Document[] = [];

	while (page !== null) {
		const response: PaginatedApiResponse<Document> = await proposalyRequest(context, {
			method: 'GET',
			path: '/documents',
			qs: {
				workspace_id: workspaceId,
				page,
			},
		});

		const documents = response.entities;
		const pagination = response.pagination;

		if (documents.length === 0) {
			break;
		}

		allDocuments = allDocuments.concat(documents);

		if (!pagination.next_page) {
			break;
		}
		page = pagination.next_page || null;
	}

	const { emit, nextId } = diffPollRecords({
		records: allDocuments,
		lastId: pollData.lastNewDocumentId,
		getId: (document) => document.document_id,
		newestFirst: true,
		mode: context.getMode(),
		limit,
	});

	if (nextId) {
		pollData.lastNewDocumentId = nextId;
	}

	if (emit.length === 0) {
		return null;
	}

	return emit.map((document) => ({
		json: document as unknown as IDataObject,
	}));
}

async function pollDocumentMovedToNewStage(
	context: IPollFunctions,
): Promise<INodeExecutionData[] | null> {
	const pollData = context.getWorkflowStaticData('node') as PollData;
	const workspaceId = context.getNodeParameter('workspaceId') as string;
	const stageId = context.getNodeParameter('stageId') as string;
	const limit = resolvePollLimit(context.getNodeParameter('limit', 0));
	const currentWorkspaceId = pollData.currentWorkspaceId;
	const currentStageId = pollData.lastStageId;

	if (currentWorkspaceId !== workspaceId) {
		resetDocumentPollDataWorkspace(pollData);
		pollData.currentWorkspaceId = workspaceId;
		pollData.lastStageId = stageId;
	} else if (currentStageId !== stageId) {
		resetDocumentPollDataStageId(pollData);
		pollData.lastStageId = stageId;
	}

	let page: number | null = 1;
	let allDocuments: Document[] = [];

	while (page !== null) {
		const response: PaginatedApiResponse<Document> = await proposalyRequest(context, {
			method: 'GET',
			path: '/documents',
			qs: {
				workspace_id: workspaceId,
				stage_id: stageId,
				page,
				sort_by: 'StatusChangedDate',
			},
		});

		const documents = response.entities;
		const pagination = response.pagination;

		if (documents.length === 0) {
			break;
		}

		documents.sort((a, b) => b.status_changed_date - a.status_changed_date);
		allDocuments = allDocuments.concat(documents);

		if (!pagination.next_page) {
			break;
		}
		page = pagination.next_page || null;
	}

	const { emit, nextId } = diffPollRecords({
		records: allDocuments,
		lastId: pollData.lastDocumentMovedToNewStageId,
		getId: (document) => document.document_id,
		newestFirst: true,
		mode: context.getMode(),
		limit,
	});

	if (nextId) {
		pollData.lastDocumentMovedToNewStageId = nextId;
	}

	if (emit.length === 0) {
		return null;
	}

	return emit.map((document) => ({
		json: document as unknown as IDataObject,
	}));
}
