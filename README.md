[![GitHub Release](https://img.shields.io/github/release/Nerwyn/material-you-utilities.svg?style=for-the-badge)](https://github.com/nerwyn/material-you-utilities/releases)
[![License](https://img.shields.io/github/license/Nerwyn/material-you-utilities.svg?style=for-the-badge)](LICENSE)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-blue.svg?style=for-the-badge)](https://github.com/hacs/default)
[![Project Maintenance](https://img.shields.io/badge/maintainer-Nerwyn-blue.svg?style=for-the-badge)](https://github.com/Nerwyn)
![Github](https://img.shields.io/github/followers/Nerwyn.svg?style=for-the-badge)
[![GitHub Activity](https://img.shields.io/github/last-commit/Nerwyn/material-you-utilities?style=for-the-badge)](https://github.com/Nerwyn/material-you-utilities/commits/main)
[![Community Forum](https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge)](https://community.home-assistant.io/t/material-you-theme-a-fully-featured-implementation-of-material-design-3-for-home-assistant/623242)
[![Buy Me A Coffee](https://img.shields.io/badge/donate-☕buy_me_a_coffee-yellow.svg?style=for-the-badge)](https://www.buymeacoffee.com/nerwyn)

[![My Home Assistant](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=material-you-utilities&owner=Nerwyn&category=Plugin)

# Material Design 3 Color Theme Generation and Component Modification

Material Design 3 color theme generation and Home Assistant component modification. Redesign your Home Assistant frontend to look like any modern Material Expressive app.

A companion module for [Material You Theme](https://github.com/Nerwyn/material-you-theme) for Home Assistant. This module turns Material You theme into a complete Material Design 3 overhaul of Home Assistant. You'll be able to use generate wildly different color theme palettes and will be able to change the entirety of the Home Assistant user interface to look like a modern Material Design 3 app. This can all be configured from a configuration panel included with this module.

This module generates color themes using [Material Color Utilities](https://github.com/material-foundation/material-color-utilities) based on user defined inputs. It also injects custom styles into many Home Assistant custom components to follow the [Material Design 3 specifications](https://m3.material.io/). The Material Design 3 specification is the source of truth for this module and Material You theme, and they will change over time to reflect updates to the specification. Custom color theme generation and style injection have minimal performance impact and work well even on low end devices.

# Installation

First time setup and installation of this module is a multistep process as this module **must** be configured in `configuration.yaml`.

## Install the Module From HACS

1. Navigate to HACS (install from [here](https://hacs.xyz/) if you do not have it yet).
2. Search for `Material You Utilities`.
3. Open this repository in HACS and click `Download`.

## Add the Module as a Frontend Module and Custom Panel

**This is not optional**.

The component design upgrades performed by this module are very time sensitive, and must be run as soon as possible. Because of this you must install it as a frontend module in your `configuration.yaml` file.

1. Open your `configuration.yaml`.
   - Your `configuration.yaml` file is found in the `config` folder. More information can be found [here](https://www.home-assistant.io/docs/configuration/).
2. Add the file URL to `frontend` `extra_module_url`, adding the `frontend` and `extra_module_url` keys if they do not exist, and adding to them if they do.
   - If you have links to any old versions of the JavaScript module here or in frontend resources, **delete them**.

```yaml
frontend:
  themes: !include_dir_merge_named themes
  extra_module_url:
    - /hacsfiles/material-you-utilities/material-you-utilities.min.js
```

3. Add the following to the `panel_custom` key in `configuration.yaml`, creating it if it does not exist. This will allow you to access the Material You Utilities configuration panel.
   - More information about custom panels can be found [here](https://www.home-assistant.io/integrations/panel_custom/).
   - While you can technically manually setup in the input helpers this module uses yourself, it is much easier to setup this panel and have it manage them for you. Remember - you can always re-order and hide your sidebar items.

```yaml
panel_custom:
  - name: material-you-panel
    url_path: material-you-configuration
    sidebar_title: Material You Utilities
    sidebar_icon: mdi:material-design
    module_url: /hacsfiles/material-you-utilities/material-you-utilities.min.js
```

4. Restart Home Assistant.

Once Home Assistant has finished restarting, you should see the upgraded Material Design 3 components and the Material You Utilities configuration panel in the sidebar. You may need to clear app/browser cache and refresh. You do not need to restart Home Assistant for subsequent updates.

## Updating and Troubleshooting

While this module should be automatically updated through HACS after initial installation, you may run into issues with updates not loading due to sticky cache issues. [**See this thread**](https://github.com/Nerwyn/material-you-utilities/discussions/12) for troubleshooting steps, help, and discussion.

# The Configuration Panel

This module comes with its own configuration panel! If you are the Home Assistant server administrator, you can use this panel to create and set input helper entities for all users, devices, and global defaults. If you are not the administrator you can set style options for yourself and your current device after an administrator creates them.

This module uses [input helpers](https://www.home-assistant.io/integrations/?cat=helper&search=input) to store user inputs. You can see all of the input helpers generated by this module on [the helpers page](http://homeassistant.local:8123/config/helpers). They will have the label `Material You`.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/configuration-panel.png" width="750"/>

## You, Everyone, and Devices

If you are an administrator you'll see three tabs at the top of the configuration panel - You, Everyone, and Devices.

The first tab is for you! These settings apply to any Home Assistant browser/device instance logged in to your profile.

The second tab is for everyone else. This includes all other users on the Home Assistant server, including other administrators. It also has the global settings, which apply when a user or device does not have their own input helpers setup.

The third tab is for device specific settings. You can setup input helpers specific to a user-browser-device combination. The current device settings appears at the top of this tab. These settings require [Browser Mod](https://github.com/thomasloven/hass-browser_mod) to keep track of user-browser-device IDs.

Device settings are prioritized over all other settings, followed by user settings and then global settings.

If you are not an administrator, then you will not see any tabs at the top of the page. You should only see your settings card, and possibly the settings card for your current device.

## Settings Cards

Each settings card has the same fields for users, devices, and global settings. Setting are divided into three tabs - theme, styles, and other.

To create input helper entities for a user, device, or globally, click on `Create Helpers` in their settings card. Similarly, you can delete input helper entities for a user by clicking `Delete Helpers`. After creating helpers, you or the non-admin user can modify them from the configuration panel or open their more info dialog using the buttons to their left.

You can click on the icons to the left of each settings card row to open their more info dialogs, or hover over them for a brief description.

### Theme

#### Base Color

Material color themes are built around a base color, from which all other theme colors are derived depending on the scheme rules. This color defaults to `#4C5C92` (a shade of blue), but can be set to any other color using the color wheel.

##### Home Assistant Android App Color Sensor

If you are using the Home Assistant Android companion app, you can enable the accent color sensor in the companion app settings to use your phones Material Design accent color as the theme base color:

1. Navigate to `Settings` > `Companion app`.
2. Click `Manage sensors.`
3. Scroll down to the section titled `Dynamic color` and click `Accent color`.
4. Toggle `Enable sensor` on. It should now return your phone's Material Design base color as a hex code.

You can then create an automation to set your Material Design base color whenever the sensor changes.

```yaml
description: ''
mode: single
triggers:
  - trigger: state
    entity_id:
      - sensor.pixel_fold_accent_color
conditions: []
actions:
  - action: input_text.set_value
    metadata: {}
    data:
      value: '{{ trigger.to_state.state }}'
    target:
      entity_id: input_text.material_you_base_color
```

#### Contrast Level

The contrast level is a number from -1 to 1 which defines how much colors in the theme will differ and how bright they are.

#### Scheme Name

The scheme defines the color palette used to generate your theme. By default, this theme will use the `Tonal Spot` color scheme. This scheme is the default color scheme used by Android 12.

In addition to the modern Android color scheme, [Material Color Utilities](https://github.com/material-foundation/material-color-utilities) offers several alternate schemes.

| Name        | Description                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tonal Spot  | Dynamic Color theme with low to medium colorfulness and a Tertiary TonalPalette with a hue related to the source color.<br> The default Material You theme on Android 12.                                                                                                                                                                                                                                               |
| Content     | A scheme that places the source color in `Scheme.primaryContainer`.<br> Primary Container is the source color, adjusted for color relativity.<br> It maintains constant appearance in light mode and dark mode.<br> This adds ~5 tone in light mode, and subtracts ~5 tone in dark mode.<br> Tertiary Container is the complement to the source color, using `TemperatureCache`. It also maintains constant appearance. |
| Fidelity    | A scheme that places the source color in `Scheme.primaryContainer`.<br> Primary Container is the source color, adjusted for color relativity.<br> It maintains constant appearance in light mode and dark mode.<br> This adds ~5 tone in light mode, and subtracts ~5 tone in dark mode.<br> Tertiary Container is the complement to the source color, using `TemperatureCache`. It also maintains constant appearance. |
| Expressive  | A Dynamic Color theme that is intentionally detached from the source color.                                                                                                                                                                                                                                                                                                                                             |
| Fruit Salad | A playful theme - the source color's hue does not appear in the theme.                                                                                                                                                                                                                                                                                                                                                  |
| Rainbow     | A playful theme - the source color's hue does not appear in the theme.                                                                                                                                                                                                                                                                                                                                                  |
| Vibrant     | A Dynamic Color theme that maxes out colorfulness at each position in the Primary Tonal Palette.                                                                                                                                                                                                                                                                                                                        |
| Neutral     | A Dynamic Color theme that is near grayscale.                                                                                                                                                                                                                                                                                                                                                                           |
| Monochrome  | A Dynamic Color theme that is grayscale.                                                                                                                                                                                                                                                                                                                                                                                |

#### Specification Version

With the Material Expressive update, Material Design 3 now has new specifications for color themes. You can choose between the original `2021` color specification, or the updated `2025` specification. Combine the `2025` specification with the `Expressive` scheme to use the new Material Expressive palette.

#### Platform

The 2025 color specification has two platform options - `Phone` and `Watch`. While you probably want to keep this at the default `Phone` setting, you have the ability to choose. Note that the `Watch` platform does not work well with light mode. If specification version is not set to 2025 then this setting will be hidden from the settings card.

### Styles

#### Style Upgrades

If you want to disable the Material Design 3 component upgrades, toggle Style Upgrades off. Doing so will still allow you to set most other options. A refresh is required for this to apply.

#### Card Type

The Material Design 3 specification has [three different card type style variations](https://m3.material.io/components/cards/overview#ccabd69f-a01a-4b55-868f-9428f244c4bd) which can be set as the default style for almost all cards in Home Assistant. This module also adds transparent and translucent (like iOS Liquid Glass) card variants.

Some cards, like those found in the configuration pages, already have the attribute `outlined`. This attribute will supersede the default `elevated` card style or user chosen card type.

#### Show Application Bar

You can choose to hide the application bar shown at the top of views by toggline this setting off. This is useful for smaller tablet displays that do not need the application bar buttons. The menu button to open the sidebar is still clickable despite being hidden to prevent users from being locked into a view.

#### Show View Title

As an alternative to Home Assistant's markdown view titles, you can choose to display the view title in the center of the application bar instead. If the application bar is hidden this title will be as well and this setting be hidden in the settings card.

#### Show Navigation Bar

You can choose to hide the navigation bar shown at the bottom of views by toggling this setting off. This is useful if you want to use an alternate view navigation system such as [Navbar Card](https://github.com/joseluis9595/lovelace-navbar-card). Note that this does not disable navigation bar styles or restore the default view tabs, it hides them entirely. Requires style upgrades to be enabled.

#### Show Navigation Bar Labels

You can choose to hide the navigation bar labels shown below and trailing the view tabs at the bottom of views by toggling this setting off. If the navigation bar is hidden this setting does nothing and is hidden in the settings card.

#### Show Navigation Rail Labels

You can choose to hide the navigation rail item labels shown on the leading side of the screen below their icons when the navigation rail is not expanded by toggling this setting off. This does not affect the expanded navigation rail which always shows the item labels.

### Other

#### Harmonize Semantic Colors

Semantic colors, such as red, orange, warning, info, etc., are normally static and can appear visually displeasing with certain theme palettes. Enabling this option will hue shift semantic colors towards the theme primary color, helping them better match the theme. You can see how this affects most of the [Read more about color harmonization here](https://m3.material.io/blog/dynamic-color-harmony).

#### Base Color Source Image Path/URL

Instead of explicitly defining your theme base color, you can instead provide the local path or external URL to an image in this input. This image can be hosted on your Home Assistant server in the `config/www` folder or be from an external website ([with CORS approval](https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/CORS_enabled_image)). A set of up to four possible base colors will be derived from this image from you to choose from and set to the base color field. You can choose between the possible options by appending the query string `?i=` to the end of your image path or URL, setting i to a number between 0 and 3 inclusive.

You can reference files locally hosted in `config/www` using the URL path `/local/{filename}`. If you use a subfolder in this folder make sure to include it in the URL path after `/local/`.

Note that changing image file by itself but not changing the name will not trigger a color theme update. A refresh or change in the input helper's value (file name) is required to retrigger this logic.

#### CSS Path/URL

You can choose to provide your own CSS styles in a file and then provide the local path or external URL in this input. This CSS file can be hosted on your Home Assistant server in the `config/www` folder or be from an external website. This is useful for applying more in depth custom themes created using [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/), or if you just want to override certain theme custom attributes. For maximum coverage use the selector `:host, html, body` for maximum effectiveness across Home Assistant, iframes, and configuration panel settings cards.

You can reference files locally hosted in `config/www` using the URL path `/local/{filename}`. If you use a subfolder in this folder make sure to include it in the URL path after `/local/`.

Similar to base color from source image, changing the CSS file contents is not enough to trigger an update. You must refresh the page or input helper's value (file name).

## Theme Mode FAB

For your convenience, you can click on the floating action button on the bottom right of the configuration panel to switch to Material You theme and between light, dark, and auto modes for the current device.

# Material Design 3 Components

In addition to generating custom material color themes, this module modifies the lifecycle methods styles of many Home Assistant component constructors to inject additional CSS styles to make the components follow the Material Design 3 specification.

## Navigation

### [App Bars](https://m3.material.io/components/top-app-bar/overview)

Menu buttons at the top of the screen. For regular views the menu buttons remain will gain a background on scroll. For subviews the entire app bar remains but shifts to a surface container color.

Large, medium, and small headline titles and subtitles can be added using Home Assistant sections view titles either using markdown or HTML headings as described below.

| Size   | Type     | Markdown              | HTML                       |
| ------ | -------- | --------------------- | -------------------------- |
| Large  | Title    | # Large Title         | \<h1>Large Title\</h1>     |
| Medium | Title    | ## Medium Title       | \<h2>Medium Title\</h2>    |
| Small  | Title    | ### Small Title       | \<h3>Small Title\</h3>     |
| Large  | Subtitle | #### Large Subtitle   | \<h4>Large Subtitle\</h4>  |
| Medium | Subtitle | ##### Medium Subtitle | \<h5>Medium Subtitle\</h5> |
| Small  | Subtitle | ###### Small Subtitle | \<h6>Small Subtitle\</h6>  |

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/app-bar.png" width="500"/>

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/headline.png" width="300"/>

### Notes

- Subviews use the [small app bar](https://m3.material.io/components/app-bars/specs#fac99130-8bb8-498c-8cb8-16ea056cc3e1) specification and have only received minor margin adustments to match.
- The headline is now only present for subviews and hidden for single view dashboards by default. The fonts for these titles has been updated.
- Standard views no longer have a headline by default. This was added to this theme shortly before Home Assistant added its own more customizable view title system. Between the built in title option and the Material Expressive updates, I decided to remove this title in favor of user added titles instead. Home Assistants section view title system is more in line with the Material Expressive specification, and its fonts and colors have been updated to match.
- If you place a subtitle right after a title, the margins between them will be reduced like in the screenshot above.
- The margin above a view header area has been removed.

### [Navigation Bar](https://m3.material.io/components/navigation-bar/overview)

View tabs displayed at the bottom of the screen, dynamically scaling with page width. On wide (landscape or width greater than 870px) displays the view tabs are horizontal. On smaller displays the view tabs are vertical.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/navigation-bar-vertical.png" width="500"/>

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/navigation-bar-horizontal.png" width="500"/>

#### Notes

- The view tabs are more akin to [Material Design 3 tabs](https://m3.material.io/components/tabs/overview), but I chose to restyle them as a navigation bar as doing so was one of the original purposes of this theme. View tabs as a navigation bar makes more sense within the context of how Home Assistant dashboards are used, and are much easier to use on tall phone displays.
- Displaying navigation bars alongside rails is not considered good practice, but is done so in this theme due to the increased accessability the bottom aligned navigation bar offers over top aligned tabs.
- Home Assistant itself uses bottom aligned tabs for mobile settings pages, which is similar to the navigation bar.

### [Navigation Rail](https://m3.material.io/components/navigation-rail/overview)

Desktop sidebar and mobile modal drawer.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/navigation-rail.png" width="500"/>

#### Notes

- The specification calls for the expanded and modal navigation rail to have variable width based on the width of the destination items, but making the width variable while expanded can cause it to cover the view. Therefore it uses the Home Assistant default fixed width for expanded drawers. The modal rail is variable width.
- Previously the expanded rail and modal dialog used the [navigation drawer specification](https://m3.material.io/components/navigation-drawer/overview), which has been deprecated and merged into navigation rail.
- Expanding and collapsing the rail has been updated with expressive animations.

### [Badges](https://m3.material.io/components/badges/overview)

Alerts the user to notifications.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/badge.png" width="200"/>

#### Notes

- Before Material Expressive, a third badge variant was available specific to the navigation drawer. This variant has been deprecated alongside the navigation drawer specification.

## [Cards](https://m3.material.io/components/cards/overview)

The ubiquitous container which most Home Assistant lovelace elements are built around.

### [Elevated Card](https://m3.material.io/components/cards/specs#a012d40d-7a5c-4b07-8740-491dec79d58b)

A background color similar to the view background with elevation. The default card style.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/elevated-card.png" width="500"/>

### [Filled Card](https://m3.material.io/components/cards/specs#0f55bf62-edf2-4619-b00d-b9ed462f2c5a)

A contrasting background color with no elevation.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/filled-card.png" width="500"/>

### [Outlined Card](https://m3.material.io/components/cards/specs#9ad208b3-3d37-475c-a0eb-68cf845718f8)

An outlined card with the same background color as the view and no elevation.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/outlined-card.png" width="500"/>

### Notes

- Cards will default to `elevated` unless they have a class or attribute that says otherwise.
- Some cards such as those found in the settings pages already have the attribute `outlined`, which will supersede the default `elevated` style.
- In order to use card styles other than elevated, you have to modify the class of the card using card-mod or set an alternate card type using the configuration panel [as described above](#card-type). The options are:
  - elevated
  - filled
  - outlined
  - transparent
- Card type classes set with card-mod will supersede card types set using the configuration panel. This way you can set an overall default card type but still modify the card types of individual cards.

```yaml
card_mod:
  class: 'filled'
```

- The specification says to use border-radius shape `--md-sys-shape-corner-medium` (12px), but I opted to instead use `--md-sys-shape-corner-extra-large` (28px). I had a few reasons for this.
  1. Material Design 3 cards are containers for interactable elements and information, but cards in Home Assistant are mostly interactable elements themselves. Interactable elements in Material Design 3 tend to have much rounder corners.
  2. Material Design 3 specification website itself uses larger more rounded border radii for card elements.
  3. Material Design 3 apps like Google Home use larger border radii for card-like interactable elements.
  4. The round border radii cards was one of the original features of this theme, back when it was called Material Rounded.

## [Buttons](https://m3.material.io/components/buttons/overview)

Basic buttons that appear in many menus and some cards. They have rounded corners that expressively become more square when pressed or focused. All buttons follow the small size specification.

### Tonal Buttons

Uses secondary container colors. Modified from the `accent` appearance button in Home Assistant.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/tonal-button.png" width="200"/>

### Filled Buttons

Uses primary colors.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/filled-button.png" width="200"/>

### Outlined Buttons

Uses on surface variant colors.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/outlined-button.png" width="200"/>

#### Notes

- This variant does not seem to appear in Home Assistant anymore after the 2025.8.0 update, but it's styles haves been retained just in case it makes a comeback.

### Text Buttons

Uses primary colors with no background or outline.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/text-button.png" width="200"/>

#### Notes

- The Material Design specification has five variations, but Home Assistant's new `ha-button` parent component only supports four. Home Assistant itself only uses three variants.

### [Button Groups](https://m3.material.io/components/button-groups/overview)

A group of buttons used as a selector. Uses the filled button variant.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/button-group.png" width="200"/>

### [FAB](https://m3.material.io/components/floating-action-button/overview)

Floating action button with just an icon.

#### Notes

- Home Assistant doesn't normally use icon only FABs! The add view button in non-sections views has been transformed into a FAB as there isn't a good place for it on the transformed header or footer.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/fab.png" width="500"/>

### [Extended FAB](https://m3.material.io/components/extended-fab/overview)

Extended floating action buttons which appear in legacy views, and the integrations, devices, and helpers pages.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/extended-fab.png" width="500"/>

## [Menus](https://m3.material.io/components/menus/overview)

Dropdown menus.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/dropdown-menu.png" width="300"/>

## [Chips](https://m3.material.io/components/chips/overview)

Small button-like elements that can be used to display information or fire actions.

### [Outlined Chips](https://m3.material.io/components/chips/specs#a144389c-9478-4fe4-9bd8-ca9f7dd830eb)

Follows the Assist Chip specification. Used in configuration menus and HACS.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/outlined-chip.png" width="500"/>

### [Filled Chips](https://m3.material.io/components/chips/specs#e900592f-75a4-4298-853c-bedd8f462f83)

Follows the Filter Chip (selected) specification. Can be added to the header or footer of some cards to fire actions and used in add-ons pages.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/filled-chip.png" width="500"/>

#### Notes

- While it would make more sense to use the elevated assist chip specification for this as both this and outlined chips are the same `ha-assist-chip` element, when designed as one it blends in with card backgrounds, where it is usually found.

### [Input Chips](https://m3.material.io/components/chips/specs#facb7c02-74c4-4b81-bd52-6ad10ce351eb)

Follows the Input Chip specification. Used by list selectors found in configuration menus.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/input-chip.png" width="500"/>

### Notes

- Chips in Home Assistant do not function like chips in Material Design 3. Instead of being informational or for less important actions, they are generally equivalent to buttons.
- Badges in Home Assistant are not equivalent to [Material Design 3 badges](https://m3.material.io/components/badges/overview), they are instead like a hybrid between cards and chips. It doesn't make sense to style them as chips as it tends to make them look worse, especially when used with entity pictures.

## Inputs

### [Switches](https://m3.material.io/components/switch/overview)

Toggle switches for setting boolean values.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/switch.png" width="500"/>

### [Sliders](https://m3.material.io/components/sliders/overview)

Numerical inputs optimized for human interaction. Uses the small variant, which is still much larger than the default slider.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/slider.png" width="500"/>

#### [Progress Indicators](https://m3.material.io/components/progress-indicators/overview)

Sliders with ID `#position-slider` will receive alternate wavy progress indicator styles. At time of writing this slider is only present in the media player more info dialog.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/progress-indicator.png" width="500"/>

#### Notes

- As of 2025.10.0 the base component of the slider has changed. This new component does not support alternate colors for tick marks before and after the slider handle. Instead one color is used with CSS mix-blend-mode difference.
- Home Assistant actually has its own implementation of a Material Design 3 slider (extra small variant), but it is only used for the card configuration layout grid size picker. The styles of this slider have been slightly modified to use theme colors, to modify the tooltip size, and to narrow the handle when pressed or focused.

## Pop-ups

### [Tooltips](https://m3.material.io/components/tooltips/overview)

Messages that appear when hovering over certain elements. Uses the plain tooltip specification.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/tooltip.png" width="500"/>

### [Snackbars](https://m3.material.io/components/snackbar/overview)

Floating messages that appear on the bottom of the screen, also known as toasts.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/snackbar.png" width="500"/>

#### Notes

- The bottom offset of snackbars has been increased to appear above the navigation bar, fixing it from preventing you from navigating your dashboard if a snackbar was in the way. I was not able to figure out a way to make this bottom offset change depending on whether the navigation bar was visible or not, as the navigation bar and snackbar are deep within different shadow roots.

### [Dialogs](https://m3.material.io/components/dialogs/overview)

Windows that appear to display information or ask for user input, like more-info and confirmation dialogs.

#### [Basic Dialogs](https://m3.material.io/components/dialogs/specs#23e479cf-c5a6-4a8b-87b3-1202d51855ac)

Lighter color and updated font.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/basic-dialog.png" width="500"/>

#### [Full-screen Dialogs](https://m3.material.io/components/dialogs/specs#bbf1acde-f8d2-4ae1-9d51-343e96c4ac20)

Background color changes on scroll and updated font.

<img src="https://raw.githubusercontent.com/Nerwyn/material-you-utilities/main/assets/full-screen-dialog.png" width="500"/>

#### Notes

- Home Assistant has a more modern dialog used for confirmations and similar messages. This dialog mostly follows the Material Design 3 specification, but does not turn into a full-screen dialog on smaller displays.
- Dialogs have been updated with an expressive opening animation.

# Developing, Modifying, and Building

This repository requires npm and Node.js to develop. The JavaScript module is a minified file compiled using rspack. The source files are all written using TypeScript. After forking the repository and cloning to your machine, run the command `npm run setup` to setup the pre-commit hooks and install dependencies.

The styles used by the component style upgrade functions can be found in the `src/css` folder, where they are named after the custom elements they are applied to. They must also be added to the `src/css/index.ts` file elements object to be picked up by the component style upgrade functions.

The module is setup to use a global `inputs` config object found in `src/models/constants/inputs.ts`. Using this object, the module can setup listeners for each inputs helpers and the settings cards will automatically generate rows for inputs.

Helper methods can be found in `src/utils/handlers`. Not all handlers are triggered by inputs, as some are called within other helpers. Most helpers have paired set and unset methods. Handlers that inject styles do so using style tags with unified helper functions found in `src/utils/handlers/styles.ts`. Unset methods generally call a unified generic `unset` method which removes their corresponding style tags. Some helpers have to be separately configured to run on certain triggers within `src/material-you-utilities.ts`.

The configuration panel and settings card code can be found in `src/classes`. These generally do not have to be modified unless an input requires a custom user interface not provided by [`ha-selector`](https://github.com/home-assistant/frontend/blob/dev/src/data/selector.ts), like for the base color picker wheel.

To build this module, either make a commit (to your own fork) or run the command `npm run build`. The compiled JavaScript module and a gzipped copy of it (which is ignored by git and is for local testing) can be found in the `dist` folder. Rspack can take a little bit of time to run, especially the first time you run it after opening the terminal. You can upload the gzipped file to your Home Assistant instance to overwrite the copy download from and created by HACS to test your changes. This file is located in your configuration folder at `www/community/material-you-utilities`.
