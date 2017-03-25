const webpack = require('webpack')
const path = require('path')

module.exports = {
	entry: {
		worker: './ts/src/worker.ts'
	},
	resolve: {
		extensions: ['.ts', '.js'],
		modules: [
			'bower_components',
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
	],
	externals: {
	},
	output: {
		path: path.resolve(__dirname, './kapocs/tmp/asset-templates/script'),
		filename: '[name].js'
	},
	target: 'webworker'
}