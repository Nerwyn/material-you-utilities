# Contributing

Contributions are welcome, but understand that this is a personal project largely maintained by one person. Low quality issues and pull requests can end up wasting a lot of my time as they cause me to chase non-existent issues or try to validate hard to read code. This is especially true for AI generated issues and pull requests, which I have seen an uptick of on my own repositories. While you are welcome to use AI tooling to aid your coding, AI generated "vibe coded" contributions are not welcome.

Bug fixes for monthly releases are normally fixed within a few days of the first monthly Home Assistant release or during the beta period. If there is not already a monthly beta fix released or matching issue, feel free to create an issue and I will get to it as soon as I can. You generally shouldn't attempt to create a bug fix fork/PR for monthly releases because chances are I'm already on it.

This project is largely feature complete outside of implementing upstream changes to material color utilities. If there are new features you want to see added, you may want to create a feature request issue or discussion thread to discuss it first.

## Create a fork

First you'll need to fork this repository and then `git clone` that fork to your development machine. Navigate to the GitHub repository home page, click Fork, and follow the instructions there to create your own fork. Then use the `git clone` command to download the fork to your development machine.

If you have not used git or cloned a repository before, you may want to read through the [GitHub documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo).

## Setup your cloned repository for development

This project is written in TypeScript and compiled into a minified JavaScript file for distribution via the Home Assistant Community Store, and requires a little bit of setup on your machine first.

Run `npm run setup` to configure the pre-commit githook build pipeline and install dependencies. Don't worry about the three severe vulnerabilities, they're in the build pipeline and not present in the distributed JavaScript file. If there's more than that then `npm audit fix` may need to be run.

## Developing

You're now ready to make your code changes. Do your best to follow the style and syntax of the existing code. Avoid changing any of the configuration files (eslint, prettier, tsconfig, rspack) if possible. Do not use `any` unless there's a good reason to do so, like a field that truly can be anything.

The styles used by the component style upgrade functions can be found in the `src/css` folder, where they are named after the custom elements they are applied to. They must also be added to the `src/css/index.ts` file elements object to be picked up by the component style upgrade functions.

The module is setup to use a global `inputs` config object found in `src/models/constants/inputs.ts`. Using this object, the module can setup listeners for each inputs helpers and the settings cards will automatically generate rows for inputs.

Helper methods can be found in `src/utils/handlers`. Not all handlers are triggered by inputs, as some are called within other helpers. Most helpers have paired set and unset methods. Handlers that inject styles do so using style tags with unified helper functions found in `src/utils/handlers/styles.ts`. Unset methods generally call a unified generic `unset` method which removes their corresponding style tags. Some helpers have to be separately configured to run on certain triggers within `src/material-you-utilities.ts`.

The configuration panel and settings card code can be found in `src/classes`. These generally do not have to be modified unless an input requires a custom user interface not provided by [`ha-selector`](https://github.com/home-assistant/frontend/blob/dev/src/data/selector.ts), like for the base color picker wheel.

## Building and testing

The pre-commit githook build pipeline you (should have) setup should compile the project into a minified JavaScript file whenever a commit is made. You can also run the build pipeline using the command `npm run build`. The compiled JavaScript module and a gzipped copy of it (which is ignored by git and is for local testing) can be found in the `dist` folder. This command assumes you have `gzip` installed.

To test your changes on your Home Assistant server, you must replace the `min.js` and `min.js.gz` files, clear cache, and refresh you browser. If installed via HACS, your custom frontend modules should be located at `config/www/community/material-you-utilities`. Within that should be a folder for this project, and within that should be the `min.js` and `min.js.gz` files. Replace the files here with your updated copies and then clear cache and refresh your browser. To clear cache and refresh, open browser developer tools (`F12` or `CTRL` + `I`), right click the refresh button, and then click `Empty Cache and Hard Reload`.

You should now be able to test that your changes work! Try to test your changes on multiple different browsers or devices. I've run into a lot of issues with different browsers and mobile webviews behaving differently, especially iOS/iPadOS webview.

## Make a pull request

Once you think your code is ready, make a pull request on the original repository! Make sure to use [the included PR template](https://github.com/Nerwyn/custom-card-features/blob/main/.github/PULL_REQUEST_TEMPLATE/pull_request.md).
