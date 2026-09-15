const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
	for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) {
			continue;
		}
		const separator = trimmed.indexOf('=');
		if (separator === -1) {
			continue;
		}
		const key = trimmed.slice(0, separator).trim();
		let value = trimmed.slice(separator + 1).trim();
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		if (process.env[key] === undefined) {
			process.env[key] = value;
		}
	}
}

const environment = process.env.PROPOSALY_ENVIRONMENT === 'production' ? 'production' : 'test';
const hosts = {
	production: 'https://api.proposaly.io/v2/public-api',
	test: 'https://test-api.proposaly.io/v2/public-api',
};

console.log(`[proposaly] API hosts live in nodes/Proposaly/environments.ts`);
console.log(`[proposaly]   production ${hosts.production}`);
console.log(`[proposaly]   test       ${hosts.test}`);
console.log(
	`[proposaly] n8n Cloud cannot read .env, so pick Environment = ${environment === 'test' ? 'Test' : 'Production'} in your Proposaly API credential (existing credentials keep their saved host until you edit them).`,
);

const bin = path.resolve(__dirname, '..', 'node_modules', '.bin', 'n8n-node');
const child = spawn(bin, ['dev'], {
	stdio: 'inherit',
	env: process.env,
});

child.on('exit', (code) => {
	process.exit(code ?? 1);
});
