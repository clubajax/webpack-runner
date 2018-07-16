const path = require('path');

module.exports = (options) => {

	const babelConfig = {
		debug: true,
		// false prevents babel from transforming import/exports
		// but false also breaks ui-shared
		// modules: false,
		//useBuiltIns: 'usage',
		targets: {
			browsers: options.isProd && (options.ie || options.ieOnly) ? ['ie >= 11'] :
				['Chrome >= 60', 'Safari >= 11', 'iOS >= 11', 'Firefox >= 54', 'Edge >= 15']
		}
	};

	const babelInclude = options.babelInclude || [];
	const app = path.resolve(options.root, options.input);
	const regApp = new RegExp(app);
	const regRoot = new RegExp(options.projectRoot);
	const libs = [app, ...babelInclude];
	const libsToBabelize = new RegExp(libs.filter(lib => !regApp.test(lib)).join('|'));


	const included = libs.map((lib) => {
		let filepath;
		if (regApp.test(lib)) {
			return regRoot.test(lib) ? lib : path.join(options.root, `./${lib}`);
		}

		filepath = /node_modules/.test(lib) ? lib : `./node_modules/${lib}`;
		console.log(' --- included', filepath);
		return regRoot.test(lib) ? filepath : path.resolve(options.projectRoot, filepath);
	});

	// console.log('included\n', included);

	return {
		test: /\.jsx?$/,
		use: {
			loader: 'babel-loader',
			options: {
				babelrc: false,
				presets: [
					'@babel/react',
					'@babel/preset-env',
					// [
					// 	'@babel/preset-env',
					// 	//babelConfig
					// ]
				],
				plugins: [
					'lodash',
					'date-fns',
					'react-hot-loader/babel',
					'@babel/plugin-syntax-dynamic-import',
					'@babel/plugin-proposal-object-rest-spread',
					// 'react-loadable/babel'
				]
			}
		},
		//exclude: /node_modules/
		include: included,
		exclude (filepath) {

			if (!this.babelizeLogged) {
				this.babelizeLogged = true;
				console.log('babelizing...');
			}

			if (/node_modules/.test(filepath) && !libsToBabelize.test(filepath)) {
				return true;
			}

			return false;
		}
	};
};
