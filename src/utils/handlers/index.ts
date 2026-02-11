import { IHandlerArguments } from '../../models/interfaces/Input';
import { getTargets } from '../common';
import { mdLog } from '../logging';

export * from './appbar';
export * from './appbarTitle';
export * from './cards';
export * from './css';
export * from './harmonize';
export * from './image';
export * from './navbar';
export * from './navbarLabels';
export * from './navrailLabels';
export * from './styles';
export * from './theme';

/**
 * Remove style tags from targets
 * @param {IHandlerArguments} args Handler arguments with targets
 * @param {string} id ID of the style tag to remove
 */
export async function unset(args: IHandlerArguments, id: string, log?: string) {
	const targets = args.targets ?? (await getTargets());
	let removed = false;
	for (const target0 of targets) {
		const target = target0.shadowRoot || target0;
		const style = target.querySelector(`#${id}`);
		if (style) {
			removed = true;
			target.removeChild(style);
		}
	}
	if (removed && log) {
		mdLog(targets[0], log, true);
	}
}
