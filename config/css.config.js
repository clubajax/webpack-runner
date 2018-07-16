const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let css;

function createCss (options) {

	if (!css) {
		const plugins = {
			main: new MiniCssExtractPlugin({
				filename: `${options.cssName}.[chunkhash].css`
			})
		};

		const rules = {
			main: {
				test: /\.s?css$/,
				use: [
					options.isProd ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: { sourceMap: true }
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: true }
					}
				]
			}
		};
		css = {
			plugins,
			rules
		};
	}
	return css;
}

module.exports = function cssConfig (options) {
	return createCss(options);
};
