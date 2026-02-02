import { IDataObject, INodeExecutionData, IPollFunctions } from 'n8n-workflow';
import { Document, PaginatedApiResponse, PollData } from '../types';
import { isRetryableProposalyError, proposalyRequest } from '../transport';

// Helper to reset all document poll data for workspace change
function resetDocumentPollDataWorkspace(pollData: PollData) {
	pollData.lastNewDocumentId = undefined;
	pollData.lastDocumentMovedToNewStageId = undefined;
	pollData.lastStageId = undefined;
}

// Helper to reset document poll data for stage change
function resetDocumentPollDataStageId(pollData: PollData) {
	pollData.lastDocumentMovedToNewStageId = undefined;
}

export async function pollDocumentTrigger(
	context: IPollFunctions,
	event: string,
): Promise<INodeExecutionData[] | null> {
	try {
		if (event === 'newDocument') {
			const result = await pollNewDocument(context);
			return result;
		} else if (event === 'documentMovedToNewStage') {
			const result = await pollDocumentMovedToNewStage(context);
			return result;
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

	// Reset poll data if workspace changes (affects data source)
	const currentWorkspaceId = pollData.currentWorkspaceId;
	if (currentWorkspaceId !== workspaceId) {
		resetDocumentPollDataWorkspace(pollData);
		pollData.currentWorkspaceId = workspaceId;
	}

	const lastNewDocumentId = pollData.lastNewDocumentId;

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

		if (!lastNewDocumentId) {
			// First time polling, collect all documents from all pages
			allDocuments = allDocuments.concat(documents);
		} else {
			const lastDocumentIndex = documents.findIndex(
				(document) => document.document_id === lastNewDocumentId,
			);
			if (lastDocumentIndex !== -1) {
				// Found the last document, collect only new documents before it
				allDocuments = allDocuments.concat(documents.slice(0, lastDocumentIndex));
				break;
			} else {
				// Last document not found, collect all documents from this page and continue
				allDocuments = allDocuments.concat(documents);
			}
		}

		// Stop when there are no more documents to fetch
		if (!pagination.next_page) {
			break;
		}
		page = pagination.next_page || null;
	}

	if (allDocuments.length === 0) {
		return null;
	}

	// Update the stored last document_id to the most recent document (first in array)
	const newLastDocumentId =
		allDocuments.length > 0 ? allDocuments[0].document_id : lastNewDocumentId;
	if (newLastDocumentId) {
		pollData.lastNewDocumentId = newLastDocumentId;
	}

	return allDocuments.map((document) => ({
		json: document as unknown as IDataObject,
	}));
}

async function pollDocumentMovedToNewStage(
	context: IPollFunctions,
): Promise<INodeExecutionData[] | null> {
	const pollData = context.getWorkflowStaticData('node') as PollData;
	const workspaceId = context.getNodeParameter('workspaceId') as string;
	const stageId = context.getNodeParameter('stageId') as string;
	const currentWorkspaceId = pollData.currentWorkspaceId;
	const currentStageId = pollData.lastStageId;

	// Reset poll data if workspace or stage changes (affects data source)
	if (currentWorkspaceId !== workspaceId) {
		resetDocumentPollDataWorkspace(pollData);
		pollData.currentWorkspaceId = workspaceId;
		pollData.lastStageId = stageId;
	} else if (currentStageId !== stageId) {
		resetDocumentPollDataStageId(pollData);
		pollData.lastStageId = stageId;
	}

	const lastDocumentMovedToNewStageId = pollData.lastDocumentMovedToNewStageId;

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

		// Sort documents by status_changed_date descending (newest first)
		documents.sort((a, b) => b.status_changed_date - a.status_changed_date);

		if (!lastDocumentMovedToNewStageId) {
			// First time polling, collect all documents from all pages
			allDocuments = allDocuments.concat(documents);
		} else {
			const lastDocumentIndex = documents.findIndex(
				(document) => document.document_id === lastDocumentMovedToNewStageId,
			);
			if (lastDocumentIndex !== -1) {
				// Found the last document, collect only new documents before it
				allDocuments = allDocuments.concat(documents.slice(0, lastDocumentIndex));
				break;
			} else {
				// Last document not found, collect all documents from this page and continue
				allDocuments = allDocuments.concat(documents);
			}
		}

		// Stop when there are no more documents to fetch
		if (!pagination.next_page) {
			break;
		}
		page = pagination.next_page || null;
	}

	if (allDocuments.length === 0) {
		return null;
	}

	// Update the stored last document_id to the most recent document (first in array)
	const newLastDocumentMovedToNewStageId =
		allDocuments.length > 0 ? allDocuments[0].document_id : lastDocumentMovedToNewStageId;
	if (newLastDocumentMovedToNewStageId) {
		pollData.lastDocumentMovedToNewStageId = newLastDocumentMovedToNewStageId;
	}

	return allDocuments.map((document) => ({
		json: document as unknown as IDataObject,
	}));
}
