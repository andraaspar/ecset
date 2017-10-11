const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = [
	{
		entry: {
			error: './ts/src/error.ts',
			index: './ts/src/index.ts',
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
					test: /\.svg$/,
					use: 'file-loader',
				},
				{
					test: /\.css$/,
					use: [ 'style-loader', 'css-loader' ]
				},
				{
					test: /worker\.ts$/,
					loader: 'worker-loader'
				},
				{
					test: /\.tsx?$/,
					loader: 'awesome-typescript-loader'
				},
			]
		},
		plugins: [
			new CheckerPlugin(),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor',
				minChunks: function(module, count) {
					return module.resource && (/node_modules/).test(module.resource);
				}
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'manifest'
			}),
			new HtmlWebpackPlugin({
				title: 'Ecset',
				template: 'html/index.html',
				chunks: ['manifest', 'error', 'vendor', 'index'],
				chunksSortMode: 'manual',
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
			filename: '[name].[chunkhash].js'
		}
	},
]
