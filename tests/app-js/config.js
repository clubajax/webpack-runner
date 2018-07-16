const path = require('path');
const root = path.resolve(`${__dirname}/../`);
console.log('ROOT', root);

const config = {
	root,
	port: 8888,
	output: '../dist',
	input: './app-js/',
	appName: 'main',
	cssName: 'main',
	appFiles: './index.js',
	// cleanExternal: true,
	// cssMinify: false,
	analyzer: false,
	showSpeed: false,
	// ie: true,
	// ieOnly: true,
	// webComponentsShim: true,
	// polyfill: './app4/vendors/polyfills.js',
	// babelInclude: ['node_modules/ui-shared', '@clubajax/base-component', path.resolve(root, '../', 'node_modules/@clubajax/no-dash')],
	// testModuleBuild: true,
	html: {
		template: 'index.tmpl.html',
		filename: 'index.html'
	}
};

module.exports = config;