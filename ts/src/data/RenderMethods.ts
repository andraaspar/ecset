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

import * as m from 'mithril'

import { IRenderStroke } from './IRenderStroke'
import { IRenderTransform } from './IRenderTransform'
import { IRenderView } from './IRenderView'
import { RendererState } from './RendererState'
import { data } from './DataMethods'
import { viewDocumentToRenderDocument } from './DocumentMethods'

export function render() {
	console.info(`Render starting...`)
	let renderDocument = viewDocumentToRenderDocument(data.document)
	let [strokes, transformLists] = flattenStrokes(renderDocument.strokes)
	let renderersNeeded = Math.min(data.maxRenderers, strokes.length)
	terminateBusyRenderers()
	createRenderers(renderersNeeded)
	console.info(`Renderers: ${data.renderers.length} Max: ${data.maxRenderers}`)

	data.renderers.forEach((renderer, index) => {
		startRender(renderer, index, strokes, transformLists)
	})
	m.redraw()
}

function terminateBusyRenderers() {
	for (let index = data.rendererStates.length - 1; index >= 0; index--) {
		if (data.rendererStates[index] == RendererState.BUSY) {
			data.renderers[index].terminate()
			data.renderers.splice(index, 1)
			data.rendererStates.splice(index, 1)
		}
	}
}

function createRenderers(count: number) {
	while (data.renderers.length < count) {
		data.renderers.push(new Worker('script/{{worker.js}}'))
	}
}

function flattenStrokes(strokes: IRenderStroke[], transforms: IRenderTransform[] = []): [IRenderStroke[], IRenderTransform[][]] {
	let allStrokes: IRenderStroke[] = []
	let allTransformLists: IRenderTransform[][] = []
	for (let stroke of strokes) {
		allStrokes.push(stroke)
		let transformList = transforms.concat([stroke.transform])
		allTransformLists.push(transformList)
		let [childStrokes, childTransformLists] = flattenStrokes(stroke.children, transformList)
		allStrokes = allStrokes.concat(childStrokes)
		allTransformLists = allTransformLists.concat(childTransformLists)
	}
	return [allStrokes, allTransformLists]
}

function startRender(renderer: Worker, index: number, strokes: IRenderStroke[], transformLists: IRenderTransform[][], ) {
	let stroke = strokes.pop()
	let transformList = transformLists.pop()
	if (stroke) {
		let pixels = data.pixelsByStrokeId[stroke.id] || new Uint8ClampedArray(data.document.width * data.document.height * data.document.channelCount)
		let view: IRenderView = {
			height: data.document.height,
			pixels: pixels,
			stroke: stroke,
			transforms: transformList,
			width: data.document.width,
		}
		data.rendererStates[index] = RendererState.BUSY
		renderer.postMessage(view)
		renderer.onmessage = (e) => {
			data.rendererStates[index] = RendererState.IDLE
			data.pixelsByStrokeId[stroke.id] = e.data.pixels
			startRender(renderer, index, strokes, transformLists)
			m.redraw()
		}
	} else {
		console.info(`Renderer idle.`)
	}
}