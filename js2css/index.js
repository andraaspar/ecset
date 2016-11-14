let out = ``

let imports = [
	'./vars',
	'../bower_components/normalize-css/normalize.css',
	'./elems',
	'./regulars/p-canvas.js',
	'./regulars/p-ecset.js',
	'./regulars/p-path.js',
	'./regulars/p-point.js',
]

imports.filter(i => !i.endsWith('.css')).forEach(i => require(i))

imports.forEach(i => {
	if (i.endsWith('.css')) {
		out += require('fs').readFileSync(i, 'utf8')
	} else {
		let t = require(i)
		if (typeof t == 'function') {
			out += t()
		}
	}
})

write('../kapocs/tmp/asset-templates/style/index.css', out)

function write(path, out) {
	require('mkdirp').sync(require('path').dirname(path))
	require('fs').writeFileSync(path, out)
}
