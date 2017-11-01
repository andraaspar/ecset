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
import * as RenderWorker from '../worker'

import { data } from './DataMethods'
import { Document } from './Document'
import { isEqual } from 'lodash'
import { RendererState } from './RendererState'
import { Stroke } from './Stroke'
import { Transform } from './Transform'
import { View } from './View'
import { BezierPath } from './BezierPath'
import { findObject } from 'illa/ObjectUtil'
import { bezierPathToPath } from './BezierPathMethods'

export function render(force?: boolean) {
	let views = createViews(data.document, data.document.strokes)
	if (!force) {
		views = views.filter(view => {
			let oldView = data.viewsByStrokeId[view.stroke.id]
			return !isEqual(oldView, view)
		})
	}
	console.info(`Views to render: ${views.length}`)
	let renderersNeeded = Math.min(data.maxRenderers, views.length)
	terminateBusyRenderers()
	createRenderers(renderersNeeded)
	console.info(`Renderers: ${data.renderers.length} Max: ${data.maxRenderers}`)
	
	data.renderers.forEach((renderer, index) => {
		startRender(renderer, index, views, data.document)
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
		data.renderers.push(new (RenderWorker as any)())
	}
}

function createViews(d: Document, strokes: Stroke[], transforms: Transform[] = []) {
	let views: View[] = []
	findObject<BezierPath>(strokes, o => o instanceof BezierPath).forEach(p => p.path = bezierPathToPath(p))
	for (let stroke of strokes) {
		let view: View = {
			channelCount: data.document.channelCount,
			height: data.document.height,
			stroke: stroke,
			transforms: transforms.concat(stroke.transform),
			width: data.document.width,
		}
		views.push(view)
		views = views.concat(createViews(d, stroke.children, view.transforms))
	}
	return views
}

function startRender(renderer: Worker, index: number, views: View[], renderDocument: Document) {
	let view = views.pop()
	if (view) {
		data.rendererStates[index] = RendererState.BUSY
		renderer.postMessage(view)
		renderer.onmessage = (e) => {
			if (e.data.pixels) {
				console.log('onmessage')
				data.rendererStates[index] = RendererState.IDLE
				data.pixelsByStrokeId[view.stroke.id] = e.data.pixels
				data.viewsByStrokeId[view.stroke.id] = view
			} else if (e.data.log) {
				console.log(e.data.log)
				return
			} else {
				console.error(e.data.error)
			}
			startRender(renderer, index, views, renderDocument)
		}
	} else {
		data.lastRenderFinished = Date.now()
		m.redraw()
		console.info(`Renderer idle.`)
	}
}
