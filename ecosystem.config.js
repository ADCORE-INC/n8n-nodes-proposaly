module.exports = {
	apps: [
		{
			name: 'n8n',
			script: 'n8n',
			args: 'start',
			env_development: {
				N8N_RELEASE_TYPE: 'stable',
				N8N_PROTOCOL: 'https',
				N8N_HOST: 'test-n8n.proposaly.io',
				N8N_PORT: 5678,
				NODE_ENV: 'production',
				WEBHOOK_URL: 'https://test-n8n.proposaly.io/',
			},
			env_production: {
				N8N_RELEASE_TYPE: 'stable',
				N8N_PROTOCOL: 'https',
				N8N_HOST: 'n8n.proposaly.io',
				N8N_PORT: 5678,
				NODE_ENV: 'production',
				WEBHOOK_URL: 'https://n8n.proposaly.io/',
			},
		},
	],
};
