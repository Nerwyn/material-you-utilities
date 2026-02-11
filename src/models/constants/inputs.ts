import { hideAppbar } from '../../utils/handlers/appbar';
import { setCardType } from '../../utils/handlers/cards';
import { setCSSFromFile } from '../../utils/handlers/css';
import { harmonize } from '../../utils/handlers/harmonize';
import { setBaseColorFromImage } from '../../utils/handlers/image';
import { hideNavbar } from '../../utils/handlers/navbar';
import { setTheme } from '../../utils/handlers/theme';
import { IInputInfo, InputDomain, InputField } from '../interfaces/Input';
import { schemes } from './colors';

export const services: Record<InputDomain, string> = {
	input_text: 'set_value',
	input_number: 'set_value',
	input_select: 'select_option',
	input_boolean: 'toggle',
};

export const inputs: Record<InputField, IInputInfo> = {
	// Theme options
	base_color: {
		domain: 'input_text',
		default: '#4C5C92',
		name: 'Base Color',
		description: `The color from which the theme is derived.
It usually does not appear in the theme itself.`,
		init: {
			config: {
				icon: 'mdi:palette',
				min: 3,
				max: 9,
			},
		},
		card: { config: {}, tabBarIndex: 0, resetButton: true },
		handler: setTheme,
	},
	contrast: {
		domain: 'input_number',
		default: 0,
		name: 'Contrast Level',
		description: 'The contrast/brightness of the theme colors.',
		init: {
			config: {
				icon: 'mdi:contrast-circle',
				min: -1,
				max: 1,
				step: 0.1,
			},
		},
		card: {
			config: {
				number: {
					min: -1,
					max: 1,
					step: 0.1,
					mode: 'slider',
					slider_ticks: true,
				},
			},
			tabBarIndex: 0,
		},
		handler: setTheme,
	},
	scheme: {
		domain: 'input_select',
		default: 'tonalspot',
		name: 'Scheme Name',
		description: 'The color palette used to generate the theme.',
		init: {
			config: {
				icon: 'mdi:palette-advanced',
				options: [...schemes.map((scheme) => scheme.value)],
			},
		},
		card: {
			config: {
				select: {
					mode: 'dropdown',
					options: schemes,
				},
			},
			tabBarIndex: 0,
		},
		handler: setTheme,
	},
	spec: {
		domain: 'input_select',
		default: '2021',
		name: 'Specification',
		description: `The palette rules to use for the scheme.
2021 is the original Material You palettes.
2025 is the Material Expressive palettes.`,
		init: {
			config: {
				icon: 'mdi:calendar-multiple',
				options: ['2021', '2025'],
			},
		},
		card: {
			config: {
				button_toggle: {
					options: ['2021', '2025'],
				},
			},
			tabBarIndex: 0,
		},
		handler: setTheme,
	},
	platform: {
		domain: 'input_select',
		default: 'phone',
		name: 'Platform',
		description: `The target platform for the theme.
Not available for the 2021 specification.`,
		init: {
			config: {
				icon: 'mdi:devices',
				options: ['phone', 'watch'],
			},
		},
		card: {
			config: {
				button_toggle: {
					options: [
						{ value: 'phone', label: 'Phone' },
						{ value: 'watch', label: 'Watch' },
					],
				},
			},
			tabBarIndex: 0,
		},
		handler: setTheme,
	},

	// Style options
	styles: {
		domain: 'input_boolean',
		default: 'on',
		name: 'Style Upgrades',
		description:
			'Enable global style upgrades for components to follow the Material Design 3 specifications.',
		init: {
			config: {
				icon: 'mdi:material-design',
			},
		},
		card: {
			config: {
				boolean: {},
			},
			tabBarIndex: 1,
		},
		handler: async (_args) => {},
	},
	card_type: {
		domain: 'input_select',
		default: 'elevated',
		name: 'Card Type',
		description: `Which card variant to use as the default for Home Assistant cards.
Does not apply to cards that are explicitly set to outlined like in settings.`,
		init: {
			config: {
				icon: 'mdi:card',
				options: ['elevated', 'filled', 'outlined', 'transparent'],
			},
		},
		card: {
			config: {
				select: {
					mode: 'dropdown',
					options: [
						{ value: 'elevated', label: 'Elevated' },
						{ value: 'filled', label: 'Filled' },
						{ value: 'outlined', label: 'Outlined' },
						{ value: 'transparent', label: 'Transparent' },
					],
				},
			},
			tabBarIndex: 1,
		},
		handler: setCardType,
	},
	appbar: {
		domain: 'input_boolean',
		default: 'on',
		name: 'Show Application Bar',
		description: 'Show/hide the application bar at the top of views.',
		init: {
			config: {
				icon: 'mdi:page-layout-header',
			},
		},
		card: {
			config: {
				boolean: {},
			},
			tabBarIndex: 1,
		},
		handler: hideAppbar,
	},
	navbar: {
		domain: 'input_boolean',
		default: 'on',
		name: 'Show Navigation Bar',
		description: `Show/hide the navigation bar at the bottom of views.
Does not restore the default Home Assistant view tabs.`,
		init: {
			config: {
				icon: 'mdi:page-layout-footer',
			},
		},
		card: {
			config: {
				boolean: {},
			},
			tabBarIndex: 1,
		},
		handler: hideNavbar,
	},

	// Color options
	harmonize: {
		domain: 'input_boolean',
		default: 'on',
		name: 'Harmonize Semantic Colors',
		description:
			'Adjust static/semantic colors to be closer in hue to the theme primary color.',
		init: {
			config: {
				icon: 'mdi:palette-swatch',
			},
		},
		card: {
			config: {
				boolean: {},
			},
			tabBarIndex: 2,
		},
		handler: harmonize,
	},
	image_url: {
		domain: 'input_text',
		default: '',
		name: 'Base Color Source Image Path/URL',
		description: `Path/URL to an image to extract the base color from.
Use a query string like ?i=1 (between 0 and 3 inclusive) to choose alternate color options.`,
		init: {
			config: {
				icon: 'mdi:image',
				min: 0,
				max: 255,
			},
		},
		card: {
			config: {
				text: {},
			},
			tabBarIndex: 2,
		},
		handler: setBaseColorFromImage,
	},
	css_file: {
		domain: 'input_text',
		default: '',
		name: 'CSS Path/URL',
		description: `Path/URL to a CSS file to apply to the page and iframe roots for defining custom properties.`,
		init: {
			config: {
				icon: 'mdi:language-css3',
				min: 0,
				max: 255,
			},
		},
		card: {
			config: {
				text: {},
			},
			tabBarIndex: 2,
		},
		handler: setCSSFromFile,
	},
};
