var webpack = require("webpack");

module.exports = {
	entry: {
		worker: './ts/src/worker.ts'
	},
	resolve: {
		extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
		modulesDirectories: [
			'bower_components',
			'node_modules',
		],
	},
	module: {
		loaders: [
			{
				test: /\.tsx?$/,
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
		path: './kapocs/tmp/asset-templates/script',
		filename: '[name].js'
	},
	target: 'webworker'
};