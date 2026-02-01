import haAssistChip from './ha-assist-chip.css';
import haButton from './ha-button.css';
import haCardElevated from './ha-card-elevated.css';
import haCardFilled from './ha-card-filled.css';
import haCardOutlined from './ha-card-outlined.css';
import haCardTransparent from './ha-card-transparent.css';
import haCard from './ha-card.css';
import haConfigInfo from './ha-config-info.css';
import haConfigSectionUpdates from './ha-config-section-updates.css';
import haDialogHeader from './ha-dialog-header.css';
import haDialog from './ha-dialog.css';
import haDrawer from './ha-drawer.css';
import haDropdownItem from './ha-dropdown-item.css';
import haDropdown from './ha-dropdown.css';
import haEntityToggle from './ha-entity-toggle.css';
import haFab from './ha-fab.css';
import haGridLayoutSlider from './ha-grid-layout-slider.css';
import haInputChip from './ha-input-chip.css';
import haListItem from './ha-list-item.css';
import haMarkdown from './ha-markdown.css';
import haMdDialog from './ha-md-dialog.css';
import haMdListItem from './ha-md-list-item.css';
import haMdMenuItem from './ha-md-menu-item.css';
import haMenuButton from './ha-menu-button.css';
import haSelectBox from './ha-select-box.css';
import haSelect from './ha-select.css';
import haSettingsRow from './ha-settings-row.css';
import haSidebar from './ha-sidebar.css';
import haSlider from './ha-slider.css';
import haSwitch from './ha-switch.css';
import haTextfield from './ha-textfield.css';
import haToast from './ha-toast.css';
import haTooltip from './ha-tooltip.css';
import haTopAppBarFixed from './ha-top-app-bar-fixed.css';
import haUserBadge from './ha-user-badge.css';
import haWaDialog from './ha-wa-dialog.css';
import homeAssistantMain from './home-assistant-main.css';
import homeAssistant from './home-assistant.css';
import hueLikeLightCard from './hue-like-light-card.css';
import huiCardChild from './hui-card-child.css';
import huiEntitiesCardEditor from './hui-entities-card-editor.css';
import huiEntitiesToggle from './hui-entities-toggle.css';
import huiGridSection from './hui-grid-section.css';
import huiRootHideHaTabGroup from './hui-root-hide-ha-tab-group.css';
import huiRootHideToolbar from './hui-root-hide-toolbar.css';
import huiRoot from './hui-root.css';
import huiViewHeader from './hui-view-header.css';
import huiViewVisibilityEditor from './hui-view-visibility-editor.css';
import waDialog from './wa-dialog.css';

/**
 * Home Assistant (and other) custom elements to patch when they are added to DOM
 */
export const implicitElements: Record<string, string> = {
	'ha-assist-chip': haAssistChip,
	'ha-button': haButton,
	'ha-card': haCard,
	'ha-config-info': haConfigInfo,
	'ha-dialog': haDialog,
	'ha-wa-dialog': haWaDialog,
	'ha-md-dialog': haMdDialog,
	'ha-dialog-header': haDialogHeader,
	'ha-dropdown': haDropdown,
	'ha-dropdown-item': haDropdownItem,
	'ha-entity-toggle': haEntityToggle,
	'ha-fab': haFab,
	'ha-grid-layout-slider': haGridLayoutSlider,
	'ha-input-chip': haInputChip,
	'ha-list-item': haListItem,
	'mwc-list-item': haListItem,
	'ha-markdown': haMarkdown,
	'ha-md-list-item': haMdListItem,
	'ha-md-menu-item': haMdMenuItem,
	'ha-menu-button': haMenuButton,
	'ha-select': haSelect,
	'ha-select-box': haSelectBox,
	'ha-settings-row': haSettingsRow,
	'ha-sidebar': haSidebar,
	'ha-slider': haSlider,
	'md-slider': haSlider,
	'ha-switch': haSwitch,
	'ha-top-app-bar-fixed': haTopAppBarFixed,
	'ha-textfield': haTextfield,
	'ha-toast': haToast,
	'ha-tooltip': haTooltip,
	'ha-user-badge': haUserBadge,
	'ha-config-section-updates': haConfigSectionUpdates,
	'hui-card': huiCardChild, // applied to child hui-*-card
	'hui-entities-toggle': huiEntitiesToggle,
	'hui-entities-card-editor': huiEntitiesCardEditor,
	'hui-grid-section': huiGridSection,
	'hui-root': huiRoot,
	'hui-view-header': huiViewHeader,
	'hui-view-visibility-editor': huiViewVisibilityEditor,
	'hue-like-light-card': hueLikeLightCard,
	'wa-dialog': waDialog,
};

/**
 * Home Assistant custom elements to explicitly apply styles to on initial load
 */
export const explicitElements: Record<string, string> = {
	'home-assistant': homeAssistant,
	'home-assistant-main': homeAssistantMain,
	'ha-drawer': haDrawer,
};

/**
 * All custom elements to patch
 */
export const elements = {
	...implicitElements,
	...explicitElements,
};

/**
 * Card type variants
 */
export const cardTypes: Record<string, string> = {
	elevated: haCardElevated,
	filled: haCardFilled,
	outlined: haCardOutlined,
	transparent: haCardTransparent,
};

export {
	// Hide navigation bar
	huiRootHideHaTabGroup,

	// Hide application bar
	huiRootHideToolbar,
};
