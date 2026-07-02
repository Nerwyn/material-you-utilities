import { huiRootHideNavbarLabels } from '../../css';
import { THEME_TOKEN } from '../../models/constants/theme';
import { IHandlerArguments } from '../../models/interfaces/Input';
import { isThemeValid } from '../common';
import { debugToast, mdLog } from '../logging';
import { applyStyleTag, loadStyles } from './styles';

const STYLE_ID = `${THEME_TOKEN}-navbar-labels`;

/** Hide the navigation bar labels */
export async function hideNavbarLabels(args: IHandlerArguments) {
	if (args.targets?.some((target) => target.nodeName.includes('CONFIG-CARD'))) {
		return;
	}

	try {
		if (isThemeValid()) {
			if (args.value == 'on') {
				showNavbarLabels();
				return;
			}

			const html = document.querySelector('html') as HTMLElement;
			applyStyleTag(html, STYLE_ID, loadStyles(huiRootHideNavbarLabels));

			mdLog(html, 'Navigation bar labels hidden.', true);
		} else {
			showNavbarLabels();
		}
	} catch (e) {
		console.error(e);
		debugToast(String(e));
		showNavbarLabels();
	}
}

async function showNavbarLabels() {
	const html = document.querySelector('html') as HTMLElement;
	const style = html?.querySelector(`#${STYLE_ID}`);
	if (style) {
		html?.removeChild(style);
		mdLog(html, 'Navigation bar labels unhidden.', true);
	}
}
