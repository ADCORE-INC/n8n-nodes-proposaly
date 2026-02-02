// === RESOURCES ===
export const Resources = {
	Lead: 'lead',
	Document: 'document',
	Recipient: 'recipient',
	Workspace: 'workspace',
} as const;

// === OPERATIONS ===
export const LeadOperations = {
	Archive: 'archiveLead',
	Create: 'createLead',
	Delete: 'deleteLead',
	FindById: 'findLeadById',
	Reactivate: 'reactivateLead',
	Update: 'updateLead',
} as const;

export const DocumentOperations = {
	Create: 'createDocument',
	CreateFromLead: 'createDocumentFromLead',
	CreateFromTemplate: 'createDocumentFromTemplate',
	CreateViewOnlyLink: 'createDocumentViewOnlyLink',
	Delete: 'deleteDocument',
	Duplicate: 'duplicateDocument',
	FindById: 'findDocumentById',
	MoveStage: 'moveDocumentStage',
	Share: 'shareDocument',
	TransferOwnership: 'transferDocumentOwnership',
	Update: 'updateDocument',
} as const;

export const RecipientOperations = {
	Add: 'addRecipient',
	Delete: 'deleteRecipient',
	Find: 'findRecipient',
	Update: 'updateRecipient',
	GetNotificationSettings: 'getRecipientNotificationSettings',
	UpdateNotificationSettings: 'updateRecipientNotificationSettings',
} as const;

export const WorkspaceOperations = {
	Add: 'addWorkspace',
	FindById: 'findWorkspaceById',
} as const;

// === FIELD IDS ===
export const Fields = {
	// Core fields
	Resource: 'resource',
	Operation: 'operation',

	// ID fields - dropdown select
	WorkspaceId: 'workspaceId',
	DocumentId: 'documentId',
	LeadId: 'leadId',
	RecipientId: 'recipientId',
	DocumentTemplateId: 'documentTemplateId',
	ArchivedLeadId: 'archivedLeadId',

	// ID fields - string input
	WorkspaceIdString: 'workspaceIdString',
	DocumentIdString: 'documentIdString',
	LeadIdString: 'leadIdString',
	RecipientIdString: 'recipientIdString',

	// Lead fields
	LeadType: 'leadType',
	LeadTypeOptional: 'leadTypeOptional',
	LeadSource: 'leadSource',
	LeadSourceOptional: 'leadSourceOptional',
	LeadSourceOther: 'leadSourceOther',
	ClientName: 'clientName',
	ClientNameOptional: 'clientNameOptional',
	Country: 'country',
	CountryOptional: 'countryOptional',
	OwnerEmail: 'ownerEmail',
	OwnerEmailOptional: 'ownerEmailOptional',
	Website: 'website',

	// Document fields
	DocumentTitle: 'documentTitle',
	DocumentTitleOptional: 'documentTitleOptional',
	NewStage: 'newStage',
	NewStageOptional: 'newStageOptional',
	ReasonArchived: 'reasonArchived',
	NewOwnerEmail: 'newOwnerEmail',
	ExpiresAfter: 'expiresAfter',
	CopyRecipients: 'copyRecipients',
	CopyPriceQuote: 'copyPriceQuote',
	CopyAddons: 'copyAddons',
	CopyAttachments: 'copyAttachments',
	Recipients: 'recipients',

	// Recipient fields
	FirstName: 'firstName',
	FirstNameOptional: 'firstNameOptional',
	LastName: 'lastName',
	LastNameOptional: 'lastNameOptional',
	Email: 'email',
	EmailOptional: 'emailOptional',
	PhoneNumber: 'phoneNumber',
	PhoneNumberOptional: 'phoneNumberOptional',
	AccessLevel: 'accessLevel',
	AccessLevelOptional: 'accessLevelOptional',
	StatusOptional: 'statusOptional',

	// Notification fields
	AgreementSigned: 'agreementSigned',
	AddonAdded: 'addonAdded',
	PaymentMade: 'paymentMade',
	MessageReceived: 'messageReceived',
	MediaAdded: 'mediaAdded',
	DocumentStatusChanged: 'documentStatusChanged',

	// Workspace fields
	WorkspaceName: 'workspaceName',
	WorkspaceType: 'workspaceType',

	// Additional fields collection
	AdditionalFields: 'additionalFields',
} as const;

// Nested additional fields
export const AdditionalFieldKeys = {
	StreetAddress: 'streetAddress',
	Apartment: 'apartment',
	City: 'city',
	State: 'state',
	ZipCode: 'zipCode',
	Comment: 'comment',
} as const;

// === DERIVED TYPES ===
export type Resource = (typeof Resources)[keyof typeof Resources];
export type LeadOperation = (typeof LeadOperations)[keyof typeof LeadOperations];
export type DocumentOperation = (typeof DocumentOperations)[keyof typeof DocumentOperations];
export type RecipientOperation = (typeof RecipientOperations)[keyof typeof RecipientOperations];
export type WorkspaceOperation = (typeof WorkspaceOperations)[keyof typeof WorkspaceOperations];
export type FieldId = (typeof Fields)[keyof typeof Fields];
export type AdditionalFieldKey = (typeof AdditionalFieldKeys)[keyof typeof AdditionalFieldKeys];
