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

import { IData } from './IData'
import { createGrayViewColor } from './ColorMethods'
import { createViewDocument } from './DocumentMethods'
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
	let pointAId = uuid()
	data.document.pointsById[pointAId] = {
		id: pointAId,
		x: 100,
		y: 100,
	}
	let pointBId = uuid()
	data.document.pointsById[pointBId] = {
		id: pointBId,
		x: 300,
		y: 80,
	}
	let pointCId = uuid()
	data.document.pointsById[pointCId] = {
		id: pointCId,
		x: 400,
		y: 100,
	}
	let pointDId = uuid()
	data.document.pointsById[pointDId] = {
		id: pointDId,
		x: 600,
		y: 900,
	}
	let pointEId = uuid()
	data.document.pointsById[pointEId] = {
		id: pointEId,
		x: 700,
		y: 920,
	}
	let pointFId = uuid()
	data.document.pointsById[pointFId] = {
		id: pointFId,
		x: 900,
		y: 900,
	}
	
	let bezierPointZeroId = uuid()
	data.document.bezierPointsById[bezierPointZeroId] = {
		id: bezierPointZeroId,
		handleInId: pointZeroId,
		centerId: pointZeroId,
		handleOutId: pointZeroId,
	}
	let bezierPointOneId = uuid()
	data.document.bezierPointsById[bezierPointOneId] = {
		id: bezierPointOneId,
		handleInId: pointOneId,
		centerId: pointOneId,
		handleOutId: pointOneId,
	}
	let bezierPointAId = uuid()
	data.document.bezierPointsById[bezierPointAId] = {
		id: bezierPointAId,
		handleInId: pointAId,
		centerId: pointBId,
		handleOutId: pointCId,
	}
	let bezierPointBId = uuid()
	data.document.bezierPointsById[bezierPointBId] = {
		id: bezierPointBId,
		handleInId: pointDId,
		centerId: pointEId,
		handleOutId: pointFId,
	}
	
	let linearPathId = uuid()
	data.document.bezierPathsById[linearPathId] = {
		id: linearPathId,
		pointIds: [bezierPointZeroId, bezierPointOneId],
		isLoop: false,
	}
	let curvePathId = uuid()
	data.document.bezierPathsById[curvePathId] = {
		id: curvePathId,
		pointIds: [bezierPointAId, bezierPointBId],
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
		bezierPathId: curvePathId,
		thicknessPairId: valuePathPairId,
		cutoffPairId: valuePathPairId,
		childIds: [],
		transformId: transformId,
	}
	
	data.document.strokeIds.push(strokeId)
}