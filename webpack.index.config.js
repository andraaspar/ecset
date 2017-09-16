const webpack = require('webpack')
const path = require('path')

module.exports = {
	entry: {
		index: './ts/src/index.ts',
		vendor: ['jquery-ts', 'mithril']
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.jsx', '.js'],
		modules: [
			'node_modules',
			'.'
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
		new webpack.optimize.CommonsChunkPlugin({
			name: ['index', 'vendor']
		}),
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
		path: path.resolve(__dirname, './build'),
		filename: '[name].js'
	}
}
