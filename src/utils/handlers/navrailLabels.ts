import { haSidebarHideNavrailLabels } from '../../css';
import { inputs } from '../../models/constants/inputs';
import { THEME_NAME, THEME_TOKEN } from '../../models/constants/theme';
import { HassElement } from '../../models/interfaces';
import { IHandlerArguments } from '../../models/interfaces/Input';
import { getEntityIdAndValue } from '../common';
import { debugToast, mdLog } from '../logging';
import { applyStyles, loadStyles } from './styles';

const STYLE_ID = `${THEME_TOKEN}-navrail-labels`;

/** Hide the navigation rail labels */
export async function hideNavrailLabels(args: IHandlerArguments) {
	if (args.targets?.some((target) => target.nodeName.includes('CONFIG-CARD'))) {
		return;
	}

	const hass = (document.querySelector('home-assistant') as HassElement).hass;

	try {
		const themeName = hass?.themes?.theme ?? '';
		if (themeName.includes(THEME_NAME)) {
			const value =
				getEntityIdAndValue('navrail_labels', args.id).value ||
				inputs.navrail_labels.default;
			if (value == 'on') {
				showNavrailLabels();
				return;
			}

			const html = document.querySelector('html') as HTMLElement;
			applyStyles(html, STYLE_ID, loadStyles(haSidebarHideNavrailLabels));

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
