import packageInfo from '../package.json';
import { MaterialYouPanel } from './classes/material-you-panel';

import { logStyles } from './models/constants/colors';
import { inputs } from './models/constants/inputs';
import { RenderTemplateError, RenderTemplateResult } from './models/interfaces';
import { getAsync, querySelectorAsync } from './utils/async';
import { setTheme, setThemeAll } from './utils/colors';
import { debugToast, getHomeAssistantMainAsync } from './utils/common';
import { setStyles } from './utils/styles';

async function main() {
	if (window.MaterialYouInit) {
		return;
	}
	window.MaterialYouInit = true;

	// Set styles on main window custom elements
	// Do this before anything else because it's time sensitive
	setStyles(window);

	console.info(
		`%c Material You Utilities v${packageInfo.version} `,
		logStyles(),
	);

	// Apply colors and styles on iframe when it's added
	const haMain = await getHomeAssistantMainAsync();
	const observer = new MutationObserver(async (mutations) => {
		for (const mutation of mutations) {
			for (const addedNode of mutation.addedNodes) {
				if (addedNode.nodeName == 'IFRAME') {
					const iframe = (await querySelectorAsync(
						haMain.shadowRoot as ShadowRoot,
						'iframe',
					)) as HTMLIFrameElement;
					const contentWindow = await getAsync(
						iframe,
						'contentWindow',
					);
					setStyles(contentWindow);

					const document = await getAsync(contentWindow, 'document');
					const body = await querySelectorAsync(document, 'body');
					setTheme(body);
				}
			}
		}
	});
	observer.observe(haMain.shadowRoot as ShadowRoot, {
		subtree: true,
		childList: true,
	});

	// Define Material You Panel custom element
	customElements.define('material-you-panel', MaterialYouPanel);

	// Set user theme colors
	const html = await querySelectorAsync(document, 'html');
	setTheme(html);

	// User inputs
	const userId = haMain.hass.user?.id;
	const colorInputs = [
		inputs.base_color.input,
		inputs.scheme.input,
		inputs.contrast.input,
		`${inputs.base_color.input}_${userId}`,
		`${inputs.scheme.input}_${userId}`,
		`${inputs.contrast.input}_${userId}`,
	].filter((entityId) => haMain.hass.states[entityId]);

	if (haMain.hass.user?.is_admin) {
		// Trigger on input change
		haMain.hass.connection.subscribeMessage(
			() => setThemeAll(),
			{
				type: 'subscribe_trigger',
				trigger: {
					platform: 'state',
					entity_id: colorInputs,
				},
			},
			{ resubscribe: true },
		);

		// Trigger on theme changed event
		haMain.hass.connection.subscribeEvents(
			() => setThemeAll(),
			'themes_updated',
		);

		// Trigger on set theme service call
		haMain.hass.connection.subscribeEvents((e: Record<string, any>) => {
			if (e?.data?.service == 'set_theme') {
				setTimeout(() => setThemeAll(), 1000);
			}
		}, 'call_service');
	} else {
		// Trigger on template change for sensors
		for (const entityId of colorInputs) {
			haMain.hass.connection.subscribeMessage(
				(msg: RenderTemplateResult | RenderTemplateError) => {
					if ('error' in msg) {
						console.error(msg.error);
						debugToast(msg.error);
					}
					setThemeAll();
				},
				{
					type: 'render_template',
					template: `{{ states("${entityId}") }}`,
					entity_ids: entityId,
					report_errors: true,
				},
			);
		}
	}
}

main();
