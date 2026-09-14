import type { IDataObject } from 'n8n-workflow';

export type CapturedRequest = {
	method?: string;
	url?: string;
	body?: IDataObject;
	qs?: IDataObject;
};

type ContextOptions = {
	params?: Record<string, unknown>;
	response?: unknown;
	responses?: unknown[];
	pollData?: Record<string, unknown>;
	mode?: string;
	inputItems?: IDataObject[];
	continueOnFail?: boolean;
};

export function createNodeContext(options: ContextOptions = {}) {
	const captured: CapturedRequest[] = [];
	let responseIndex = 0;
	const params = options.params ?? {};
	const pollData = options.pollData ?? {};

	const httpRequestWithAuthentication = async (
		_credentialType: string,
		requestOptions: CapturedRequest,
	) => {
		captured.push({
			method: requestOptions.method,
			url: requestOptions.url,
			body: requestOptions.body as IDataObject | undefined,
			qs: requestOptions.qs as IDataObject | undefined,
		});

		if (options.responses) {
			const index = Math.min(responseIndex, options.responses.length - 1);
			responseIndex += 1;
			return options.responses[index];
		}

		return options.response;
	};

	const context = {
		getNodeParameter(name: string, itemIndexOrFallback?: unknown, fallback?: unknown) {
			if (name in params) {
				return params[name];
			}
			if (fallback !== undefined) {
				return fallback;
			}
			if (typeof itemIndexOrFallback !== 'number') {
				return itemIndexOrFallback;
			}
			return undefined;
		},
		getCredentials: async () => ({ url: 'https://api.proposaly.io/v2/public-api' }),
		getNode: () => ({ name: 'Proposaly' }),
		getMode: () => options.mode ?? 'trigger',
		getWorkflowStaticData: () => pollData,
		getInputData: () => (options.inputItems ?? [{}]).map((json) => ({ json })),
		continueOnFail: () => options.continueOnFail ?? false,
		helpers: {
			httpRequestWithAuthentication,
		},
	};

	return {
		context: context as never,
		captured,
		pollData,
		pathOf: (index = 0) => new URL(captured[index]?.url ?? 'https://invalid').pathname,
	};
}

export async function runOperation<T>(
	operation: (context: never, items: never[], itemIndex: number) => Promise<T>,
	params: Record<string, unknown>,
	response: unknown,
) {
	const { context, captured, pathOf } = createNodeContext({ params, response });
	const result = await operation(context, [], 0);
	return { result, captured, request: captured[0], path: pathOf(0) };
}

export async function runExecute(
	execute: (this: never) => Promise<unknown>,
	params: Record<string, unknown>,
	response: unknown,
	extras: Omit<ContextOptions, 'params' | 'response'> = {},
) {
	const { context, captured, pathOf, pollData } = createNodeContext({
		params,
		response,
		...extras,
	});
	const result = await execute.call(context);
	return { result, captured, request: captured[0], path: pathOf(0), pollData, pathOf };
}
