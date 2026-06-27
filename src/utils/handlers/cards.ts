import { unset } from '.';
import { cardTypes } from '../../css';
import { THEME_TOKEN } from '../../models/constants/theme';
import { IHandlerArguments } from '../../models/interfaces/Input';
import { getTargets, isThemeValid } from '../common';
import { debugToast, mdLog } from '../logging';
import { applyStyleTag, loadStyles } from './styles';

const STYLE_ID = `${THEME_TOKEN}-card-type`;

/** Change ha-card styles to match the selected card type */
export async function setCardType(args: IHandlerArguments) {
	const targets = args.targets ?? (await getTargets());

	try {
		if (isThemeValid()) {
			const value = args.value as keyof typeof cardTypes;
			if (!(value in cardTypes)) {
				unsetCardType(args);
				return;
			}

			for (const target of targets) {
				applyStyleTag(target, STYLE_ID, loadStyles(cardTypes[value]));
			}

			mdLog(targets[0], `Material design card type set to ${value}.`, true);
		} else {
			await unsetCardType(args);
		}
	} catch (e) {
		console.error(e);
		debugToast(String(e));
		await unsetCardType(args);
	}
}

async function unsetCardType(args: IHandlerArguments) {
	await unset(args, STYLE_ID, 'Material design card type unset.');
}
