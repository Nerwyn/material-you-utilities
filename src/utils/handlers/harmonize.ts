import {
	argbFromHex,
	Blend,
	hexFromArgb,
} from '@material/material-color-utilities';
import { applyStyles, buildStylesString, unset } from '.';
import { paletteColors, semanticColors } from '../../models/constants/colors';
import { inputs } from '../../models/constants/inputs';
import { THEME_NAME, THEME_TOKEN } from '../../models/constants/theme';
import { HassElement } from '../../models/interfaces';
import { IHandlerArguments } from '../../models/interfaces/Input';
import {
	getARGBColor,
	getEntityIdAndValue,
	getTargets,
	getToken,
} from '../common';
import { debugToast, mdLog } from '../logging';
import { setPalette, unsetPalette } from './palettes';

const STYLE_ID = `${THEME_TOKEN}-harmonized-colors`;

/**
 * Harmonize semantic colors to be closer to the base color
 * https://m3.material.io/blog/dynamic-color-harmony
 */
export async function harmonize(args: IHandlerArguments) {
	const hass = (document.querySelector('home-assistant') as HassElement).hass;
	const targets = args.targets ?? (await getTargets());

	try {
		const themeName = hass?.themes?.theme ?? '';
		if (themeName.includes(THEME_NAME)) {
			const value =
				getEntityIdAndValue('harmonize', args.id).value ||
				inputs.harmonize.default;

			if (value != 'on') {
				dissonance(args);
				return;
			}

			const baseColor = getARGBColor(
				'--primary-color',
				getComputedStyle(targets[0]),
			);
			const styles: Record<string, string> = {};
			for (const color in semanticColors) {
				const harmonizedColor = hexFromArgb(
					Blend.harmonize(argbFromHex(semanticColors[color]), baseColor),
				);

				const token = getToken(color);
				styles[`--md-sys-color-${token}`] = harmonizedColor;
			}

			for (const target of targets) {
				applyStyles(target, STYLE_ID, buildStylesString(styles));
			}

			await setPalette(args, paletteColors);

			mdLog(targets[0], 'Semantic colors harmonized.', true);
		} else {
			await dissonance(args);
		}
	} catch (e) {
		console.error(e);
		debugToast(String(e));
		dissonance(args);
	}
}

async function dissonance(args: IHandlerArguments) {
	await unset(args, STYLE_ID, 'Harmonized colors removed.');
	await unsetPalette(args);
}
