const flow = require("lodash.flow");
const path = require("path");
const webpackCraOverrides = require("./webpack-cra-overrides");

module.exports = {
	stories: [
		"../src/**/*.stories.@(tsx|mdx)",
		"../src/**/stories/index.@(tsx|mdx)",
		"../src/**/stories/*.story.@(tsx|mdx)"
	],
	addons: [
		"@storybook/addon-a11y",
		"@storybook/addon-essentials",
		"@storybook/addon-knobs",
		"@storybook/addon-storysource",
		{
			name: "@storybook/preset-scss",
			options: {
				cssLoaderOptions: {
					modules: true
				}
			}
		}
	],
	typescript: {
		check: false,
		checkOptions: {},
		reactDocgen: 'react-docgen-typescript',
		reactDocgenTypescriptOptions: {
			shouldExtractLiteralValuesFromEnum: true,
			propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
		}
	},
	webpackFinal: (config) => {
		return flow.apply(null, webpackCraOverrides)(config);
	}
};
