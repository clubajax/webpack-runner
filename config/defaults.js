const path = require('path');
const DEFAULTS = {
	port: 8080,
	host: '0.0.0.0',
	output: './dist',
	build_port: 9091
};

const requiredProperties = 'root,input,appFiles';

function required (options) {
	requiredProperties.split(',').forEach((key) => {
		if (options[key] === undefined) {
			throw new Error(`The config property "${key}" is required`);
		}
	});
}

function testProperties (options) {
	Object.keys(options).forEach((key) => {
		if (key === 'output' && /^\//.test(options[key])) {
			throw new Error(`The "output" property appears to be an absolute path (remove the beginning slash): ${options[key]}`);
		}
	});
}

module.exports = (options) => {
	required(options);
	testProperties(options);
	const opts = Object.assign({}, DEFAULTS, options);

	opts.output = path.resolve(opts.root, opts.output);

	return opts;
};
