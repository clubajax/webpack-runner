console.log('webpack-runner init');
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const serve = require('webpack-serve');
const path = require('path');
const fs = require('fs');
const html = require('./config/html.plugin');
const assets = require('./config/assets.plugin');
console.log('loading 1...');
//
const args = require('minimist')(process.argv.slice(2));
const localOptions = require(args.config);
const isDev = args.mode === 'development';
localOptions.projectRoot = process.cwd();
console.log('loading 2...');


function run (options, callback) {

	// const filepath = path.resolve(localOptions.root, localOptions.output, localOptions.html.filename);
	// console.log('filepath', filepath);
	// return

	const webpackConfig = require('./config/webpack.config');
	const serverConfig = require('./config/server.config');
	const serveConfig = require('./config/serve.config');
	const webpackOptions = webpackConfig(options);

	console.log('webpackOptions', webpackOptions);

	if (args.mode === 'development') {


		if (options.useServe) {
			// doesn't work.
			webpackOptions.serve = serveConfig(options);
			serve({
				config: webpackOptions
			}).then((e) => {
				console.log('You have been SERVED');
			});

		} else {

			// Based on
			// Script to launch webpack dev server
			// https://gist.github.com/michaelrambeau/b04f83ef16fc78feee09

			const svr = serverConfig(options);

			// needed for HMR
			WebpackDevServer.addDevServerEntrypoints(webpackOptions, svr);

			const compiler = webpack(webpackOptions);
			const port = options.port;
			const server = new WebpackDevServer(compiler, svr);
			server.listen(port, 'localhost', function (err) {
				if (err) {
					console.log(err);
				}
				console.log('WebpackDevServer listening at localhost:', port);
			});
		}


	} else {
		webpack(webpackConfig(options), (err, stats) => {
			if (err || stats.hasErrors()) {
				// Handle errors here
				console.error('****ERROR****', err);
				const info = stats.toJson();

				if (stats.hasErrors()) {
					console.error(stats.toJson().errors[0]);
				}
			} else {
				console.log('webpack runner done processing');
				if (callback) {
					callback();
				}
			}
		});
	}
}

const build1 = `
*********
BUILD ONE
*********
`;

const build2 = `
*********
BUILD TWO
*********
`;

console.log('run...');
if (isDev) {
	console.log('dev...');
	run(localOptions);
} else if (localOptions.ieOnly || !localOptions.ie) {
	console.log('ie...');
	run(localOptions, () => {
		let content = html.read(localOptions);
		content = assets.toFile(content, [], localOptions);
		html.write(content, localOptions);
		assets.flush();
	});
} else {
	console.log('build...');
	// modules/nomodules build step
	// first run modern browser build
	console.log(build1);
	localOptions.ie = false;
	run(localOptions, () => {

		let content = html.read(localOptions);
		const moduleScripts = assets.fromFile(content);
		assets.cache(localOptions);

		// now run legacy browser build
		console.log(build2);
		localOptions.ie = true;
		run(localOptions, () => {
			let content = html.read(localOptions);
			content = assets.toFile(content, moduleScripts, localOptions);
			html.write(content, localOptions);
			assets.flush();
		});
	});
}

