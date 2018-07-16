# webpack-runner

Quickly stand up a React or Vanilla JS app with customizable presets, 
removes the pain of setting up webpack.

## Features

TODO

## Installation

TODO

Create a file (suggest: `config.js`) which exports a config object. Point to this
object in the package.json run commands.

## Run

TODO
include: dev, build, dual build

## Options

**root** *(required)* *[String]*: Root folder which contains source code and config file. May be the root of the project, 
but not necessarily. May be the root of the build folder, but not necessarily. 

**host** *[String]*: Web address for dev server. Defaults to `localhost`.

**port** *[String]*: Port for dev server. Defaults to `8080`.

**output** *[String]*: Build folder. Defaults to `dist` in project root.

**input** *(required)* *[String]*: Source files of project.

**appFiles** *(required)* *[String/Array]*: Main application file or files. Usually `index.js` or `main.jsx`.

**cssMinify** *[Boolean]*: Whether or not to minify CSS output.

**analyzer** *[Boolean]*: If true will load webpack analyzer which can be be launched at `http://localhost:8888`.

**showSpeed** *[Boolean]*: If true will log build speed results of individual webpack components.

**ie** *[Boolean]*: If true, will create a production build that works for IE11 and a separate build for modern browsers. Does not affect the dev server.

**ieOnly** *[Boolean]*: If true, production build wil be ES5 that works with IE11 and will also work in modern browsers. Does not affect the dev server.

**webComponentsShim *[Boolean]*: If true, automatically includes `clubajax/custom-elements-polyfill`

**polyfill** *[String]*: A path to a file that contains polyfills for IE. if `config.ie = true`, this polyfill will only be included in the IE build.

**babelInclude** *[Array]*: Array of `node_module` folder paths that should be included in the Babel parser. 

**testModuleBuild** *[Boolean]*: If true will start the build server to test the `config.ie` dual-build. 

**html** *[Object]*: Properties for the `html-webpack-plugin`. Must include at least `template` and `filename`. 

**copy** *[Array]*: Array of objects with references to files to be copied to output. Format: `{ from: path, to: path }`

**define** *[Object]*: 

**resolve** *[Object]*: 

**headers** *[Object]*:

**plugins** *[Array]*: 

**rules** *[Array]*: 