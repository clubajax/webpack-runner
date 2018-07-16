const path = require('path');
const root = path.resolve(`${__dirname}/../`);
console.log('ROOT', root);

const config = {
	root,
	port: 8888,
	output: '../dist',
	input: './app4/',
	appName: 'main',
	cssName: 'main',
	appFiles: './index.jsx',
	// cleanExternal: true,
	cssMinify: false,
	analyzer: false,
	showSpeed: false,
	// ie: true,
	ieOnly: true,
	webComponentsShim: true,
	polyfill: './app4/vendors/polyfills.js',
	babelInclude: ['node_modules/ui-shared', '@clubajax/base-component', path.resolve(root, '../', 'node_modules/@clubajax/no-dash')],
	testModuleBuild: true,
	html: {
		template: 'index.tmpl.html',
		filename: 'index.html'
	},
	copy: [{
		from : './file-to-copy.js',
		to: '../dist/file-to-copy.js'
	}],
	define: {
		RELEASE_VERSION: JSON.stringify(process.env.RELEASE_VERSION || 'local'),
		GIT_COMMIT: JSON.stringify(process.env.GIT_COMMIT || 'local'),
		COMMIT_DATE: JSON.stringify(process.env.COMMIT_DATE || 'local'),
		SENTRY_URL: JSON.stringify('https://43cc8eba28734fb28d773f80d1bea1f9@sentry.io/127234'),
	},
	resolve: {
		alias: {
			vendors: path.resolve(__dirname, './vendors')
		}
	}
};

module.exports = config;