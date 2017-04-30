const path = require('path')
const RawSource = require('webpack-sources').RawSource

module.exports = function(baseConfig) {
	baseConfig.output.path = path.resolve(__dirname, './build/script')

	baseConfig.plugins.push(function() {
		this.plugin('emit', (compilation, callback) => {
			compilation.chunks.forEach((chunk) => {
				chunk.files.filter((filename) => /\.js$/.test(filename)).forEach((filename) => {
					var source = compilation.assets[filename].source()

					compilation.assets[filename] = new RawSource(source.replace(/__WEBPACK_IMPORTED_MODULE_/g, '__').replace(/◄([^◄►]+)►/g, '$1'))
				})
			})
			callback()
		})
	})
}