#!/usr/bin/env node
const pkg = require('./package.json');
const minimist = require('minimist');
const runner = require('./index');
let args = minimist(process.argv.slice(2));

console.log('run!', args);
// console.log('process.env', process.env);
//console.log('pkg', pkg.scripts);


let config;
for (let i = 0; i < args._.length; i++) {
	const arg = args._[i];
	console.log('   - ', arg);
	if (pkg.scripts[arg]) {
		config = pkg.scripts[arg];
		break;
	}
}

args = Object.assign(args, minimist(config.split(' ')));
console.log('config', config);
console.log('args.minimist', args);

runner(args);

