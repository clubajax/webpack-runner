const path = require('path');
const fs = require('fs');

const assets = {
	js: [],
	css: [],
	cache: {}
};

function write() {
	return function () {
		this.plugin('done', function (stats) {
			// const chunks = stats.compilation.compiler.options.optimization.splitChunks.cacheGroups;
			Object.keys(stats.compilation.assets).forEach((filename) => {

				if (/js/.test(filename)) {
					assets.js.push(filename);
				}
				if (/css/.test(filename)) {
					assets.css.push(filename);
				}
			});
		});
	}
}

function cache (options) {
	[...assets.css, ...assets.js].forEach((js) => {
		const filepath = path.resolve(options.root, options.output, js);
		assets.cache[filepath] = fs.readFileSync(filepath);
	});
}

function flush () {
	Object.keys(assets.cache).forEach((filename) => {
		fs.writeFileSync(filename, assets.cache[filename]);
	});
}

function get () {
	return assets;
}

function fromFile (content) {
	// only used in dual builds
	let moduleScripts = [];
	assets.js.forEach((js) => {
		const read = `<script type="text/javascript" src="/${js}"></script>`;
		const write = `<script type="module" src="/${js}"></script>`;
		const index = content.indexOf(read);
		if (index > -1) {
			moduleScripts.push({
				index,
				file: write
			});
		}
	});

	moduleScripts.sort((a, b) => {
		return a.index - b.index;
	});
	moduleScripts = moduleScripts.map(o => o.file);
	return moduleScripts;
}

function toFile (content, moduleScripts, options) {
	const attr = options.ieOnly ? 'type="text/javascript"' : 'nomodule';

	assets.js.forEach((js) => {
		const read = `<script type="text/javascript" src="/${js}"></script>`;
		const index = content.indexOf(read);
		if (index > -1) {
			const write = `<script ${attr} src="/${js}"></script>\n`;
			content = content.replace(read, write);
		}
	});

	if (options.polyfill) {
		const name = options.polyfill.split('/')[options.polyfill.split('/').length - 1];
		const output = path.resolve(options.root, options.output, name);
		const input = path.resolve(options.root, options.polyfill);
		fs.writeFileSync(output, fs.readFileSync(input));

		content = content.replace(`<script ${attr}`, `<script ${attr} src="/${name}"></script>\n<script ${attr}`);
	}

	if (options.webComponentsShim) {
		const name = 'custom-elements-polyfill.js';
		const shim = 'window[\'no-native-shim\'] = true;\n\n' + fs.readFileSync(path.resolve(options.projectRoot, 'node_modules', '@clubajax/custom-elements-polyfill/index.js')).toString();

		//
		fs.writeFileSync(path.resolve(options.root, options.output, name), shim);
		content = content.replace(`<script ${attr}`, `<script src="/${name}"></script>\n<script ${attr}`);
	}



	return content.replace('</body>', `\n${moduleScripts.join('\n')}\n</body>`);
}

module.exports = {
	write,
	cache,
	flush,
	get,
	fromFile,
	toFile
};
