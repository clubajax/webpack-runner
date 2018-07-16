const path = require('path');
const defaults = require('./defaults');
const WebSocket = require('ws');


// WRONG ONE! DO NOT USE!


// const chokidar = require('chokidar');

// webpack-serve has too many issues
// HMR does not work
// lazy-load only loads one module - ???!!

module.exports = function server (opts) {

	const options = defaults(opts);

	const config = {
		// messages for errors or HMR (quite verbose)
		// Possible values are none, error, warning or info (default).
		// logLevel: 'none',
		port: options.port,
		host: options.host,
		content: path.resolve(options.root, options.output),
		// historyApiFallback: true,
		// if not true, css will trigger a full page reload
		hot: {
			host: options.host,
			port: 8090
		},
		stats: { colors: true },
		// on: {
		// 	listening(server) {
		// 		const socket = new WebSocket('ws://localhost:8090');
		// 		const watchPath = __dirname;
		// 		const options = {};
		// 		const watcher = chokidar.watch(watchPath, options);
		//
		// 		watcher.on('change', () => {
		// 			console.log('.....................hange.....................');
		// 			const data = {
		// 				type: 'broadcast',
		// 				data: {
		// 					type: 'window-reload',
		// 					data: {},
		// 				},
		// 			};
		//
		// 			socket.send(JSON.stringify(data));
		// 		});
		//
		// 		// server.on('close', () => {
		// 		// 	watcher.close();
		// 		// });
		// 	}
		// }
	};

	return config;
};
