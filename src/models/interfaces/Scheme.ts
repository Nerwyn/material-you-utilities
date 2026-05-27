import type {
	SchemeCmf,
	SchemeContent,
	SchemeExpressive,
	SchemeFidelity,
	SchemeFruitSalad,
	SchemeMonochrome,
	SchemeNeutral,
	SchemeRainbow,
	SchemeTonalSpot,
	SchemeVibrant,
} from '@material/material-color-utilities';

export type Scheme =
	| typeof SchemeContent
	| typeof SchemeExpressive
	| typeof SchemeFidelity
	| typeof SchemeFruitSalad
	| typeof SchemeMonochrome
	| typeof SchemeNeutral
	| typeof SchemeRainbow
	| typeof SchemeTonalSpot
	| typeof SchemeVibrant
	| typeof SchemeCmf;

export type SpecVersion = '2021' | '2025' | '2026';

export interface IScheme {
	value: string;
	label: string;
	secondary?: string;
	class: Scheme;
	spec_versions: SpecVersion[];
}
