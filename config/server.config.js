const path = require('path');
const defaults = require('./defaults');

module.exports = function server (opts) {

	const options = defaults(opts);

	const ENV = process.env.API;
	//let api = ENV === 'dev' || ENV === 'vm' ? 'https://smartar-dev.researchnow.com' : ENV;

	let api;
	if (options.api) {
		api = options.api;
		if (!/http/.test(api)) {
			api = `https://${api}`;
		}
	}
	console.log('api:', api);
	const config = {
		// messages for errors or HMR (quite verbose)
		// Possible values are none, error, warning or info (default).
		clientLogLevel: 'none',
		port: options.port,
		host: options.host,
		//contentBase: path.resolve(options.root, options.output),
		// contentBase: `${options.root}/dist`,
		contentBase: path.resolve(options.root, options.output),
		historyApiFallback: true,
		// if not true, css will trigger a full page reload
		hot: true, //ENV !== 'vm',
		watchContentBase: true,
		inline: true
	};

	if (api) {
		if (!options.apiPath) {
			throw new Error('"apiPath" is required for proxy');
		}
		const proxy = {};
		proxy[options.apiPath] = {
			target: api,
			changeOrigin: true,
			headers: {
				Referer: api,
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
				'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
			}
		};
		if (options.headers) {
			Object.assign(proxy[options.apiPath].headers, options.headers);
		}
		config.proxy = proxy;
	}

	return config;
};