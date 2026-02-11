import { inputs } from '../models/constants/inputs';
import {
	RenderTemplateError,
	RenderTemplateResult,
} from '../models/interfaces';
import {
	IHandlerArguments,
	InputField,
	ISubscription,
} from '../models/interfaces/Input';
import { getHomeAssistantMainAsync } from './async';
import { getEntityId } from './common';
import { debugToast } from './logging';

export async function setupSubscriptions(
	args: IHandlerArguments,
): Promise<(() => Promise<void>)[]> {
	const hass = (await getHomeAssistantMainAsync()).hass;
	const userId = hass.user?.id;
	const deviceId = window.browser_mod?.browserID?.replace(/-/g, '_');

	return new Promise((resolve) => {
		if (hass.connection.connected && userId) {
			const subscriptions: ISubscription[] = [];
			for (const field in inputs) {
				let subscription = subscriptions.find(
					(sub) => sub.handler == inputs[field as InputField].handler,
				);
				if (!subscription) {
					subscription = {
						inputs: [field as InputField],
						handler: inputs[field as InputField].handler,
					};
					subscriptions.push(subscription);
				} else {
					subscription.inputs.push(field as InputField);
				}
			}

			const unsubscribers = [];
			for (const subscription of subscriptions) {
				// User inputs
				let entities: string[] = [];
				if (args.id) {
					entities = [
						...subscription.inputs.map((input) => getEntityId(input, args.id)),
					];
				} else {
					entities = [
						...subscription.inputs.map((input) => getEntityId(input)),
						...subscription.inputs.map((input) => getEntityId(input, userId)),
					];
					if (deviceId) {
						entities.push(
							...subscription.inputs.map((input) =>
								getEntityId(input, deviceId),
							),
						);
					}
				}

				if (hass.user?.is_admin) {
					// Trigger on input change using subscription
					unsubscribers.push(
						hass.connection.subscribeMessage(
							() => subscription.handler(args),
							{
								type: 'subscribe_trigger',
								trigger: {
									platform: 'state',
									entity_id: entities,
								},
							},
							{ resubscribe: true },
						),
					);
				} else {
					// Trigger on input change using templates
					for (const entity of entities) {
						unsubscribers.push(
							hass.connection.subscribeMessage(
								(msg: RenderTemplateResult | RenderTemplateError) => {
									if ('error' in msg) {
										console.error(msg.error);
										debugToast(msg.error);
									}
									subscription.handler(args);
								},
								{
									type: 'render_template',
									template: `{{ states("${entity}") }}`,
									entity_ids: entity,
									report_errors: true,
								},
							),
						);
					}
				}
			}
			resolve(Promise.all(unsubscribers));
		} else {
			setTimeout(() => resolve(setupSubscriptions(args)), 100);
		}
	});
}
