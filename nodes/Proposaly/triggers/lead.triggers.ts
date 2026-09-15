import type { IDataObject, INodeExecutionData, IPollFunctions } from 'n8n-workflow';
import { Lead, PaginatedApiResponse, PollData } from '../types';
import { isRetryableProposalyError, proposalyRequest } from '../transport';
import { diffPollRecords, flattenLead, resolvePollLimit } from '../shape';
import { attachNotesToRecords, includeNotesForPoll } from '../notes';

function resetLeadPollData(pollData: PollData) {
	pollData.lastAddedLeadId = undefined;
	pollData.lastArchivedLeadId = undefined;
	pollData.lastDeletedLeadId = undefined;
}

const statusMap: Record<string, string | undefined> = {
	newLead: 'Active',
	archivedLead: 'Archived',
	deletedLead: 'Deleted',
};

function getLastLeadIdKey(event: string): keyof PollData {
	const keyMap: Record<string, keyof PollData> = {
		newLead: 'lastAddedLeadId',
		archivedLead: 'lastArchivedLeadId',
		deletedLead: 'lastDeletedLeadId',
	};

	return keyMap[event] || 'lastAddedLeadId';
}

export async function pollLeadTrigger(
	context: IPollFunctions,
	event: string,
): Promise<INodeExecutionData[] | null> {
	try {
		const workspaceId = context.getNodeParameter('workspaceId') as string;
		const pollData = context.getWorkflowStaticData('node') as PollData;
		const limit = resolvePollLimit(context.getNodeParameter('limit', 0));

		const currentWorkspaceId = pollData.currentWorkspaceId;
		if (currentWorkspaceId !== workspaceId) {
			resetLeadPollData(pollData);
			pollData.currentWorkspaceId = workspaceId;
		}

		const status = statusMap[event];
		const lastLeadIdKey = getLastLeadIdKey(event);
		const lastLeadId = pollData[lastLeadIdKey];

		let page: number | null = 1;
		let allLeads: Lead[] = [];

		while (page !== null) {
			const response: PaginatedApiResponse<Lead> = await proposalyRequest(context, {
				method: 'GET',
				path: '/leads',
				qs: {
					workspace_id: workspaceId,
					page,
					lead_status: status,
				},
			});

			const leads: Lead[] = Array.isArray(response.entities) ? response.entities : [];
			const pagination: { next_page?: number | null } = response.pagination || {};

			if (leads.length === 0) {
				break;
			}

			leads.sort((a, b) => b.date_created - a.date_created);
			allLeads = allLeads.concat(leads);

			if (!pagination.next_page) {
				break;
			}
			page = pagination.next_page;
		}

		const { emit, nextId } = diffPollRecords({
			records: allLeads,
			lastId: typeof lastLeadId === 'string' ? lastLeadId : undefined,
			getId: (lead) => lead.lead_id,
			newestFirst: true,
			mode: context.getMode(),
			limit,
		});

		if (nextId) {
			pollData[lastLeadIdKey] = nextId;
		}

		if (emit.length === 0) {
			return null;
		}

		const withNotes = await attachNotesToRecords(
			context,
			emit.map((lead) => flattenLead(lead)),
			(lead) => lead.lead_id || lead.id,
			includeNotesForPoll(context),
		);

		return withNotes.map((lead) => ({
			json: lead as IDataObject,
		}));
	} catch (error) {
		if (isRetryableProposalyError(error)) {
			return null;
		}
		throw error;
	}
}
