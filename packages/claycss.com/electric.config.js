'use strict';

const clay = require('clay');
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');

require('gulp-storage')(gulp);

gulp.storage.create('claycss', 'claycss.json');

const generateIconData = require('./lib/icons');

let clayJSPath = path.join(clay.srcDir, 'js');

const clayPath = gulp.storage.get('clayPath');
let clayIncludePaths = clay.includePaths;

if (clayPath) {
	clayIncludePaths = path.join(
		path.join(process.cwd(), clayPath, 'src/scss')
	);

	console.log(
		'Warning! using ' +
			clayIncludePaths +
			' to compile sass.\nDelete claycss.json to reset.'
	);
}

const excludedComponents = /.*pagination/;
const metalComponents = ['electric-marble-components']
	.concat(fs.readdirSync('../').filter(f => f.match(/^clay-.*/) && !f.match(excludedComponents)));

module.exports = {
	apiConfig: {
		layout: 'api',
		project: {
			refs: ['v2.0.0-rc.0'],
			repo: 'clay',
			src: [
				'packages/clay-*/src/**/*.js',
			],
			user: 'liferay',
		},
	},
	frontMatterHook: function(data) {
		return generateIconData(data);
	},
	entryPoints: {
		electricAPI: path.join(__dirname, 'src/partials/ElectricAPI.js'),
	},
	codeMirrorLanguages: ['xml', 'htmlmixed', 'soy'],
	metalComponents: metalComponents,
	resolveModules: ['../../node_modules'],
	sassOptions: {
		includePaths: ['node_modules', clayIncludePaths],
	},
	vendorSrc: [
		{
			dest: 'dist/vendor/lexicon',
			src: path.join(clay.buildDir, 'images', 'icons', '*'),
		},
		{
			src: [
				path.join(clayJSPath, 'svg4everybody.js'),
				path.join(clayJSPath, 'bootstrap.js'),
			],
		},
		{
			src: path.join(clayJSPath, 'svg4everybody.js'),
		},
		{
			src: path.join('../clay-charts/build/clay-charts.css'),
		},
	],
};
