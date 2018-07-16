const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (options) => {
	if (noCopy(options)) {
		return () => {};
	}

	let files = options.copy || [];
	if (options.isProd && options.copyProd) {
		files = [...files, options.copyProd];
	} else if (!options.isProd && options.copyDev) {
		files = [...files, options.copyDev];
	}

	return new CopyWebpackPlugin(files);
};

function noCopy (options) {
	return !options.copy && options.isProd && !options.copyProd && !options.isProd && !options.copyDev;
}
