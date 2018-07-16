const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const cssFn = require('./css.config');
const html = require('./html.plugin');
const assets = require('./assets.plugin');
const copy = require('./copy.plugin');
const pkg = require('../package.json');

module.exports = function plugins (options) {

	const css = cssFn(options);

	const ENV = options.isProd ? 'production' : process.env.API === 'dev' ? 'dev' : process.env.API;

	console.log('process.env.API', process.env.API);

	const clean = new CleanWebpackPlugin([options.output], {
		// use project root, not __dirname, since config may be below dist
		root: process.cwd(),
		verbose: true,
		dry: false
	});

	const defineOptions = {
		'process.env': {
			NODE_ENV: JSON.stringify(ENV)
		}
	};
	Object.assign(defineOptions, options.define || {});

	const define = new webpack.DefinePlugin(defineOptions);

	const cssMinify = new OptimizeCSSAssetsPlugin({
		cssProcessor: cssnano,
		cssProcessorOptions: {
			discardComments: {
				removeAll: true,
			},
			// Run cssnano in safe mode to avoid
			// potentially unsafe transformations.
			safe: true,
		},
	});

	const hmr = new webpack.HotModuleReplacementPlugin();
	const names = new webpack.NamedModulesPlugin();
	const force = new CaseSensitivePathsPlugin();

	const analyzer = new BundleAnalyzerPlugin({
		analyzerMode: 'server',
		analyzerHost: '127.0.0.1',
		analyzerPort: 8888,
		reportFilename: 'report.html',
		openAnalyzer: false
	});

	let lastPct;
	const progress = new ProgressPlugin((percentage, msg, current, active, modulepath) => {
		const pct = Math.floor(percentage * 10);
		if (lastPct !== pct) {
			console.log(!pct ? '0%' : `${pct}0%`);
			lastPct = pct;
			if (percentage === 1) {
				console.log('build complete');
			}
		}
	});

	const onComplete = function () {
		this.plugin('done', function (stats) {
			if (global.buildServer) {
				setTimeout(() => {
					console.log('starting server...');
					require('./build.server')(options);
				}, 1);
			}
		});
	};

	const Tester = function () {
		this.apply = function (compiler) {

			compiler.plugin('done', function(compilation) {
				console.log('PLUGINS DNE', compilation.assets);
				Object.keys(compilation.assets).forEach((filename) => {
					console.log(' - ', filename);
				});
				// callback();
			});
		}
	};

	const common = [clean, define, css.plugins.main, force, progress, html.create(options), assets.write(options), copy(options), ...(options.plugins || [])];
	const dev = [names, hmr];
	const prod = [onComplete]; // cssMinify,

	if (options.cssMinify) {
		prod.push(cssMinify);
	}

	if (options.analyzer) {
		common.push(analyzer);
	}

	return options.isProd ?
		[...common, ...prod] :
		[...common, ...dev];
};
