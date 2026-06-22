import { hexFromArgb, TonalPalette } from '@material/material-color-utilities';
import { unset } from '.';
import { THEME_TOKEN } from '../../models/constants/theme';
import { IHandlerArguments } from '../../models/interfaces/Input';
import { getARGBColor, getTargets, getToken } from '../common';
import { debugToast } from '../logging';
import { applyStyleTag, buildStylesString } from './styles';

const TONES = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95];
const STYLE_ID = `${THEME_TOKEN}-palettes`;

/* Set palette based on color */
export async function setPalette(args: IHandlerArguments, colors: string[]) {
	const targets = args.targets ?? (await getTargets());

	try {
		const style = getComputedStyle(targets[0]);
		const styles: Record<string, string> = {};
		for (const color of colors) {
			let token = `--${getToken(color)}-color`;
			const baseColor = getARGBColor(token, style);
			const palette = TonalPalette.fromInt(baseColor);
			token = `--md-sys-color-${getToken(color)}`;
			for (const tone of TONES) {
				const prop = `${token}-${tone.toString().padStart(2, '0')}`;
				const hex = hexFromArgb(palette.tone(tone));
				styles[prop] = hex;
			}
		}

		for (const target of targets) {
			applyStyleTag(target, STYLE_ID, buildStylesString(styles));
		}
	} catch (e) {
		console.error(e);
		debugToast(String(e));
		await unsetPalette(args, !(colors.length == 1 && colors[0] == 'primary'));
	}
}

/* Remove palette */
export async function unsetPalette(
	args: IHandlerArguments,
	resetPrimary = true,
) {
	await unset(args, STYLE_ID);
	if (resetPrimary) {
		await setPalette(args, ['primary']);
	}
}
