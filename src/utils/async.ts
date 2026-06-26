import { HassElement } from '../models/interfaces';

/**
 * Asynchronous query selector
 * @param {ParentNode} parent Element to query
 * @param {string} selector Query selector string
 * @param {number} [timeout=60000] Timeout until promise rejection in milliseconds, defaults to 60000
 * @returns {Promise<HTMLElement>} The queried element
 */
export async function querySelectorAsync(
	parent: ParentNode,
	selector: string,
	timeout: number = 60000,
): Promise<HTMLElement> {
	return new Promise((resolve, reject) => {
		const element = parent.querySelector(selector) as HTMLElement;
		if (element) {
			resolve(element);
			return;
		}

		const rejectTimeout = setTimeout(
			() =>
				reject(
					`Timeout waiting for ${selector} in ${parent} after ${timeout}ms.`,
				),
			timeout,
		);

		const observer = new MutationObserver(() => {
			const element = parent.querySelector(selector) as HTMLElement;
			if (element) {
				clearTimeout(rejectTimeout);
				observer.disconnect();
				resolve(element);
			}
		});
		observer.observe(parent, { childList: true, subtree: true });
	});
}

/**
 * Asynchronous getter which waits for value to not be either undefined or null
 * @param {Node} element node to get value from
 * @param {string} key key to get value of
 * @param {number} [timeout=60000] Timeout until promise rejection in milliseconds, defaults to 60000
 * @returns {Promise<any>} The defined value
 */
export async function getAsync(
	element: Node,
	key: string,
	timeout: number = 60000,
): Promise<unknown> {
	let sleep = 1;
	setTimeout(() => (sleep = 10), 100);
	setTimeout(() => (sleep = 100), 1000);
	setTimeout(() => (sleep = 1000), 5000);

	let kill = false;
	setTimeout(() => (kill = true), timeout);

	while (!(key in element) || element[key as keyof object] == null) {
		if (kill) {
			console.error(
				`Timeout waiting for ${key} in ${element} after ${timeout}ms.`,
			);
			break;
		}
		await new Promise((resolve) => setTimeout(resolve, sleep));
	}
	return element[key as keyof object];
}

/**
 * Call a handler function when a ready function returns true.
 * If the ready function returns false, this method recursively recalls itself on a timeout.
 * The function continues to recall itself with an exponentially increasing timeout until
 * the ready function returns true or the timeout is exceeded.
 * @param {() => void | Promise<void>} handler The function to call when ready
 * @param {() => boolean | Promise<boolean>} handleReady The function to check and return true when ready
 * @param {number} timeout The max time to wait in milliseconds, defaults to 20000
 * @param {number} delay The initial delay in milliseconds, defaults to 10
 */
export async function handleWhenReady(
	handler: () => void | Promise<void>,
	handleReady: () => boolean | Promise<boolean>,
	timeout: number = 20000,
	delay: number = 10,
) {
	if (delay > timeout) {
		return;
	}

	if (!(await handleReady())) {
		setTimeout(
			async () =>
				await handleWhenReady(handler, handleReady, timeout, delay * 2),
			delay,
		);
		return;
	}

	await handler();
}

/**
 * Wait for home-assistant-main shadow-root to load, then return home-assistant-main
 * @returns {HassElement} home-assistant-main element
 */
export async function getHomeAssistantMainAsync(): Promise<HassElement> {
	const ha = (await querySelectorAsync(
		(await getAsync(
			await querySelectorAsync(document, 'home-assistant'),
			'shadowRoot',
		)) as HassElement,
		'home-assistant-main',
	)) as HassElement;
	await getAsync(ha, 'shadowRoot');
	return ha;
}
