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

import { BezierKind } from './BezierKind'
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
		lastRenderFinished: 0,
		pixelsByStrokeId: {},
		viewsByStrokeId: {},
		canvasLocation: {
			x: 0,
			y: 0,
		},
		canvasScale: 1,
		selectedStrokeIds: {},
		selectedBezierPathIds: {},
		selectedBezierPointIds: {},
		selectedPointIds: {},
	})
	
}

export function createStroke() {
	let blackId = `Black`
	let whiteId = `White`
	data.document.colorsById[blackId] = createGrayViewColor(blackId, 255, 0)
	data.document.colorsById[whiteId] = createGrayViewColor(whiteId, 255, 255)
	
	let black100Id = `Black 100%`
	data.document.aplhaMultipliersById[black100Id] = {
		id: black100Id,
		colorId: blackId,
		alphaMultiplier: 1,
	}
	let black0Id = `Black 0%`
	data.document.aplhaMultipliersById[black0Id] = {
		id: black0Id,
		colorId: blackId,
		alphaMultiplier: 0,
	}
	let white100Id = `White 100%`
	data.document.aplhaMultipliersById[white100Id] = {
		id: white100Id,
		colorId: whiteId,
		alphaMultiplier: 1,
	}
	let white0Id = `White 0%`
	data.document.aplhaMultipliersById[white0Id] = {
		id: white0Id,
		colorId: whiteId,
		alphaMultiplier: 0,
	}

	let pointZeroId = `Origin`
	data.document.pointsById[pointZeroId] = {
		id: pointZeroId,
		kind: BezierKind.TWEEN,
		x: 0,
		y: 0,
	}
	let pointOneId = `Tween End`
	data.document.pointsById[pointOneId] = {
		id: pointOneId,
		kind: BezierKind.TWEEN,
		x: 1,
		y: 1,
	}
	let pointAId = uuid()
	data.document.pointsById[pointAId] = {
		id: pointAId,
		kind: BezierKind.ART,
		x: 100,
		y: 100,
	}
	let pointBId = uuid()
	data.document.pointsById[pointBId] = {
		id: pointBId,
		kind: BezierKind.ART,
		x: 300,
		y: 80,
	}
	let pointCId = uuid()
	data.document.pointsById[pointCId] = {
		id: pointCId,
		kind: BezierKind.ART,
		x: 400,
		y: 100,
	}
	let pointDId = uuid()
	data.document.pointsById[pointDId] = {
		id: pointDId,
		kind: BezierKind.ART,
		x: 600,
		y: 900,
	}
	let pointEId = uuid()
	data.document.pointsById[pointEId] = {
		id: pointEId,
		kind: BezierKind.ART,
		x: 700,
		y: 920,
	}
	let pointFId = uuid()
	data.document.pointsById[pointFId] = {
		id: pointFId,
		kind: BezierKind.ART,
		x: 900,
		y: 900,
	}
	
	let bezierPointZeroId = `Origin Linear`
	data.document.bezierPointsById[bezierPointZeroId] = {
		id: bezierPointZeroId,
		kind: BezierKind.TWEEN,
		handleInId: pointZeroId,
		centerId: pointZeroId,
		handleOutId: pointZeroId,
	}
	let bezierPointOneId = `Tween End Linear`
	data.document.bezierPointsById[bezierPointOneId] = {
		id: bezierPointOneId,
		kind: BezierKind.TWEEN,
		handleInId: pointOneId,
		centerId: pointOneId,
		handleOutId: pointOneId,
	}
	let bezierPointAId = uuid()
	data.document.bezierPointsById[bezierPointAId] = {
		id: bezierPointAId,
		kind: BezierKind.ART,
		handleInId: pointAId,
		centerId: pointBId,
		handleOutId: pointCId,
	}
	let bezierPointBId = uuid()
	data.document.bezierPointsById[bezierPointBId] = {
		id: bezierPointBId,
		kind: BezierKind.ART,
		handleInId: pointDId,
		centerId: pointEId,
		handleOutId: pointFId,
	}
	
	let linearPathId = `Linear Tween`
	data.document.bezierPathsById[linearPathId] = {
		id: linearPathId,
		kind: BezierKind.TWEEN,
		pointIds: [bezierPointZeroId, bezierPointOneId],
		isLoop: false,
	}
	let curvePathId = uuid()
	data.document.bezierPathsById[curvePathId] = {
		id: curvePathId,
		kind: BezierKind.ART,
		pointIds: [bezierPointAId, bezierPointBId],
		isLoop: false,
	}

	let colorSegmentBlack100ToWhite0Id = `Default Color Segment 1`
	data.document.colorSegmentsById[colorSegmentBlack100ToWhite0Id] = {
		id: colorSegmentBlack100ToWhite0Id,
		aId: black100Id,
		bId: white0Id,
		tweenPathId: linearPathId,
	}
	let colorSegmentWhite100ToBlack0Id = `Default Color Segment 2`
	data.document.colorSegmentsById[colorSegmentWhite100ToBlack0Id] = {
		id: colorSegmentWhite100ToBlack0Id,
		aId: white100Id,
		bId: black0Id,
		tweenPathId: linearPathId,
	}
	
	let colorPathBlack100ToWhite0Id = `Default Color Path 1`
	data.document.colorPathsById[colorPathBlack100ToWhite0Id] = {
		id: colorPathBlack100ToWhite0Id,
		segmentIds: [colorSegmentBlack100ToWhite0Id],
	}
	let colorPathWhite100ToBlack0Id = `Default Color Path 2`
	data.document.colorPathsById[colorPathWhite100ToBlack0Id] = {
		id: colorPathWhite100ToBlack0Id,
		segmentIds: [colorSegmentWhite100ToBlack0Id],
	}
	
	let colorFieldId = `Default Color Field`
	data.document.colorFieldsById[colorFieldId] = {
		id: colorFieldId,
		aId: colorPathBlack100ToWhite0Id,
		bId: colorPathWhite100ToBlack0Id,
		colorTweenPathIds: [linearPathId],
	}
	let colorStripId = `Default Color Strip`
	data.document.colorStripsById[colorStripId] = {
		id: colorStripId,
		colorFieldIds: [colorFieldId],
		colorFieldTs: [0],
		parallelTPathIds: [linearPathId],
	}
	let colorStripPairId = `Default Color Strip Pair`
	data.document.colorStripPairsById[colorStripPairId] = {
		id: colorStripPairId,
		leftId: colorStripId,
		rightId: colorStripId,
	}
	
	let thicknessPointAId = uuid()
	data.document.pointsById[thicknessPointAId] = {
		id: thicknessPointAId,
		x: 0,
		y: 0,
		kind: BezierKind.PROFILE,
	}
	let thicknessPointBId = uuid()
	data.document.pointsById[thicknessPointBId] = {
		id: thicknessPointBId,
		x: .25,
		y: 100,
		kind: BezierKind.PROFILE,
	}
	let thicknessPointCId = uuid()
	data.document.pointsById[thicknessPointCId] = {
		id: thicknessPointCId,
		x: .75,
		y: 100,
		kind: BezierKind.PROFILE,
	}
	let thicknessPointDId = uuid()
	data.document.pointsById[thicknessPointDId] = {
		id: thicknessPointDId,
		x: 1,
		y: 0,
		kind: BezierKind.PROFILE,
	}
	
	let thicknessBezierPointAId = uuid()
	data.document.bezierPointsById[thicknessBezierPointAId] = {
		id: thicknessBezierPointAId,
		kind: BezierKind.PROFILE,
		handleInId: thicknessPointAId,
		centerId: thicknessPointAId,
		handleOutId: thicknessPointBId,
	}
	let thicknessBezierPointBId = uuid()
	data.document.bezierPointsById[thicknessBezierPointBId] = {
		id: thicknessBezierPointBId,
		kind: BezierKind.PROFILE,
		handleInId: thicknessPointCId,
		centerId: thicknessPointDId,
		handleOutId: thicknessPointDId,
	}
	
	let thicknessPathId = uuid()
	data.document.bezierPathsById[thicknessPathId] = {
		id: thicknessPathId,
		kind: BezierKind.PROFILE,
		pointIds: [thicknessBezierPointAId, thicknessBezierPointBId],
		isLoop: false,
	}
	
	let thicknessPathPairId = uuid()
	data.document.bezierPathPairsById[thicknessPathPairId] = {
		id: thicknessPathPairId,
		kind: BezierKind.PROFILE,
		leftId: thicknessPathId,
		rightId: thicknessPathId,
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
		thicknessPairId: thicknessPathPairId,
		childIds: [],
		transformId: transformId,
	}
	
	data.document.strokeIds.push(strokeId)
	
	return strokeId
}

export function deselectAllPoints() {
	data.selectedPointIds = {}
}

export function selectPoint(id: string) {
	data.selectedPointIds[id] = true
}

export function deselectAllBezierPoints() {
	data.selectedBezierPointIds = {}
	deselectAllPoints()
}

export function selectBezierPoint(id: string) {
	data.selectedBezierPointIds[id] = true
	let p = data.document.bezierPointsById[id]
	;[p.centerId, p.handleInId, p.handleOutId].forEach(selectPoint)
}

export function deselectAllBezierPaths() {
	data.selectedBezierPathIds = {}
	deselectAllBezierPoints()
}

export function selectBezierPath(id: string) {
	data.selectedBezierPathIds[id] = true
	let p = data.document.bezierPathsById[id]
	p.pointIds.forEach(selectBezierPoint)
}

export function deselectAllStrokes() {
	data.selectedStrokeIds = {}
	deselectAllBezierPaths()
}

export function selectStroke(id: string) {
	data.selectedStrokeIds[id] = true
	let s = data.document.strokesById[id]
	selectBezierPath(s.bezierPathId)
}