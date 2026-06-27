import {
	hexFromArgb,
	QuantizerCelebi,
	Score,
} from '@material/material-color-utilities';
import { HassElement } from '../../models/interfaces';
import { IHandlerArguments } from '../../models/interfaces/Input';
import { getEntityIdAndValue, isThemeValid } from '../common';
import { debugToast } from '../logging';

/**
 * Convert RGBA 8-bit values to ARGB integer
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @param {number} alpha
 * @returns {number}
 */
function argbFromRgba(
	red: number,
	green: number,
	blue: number,
	alpha: number,
): number {
	return (
		((alpha << 24) |
			((red & 255) << 16) |
			((green & 255) << 8) |
			(blue & 255)) >>>
		0
	);
}

/**
 * Generate and set a theme base color from an image
 */
export async function setBaseColorFromImage(args: IHandlerArguments) {
	const hass = (document.querySelector('home-assistant') as HassElement).hass;

	try {
		if (isThemeValid()) {
			// Do not fetch if no path/url is set
			let url = args.value as string;
			if (!url) {
				return;
			}

			// Create image and retrieve image locally or from external source
			const xy = 128;
			const img = new Image(xy, xy);
			img.crossOrigin = 'anonymous';
			if (url.includes('://')) {
				img.src = url;
			} else {
				const r = await hass.fetchWithAuth(url, { mode: 'cors' });
				if (!r.ok) {
					throw new Error(await r.text());
				}

				const blob = await r.blob();
				img.src = URL.createObjectURL(blob);
				url = r.url;
			}
			await new Promise((resolve) => {
				img.onload = resolve;
			});

			// Create canvas and draw image to it
			const canvas = document.createElement('canvas');
			canvas.height = xy;
			canvas.width = xy;
			const ctx = canvas.getContext('2d');
			ctx?.drawImage(img, 0, 0, xy, xy);

			// Get image data and convert to ARGB array
			const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
			const pixels = imageData?.data ?? [];
			URL.revokeObjectURL(img.src);
			const a = [];
			for (let i = 0; i < pixels.length - 3; i += 4) {
				a.push(
					argbFromRgba(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]),
				);
			}

			// Quantize image and score colors
			const quantized = QuantizerCelebi.quantize(a, 128);
			const colors = Score.score(quantized);

			// Get color index from query string
			let i = 0;
			const params = new URL(url).searchParams;
			if (params.has('i')) {
				i = parseInt(params.get('i') as string);
				if (isNaN(i)) {
					return;
				}
				i = Math.max(Math.min(i, colors.length - 1), 0);
			}

			// Set base color
			const baseColor = hexFromArgb(colors[i]);
			const output = getEntityIdAndValue(
				'image_url',
				args.id,
			).entityId?.replace('image_url', 'base_color');
			hass.callService('input_text', 'set_value', {
				entity_id: output,
				value: baseColor,
			});
		}
	} catch (e) {
		console.error(e);
		debugToast(String(e));
	}
}
