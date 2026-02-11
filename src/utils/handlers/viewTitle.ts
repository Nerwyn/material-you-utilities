import { huiRootShowViewTitle } from '../../css';
import { inputs } from '../../models/constants/inputs';
import { THEME_NAME, THEME_TOKEN } from '../../models/constants/theme';
import { HassElement } from '../../models/interfaces';
import { IHandlerArguments } from '../../models/interfaces/Input';
import { getEntityIdAndValue } from '../common';
import { debugToast, mdLog } from '../logging';
import { applyStyles, loadStyles } from './styles';

const STYLE_ID = `${THEME_TOKEN}-view-title`;

/** Show the view title */
export async function showViewTitle(args: IHandlerArguments) {
	if (args.targets?.some((target) => target.nodeName.includes('CONFIG-CARD'))) {
		return;
	}

	const hass = (document.querySelector('home-assistant') as HassElement)?.hass;

	try {
		const themeName = hass?.themes?.theme ?? '';
		if (themeName.includes(THEME_NAME)) {
			const value =
				getEntityIdAndValue('view_title', args.id).value ||
				inputs.view_title.default;
			const appbar =
				getEntityIdAndValue('appbar', args.id).value || inputs.appbar.default;
			if (value == 'off' || appbar == 'off') {
				hideViewTitle();
				return;
			}

			const html = document.querySelector('html') as HTMLElement;
			applyStyles(html, STYLE_ID, loadStyles(huiRootShowViewTitle));

			mdLog(html, 'View title shown.', true);
		} else {
			hideViewTitle();
		}
	} catch (e) {
		console.error(e);
		debugToast(String(e));
		hideViewTitle();
	}
}

async function hideViewTitle() {
	const html = document.querySelector('html') as HTMLElement;
	const style = html?.querySelector(`#${STYLE_ID}`);
	if (style) {
		html?.removeChild(style);
		mdLog(html, 'View title hidden.', true);
	}
}
