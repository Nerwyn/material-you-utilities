export type InputDomain =
	| 'input_text'
	| 'input_select'
	| 'input_number'
	| 'input_boolean';

export type InputField =
	| 'base_color'
	| 'scheme'
	| 'spec'
	| 'platform'
	| 'contrast'
	| 'styles'
	| 'card_type'
	| 'appbar'
	| 'view_title'
	| 'navbar'
	| 'harmonize'
	| 'image_url'
	| 'css_file';

export interface IHandlerArguments {
	targets?: HTMLElement[];
	id?: string;
}

export type Handler = (args: IHandlerArguments) => Promise<void>;

export interface IInputInfo {
	domain: InputDomain;
	default: string | number;
	name: string;
	description: string;
	init: {
		config: Record<string, unknown>;
	};
	card: {
		tabBarIndex: number;
		config: Record<string, unknown>;
		resetButton?: boolean;
	};
	handler: Handler;
}

export interface ISubscription {
	inputs: InputField[];
	handler: Handler;
}

interface RegistryEntry {
	created_at: number;
	modified_at: number;
}

export interface LabelRegistryEntryMutableParams {
	name: string;
	icon?: string;
	color?: string;
	description?: string;
}
export interface LabelRegistryEntry
	extends RegistryEntry, LabelRegistryEntryMutableParams {
	label_id: string;
}

export interface EntityRegistryEntryUpdateParams {
	name?: string;
	icon?: string;
	device_class?: string;
	area_id?: string;
	disabled_by?: string;
	hidden_by: string;
	new_entity_id?: string;
	options_domain?: string;
	// options?:
	// 	| SensorEntityOptions
	// 	| NumberEntityOptions
	// 	| LockEntityOptions
	// 	| AlarmControlPanelEntityOptions
	// 	| WeatherEntityOptions
	// 	| LightEntityOptions;
	aliases?: string[];
	labels?: string[];
	categories?: Record<string, string | null>;
}
