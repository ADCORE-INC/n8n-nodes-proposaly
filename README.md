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
| Reactivate | Reactivate an archived lead |
| Update | Update lead properties |

### Document

| Operation | Description |
|-----------|-------------|
| Create | Create a new document |
| Delete | Permanently delete a document |
| Duplicate | Create a copy of an existing document |
| Find By ID | Retrieve a document by its ID |
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
| Find | Find recipients on a document |
| Update | Update recipient details |
| Get Notification Settings | Retrieve notification preferences for a recipient |
| Update Notification Settings | Modify notification preferences for a recipient |

### Workspace

| Operation | Description |
|-----------|-------------|
| Add | Add a new workspace |
| Find By ID | Retrieve a workspace by its ID |

### Trigger Node

The package also includes a **Proposaly Trigger** node that listens for webhook events from Proposaly, allowing you to start workflows when events occur in your Proposaly account.

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
5. The default API URL is `https://api.proposaly.io/v2/public-api` (only change if instructed by Proposaly support)
6. Click **Save**

## Compatibility

This node has been tested with n8n version **1.x** and later.

**Minimum n8n version:** 1.0.0

## Usage

### Basic Example: Create a Lead

1. Add a **Proposaly** node to your workflow
2. Select **Lead** as the resource
3. Select **Create** as the operation
4. Fill in the required fields:
   - **Email**: The lead's email address
   - **First Name**: The lead's first name
   - **Last Name**: The lead's last name
5. Execute the node

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

- **Webhook Trigger**: Use the Proposaly Trigger node to automatically start workflows when documents are viewed, signed, or when other events occur
- **Error Handling**: Enable "Continue On Fail" if you want your workflow to continue even if a Proposaly operation fails
- **Batch Operations**: When processing multiple items, the node automatically handles each item in the input

## Resources

- [Proposaly Website](https://proposaly.io)
- [Proposaly API Documentation](https://api.proposaly.io/redoc)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [GitHub Repository](https://github.com/ADCORE-INC/n8n.proposaly.io)

## Version history

See [CHANGELOG.md](CHANGELOG.md) for a detailed version history.

### 0.1.0

Initial release with support for:

- **Lead** management (Create, Archive, Delete, Find, Reactivate, Update)
- **Document** operations (Create, Delete, Duplicate, Find, Move Stage, Share, Share Link, Transfer, Update)
- **Recipient** handling (Add, Delete, Find, Update, Notification Settings)
- **Workspace** operations (Add, Find)
- **Webhook Trigger** for real-time event handling
