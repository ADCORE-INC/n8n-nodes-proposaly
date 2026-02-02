type AnyObj = Record<string, unknown>;

/**
 * Remove null/undefined and empty strings from an object
 * @param obj - The object to compact
 * @returns The compacted object
 */
export function compact<T extends AnyObj>(obj: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(obj).filter(
			([, v]) => v !== undefined && v !== null && !(typeof v === 'string' && v.trim() === ''),
		),
	) as Partial<T>;
}
