# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-02-02

### Added

- Initial release of n8n-nodes-proposaly

#### Lead Resource
- Create: Create a new lead
- Archive: Archive an existing lead
- Delete: Permanently delete a lead
- Find By ID: Retrieve a lead by its ID
- Reactivate: Reactivate an archived lead
- Update: Update lead properties

#### Document Resource
- Create: Create a new document
- Delete: Permanently delete a document
- Duplicate: Create a copy of an existing document
- Find By ID: Retrieve a document by its ID
- Move Stage: Move a document to a different stage
- Create View Only Link: Generate a shareable view-only link
- Share: Share a document with recipients
- Transfer Ownership: Transfer document ownership to another user
- Update: Update document properties

#### Recipient Resource
- Add: Add a recipient to a document
- Delete: Remove a recipient from a document
- Find: Find recipients on a document
- Update: Update recipient details
- Get Notification Settings: Retrieve notification preferences
- Update Notification Settings: Modify notification preferences

#### Workspace Resource
- Add: Add a new workspace
- Find By ID: Retrieve a workspace by its ID

#### Trigger Node
- Proposaly Trigger: Webhook-based trigger for real-time event handling
