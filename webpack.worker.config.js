const webpack = require('webpack')
const path = require('path')
const RawSource = require('webpack-sources').RawSource

module.exports = {
	entry: {
		worker: './ts/src/worker.ts'
	},
	resolve: {
		extensions: ['.ts', '.js'],
		modules: [
			'node_modules',
			'.'
		],
	},
	module: {
		loaders: [
			{
				test: /\.ts?$/,
				loader: 'awesome-typescript-loader'
			},
		]
	},
	plugins: [
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false
		// 	},
		// 	beautify: true,
		// 	output: {
		// 		indent_level: 0
		// 	}
		// }),
		function () {
			this.plugin('emit', (compilation, callback) => {
				compilation.chunks.forEach((chunk) => {
					chunk.files.filter((filename) => /\.js$/.test(filename)).forEach((filename) => {
						var source = compilation.assets[filename].source()

						compilation.assets[filename] = new RawSource(source.replace(/__WEBPACK_IMPORTED_MODULE_/g, '__'))
					})
				})
				callback()
			})
		},
	],
	externals: {
	},
	output: {
		path: path.resolve(__dirname, './kapocs/tmp/asset-templates/script'),
		filename: '[name].js'
	},
	target: 'webworker'
}