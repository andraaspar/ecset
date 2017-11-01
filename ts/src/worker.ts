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

import { GLOBAL } from 'illa/GLOBAL'
import { View } from './data/View'
import { Renderer } from './renderer/Renderer'

GLOBAL.onerror = function(m: string, f: string, r: number, c: number, e: any) {
	GLOBAL.postMessage({
		error: `Error: ${m}
File: ${f}
Row:Col: ${r}:${c}
Stack:
${e ? e.stack : undefined}`
	})
}

// console.log('Web worker starting...')
export function onMessage(e: MessageEvent) {
	// console.log('Render starting...')
	GLOBAL.postMessage({ log: 'Render starting...' })
	let view: View = e.data
	var renderer = new Renderer(view)
	renderer.render()
	// console.log('Render finished.')
	GLOBAL.postMessage({ log: 'Render finished.' })

	GLOBAL.postMessage({ pixels: renderer.getPixels() })
}
GLOBAL.onmessage = onMessage
