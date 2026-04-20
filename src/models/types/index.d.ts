import { CardHelpers } from '../interfaces';

export {};

declare global {
	interface Window {
		MaterialYouInit?: boolean;
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

	declare module '*.css' {
		const classes: string;
		export default classes;
	}
}
