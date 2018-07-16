const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const defaults = require('./defaults');
const argv = require('minimist')(process.argv.slice(2));


module.exports = (opts) => {

	const options = defaults(opts);

	console.log('options', options);

	const ENV = process.env.API;
	const isProd = argv.mode !== 'development';

	options.isProd = isProd;
	global.buildServer = argv.env === 'test-build' || options.testModuleBuild;
	process.env.API = ENV || !isProd ? 'dev' : undefined;

	options.appName = options.appName || 'app';
	options.cssName = options.cssName || 'styles';
	const appName = isProd ? '[name].[chunkhash].js' : '[name].js';

	let appFiles = Array.isArray(options.appFiles) ? options.appFiles : [options.appFiles];
	appFiles = [...appFiles, 'react', 'react-dom', 'react-dom.production.min'];

	if (!isProd) {
		appFiles = [
			...appFiles,
			`webpack-dev-server/client?http://${options.host}:${options.port}`
		];

		if (ENV !== 'vm') {
			appFiles = [
				...appFiles,
				'react-hot-loader/patch',
				'webpack/hot/only-dev-server'
			]
		}
	}

	if (!isProd) {
		process.traceDeprecation = true;
	}

	const config = {
		mode: isProd ? 'production' : 'development',
		context: `${options.root}/${options.input}/`, // path.resolve does not work in this scenario - need abs path
		entry: {
			[options.appName]: options.appFiles
		},
		output: {
			filename: appName,
			path: path.resolve(options.root, options.output),
			publicPath: isProd ? '/' : ENV === 'vm' ? '/' : `http://localhost:${options.port}/`
		},
		optimization: {
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					react: {
						name: 'react',
						test: /react|fbjs/,
						enforce: true,
						priority: 5
					},
					shared: {
						name: 'shared',
						test: /ui-shared|clubajax/,
						enforce: true,
						priority: 10
					},
					other: {
						name: 'other',
						test: /node_modules/,
						enforce: true,
						priority: 1
					}
				}
			},
			minimize: false, //isProd,
			minimizer: [
				new UglifyJSPlugin({
					cache: true,
					sourceMap: false,
					parallel: true,
					uglifyOptions: {
						compress: { inline: false },
						output: {
							comments: false,
							beautify: false,
							preserve_line: false,
							semicolons: false,
							indent_level: 4,
							indent_start: 0,
							width: 120
						}
					}
				})
			]
		},

		module: {
			rules: require('./rules.config')(options)
		},

		plugins: require('./plugins.config')(options),

		// eval-source-map caused bugs and creates hard-to-read source code
		devtool: isProd ? 'none' : 'inline-source-map',

	};

	config.resolve = options.resolve;

	if (options.showSpeed) {
		const smp = new SpeedMeasurePlugin();
		return smp.wrap(config);
	}
	return config;
};
