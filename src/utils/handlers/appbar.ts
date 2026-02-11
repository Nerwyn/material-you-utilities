import { huiRootHideAppbar } from '../../css';
import { inputs } from '../../models/constants/inputs';
import { THEME_NAME, THEME_TOKEN } from '../../models/constants/theme';
import { HassElement } from '../../models/interfaces';
import { IHandlerArguments } from '../../models/interfaces/Input';
import { getEntityIdAndValue } from '../common';
import { debugToast, mdLog } from '../logging';
import { showAppbarTitle } from './appbarTitle';
import { applyStyles, loadStyles } from './styles';

const STYLE_ID = `${THEME_TOKEN}-appbar`;

/** Hide the header */
export async function hideAppbar(args: IHandlerArguments) {
	if (args.targets?.some((target) => target.nodeName.includes('CONFIG-CARD'))) {
		return;
	}

	const hass = (document.querySelector('home-assistant') as HassElement).hass;

	try {
		const themeName = hass?.themes?.theme ?? '';
		if (themeName.includes(THEME_NAME)) {
			const value =
				getEntityIdAndValue('appbar', args.id).value || inputs.appbar.default;
			if (value == 'on') {
				showAppbar();
				showAppbarTitle(args);
				return;
			}

			const html = document.querySelector('html') as HTMLElement;
			applyStyles(html, STYLE_ID, loadStyles(huiRootHideAppbar));

			mdLog(html, 'Application bar hidden.', true);
		} else {
			showAppbar();
		}
	} catch (e) {
		console.error(e);
		debugToast(String(e));
		showAppbar();
	}

	showAppbarTitle(args);
}

async function showAppbar() {
	const html = document.querySelector('html') as HTMLElement;
	const style = html?.querySelector(`#${STYLE_ID}`);
	if (style) {
		html?.removeChild(style);
		mdLog(html, 'Application bar unhidden.', true);
	}
}
