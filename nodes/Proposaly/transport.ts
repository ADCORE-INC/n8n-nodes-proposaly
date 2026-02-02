import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IPollFunctions,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { PaginatedApiResponse } from './types';

export type ProposalyContext =
	| IExecuteFunctions
	| ILoadOptionsFunctions
	| IPollFunctions
	| IHookFunctions;

export interface ProposalyRequestOptions extends Omit<IHttpRequestOptions, 'url'> {
	url?: string;
	path?: string;
}

type ProposalyErrorMetadata = {
	statusCode?: number;
	code?: string;
	isRetryable: boolean;
};

const NETWORK_ERROR_CODES = new Set([
	'ETIMEDOUT',
	'ENOTFOUND',
	'ECONNRESET',
	'EAI_AGAIN',
	'ECONNREFUSED',
	'EHOSTUNREACH',
	'ENETUNREACH',
	'ECONNABORTED',
]);

function getRequestPath(options: ProposalyRequestOptions): string {
	if (options.path) {
		return options.path;
	}

	if (options.url) {
		const { url } = options;
		const schemeIndex = url.indexOf('://');
		if (schemeIndex === -1) {
			return url;
		}

		const pathIndex = url.indexOf('/', schemeIndex + 3);
		if (pathIndex === -1) {
			return '/';
		}

		return url.slice(pathIndex);
	}

	return '';
}

function getRequestLabel(options: ProposalyRequestOptions): string {
	const method = (options.method ?? 'GET').toUpperCase();
	const path = getRequestPath(options);
	return path ? `${method} ${path}` : method;
}

function getStatusCode(error: unknown): number | undefined {
	const errorData = error as {
		statusCode?: number;
		status?: number;
		response?: { statusCode?: number; status?: number };
	};

	return (
		errorData?.statusCode ??
		errorData?.status ??
		errorData?.response?.statusCode ??
		errorData?.response?.status
	);
}

function getErrorCode(error: unknown): string | undefined {
	const errorData = error as { code?: unknown; error?: { code?: unknown } };
	const code = errorData?.code ?? errorData?.error?.code;
	return typeof code === 'string' ? code : undefined;
}

function getResponseBody(error: unknown): unknown {
	const errorData = error as { response?: { body?: unknown; data?: unknown }; error?: unknown };
	return errorData?.response?.body ?? errorData?.response?.data ?? errorData?.error;
}

function isRetryableStatus(statusCode?: number): boolean {
	if (!statusCode) {
		return false;
	}

	if (statusCode >= 500) {
		return true;
	}

	return statusCode === 429 || statusCode === 408;
}

function isRetryableError(statusCode: number | undefined, code: string | undefined): boolean {
	if (typeof statusCode === 'number') {
		return isRetryableStatus(statusCode);
	}

	return !!code && NETWORK_ERROR_CODES.has(code);
}

function getStatusHint(statusCode?: number): string {
	if (!statusCode) {
		return 'Try again later.';
	}

	if (statusCode === 400) {
		return 'Check the request parameters.';
	}
	if (statusCode === 401 || statusCode === 403) {
		return 'Check your API key and URL.';
	}
	if (statusCode === 404) {
		return 'Check the resource ID and workspace.';
	}
	if (statusCode === 429) {
		return 'Too many requests. Try again later.';
	}
	if (statusCode >= 500) {
		return 'Proposaly API is temporarily unavailable. Try again later.';
	}

	return 'Try again later.';
}

function safeStringify(value: unknown): string {
	try {
		return JSON.stringify(value, null, 2);
	} catch {
		return String(value);
	}
}

function attachProposalyMetadata(
	error: NodeOperationError,
	metadata: ProposalyErrorMetadata,
): void {
	(error as { proposaly?: ProposalyErrorMetadata }).proposaly = metadata;
}

export function isRetryableProposalyError(error: unknown): boolean {
	const errorData = error as { proposaly?: ProposalyErrorMetadata };
	return !!errorData?.proposaly?.isRetryable;
}

export async function proposalyRequest<T = IDataObject>(
	context: ProposalyContext,
	options: ProposalyRequestOptions,
): Promise<T> {
	const credentials = await context.getCredentials('proposalyApi');
	const apiKey = credentials.apiKey as string;
	const baseUrl = credentials.url as string;

	if (!apiKey) {
		throw new NodeOperationError(
			context.getNode(),
			'The parameter "Proposaly API Key" has to be set!',
		);
	}

	// Destructure path separately to avoid passing it to IHttpRequestOptions
	const { path, ...restOptions } = options;

	const requestOptions: IHttpRequestOptions = {
		...restOptions,
		url: options.url ?? `${baseUrl}${path ?? ''}`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
			...options.headers,
		},
		json: true,
	};

	try {
		return await context.helpers.httpRequestWithAuthentication.call(
			context,
			'proposalyApi',
			requestOptions,
		);
	} catch (error) {
		const statusCode = getStatusCode(error);
		const errorCode = getErrorCode(error);
		const retryable = isRetryableError(statusCode, errorCode);
		const metadata: ProposalyErrorMetadata = {
			statusCode,
			code: errorCode,
			isRetryable: retryable,
		};

		if (error instanceof NodeOperationError) {
			attachProposalyMetadata(error, metadata);
			throw error;
		}

		const requestLabel = getRequestLabel(options);
		const hint = statusCode ? getStatusHint(statusCode) : 'Check your connection and URL.';
		const detailPayload = {
			request: requestLabel,
			statusCode,
			code: errorCode,
			message: (error as Error).message,
			response: getResponseBody(error),
		};

		const message = statusCode
			? `Proposaly API request failed (${requestLabel}). HTTP ${statusCode}. ${hint}`
			: errorCode
				? `Proposaly API request failed (${requestLabel}). Network error: ${errorCode}. ${hint}`
				: `Proposaly API request failed (${requestLabel}). ${hint}`;

		const nodeError = new NodeOperationError(context.getNode(), message, {
			description: safeStringify(detailPayload),
		});
		attachProposalyMetadata(nodeError, metadata);
		throw nodeError;
	}
}

export async function proposalyRequestAll<T>(
	context: ProposalyContext,
	path: string,
	qs: IDataObject = {},
): Promise<T[]> {
	let page: number | null = 1;
	let allItems: T[] = [];

	while (page !== null) {
		const response: PaginatedApiResponse<T> = await proposalyRequest(context, {
			method: 'GET',
			path,
			qs: {
				...qs,
				page,
			},
		});

		const items = Array.isArray(response) ? response : response.entities || [];
		allItems = allItems.concat(items);

		if (response.pagination && response.pagination.next_page) {
			page = response.pagination.next_page;
		} else {
			page = null;
		}
	}

	return allItems;
}
