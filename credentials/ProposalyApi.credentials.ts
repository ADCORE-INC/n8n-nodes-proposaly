import type {
	IAuthenticateGeneric,
	ICredentialType,
	ICredentialTestRequest,
	Icon,
	INodeProperties,
} from 'n8n-workflow';
import { ProposalyApiUrls } from '../nodes/Proposaly/environments';

export class ProposalyApi implements ICredentialType {
	name = 'proposalyApi';

	displayName = 'Proposaly API';

	documentationUrl = 'https://docs.proposaly.com/';

	icon: Icon = { light: 'file:proposaly.svg', dark: 'file:proposaly-dark.svg' };

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
			displayName: 'Environment',
			name: 'url',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: ProposalyApiUrls.production,
				},
				{
					name: 'Test',
					value: ProposalyApiUrls.test,
				},
			],
			default: ProposalyApiUrls.production,
			description:
				'Proposaly API environment. Test uses test-api.proposaly.io; production uses api.proposaly.io.',
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
