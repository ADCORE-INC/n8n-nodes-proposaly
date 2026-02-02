import type { IDataObject, INodeExecutionData, IPollFunctions } from 'n8n-workflow';
import { Lead, PaginatedApiResponse, PollData } from '../types';
import { isRetryableProposalyError, proposalyRequest } from '../transport';

// Helper to reset all lead poll data
function resetLeadPollData(pollData: PollData) {
	pollData.lastAddedLeadId = undefined;
	pollData.lastArchivedLeadId = undefined;
	pollData.lastDeletedLeadId = undefined;
}

// Map events to their corresponding status filters
const statusMap: Record<string, string | undefined> = {
	newLead: 'Active',
	archivedLead: 'Archived',
	deletedLead: 'Deleted',
};

/**
 * Gets the appropriate poll data key based on the event type
 */
function getLastLeadIdKey(event: string): keyof PollData {
	const keyMap: Record<string, keyof PollData> = {
		newLead: 'lastAddedLeadId',
		archivedLead: 'lastArchivedLeadId',
		deletedLead: 'lastDeletedLeadId',
	};

	return keyMap[event] || 'lastAddedLeadId';
}

/**
 * Polls for leads based on the specified event type and status
 */
export async function pollLeadTrigger(
	context: IPollFunctions,
	event: string,
): Promise<INodeExecutionData[] | null> {
	try {
		const workspaceId = context.getNodeParameter('workspaceId') as string;
		const pollData = context.getWorkflowStaticData('node') as PollData;

		// Reset poll data if workspace changes (affects data source)
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

			// Sort leads by date_created descending (newest first)
			leads.sort((a, b) => b.date_created - a.date_created);

			if (!lastLeadId) {
				// First time polling, collect all leads from all pages
				allLeads = allLeads.concat(leads);
			} else {
				const lastLeadIndex = leads.findIndex((lead) => lead.lead_id === lastLeadId);
				if (lastLeadIndex !== -1) {
					// Found the last lead, collect only new leads before it
					allLeads = allLeads.concat(leads.slice(0, lastLeadIndex));
					break;
				} else {
					// Last lead not found, collect all leads from this page and continue
					allLeads = allLeads.concat(leads);
				}
			}

			// Stop when there are no more leads to fetch
			if (!pagination.next_page) {
				break;
			}
			page = pagination.next_page;
		}

		if (allLeads.length === 0) {
			return null;
		}

		// Update the stored last lead_id to the most recent lead (first in array)
		const newLastLeadId = allLeads.length > 0 ? allLeads[0].lead_id : lastLeadId;
		if (newLastLeadId) {
			pollData[lastLeadIdKey] = newLastLeadId;
		}

		return allLeads.map((lead) => ({
			json: lead as unknown as IDataObject,
		}));
	} catch (error) {
		if (isRetryableProposalyError(error)) {
			return null;
		}
		throw error;
	}
}
