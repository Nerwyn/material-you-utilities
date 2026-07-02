import { huiRootHideAppbar } from '../../css';
import { THEME_TOKEN } from '../../models/constants/theme';
import { IHandlerArguments } from '../../models/interfaces/Input';
import { isThemeValid } from '../common';
import { debugToast, mdLog } from '../logging';
import { applyStyleTag, loadStyles } from './styles';

const STYLE_ID = `${THEME_TOKEN}-appbar`;

/** Hide the header */
export async function hideAppbar(args: IHandlerArguments) {
	if (args.targets?.some((target) => target.nodeName.includes('CONFIG-CARD'))) {
		return;
	}

	try {
		if (isThemeValid()) {
			if (args.value == 'on') {
				showAppbar();
				return;
			}

			const html = document.querySelector('html') as HTMLElement;
			applyStyleTag(html, STYLE_ID, loadStyles(huiRootHideAppbar));

			mdLog(html, 'Application bar hidden.', true);
		} else {
			showAppbar();
		}
	} catch (e) {
		console.error(e);
		debugToast(String(e));
		showAppbar();
	}
}

async function showAppbar() {
	const html = document.querySelector('html') as HTMLElement;
	const style = html?.querySelector(`#${STYLE_ID}`);
	if (style) {
		html?.removeChild(style);
		mdLog(html, 'Application bar unhidden.', true);
	}
}
