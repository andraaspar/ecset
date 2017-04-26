/*
 * Copyright 2017 András Parditka.
 *
 * This file is part of Ecset.
 *
 * Ecset is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Ecset is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Ecset.  If not, see <http://www.gnu.org/licenses/>.
 */

global.color = require('color')

global.rgba = (c, alpha) => color(c).alpha(alpha)
global.rules = (arr, mapper) => arr.map(mapper).join('')
global.selectors = (arr, mapper) => {
	if (mapper) arr = arr.map(mapper)
	return arr.join(',\n')
}

let out = ``

let imports = [
	'./vars',
	'../node_modules/normalize.css/normalize.css',
	'./elems',
	'./regulars/p-canvas',
	'./regulars/p-ecset',
	'./regulars/p-path',
	'./regulars/p-point',
	'./regulars/p-form',
	'./regulars/p-border',
	'./regulars/p-button',
]

imports.filter(i => !i.endsWith('.css')).forEach(i => require(i))

imports.forEach(i => {
	if (i.endsWith('.css')) {
		out += require('fs').readFileSync(i, 'utf8')
	} else {
		let t = require(i)
		if (typeof t == 'function') {
			out += t()
		} else {
			out += t
		}
	}
})

write('../kapocs/tmp/asset-templates/style/index.css', out)

function write(path, out) {
	require('mkdirp').sync(require('path').dirname(path))
	require('fs').writeFileSync(path, out)
}
