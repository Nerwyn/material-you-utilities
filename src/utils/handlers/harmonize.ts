import {
	argbFromHex,
	Blend,
	hexFromArgb,
} from '@material/material-color-utilities';
import { applyStyleTag, buildStylesString, unset } from '.';
import { paletteColors, semanticColors } from '../../models/constants/colors';
import { THEME_TOKEN } from '../../models/constants/theme';
import { IHandlerArguments } from '../../models/interfaces/Input';
import { getARGBColor, getTargets, getToken, isThemeValid } from '../common';
import { debugToast, mdLog } from '../logging';
import { setPalette, unsetPalette } from './palettes';

const STYLE_ID = `${THEME_TOKEN}-harmonized-colors`;

/**
 * Harmonize semantic colors to be closer to the base color
 * https://m3.material.io/blog/dynamic-color-harmony
 */
export async function harmonize(args: IHandlerArguments) {
	const targets = args.targets ?? (await getTargets());

	try {
		if (isThemeValid()) {
			if (args.value != 'on') {
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
				applyStyleTag(target, STYLE_ID, buildStylesString(styles));
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
