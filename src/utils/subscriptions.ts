import { inputs } from '../models/constants/inputs';
import {
	RenderTemplateError,
	RenderTemplateResult,
} from '../models/interfaces';
import {
	IHandlerArguments,
	InputField,
	ISubscription,
	SubscriptionResult,
} from '../models/interfaces/Input';
import { getHomeAssistantMainAsync } from './async';
import {
	getEntityId,
	getEntityIdAndValue,
	getFieldFromEntityIdAndInputs,
} from './common';
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
				let entities: string[];
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
						hass.connection.subscribeMessage<SubscriptionResult>(
							(r) => {
								const entityId0 = r.variables.trigger.entity_id;
								const field = getFieldFromEntityIdAndInputs(
									entityId0,
									subscription.inputs,
								);
								const value =
									r.variables.trigger.to_state?.state || inputs[field].default;
								const { entityId } = getEntityIdAndValue(field, args.id);
								if (entityId0 == entityId) {
									subscription.handler({
										...args,
										entityId,
										value,
									});
								}
							},
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
					for (const entityId0 of entities) {
						unsubscribers.push(
							hass.connection.subscribeMessage(
								(msg: RenderTemplateResult | RenderTemplateError) => {
									if ('error' in msg) {
										console.error(msg.error);
										debugToast(msg.error);
									}

									const field = getFieldFromEntityIdAndInputs(
										entityId0,
										subscription.inputs,
									);
									const { entityId } = getEntityIdAndValue(field, args.id);
									if (entityId0 == entityId) {
										let value: string | number | undefined = (
											msg as RenderTemplateResult
										).result;
										if (value == 'unknown') {
											value = undefined;
										}
										value ||= inputs[field].default;
										subscription.handler({
											...args,
											entityId,
											value,
										});
									}
								},
								{
									type: 'render_template',
									template: `{{ states("${entityId0}") }}`,
									entity_ids: entityId0,
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
