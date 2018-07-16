const cssFn = require('./css.config');
const babelConfig = require('./babel.config');

module.exports = (options) => {
	const css = cssFn(options);

	const babel = babelConfig(options);

	const files = {
		test: /\.(jpg|png|svg)$/,
		loader: 'file-loader',
		options: {
			name: '[name].[ext]',
			context: `${options.root}/app`
		}
	};

	const common = [babel, css.rules.main, files, ...(options.rules || [])];
	const dev = [];

	return [...common, ...dev];
};