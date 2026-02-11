import { elements, implicitElements } from '../../css';
import { inputs } from '../../models/constants/inputs';
import { THEME_NAME, THEME_TOKEN } from '../../models/constants/theme';
import { HassElement } from '../../models/interfaces';
import {
	getHomeAssistantMainAsync,
	handleWhenReady,
	querySelectorAsync,
} from '../async';
import { getEntityIdAndValue } from '../common';

// Theme check variables
let theme = '';
let shouldSetStyles = false;

/**
 * Check if theme is a "Material You" variant and set should set styles flag
 */
function checkTheme() {
	if (!theme) {
		const ha = document.querySelector('home-assistant') as HassElement;
		theme = ha?.hass?.themes?.theme;
		if (theme) {
			shouldSetStyles =
				theme.includes(THEME_NAME) &&
				(getEntityIdAndValue('styles').value || inputs.styles.default) == 'on';
		}
	}
}

/**
 * Check if styles exist, returning them if they do
 * @param {HTMLElement} element
 * @returns {HTMLStyleElement}
 */
function hasStyles(element: HTMLElement): HTMLStyleElement {
	return element.shadowRoot?.getElementById(THEME_TOKEN) as HTMLStyleElement;
}

/**
 * Convert styles to string and add !important to all styles
 * @param {string} styles CSS styles imported from file
 * @returns {string} styles converted to string and all set to !important
 */
export function loadStyles(styles: string): string {
	// Ensure new styles override default styles
	let importantStyles = styles
		.toString()
		.replace(/ !important/g, '')
		.replace(/;\n/g, ' !important;\n');

	// Remove !important from keyframes
	// Initial check to avoid expensive regex for most user styles
	if (importantStyles.includes('@keyframes')) {
		const keyframeses = importantStyles.match(
			/@keyframes\s.*?\s{(.|\n)*?}\n}/g,
		);
		for (const keyframes of keyframeses ?? []) {
			importantStyles = importantStyles.replace(
				keyframes,
				keyframes.replace(/ !important/g, ''),
			);
		}
	}

	// Remove !important from other at-rules
	if (importantStyles.includes('@')) {
		const atRules = importantStyles.match(
			/@(import|charset|layer|namespace)\s.*?;/g,
		);
		for (const atRule of atRules ?? []) {
			importantStyles = importantStyles.replace(
				atRule,
				atRule.replace(/ !important/g, ''),
			);
		}
	}

	return importantStyles;
}

/**
 * Build styles tag textContent string from object
 * @param {Record<string, string>} styles
 * @returns {string}
 */
export function buildStylesString(styles: Record<string, string>): string {
	return `:host,html,body,ha-card{${loadStyles(
		Object.entries(styles)
			.map(([key, value]) => `${key}: ${value};`)
			.join('\n'),
	)}}`;
}

/**
 * Apply styles to custom elements
 * @param {HTMLElement} element
 */
function applyStylesToShadowRoot(element: HTMLElement) {
	checkTheme();
	const shadowRoot = element.shadowRoot;
	if (shouldSetStyles && shadowRoot && !hasStyles(element)) {
		applyStyles(
			shadowRoot,
			THEME_TOKEN,
			loadStyles(
				elements[element.nodeName.toLowerCase()] || elements['hui-card'],
			),
		);
	}
}

export function applyStyles(
	target: HTMLElement | ShadowRoot,
	id: string,
	styles: string,
) {
	target = (target as HTMLElement).shadowRoot || target;
	let style = target.querySelector(`#${id}`);
	if (!style) {
		style = document.createElement('style');
		style.id = id;
		target.appendChild(style);
	}
	style.textContent = styles;
}

const observeAll = {
	childList: true,
	subtree: true,
	characterData: true,
	attributes: true,
};

const HUI_CARD_CHILD_REGEX = /^HUI-.*-CARD$/;

/**
 * Apply styles to custom elements when a mutation is observed and the shadow-root is present
 * @param {HTMLElement} element
 */
function observeThenApplyStyles(element: HTMLElement) {
	const onObserve = (el: HTMLElement) => {
		// No need to continue observing
		if (hasStyles(el)) {
			observer.disconnect();
			return;
		}

		if (el.shadowRoot) {
			// Shadow-root exists and is populated, apply styles
			if (el.shadowRoot.children.length) {
				applyStylesToShadowRoot(el);
				observer.disconnect();
				return;
			}

			// Shadow-root exists but is empty, observe it
			observer.observe(el.shadowRoot, observeAll);
		}
	};

	const observer = new MutationObserver(() => {
		onObserve(element);

		// Observe and apply styles to hui-card children
		if (element.nodeName == 'HUI-CARD') {
			for (const child of element.children) {
				if (HUI_CARD_CHILD_REGEX.test(child.nodeName)) {
					observer.observe(child as HTMLElement, observeAll);
					onObserve(child as HTMLElement);
				}
			}
		}
	});

	observer.observe(element, observeAll);
	onObserve(element);
}

/**
 * Apply styles to custom elements on a timeout
 * @param {HTMLElement} element
 */
function applyStylesOnTimeout(element: HTMLElement) {
	handleWhenReady(
		() => {
			applyStylesToShadowRoot(element);
		},
		() => Boolean(element.shadowRoot?.children.length),
	);
}

const definedElements = new Set<string>();

/**
 * Modify targets custom element registry define function to intercept constructors to use custom styles
 * Style are redundantly added in multiple places to ensure speed and consistency
 * @param {typeof globalThis} target
 */
export async function setStyles(target: typeof globalThis) {
	// Patch custom elements registry define function to inject styles
	const define = target.CustomElementRegistry.prototype.define;
	target.CustomElementRegistry.prototype.define = function (
		name,
		constructor,
		options,
	) {
		if (implicitElements[name]) {
			class PatchedElement extends constructor {
				constructor(...args: unknown[]) {
					super(...args);

					// Most efficient
					observeThenApplyStyles(this);

					// Most coverage
					applyStylesOnTimeout(this);
				}
			}

			constructor = PatchedElement;
		}

		definedElements.add(name);
		return define.call(this, name, constructor, options);
	};

	// Update already defined element constructors
	for (const element in implicitElements) {
		target.customElements.whenDefined(element).then((cls) => {
			if (!definedElements.has(element)) {
				const updated = cls.prototype.updated;
				class PatchedElement extends cls {
					updated(args: unknown) {
						updated?.call(this, args);

						if (this.shadowRoot && !hasStyles(this)) {
							// Most efficient
							observeThenApplyStyles(this);

							// Most coverage
							applyStylesOnTimeout(this);
						}
					}
				}

				cls.prototype.updated = PatchedElement.prototype.updated;
			}
		});
	}
}

/**
 * Explicitly set styles to top level elements
 */
export async function setExplicitStyles() {
	handleWhenReady(
		async () => {
			if (shouldSetStyles) {
				const haMain = await getHomeAssistantMainAsync();
				const ha = await querySelectorAsync(document, 'home-assistant');
				const haDrawer = await querySelectorAsync(
					haMain.shadowRoot as ShadowRoot,
					'ha-drawer',
				);
				applyStylesToShadowRoot(ha);
				applyStylesToShadowRoot(haMain);
				applyStylesToShadowRoot(haDrawer);
			}
		},
		() => {
			checkTheme();
			return Boolean(theme);
		},
	);
}
