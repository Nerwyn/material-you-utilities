import { css, html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import packageInfo from '../../package.json';
import { HomeAssistant } from '../models/interfaces';
import './material-you-config-card';

import { THEME, THEME_NAME } from '../models/constants/theme';
import {
	buildAlertBox,
	createLabelRegistryEntry,
	fetchLabelRegistry,
} from '../utils/panel';

export class MaterialYouPanel extends LitElement {
	@property() hass!: HomeAssistant;
	@property() narrow!: boolean;
	@property() route!: object;
	@property() panel!: object;

	@state() tabBarIndex: number = 0;
	tabs = ['you', 'everyone', 'devices'];

	@state() darkModeIndex: number = 0;
	darkModes = ['auto', 'light', 'dark'];

	people: string[] = [];
	devices: string[] = [];
	labelSetup: boolean = false;

	buildHeader() {
		const moduleVersion = packageInfo.version;
		const themeVersion = this.hass.themes.themes[THEME_NAME]?.version;

		return html`<div class="header">
			<ha-menu-button
				slot="navigationIcon"
				.hass=${this.hass}
				.narrow=${this.narrow}
			></ha-menu-button>
			<div class="versions">
				<span class="version">Module v${moduleVersion}</span>
				<span class="version">Theme v${themeVersion}</span>
			</div>
		</div>`;
	}

	handleTabBar(e: Event) {
		const i = this.tabs.indexOf(e.detail.name);
		if (this.tabBarIndex == i) {
			return;
		}
		this.tabBarIndex = i;
	}

	buildTabBar(index: number, handler: (e: Event) => void, tabs: string[]) {
		return html`
			<ha-tab-group @wa-tab-show=${handler}>
				${tabs.map(
					(tab, i) =>
						html`<ha-tab-group-tab slot="nav" panel=${tab} .active=${i == index}
							>${tab}</ha-tab-group-tab
						>`,
				)}
			</ha-tab-group>
		`;
	}

	buildSectionHeader(title: string, description: string) {
		return html`
			<div class="section-header">
				<div class="title">${title}</div>
				<div class="description">${description}</div>
			</div>
		`;
	}

	handleThemeMode(_e: MouseEvent) {
		this.darkModeIndex += 1;
		if (this.darkModeIndex > this.darkModes.length - 1) {
			this.darkModeIndex = 0;
		}

		const dark = {
			auto: undefined,
			light: false,
			dark: true,
		}[this.darkModes[this.darkModeIndex]];

		const event = new Event('settheme', { bubbles: true, composed: true });
		event.detail = { theme: THEME_NAME, dark };
		this.dispatchEvent(event);
	}

	buildThemeModeFAB() {
		const icon = {
			auto: 'mdi:theme-light-dark',
			light: 'mdi:white-balance-sunny',
			dark: 'mdi:weather-night',
		}[this.darkModes[this.darkModeIndex]];

		return html`
			<div class="theme-mode-fab" @click=${this.handleThemeMode}>
				<ha-icon .icon=${icon}></ha-icon>
			</div>
		`;
	}

	setupIds() {
		if (!this.people.length) {
			this.people = Object.keys(this.hass.states).filter(
				(entity) =>
					entity.startsWith('person.') &&
					this.hass.states[entity].attributes.user_id &&
					this.hass.states[entity].attributes.user_id != this.hass.user?.id,
			);
		}

		if (!this.devices.length) {
			this.devices = Object.keys(window.browser_mod?.browsers ?? {}).filter(
				(browserId) => browserId != window.browser_mod?.browserID,
			);
		}
	}

	async setupLabel() {
		if (!this.labelSetup) {
			this.labelSetup = true;
			const labels = await fetchLabelRegistry(this.hass.connection);
			if (!labels.some((label) => label.label_id == THEME)) {
				createLabelRegistryEntry(this.hass, {
					name: 'Material You',
					icon: 'mdi:material-design',
					color: 'indigo',
					description: `Input helpers for ${THEME_NAME} Utilities.`,
				});
			}
		}
	}

	render() {
		this.setupIds();
		this.setupLabel();

		if (!this.hass.user?.is_admin) {
			this.tabBarIndex = 0;
		}

		const warnings = html`
			${this.hass.themes.themes['Material Rounded']
				? buildAlertBox(
						`Your theme install is corrupted! The legacy Material Rounded theme was not properly removed and is possibly overwriting ${THEME_NAME} Theme. Delete the config/themes/material_rounded folder from your Home Assistant server.`,
						'error',
					)
				: ''}
			${!this.hass.themes.themes[THEME_NAME]
				? buildAlertBox(
						`You do not have ${THEME_NAME} Theme installed! This module is made to work with ${THEME_NAME} Theme and will not function properly otherwise. Install it using HACS.`,
						'error',
					)
				: !this.hass.themes.theme.includes(THEME_NAME)
					? buildAlertBox(
							`You are not using ${THEME_NAME} Theme! Switch to it using the floating action button at the bottom of the page.`,
							'warning',
						)
					: ''}
		`;

		let page: TemplateResult;
		switch (this.tabBarIndex) {
			case 2:
				page = html`
					${window.browser_mod
						? html`${buildAlertBox(
									'Remember to register devices with Brower Mod!',
								)}
								${this.buildSectionHeader(
									'This Device',
									'Your settings for this device, prioritized over all other settings.',
								)}
								<material-you-config-card
									.hass=${this.hass}
									.dataId=${window.browser_mod?.browserID}
								></material-you-config-card>
								${this.buildSectionHeader(
									'Other Devices',
									'Other devices registered with Browser Mod.',
								)}
								<div class="section">
									${this.devices.map(
										(id) => html`
											<material-you-config-card
												.hass=${this.hass}
												.dataId=${id}
											></material-you-config-card>
										`,
									)}
								</div>`
						: buildAlertBox(
								'Device settings requires Browser Mod, which can be installed using HACS.',
								'error',
							)}
				`;
				break;
			case 1:
				page = html`
					${this.buildSectionHeader(
						'Everyone!',
						'Default settings for all users and devices.',
					)}
					<material-you-config-card
						.hass=${this.hass}
					></material-you-config-card>
					${this.buildSectionHeader(
						'Everyone Else',
						'Other users on this Home Assistant instance.',
					)}
					<div class="section">
						${this.people.map(
							(id) => html`
								<material-you-config-card
									.hass=${this.hass}
									.dataId=${this.hass.states[id].attributes.user_id}
								></material-you-config-card>
							`,
						)}
					</div>
				`;
				break;
			case 0:
			default:
				page = html`
					${this.buildSectionHeader(
						'You!',
						`Your personal ${THEME_NAME} settings.`,
					)}
					<material-you-config-card
						.hass=${this.hass}
						.dataId=${this.hass.user?.id}
					></material-you-config-card>
					${window.browser_mod && !this.hass.user?.is_admin
						? html`
								${this.buildSectionHeader(
									'This Device',
									'Settings for this device.',
								)}
								<material-you-config-card
									.hass=${this.hass}
									.dataId=${window.browser_mod?.browserID}
								></material-you-config-card>
							`
						: ''}
				`;
				break;
		}

		return html`
			${this.buildHeader()}
			<div class="content">
				${this.hass.user?.is_admin
					? this.buildTabBar(this.tabBarIndex, this.handleTabBar, this.tabs)
					: ''}
				${warnings}
				<div class="page-header">
					<div class="title">${THEME_NAME} Utilities</div>
					<div class="description">
						Design your own Material Design 3 dynamic color theme.
					</div>
				</div>
				${page}
			</div>
			${this.buildThemeModeFAB()}
		`;
	}

	firstUpdated() {
		this.darkModeIndex = this.darkModes.indexOf(
			this.hass.themes.darkMode ? 'dark' : 'light',
		);
	}

	static get styles() {
		return css`
			:host {
				font-family: var(--font-family);
				color: var(--primary-text-color);
				background-color: var(
					--lovelace-background,
					var(--primary-background-color)
				);

				--width: min(600px, calc(100% - 36px));
			}

			.header {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				padding: 0 12px;
				height: 64px;
				background-color: inherit;
			}
			.versions {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				width: fit-content;
				min-width: 0;
				color: var(--secondary-text-color);
				font-size: var(--md-sys-typescale-label-medium-size, 12px);
				font-weight: var(--md-sys-typescale-label-medium-weight, 500);
				line-height: var(--md-sys-typescale-label-medium-line-height, 16px);
				letter-spacing: var(--md-sys-typescale-label-medium-tracking, 0.5px);
			}
			.version {
				width: 100%;
				direction: rtl;
				overflow: hidden;
				text-overflow: clip;
				white-space: nowrap;
			}

			.page-header {
				width: var(--width);
			}
			.page-header .title {
				font-size: var(--md-sys-typescale-display-small-size, 36px);
				font-weight: var(--md-sys-typescale-display-small-weight, 400);
				line-height: var(--md-sys-typescale-display-small-line-height, 44px);
				letter-spacing: var(--md-sys-typescale-display-small-tracking, 0);
			}
			.page-header .description {
				color: var(--secondary-text-color);
				font-size: var(--md-sys-typescale-title-medium-size, 16px);
				font-weight: var(--md-sys-typescale-title-medium-weight, 500);
				line-height: var(--md-sys-typescale-title-medium-line-height, 24px);
				letter-spacing: var(--md-sys-typescale-title-medium-tracking, 0.15px);
			}

			.content {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 24px;
				padding-bottom: 80px;
				background-color: inherit;
				min-height: calc(100% - 88px);
			}

			ha-tab-group {
				width: var(--width);
				text-transform: capitalize;
			}
			ha-tab-group-tab {
				flex: 1;
			}
			ha-tab-group-tab::part(base) {
				width: 100%;
				justify-content: center;
			}

			ha-card {
				width: var(--width);
			}
			.section-header {
				width: var(--width);
				padding: 0 16px;
				box-sizing: border-box;
			}
			.section-header .title {
				line-height: var(--md-sys-typescale-headline-large-line-height, 40px);
				font-size: var(--md-sys-typescale-headline-large-size, 32px);
				font-weight: var(--md-sys-typescale-headline-large-weight, 400);
				letter-spacing: var(--md-sys-typescale-headline-large-tracking, 0);
			}
			.section-header .description {
				color: var(--secondary-text-color);
				line-height: var(--md-sys-typescale-body-large-line-height, 24px);
				font-size: var(--md-sys-typescale-body-large-size, 16px);
				font-weight: var(--md-sys-typescale-body-large-weight, 400);
				letter-spacing: var(--md-sys-typescale-body-large-tracking, 0.5px);
			}
			.section {
				width: 100%;
				display: grid;
				justify-content: center;
				justify-items: center;
				gap: 24px;
				grid-template-columns: repeat(auto-fit, var(--width));
			}

			.theme-mode-fab {
				position: fixed;
				inset-block-end: calc(env(safe-area-inset-bottom) + 16px);
				inset-inline-end: calc(env(safe-area-inset-right) + 16px);
				display: flex;
				justify-content: center;
				align-items: center;
				height: 56px;
				width: 56px;
				border-radius: var(--md-sys-shape-corner-large, 16px);
				background: var(--md-sys-color-tertiary-container, #5b3d57);
				color: var(--md-sys-color-on-tertiary-container, #ffd7f6);
				box-shadow: var(--md-sys-elevation-level3, var(--mdc-fab-box-shadow));
				transition: box-shadow var(--md-sys-motion-expressive-effects-slow);
			}
			.theme-mode-fab::after {
				content: '';
				position: absolute;
				height: 56px;
				width: 56px;
				cursor: pointer;
				border-radius: var(--md-sys-shape-corner-large, 16px);
				background: var(--md-sys-color-on-tertiary-container, #5b3d57);
				opacity: 0;
				transition: opacity var(--md-sys-motion-expressive-effects-default);
			}
			@media (hover: hover) {
				.theme-mode-fab:hover {
					box-shadow: var(--md-sys-elevation-level4, var(--mdc-fab-box-shadow));
				}
				.theme-mode-fab:hover::after {
					opacity: 0.08;
				}
			}
			.theme-mode-fab:focus-visible::after,
			.theme-mode-fab:active::after {
				opacity: 0.18;
			}
		`;
	}
}
