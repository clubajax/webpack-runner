const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function create (options) {

	let htmlConfig;
	let template;
	let filename;

	if (!options.html) {
		throw new Error('An html object is required');
	}
	if (options.html.filename === options.html.template || options.html.template === 'index.html') {
		throw new Error('html template and filename should be different; template should not be "index.html"');
	}

	if (options.html.filename) {
		htmlConfig = {
			filename: options.html.filename,
			inject: true,
			template: options.html.template,
			cache: false
		};
		template = options.html.template;
		filename = options.html.filename;
	} else {
		htmlConfig = options.html;
		template = htmlConfig.template;
		filename = htmlConfig.filename;
	}

	return new HtmlWebpackPlugin(htmlConfig);
}

function read (options) {
	const filepath = path.resolve(options.root, options.output, options.html.filename);
	return fs.readFileSync(filepath).toString();
}

function write (content, options) {
	const filepath = path.resolve(options.root, options.output, options.html.filename);
	fs.writeFileSync(filepath, content);
}

module.exports = {
	create,
	read,
	write
};
