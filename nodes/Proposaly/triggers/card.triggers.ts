import type { IDataObject, INodeExecutionData, IPollFunctions } from 'n8n-workflow';
import { Document, PaginatedApiResponse, PollData } from '../types';
import { isRetryableProposalyError, proposalyRequest, rethrowAsNodeError } from '../transport';
import { cardsWithNotes, includeNotesForPoll, includeNotesQuery } from '../notes';
import { diffPollRecords, resolvePollLimit } from '../shape';

function resetCardPollDataWorkspace(pollData: PollData) {
	pollData.lastNewCardId = undefined;
	pollData.lastCardMovedToNewStageId = undefined;
	pollData.lastCardStageId = undefined;
}

async function loadDocuments(
	context: IPollFunctions,
	qs: IDataObject,
): Promise<Document[]> {
	let page: number | null = 1;
	let allDocuments: Document[] = [];

	while (page !== null) {
		const response: PaginatedApiResponse<Document> = await proposalyRequest(context, {
			method: 'GET',
			path: '/documents',
			qs: {
				...qs,
				page,
				...includeNotesQuery(includeNotesForPoll(context)),
			},
		});

		const documents = response.entities ?? [];
		if (documents.length === 0) {
			break;
		}

		allDocuments = allDocuments.concat(documents);
		page = response.pagination?.next_page || null;
	}

	return allDocuments;
}

export async function pollCardTrigger(
	context: IPollFunctions,
	event: string,
): Promise<INodeExecutionData[] | null> {
	try {
		if (event === 'newCard') {
			return await pollNewCard(context);
		}
		if (event === 'cardMovedToNewStage') {
			return await pollCardMovedToNewStage(context);
		}
		return null;
	} catch (error) {
		if (isRetryableProposalyError(error)) {
			return null;
		}
		rethrowAsNodeError(context, error);
	}
}

async function pollNewCard(context: IPollFunctions): Promise<INodeExecutionData[] | null> {
	const pollData = context.getWorkflowStaticData('node') as PollData;
	const workspaceId = context.getNodeParameter('workspaceId') as string;
	const limit = resolvePollLimit(context.getNodeParameter('limit', 0));

	if (pollData.currentWorkspaceId !== workspaceId) {
		resetCardPollDataWorkspace(pollData);
		pollData.currentWorkspaceId = workspaceId;
	}

	const documents = (await loadDocuments(context, { workspace_id: workspaceId })).filter(
		(document) => document.stage_id !== 'Archived',
	);

	const { emit, nextId } = diffPollRecords({
		records: documents,
		lastId: pollData.lastNewCardId,
		getId: (document) => document.document_id,
		newestFirst: true,
		mode: context.getMode(),
		limit,
	});

	if (nextId) {
		pollData.lastNewCardId = nextId;
	}

	if (emit.length === 0) {
		return null;
	}

	const cards = await cardsWithNotes(context, emit, includeNotesForPoll(context));
	return cards.map((card) => ({
		json: card as unknown as IDataObject,
	}));
}

async function pollCardMovedToNewStage(
	context: IPollFunctions,
): Promise<INodeExecutionData[] | null> {
	const pollData = context.getWorkflowStaticData('node') as PollData;
	const workspaceId = context.getNodeParameter('workspaceId') as string;
	const stageId = context.getNodeParameter('stageId') as string;
	const limit = resolvePollLimit(context.getNodeParameter('limit', 0));

	if (pollData.currentWorkspaceId !== workspaceId) {
		resetCardPollDataWorkspace(pollData);
		pollData.currentWorkspaceId = workspaceId;
		pollData.lastCardStageId = stageId;
	} else if (pollData.lastCardStageId !== stageId) {
		pollData.lastCardMovedToNewStageId = undefined;
		pollData.lastCardStageId = stageId;
	}

	const documents = await loadDocuments(context, {
		workspace_id: workspaceId,
		stage_id: stageId,
		sort_by: 'StatusChangedDate',
	});
	documents.sort((a, b) => b.status_changed_date - a.status_changed_date);

	const { emit, nextId } = diffPollRecords({
		records: documents,
		lastId: pollData.lastCardMovedToNewStageId,
		getId: (document) => document.document_id,
		newestFirst: true,
		mode: context.getMode(),
		limit,
	});

	if (nextId) {
		pollData.lastCardMovedToNewStageId = nextId;
	}

	if (emit.length === 0) {
		return null;
	}

	const cards = await cardsWithNotes(context, emit, includeNotesForPoll(context));
	return cards.map((card) => ({
		json: card as unknown as IDataObject,
	}));
}
