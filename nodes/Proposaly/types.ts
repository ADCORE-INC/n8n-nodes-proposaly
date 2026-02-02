export type PollData = {
	lastAddedLeadId?: string;
	lastArchivedLeadId?: string;
	lastDeletedLeadId?: string;
	lastNewDocumentId?: string;
	lastDocumentMovedToNewStageId?: string;
	lastStageId?: string;
	currentWorkspaceId?: string;
	lastNewWorkspaceId?: string;
	lastNewRecipientId?: string;
};

export type LeadType = 'individual' | 'business';

export type Lead = {
	lead_id: string;
	workspace_id: string;
	lead_type?: LeadType | null;
	company?: string | null;
	website?: string | null;
	street_address?: string | null;
	apartment?: string | null;
	country?: string | null;
	state?: string | null;
	city?: string | null;
	zip_code?: string | null;
	lead_source?: string | null;
	lead_source_other?: string | null;
	comment?: string | null;
	owner_email?: string | null;
	recipients?: Recipient[] | null;
	date_created: number;
};

export enum ProposalBoardType {
	Proposal = 'proposal',
	Agreement = 'agreement',
	Presentation = 'presentation',
	Payment = 'payment',
}

export type Document = {
	workspace_id: string;
	document_id: string;
	document_title: string;
	document_type: ProposalBoardType;
	date_created: number;
	status_changed_date: number;
	is_template: boolean;
	is_master_template: boolean;
	owner_email: string;
};

export type PaginatedApiResponse<T> = {
	entities: T[];
	pagination: {
		total_entities: number;
		next_page?: number | null;
		prev_page?: number | null;
		total_pages: number;
	};
};

export type Stage = {
	stage_id: string;
	stage_label: string;
	stage_status: 'hide' | 'unhide';
};

export type WorkspaceLabel = {
	label_key: string;
	title: string;
	color: string;
};

export type Workspace = {
	workspace_id: string;
	workspace_name: string;
	workspace_type: string;
	stages: Stage[];
	labels: WorkspaceLabel[];
};

export type Recipient = {
	first_name: string;
	last_name: string;
	email: string | null;
	phone_number: string | null;
	access_level: 'viewer' | 'editor';
	recipient_id: string;
	document_id: string;
	status: 'active' | 'block';
	blocked: boolean;
};

export enum StageID {
	LEAD = 'Lead',
	DRAFT = 'Draft',
	PROSPECT = 'Prospect',
	PARTIALLY_APPROVED = 'PartiallyApproved',
	APPROVED = 'Approved',
	IN_PROGRESS = 'InProgress',
	COMPLETED = 'Completed',
	ARCHIVED = 'Archived',
}
