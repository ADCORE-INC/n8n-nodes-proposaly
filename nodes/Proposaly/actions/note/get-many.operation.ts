import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Fields } from '../../constants';
import { fetchNotesList } from '../../notes';
import { toItems } from '../../shape';

export async function getManyNotesOperation(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const parentId = context.getNodeParameter(Fields.ParentId, itemIndex) as string;
	const source = context.getNodeParameter(Fields.NoteSource, itemIndex, '') as string;
	const search = context.getNodeParameter(Fields.NoteSearch, itemIndex, '') as string;
	const returnAll = context.getNodeParameter(Fields.ReturnAll, itemIndex, false) as boolean;
	const limit = returnAll
		? undefined
		: (context.getNodeParameter(Fields.Limit, itemIndex, 50) as number);

	const notes = await fetchNotesList(context, parentId, {
		source: source || undefined,
		search: search || undefined,
	});

	return toItems(limit === undefined ? notes : notes.slice(0, limit), itemIndex);
}
