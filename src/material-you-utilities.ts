import packageInfo from '../package.json';
import { MaterialYouConfigCard } from './classes/material-you-config-card';
import { MaterialYouPanel } from './classes/material-you-panel';
import { inputs } from './models/constants/inputs';

import { THEME_NAME, THEME_TOKEN } from './models/constants/theme';
import { InputField } from './models/interfaces/Input';
import {
	getAsync,
	getHomeAssistantMainAsync,
	handleWhenReady,
	querySelectorAsync,
} from './utils/async';
import { getEntityIdAndValue } from './utils/common';
import { setExplicitStyles, setStyles, setTheme } from './utils/handlers';
import { mdLog } from './utils/logging';
import { setupSubscriptions } from './utils/subscriptions';

async function main() {
	if (window.MaterialYouInit) {
		return;
	}
	window.MaterialYouInit = true;

	const funcs = [];

	// Set styles on main window custom elements
	// Do this before anything else because it's time sensitive
	funcs.push(setStyles(window));
	funcs.push(setExplicitStyles());

	mdLog(
		document.querySelector('html') as HTMLElement,
		`${THEME_NAME} Utilities v${packageInfo.version}`,
	);

	// Call handlers on iframe when it's added
	const haMain = await getHomeAssistantMainAsync();
	const observer = new MutationObserver(async (mutations) => {
		for (const mutation of mutations) {
			for (const addedNode of mutation.addedNodes) {
				if (addedNode.nodeName == 'IFRAME') {
					const iframe = (await querySelectorAsync(
						haMain.shadowRoot as ShadowRoot,
						'iframe',
					)) as HTMLIFrameElement;
					const contentWindow = await getAsync(iframe, 'contentWindow');
					setStyles(contentWindow as typeof globalThis);

					const document = (await getAsync(
						contentWindow as Node,
						'document',
					)) as Document;
					const body = await querySelectorAsync(document, 'body');
					const args = { targets: [body] };
					const fields: InputField[] = ['base_color', 'card_type', 'css_file'];
					for (const field of fields) {
						await inputs[field].handler({
							...args,
							...getEntityIdAndValue(field),
						});
					}
				}
			}
		}
	});
	observer.observe(haMain.shadowRoot as ShadowRoot, {
		subtree: true,
		childList: true,
	});

	// Define Material You Panel custom element
	customElements.define(`${THEME_TOKEN}-config-card`, MaterialYouConfigCard);
	customElements.define(`${THEME_TOKEN}-panel`, MaterialYouPanel);

	// Call handlers on first load
	const setOnFirstLoad = async () => {
		let theme = '';

		handleWhenReady(
			async () => {
				if (theme.includes(THEME_NAME)) {
					const html = await querySelectorAsync(document, 'html');
					const args = { targets: [html] };
					const fields: InputField[] = [
						'image_url',
						'base_color',
						'card_type',
						'css_file',
						'appbar',
						'appbar_title',
						'navbar',
						'navbar_labels',
						'navrail_labels',
					];
					for (const field of fields) {
						await inputs[field].handler({
							...args,
							...getEntityIdAndValue(field),
						});
					}

					// Fix html background color
					const fixBackgroundColor = () => {
						html.style.setProperty(
							'background-color',
							'var(--md-sys-color-surface)',
						);
					};
					fixBackgroundColor();
					const observe = () => {
						observer.observe(html, {
							attributes: true,
							attributeFilter: ['style'],
						});
					};
					const observer = new MutationObserver(() => {
						observer.disconnect();
						fixBackgroundColor();
						observe();
					});
					observe();
				}
			},
			async () => {
				const hass = (await getHomeAssistantMainAsync()).hass;
				theme = hass?.themes?.theme;
				return Boolean(theme);
			},
		);
	};
	funcs.push(setOnFirstLoad());

	// Call handlers on visibility change
	window.addEventListener('visibilitychange', async () => {
		if (!document.hidden) {
			const fields: InputField[] = ['base_color', 'card_type', 'css_file'];
			for (const field of fields) {
				await inputs[field].handler({
					...getEntityIdAndValue(field),
				});
			}
		}
	});

	funcs.push(setupSubscriptions({}));

	const setupThemeChangeSubscriptions = async () => {
		handleWhenReady(
			async () => {
				const hass = (await getHomeAssistantMainAsync()).hass;
				if (hass.user?.is_admin) {
					// Trigger on set theme service call
					hass.connection.subscribeEvents(
						(e: Record<string, Record<string, string>>) => {
							if (e?.data?.service == 'set_theme') {
								setTimeout(() => setTheme({}), 1000);
							}
						},
						'call_service',
					);
				}
			},
			async () => {
				const hass = (await getHomeAssistantMainAsync()).hass;
				const userId = hass.user?.id;
				return hass.connection.connected && Boolean(userId);
			},
		);
	};
	funcs.push(setupThemeChangeSubscriptions());

	await Promise.all(funcs);
}

await main();
