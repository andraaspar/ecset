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

import { isEqual, isEqualWith } from 'lodash'

import { IRenderDocument } from './IRenderDocument'
import { IRenderStroke } from './IRenderStroke'
import { IRenderTransform } from './IRenderTransform'
import { IRenderView } from './IRenderView'
import { IViewDocument } from './IViewDocument'
import { RendererState } from './RendererState'
import { data } from './DataMethods'
import { get } from '../statics'
import { viewDocumentToRenderDocument } from './DocumentMethods'

export function render(force?: boolean) {
	let renderDocument = viewDocumentToRenderDocument(data.document)
	let views = createViews(renderDocument, renderDocument.strokes)
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
		startRender(renderer, index, views, renderDocument)
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
		data.renderers.push(new Worker('script/◄worker.js►'))
	}
}

function createViews(d: IRenderDocument, strokes: IRenderStroke[], transforms: IRenderTransform[] = []) {
	let views: IRenderView[] = []
	for (let stroke of strokes) {
		let view: IRenderView = {
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

function startRender(renderer: Worker, index: number, views: IRenderView[], renderDocument: IRenderDocument) {
	let view = views.pop()
	if (view) {
		data.rendererStates[index] = RendererState.BUSY
		renderer.postMessage(view)
		renderer.onmessage = (e) => {
			data.rendererStates[index] = RendererState.IDLE
			data.pixelsByStrokeId[view.stroke.id] = e.data.pixels
			data.viewsByStrokeId[view.stroke.id] = view
			startRender(renderer, index, views, renderDocument)
		}
	} else {
		data.lastRenderFinished = Date.now()
		m.redraw()
		console.info(`Renderer idle.`)
	}
}