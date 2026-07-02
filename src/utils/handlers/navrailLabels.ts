import { haSidebarHideNavrailLabels } from '../../css';
import { THEME_TOKEN } from '../../models/constants/theme';
import { IHandlerArguments } from '../../models/interfaces/Input';
import { isThemeValid } from '../common';
import { debugToast, mdLog } from '../logging';
import { applyStyleTag, loadStyles } from './styles';

const STYLE_ID = `${THEME_TOKEN}-navrail-labels`;

/** Hide the navigation rail labels */
export async function hideNavrailLabels(args: IHandlerArguments) {
	if (args.targets?.some((target) => target.nodeName.includes('CONFIG-CARD'))) {
		return;
	}

	try {
		if (isThemeValid()) {
			if (args.value == 'on') {
				showNavrailLabels();
				return;
			}

			const html = document.querySelector('html') as HTMLElement;
			applyStyleTag(html, STYLE_ID, loadStyles(haSidebarHideNavrailLabels));

			mdLog(html, 'Navigation rail labels hidden.', true);
		} else {
			showNavrailLabels();
		}
	} catch (e) {
		console.error(e);
		debugToast(String(e));
		showNavrailLabels();
	}
}

async function showNavrailLabels() {
	const html = document.querySelector('html') as HTMLElement;
	const style = html?.querySelector(`#${STYLE_ID}`);
	if (style) {
		html?.removeChild(style);
		mdLog(html, 'Navigation bar labels unhidden.', true);
	}
}
