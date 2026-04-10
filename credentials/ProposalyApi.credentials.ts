import type {
	IAuthenticateGeneric,
	ICredentialType,
	ICredentialTestRequest,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class ProposalyApi implements ICredentialType {
	name = 'proposalyApi';

	displayName = 'Proposaly API';

	documentationUrl = 'https://docs.proposaly.com/';

	icon: Icon = 'file:proposaly.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
		{
			displayName: 'Base URL',
			name: 'url',
			type: 'string',
			default: 'https://api.proposaly.io/v2/public-api',
			description: 'Override the default base URL for the API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			url: '={{$credentials.url}}/validate',
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};
}
