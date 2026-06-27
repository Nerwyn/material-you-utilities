import { unset } from '.';
import { inputs } from '../../models/constants/inputs';
import { THEME_TOKEN } from '../../models/constants/theme';
import { HassElement } from '../../models/interfaces';
import { IHandlerArguments } from '../../models/interfaces/Input';
import { getEntityIdAndValue, getTargets, isThemeValid } from '../common';
import { debugToast } from '../logging';
import { harmonize } from './harmonize';
import { applyStyleTag, loadStyles } from './styles';

const STYLE_ID = `${THEME_TOKEN}-user-styles`;

export async function setCSSFromFile(args: IHandlerArguments) {
	const targets = args.targets ?? (await getTargets());

	try {
		if (isThemeValid()) {
			// Do not fetch if no path/url is set
			const url = (args.value || inputs.css_file.default) as string;
			if (!url) {
				unsetCSSFromFile(args);
				return;
			}

			// Get full URL if local path given
			let r: Response;
			if (url.includes('://')) {
				r = await fetch(url, { mode: 'cors' });
			} else {
				const hass = (document.querySelector('home-assistant') as HassElement)
					.hass;
				r = await hass.fetchWithAuth(url, { mode: 'cors' });
			}
			if (!r.ok) {
				throw new Error(await r.text());
			}
			const styles = loadStyles(await r.text());

			// Add style link to targets
			for (const target of targets) {
				applyStyleTag(target, STYLE_ID, styles);
			}

			// Harmonize if styles includes changes to primary color
			if (
				styles.includes('--primary-color') ||
				styles.includes('--md-sys-color-primary')
			) {
				await harmonize({
					...args,
					...getEntityIdAndValue('harmonize', args.id),
				});
			}
		} else {
			await unsetCSSFromFile(args);
		}
	} catch (e) {
		console.error(e);
		debugToast(String(e));
		unsetCSSFromFile(args);
	}
}

async function unsetCSSFromFile(args: IHandlerArguments) {
	await unset(args, STYLE_ID, 'CSS styles from file removed.');
	await harmonize({ ...args, ...getEntityIdAndValue('harmonize', args.id) });
}
