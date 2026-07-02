import { huiRootShowAppbarTitle } from '../../css';
import { THEME_TOKEN } from '../../models/constants/theme';
import { IHandlerArguments } from '../../models/interfaces/Input';
import { getEntityIdAndValue, isThemeValid } from '../common';
import { debugToast, mdLog } from '../logging';
import { applyStyleTag, loadStyles } from './styles';

const STYLE_ID = `${THEME_TOKEN}-view-title`;

/** Show the view title */
export async function showAppbarTitle(args: IHandlerArguments) {
	if (args.targets?.some((target) => target.nodeName.includes('CONFIG-CARD'))) {
		return;
	}

	try {
		if (isThemeValid()) {
			const appbar = getEntityIdAndValue('appbar', args.id).value;
			if (args.value == 'off' || appbar == 'off') {
				hideAppbarTitle();
				return;
			}

			const html = document.querySelector('html') as HTMLElement;
			applyStyleTag(html, STYLE_ID, loadStyles(huiRootShowAppbarTitle));

			mdLog(html, 'View title shown.', true);
		} else {
			hideAppbarTitle();
		}
	} catch (e) {
		console.error(e);
		debugToast(String(e));
		hideAppbarTitle();
	}
}

async function hideAppbarTitle() {
	const html = document.querySelector('html') as HTMLElement;
	const style = html?.querySelector(`#${STYLE_ID}`);
	if (style) {
		html?.removeChild(style);
		mdLog(html, 'View title hidden.', true);
	}
}
