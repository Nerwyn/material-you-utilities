import { unset } from '.';
import { cardTypes } from '../../css';
import { inputs } from '../../models/constants/inputs';
import { THEME_NAME, THEME_TOKEN } from '../../models/constants/theme';
import { HassElement } from '../../models/interfaces';
import { IHandlerArguments } from '../../models/interfaces/Input';
import { getTargets } from '../common';
import { debugToast, mdLog } from '../logging';
import { applyStyleTag, loadStyles } from './styles';

const STYLE_ID = `${THEME_TOKEN}-card-type`;

/** Change ha-card styles to match the selected card type */
export async function setCardType(args: IHandlerArguments) {
	const hass = (document.querySelector('home-assistant') as HassElement).hass;
	const targets = args.targets ?? (await getTargets());

	try {
		const themeName = hass?.themes?.theme ?? '';
		if (themeName.includes(THEME_NAME)) {
			const value = args.value || inputs.card_type.default;
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
