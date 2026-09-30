# n8n-nodes-proposaly

This is an n8n community node. It lets you use [Proposaly](https://proposaly.io) in your n8n workflows.

Proposaly unifies presentations, proposals, agreements, and payments into one seamless, client-ready experience - helping you close faster and smarter.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node supports the following resources and operations:

### Lead

| Operation | Description |
|-----------|-------------|
| Create | Create a new lead |
| Archive | Archive an existing lead |
| Delete | Permanently delete a lead |
| Find By ID | Retrieve a lead by its ID |
| Get Many | List leads in a workspace (optional status filter) |
| Reactivate | Reactivate an archived lead |
| Update | Update lead properties |

### Document

| Operation | Description |
|-----------|-------------|
| Create | Create a new document |
| Create From Lead | Create a document attached to a lead |
| Create From Template | Create a document from a template |
| Delete | Permanently delete a document |
| Duplicate | Create a copy of an existing document |
| Find By ID | Retrieve a document by its ID |
| Get Many | List documents in a workspace |
| Move Stage | Move a document to a different stage |
| Create View Only Link | Generate a shareable view-only link |
| Share | Share a document with recipients |
| Transfer Ownership | Transfer document ownership to another user |
| Update | Update document properties |

### Recipient

| Operation | Description |
|-----------|-------------|
| Add | Add a recipient to a document |
| Delete | Remove a recipient from a document |
| Find | Find a recipient by ID |
| Get Many | List recipients on a document |
| Update | Update recipient details |
| Get Notification Settings | Retrieve notification preferences for a recipient |
| Update Notification Settings | Modify notification preferences for a recipient |

### Workspace

| Operation | Description |
|-----------|-------------|
| Add | Add a new workspace |
| Find By ID | Retrieve a workspace by its ID |
| Get Many | List workspaces in your company |
| Get Stages | List stages in a workspace |

### Card

Cards are documents in a **Card** workspace. Find and list return flattened lead metadata (`client_name`, first recipient `email` / `first_name` / `last_name` / `phone_number`). Nested `notes` are included by default; turn **Include Notes** off to skip those extra API calls.

| Operation | Description |
|-----------|-------------|
| Find By ID | Retrieve a card by its document ID |
| Get Many | List cards in a Card workspace |

### Note

Notes attach to a document, card, or lead. Server-generated notes (`agent` / `order_fields`) are read-only.

| Operation | Description |
|-----------|-------------|
| Create | Create a note on a document, card, or lead |
| Update | Update a note's title and/or body |
| Delete | Permanently delete a note |
| Find By ID | Retrieve a note by its ID |
| Get Many | List notes on a document, card, or lead |

### Trigger Node

**Proposaly Trigger** is a **polling** trigger. It periodically asks Proposaly for new or changed records, then starts a workflow when it finds them.

| Event | Description |
|-----------|-------------|
| New Lead | New active lead in a workspace |
| Archived Lead | Lead archived in a workspace |
| Deleted Lead | Lead deleted in a workspace |
| New Document | New document in a workspace |
| Document Moved to New Stage | Document entered the selected stage |
| New Card | New card in a Card workspace |
| Card Moved to New Stage | Card entered the selected stage |
| New Recipient | New recipient on a selected document |
| New Note | New note on a selected document, card, or lead |
| New Workspace | New workspace in the company |

The first production poll seeds the cursor and does not replay existing records. **Execute step** in the editor still returns a sample. **Limit** (default 50) caps how many new items are emitted on later polls.

Lead trigger and lead action outputs include Zapier/Make-style fields: `client_name`, plus the first recipient lifted to `email`, `first_name`, `last_name`, and `phone_number`. The `recipients` array is still present. Lead, document, and card outputs include nested `notes` by default (up to 100 newest notes). Turn **Include Notes** off to avoid extra API usage.

## Credentials

To authenticate with Proposaly, you need an API key from your Proposaly workspace.

### How to obtain your API Key

1. Log in to your Proposaly account
2. Open the **Menu** in your company's workspace
3. Navigate to **Company** → **Settings**
4. Open the **Integrations** tab
5. Click **"Generate an API Key"** (or if you already have a key, click the 3 dots and select **"Edit"**)
6. Copy the API Key

### Setting up credentials in n8n

1. In n8n, go to **Credentials**
2. Click **Add Credential**
3. Search for **Proposaly API**
4. Paste your API Key
5. Choose **Environment**: **Test** (`test-api.proposaly.io`) or **Production** (`api.proposaly.io`)
6. Click **Save**

Local `npm run dev` prints the Test vs Production hosts from `nodes/Proposaly/environments.ts` (same URLs as Zapier and Make). n8n Cloud forbids `process.env` in community nodes, so `.env` (`PROPOSALY_ENVIRONMENT=test`, see `.env.example`) documents local intent only — you still choose **Environment** on the credential. Existing credentials keep Production until you edit them and pick Test. API keys stay in n8n credentials, not in `.env`.

## Compatibility

This node has been tested with n8n version **1.x** and later.

**Minimum n8n version:** 1.0.0

## Usage

### Basic Example: Create a Lead

1. Add a **Proposaly** node to your workflow
2. Select **Lead** as the resource
3. Select **Create** as the operation
4. Fill in the required fields:
   - **Workspace**
   - **Client Name**
   - **Lead Type**, **Lead Source**, **Owner Email**, and **Country**
5. Execute the node

Lead outputs include `lead_id`, `client_name`, and first-recipient `email` / `first_name` / `last_name` when recipients exist.

### Using with AI Agents

This node is compatible with n8n's AI Agent functionality. You can use it as a tool within AI workflows to automate proposal and document management based on natural language instructions.

Example using `$fromAI()`:

```javascript
// In a Code node before the Proposaly node
return {
  email: $fromAI("email", "The client's email address"),
  firstName: $fromAI("firstName", "The client's first name"),
  lastName: $fromAI("lastName", "The client's last name")
};
```

### Tips

- **Polling Trigger**: Use the Proposaly Trigger node to start workflows on new leads, documents, recipients, workspaces, or stage moves. It polls; it does not receive webhooks.
- **Get Many**: List operations return one n8n item per record, so downstream nodes run once per lead/document/recipient/workspace.
- **Error Handling**: Enable "Continue On Fail" if you want your workflow to continue even if a Proposaly operation fails
- **Batch Operations**: When processing multiple items, the node automatically handles each item in the input

## Resources

- [Proposaly Website](https://proposaly.io)
- [Proposaly API Documentation](https://api.proposaly.io/redoc)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [GitHub Repository](https://github.com/ADCORE-INC/n8n.proposaly.io)

## Version history

See [CHANGELOG.md](CHANGELOG.md) for a detailed version history.

### 0.2.2

- Community-node lint fixes from the 0.2.1 review, including light and dark icons
- Codex node id is `n8n-nodes-proposaly.Proposaly`
- Nested notes load with `include_notes`

### 0.2.1

- Same 0.2.0 node features; npm publish now uses Trusted Publishing (OIDC) from GitHub Actions

### 0.2.0

- **Get Many** for leads, documents, recipients, and workspaces, plus **Get Workspace Stages**
- Lead outputs flattened to match Zapier/Make (`client_name`, first-recipient email/name/phone)
- Polling triggers seed on first production poll instead of replaying history
- Optional document labels and `copy_team_members` on create/duplicate
- Credential **Environment** (Test vs Production); URLs live in `nodes/Proposaly/environments.ts`
- **Note** and **Card** resources, nested notes, Include Notes toggle, and matching triggers

### 0.1.0

Initial release with support for:

- **Lead** management (Create, Archive, Delete, Find, Reactivate, Update)
- **Document** operations (Create, Delete, Duplicate, Find, Move Stage, Share, Share Link, Transfer, Update)
- **Recipient** handling (Add, Delete, Find, Update, Notification Settings)
- **Workspace** operations (Add, Find)
- **Webhook Trigger** for real-time event handling
