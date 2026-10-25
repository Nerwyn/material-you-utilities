import { THEME_UTILS } from '../constants/theme';
import { CardHelpers } from '../interfaces';

export {};

declare global {
	interface Window {
		[THEME_UTILS]: {
			disabled?: boolean;
			elements: Set<HTMLElement>;
			toggleStyles: (value?: boolean) => void;
		};
		browser_mod?: {
			browserID?: string;
			browsers?: Record<string, Record<string, unknown>>;
		};
		loadCardHelpers: () => Promise<CardHelpers>;
	}

	interface Event {
		// eslint-disable-next-line
		detail?: any;
	}

	interface HTMLElement {
		connectedCallback?(): void;
		disconnectedCallback?(): void;
	}

	declare module '*.css' {
		const classes: string;
		export default classes;
	}
}
