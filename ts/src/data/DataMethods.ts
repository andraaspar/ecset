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

import { createViewDocument, viewDocumentToRenderDocument } from './DocumentMethods'

import { IData } from './IData'
import { IRenderStroke } from './IRenderStroke'
import { IRenderTransform } from './IRenderTransform'
import { IRenderView } from './IRenderView'
import { RendererState } from './RendererState'
import { createGrayViewColor } from './ColorMethods'
import { uuid } from 'illa/StringUtil'

export let data: IData

export function setData(v: IData) {
	if (data) throw 'oor9sa'
	data = v
}

export function createData() {
	setData({
		document: createViewDocument(),
		renderers: [],
		rendererStates: [],
		maxRenderers: navigator.hardwareConcurrency || 1,
		pixelsByStrokeId: {},
	})

	let blackId = uuid()
	let whiteId = uuid()
	data.document.colorsById[blackId] = createGrayViewColor(blackId, 255, 0)
	data.document.colorsById[whiteId] = createGrayViewColor(whiteId, 255, 255)

	let pointZeroId = uuid()
	data.document.pointsById[pointZeroId] = {
		id: pointZeroId,
		x: 0,
		y: 0,
	}
	let pointOneId = uuid()
	data.document.pointsById[pointOneId] = {
		id: pointOneId,
		x: 1,
		y: 1,
	}
	let bezierPointZeroId = uuid()
	data.document.bezierPointsById[bezierPointZeroId] = {
		id: bezierPointZeroId,
		centerId: pointZeroId,
		handleInId: pointZeroId,
		handleOutId: pointZeroId,
	}
	let bezierPointOneId = uuid()
	data.document.bezierPointsById[bezierPointOneId] = {
		id: bezierPointOneId,
		centerId: pointOneId,
		handleInId: pointOneId,
		handleOutId: pointOneId,
	}
	let linearPathId = uuid()
	data.document.bezierPathsById[linearPathId] = {
		id: linearPathId,
		pointIds: [bezierPointZeroId, bezierPointOneId],
		isLoop: false,
	}

	let colorSegmentBlackToWhiteId = uuid()
	data.document.colorSegmentsById[colorSegmentBlackToWhiteId] = {
		id: colorSegmentBlackToWhiteId,
		aId: blackId,
		bId: whiteId,
		tweenPathId: linearPathId,
	}
	let colorPathBlackToWhiteId = uuid()
	data.document.colorPathsById[colorPathBlackToWhiteId] = {
		id: colorPathBlackToWhiteId,
		segmentIds: [colorSegmentBlackToWhiteId],
		segmentEndTs: [1],
	}
	let colorFieldId = uuid()
	data.document.colorFieldsById[colorFieldId] = {
		id: colorFieldId,
		aId: colorPathBlackToWhiteId,
		bId: colorPathBlackToWhiteId,
		tTweenPathIds: [linearPathId],
		colorTweenPathIds: [linearPathId],
	}
	let colorStripId = uuid()
	data.document.colorStripsById[colorStripId] = {
		id: colorStripId,
		colorFieldIds: [colorFieldId],
		colorFieldEndTs: [1],
	}
	let colorStripPairId = uuid()
	data.document.colorStripPairsById[colorStripPairId] = {
		id: colorStripPairId,
		leftId: colorStripId,
		rightId: colorStripId,
	}

	let valueSegmentId = uuid()
	data.document.valueSegmentsById[valueSegmentId] = {
		id: valueSegmentId,
		a: 255,
		b: 255,
		tweenPathId: linearPathId,
	}
	let valuePathId = uuid()
	data.document.valuePathsById[valuePathId] = {
		id: valuePathId,
		segmentIds: [valueSegmentId],
		segmentEndTs: [1],
	}
	let valuePathPairId = uuid()
	data.document.valuePathPairsById[valuePathPairId] = {
		id: valuePathPairId,
		leftId: valuePathId,
		rightId: valuePathId,
	}

	let transformId = uuid()
	data.document.transformsById[transformId] = {
		id: transformId,
		offsetId: pointZeroId,
		scale: 1,
		rotation: 0,
		pivotId: pointZeroId,
	}

	let strokeId = uuid()
	data.document.strokesById[strokeId] = {
		id: strokeId,
		stripPairId: colorStripPairId,
		bezierPathId: linearPathId,
		thicknessPairId: valuePathPairId,
		cutoffPairId: valuePathPairId,
		childIds: [],
		transformId: transformId,
	}
}

export function render() {
	let renderDocument = viewDocumentToRenderDocument(data.document)
	let [strokes, transformLists] = flattenStokes(renderDocument.strokes)
	let renderersNeeded = Math.min(data.maxRenderers, strokes.length)
	terminateBusyRenderers()
	createRenderers(renderersNeeded)

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

function flattenStokes(strokes: IRenderStroke[], transforms: IRenderTransform[] = []): [IRenderStroke[], IRenderTransform[][]] {
	let allStrokes: IRenderStroke[] = []
	let allTransformLists: IRenderTransform[][] = []
	for (let stroke of strokes) {
		allStrokes.push(stroke)
		let transformList = transforms.concat([stroke.transform])
		allTransformLists.push(transformList)
		let [childStrokes, childTransformLists] = flattenStokes(stroke.children, transformList)
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
	}
}