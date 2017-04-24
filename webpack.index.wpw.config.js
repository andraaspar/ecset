const baseConfig = require('./webpack.index.config.js')
const setWpwMode = require('./webpack.set-wpw-mode.js')

setWpwMode(baseConfig)

module.exports = baseConfig