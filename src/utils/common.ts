import { argbFromHex, argbFromRgb } from '@material/material-color-utilities';
import { inputs } from '../models/constants/inputs';
import { THEME } from '../models/constants/theme';
import { HassElement } from '../models/interfaces';
import { InputField } from '../models/interfaces/Input';
import { getHomeAssistantMainAsync, querySelectorAsync } from './async';

/**
 * Build input helper entity ID from field and ID
 * @param {InputField} field Field to get entity ID for
 * @param {string} [id] Specific user or device ID to get entity ID for
 * @returns {string}
 */
export function getEntityId(field: InputField, id?: string): string {
	return `${inputs[field as InputField].domain}.${THEME}_${field}${id ? `_${id}` : ''}`
		.toLowerCase()
		.replace(/ |-/g, '_');
}

/**
 * Get the highest priority entity ID and its value for a given field
 * @param {InputField} field
 * @param {string} id
 * @returns { entityId: string; value: string | number }
 */
export function getEntityIdAndValue(
	field: InputField,
	id?: string,
): { entityId: string; value: string | number } {
	const hass = (document.querySelector('home-assistant') as HassElement).hass;

	const ids = [
		id,
		window.browser_mod?.browserID?.replace(/-/g, '_'),
		hass.user?.id,
		'',
	];
	const result = {
		entityId: '',
		value: '',
	};
	for (const id of ids) {
		if (id == undefined) {
			continue;
		}

		const entityId = getEntityId(field, id);
		const value = hass.states[entityId]?.state?.trim();

		if (value != undefined && value != 'unknown') {
			result.entityId = entityId;
			result.value = value;
			break;
		}
	}

	return result;
}

/**
 * Get theme color token
 * @param {string} color Material Dynamic Color key
 * @returns {string} Material Dynamic Color token
 */
export function getToken(color: string): string {
	return color.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Get targets to apply or remove theme colors to/from
 * @returns {HTMLElement[]} HTML Elements to apply/remove theme to/from
 */
export async function getTargets(): Promise<HTMLElement[]> {
	const targets: HTMLElement[] = [
		(await querySelectorAsync(document, 'html')) as HTMLElement,
	];

	// Add-ons and HACS iframe
	const ha = await getHomeAssistantMainAsync();
	const iframe = ha.shadowRoot
		?.querySelector('iframe')
		?.contentWindow?.document?.querySelector('body');
	if (iframe) {
		targets.push(iframe);
	}
	return targets;
}

/**
 * Retrieve color from styles and convert to ARGB number
 * @param {string} property CSS property name
 * @param {CSSStyleDeclaration} style computed CSS style
 * @returns {number} ARGB color
 */
export function getARGBColor(
	property: string,
	style: CSSStyleDeclaration,
): number {
	const color = style.getPropertyValue(property).trim();

	if (color.startsWith('#')) {
		return argbFromHex(color);
	}

	if (color.startsWith('rgb')) {
		const [r, g, b] = color
			.replace('rgb(', '')
			.replace('rgba(', '')
			.replace(')', '')
			.replace(/ /g, ',')
			.split(',')
			.map((c) => parseInt(c));
		return argbFromRgb(r, g, b);
	}

	return argbFromHex(inputs.base_color.default as string);
}
