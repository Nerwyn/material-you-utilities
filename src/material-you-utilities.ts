import packageInfo from '../package.json';
import { MaterialYouConfigCard } from './classes/material-you-config-card';
import { MaterialYouPanel } from './classes/material-you-panel';

import { THEME_NAME, THEME_TOKEN } from './models/constants/theme';
import {
	getAsync,
	getHomeAssistantMainAsync,
	handleWhenReady,
	querySelectorAsync,
} from './utils/async';
import {
	hideAppbar,
	hideNavbar,
	hideNavbarLabels,
	setBaseColorFromImage,
	setCardType,
	setCSSFromFile,
	setExplicitStyles,
	setStyles,
	setTheme,
	showAppbarTitle,
} from './utils/handlers';
import { hideNavrailLabels } from './utils/handlers/navrailLabels';
import { mdLog } from './utils/logging';
import { setupSubscriptions } from './utils/subscriptions';

async function main() {
	if (window.MaterialYouInit) {
		return;
	}
	window.MaterialYouInit = true;

	// Set styles on main window custom elements
	// Do this before anything else because it's time sensitive
	setStyles(window);
	setExplicitStyles();

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
					const handlers = [setTheme, setCardType, setCSSFromFile];
					for (const handler of handlers) {
						await handler(args);
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
					const handlers = [
						setBaseColorFromImage,
						setTheme,
						setCardType,
						setCSSFromFile,
						hideAppbar,
						showAppbarTitle,
						hideNavbar,
						hideNavbarLabels,
						hideNavrailLabels,
					];
					for (const handler of handlers) {
						await handler(args);
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
	setOnFirstLoad();

	// Call handlers on visibility change
	window.addEventListener('visibilitychange', async () => {
		if (!document.hidden) {
			const handlers = [setTheme, setCardType, setCSSFromFile];
			for (const handler of handlers) {
				await handler({});
			}
		}
	});

	setupSubscriptions({});

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
	setupThemeChangeSubscriptions();
}

main();
