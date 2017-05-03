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

import { deleteBezierPath, deselectAllBezierPaths, getRenderBezierPath, selectBezierPath } from './BezierPathMethods'
import { deleteBezierPathPair, getRenderBezierPathPair } from './BezierPathPairMethods'
import { deleteColorStripPair, getRenderColorStripPair } from './ColorStripPairMethods'
import { deleteTransform, getRenderTransform } from './TransformMethods'

import { BezierKind } from './BezierKind'
import { IData } from './IData'
import { IPath } from './IPath'
import { IRenderStroke } from './IRenderStroke'
import { IViewDocument } from './IViewDocument'
import { IViewStroke } from './IViewStroke'
import { TSet } from './TSet'
import { createGrayViewColor } from './ColorMethods'
import { getIdCountInViewDocument } from './DocumentMethods'
import { uuid } from 'illa/StringUtil'

export function viewStrokeToRenderStroke(d: IViewDocument, s: TSet<IPath>, p: IViewStroke): IRenderStroke {
	return {
		id: p.id,
		bezierPath: getRenderBezierPath(d, s, p.bezierPathId),
		stripPair: getRenderColorStripPair(d, s, p.stripPairId),
		thicknessPair: getRenderBezierPathPair(d, s, p.thicknessPairId),
		children: p.childIds.map(id => getRenderStroke(d, s, id)),
		transform: getRenderTransform(d, p.transformId)
	}
}

export function getRenderStroke(d: IViewDocument, s: TSet<IPath>, id: string): IRenderStroke {
	return viewStrokeToRenderStroke(d, s, d.strokesById[id])
}

export function deselectAllStrokes(data: IData) {
	data.selectedStrokeIds = {}
	deselectAllBezierPaths(data)
}

export function selectStroke(data: IData, id: string) {
	data.selectedStrokeIds[id] = true
	let s = data.document.strokesById[id]
	selectBezierPath(data, s.bezierPathId)
}

export function deleteStroke(data: IData, stroke: IRenderStroke) {
	delete data.pixelsByStrokeId[stroke.id]
	delete data.selectedStrokeIds[stroke.id]
	delete data.viewsByStrokeId[stroke.id]
	delete data.document.strokesById[stroke.id]
	data.document.strokeIds = data.document.strokeIds.filter(anId => anId != stroke.id)
	let deleteCount
	do {
		deleteCount = 0
		for (let child of stroke.children) {
			if (getIdCountInViewDocument(data.document, child.id) == 1) {
				deleteCount++
				deleteStroke(data, child)
			}
		}
		if (getIdCountInViewDocument(data.document, stroke.stripPair.id) == 1) {
			deleteCount++
			deleteColorStripPair(data, stroke.stripPair)
		}
		if (getIdCountInViewDocument(data.document, stroke.thicknessPair.id) == 1) {
			deleteCount++
			deleteBezierPathPair(data, stroke.thicknessPair)
		}
		if (getIdCountInViewDocument(data.document, stroke.bezierPath.id) == 1) {
			deleteCount++
			deleteBezierPath(data, stroke.bezierPath)
		}
		if (getIdCountInViewDocument(data.document, stroke.transform.id) == 1) {
			deleteCount++
			deleteTransform(data, stroke.transform)
		}
	} while (deleteCount)
	stroke.stripPair
}

export function createStroke(data: IData) {
	let blackId = `13636f84-3fd2-6aae-4230-66a0767cb765`
	let whiteId = `333b3ea5-9d19-d1ae-4745-b64c98dfabb7`
	data.document.colorsById[blackId] = createGrayViewColor(data, blackId, 255, 0)
	data.document.colorsById[whiteId] = createGrayViewColor(data, whiteId, 255, 255)

	let black100Id = `17ec8dcb-9639-ed9d-4011-b4c88d290a37`
	data.document.aplhaMultipliersById[black100Id] = {
		id: black100Id,
		colorId: blackId,
		alphaMultiplier: 1,
	}
	let black0Id = `64cff27b-98dd-d2ba-45fa-3266ea62678c`
	data.document.aplhaMultipliersById[black0Id] = {
		id: black0Id,
		colorId: blackId,
		alphaMultiplier: 0,
	}
	let white100Id = `f8be8ec9-cfda-00b6-4595-d8bc5d1ddcab`
	data.document.aplhaMultipliersById[white100Id] = {
		id: white100Id,
		colorId: whiteId,
		alphaMultiplier: 1,
	}
	let white0Id = `70ad082a-40f9-52b9-48c6-cc14d1281390`
	data.document.aplhaMultipliersById[white0Id] = {
		id: white0Id,
		colorId: whiteId,
		alphaMultiplier: 0,
	}

	let pointZeroId = `84679294-c8bb-249a-4382-a2ffb51405c6`
	data.document.pointsById[pointZeroId] = {
		id: pointZeroId,
		kind: BezierKind.TWEEN,
		x: 0,
		y: 0,
	}
	let pointOneId = `fa47643f-3e31-46ba-495c-21d21c450431`
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

	let bezierPointZeroId = `496d1a2b-53c3-88aa-4fe6-aecb78b13f17`
	data.document.bezierPointsById[bezierPointZeroId] = {
		id: bezierPointZeroId,
		kind: BezierKind.TWEEN,
		handleInId: pointZeroId,
		centerId: pointZeroId,
		handleOutId: pointZeroId,
	}
	let bezierPointOneId = `c104f11f-6ef6-0fbe-4461-eabf5953becb`
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

	let linearPathId = `07e285c5-e141-aeb9-403a-790f350a36e9`
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

	let colorSegmentBlack100ToWhite0Id = `740ab73b-6e62-b2bb-4a8c-9c450d6dbf1f`
	data.document.colorSegmentsById[colorSegmentBlack100ToWhite0Id] = {
		id: colorSegmentBlack100ToWhite0Id,
		aId: black100Id,
		bId: white0Id,
		tweenPathId: linearPathId,
	}
	let colorSegmentWhite100ToBlack0Id = `3166ccb5-4989-ca96-4f56-0f0f0790d54d`
	data.document.colorSegmentsById[colorSegmentWhite100ToBlack0Id] = {
		id: colorSegmentWhite100ToBlack0Id,
		aId: white100Id,
		bId: black0Id,
		tweenPathId: linearPathId,
	}

	let colorPathBlack100ToWhite0Id = `a7b84ba7-d158-4685-4708-a1961455e4d1`
	data.document.colorPathsById[colorPathBlack100ToWhite0Id] = {
		id: colorPathBlack100ToWhite0Id,
		segmentIds: [colorSegmentBlack100ToWhite0Id],
	}
	let colorPathWhite100ToBlack0Id = `bcb771b1-1ff4-f79f-4ffd-04b0448ae48b`
	data.document.colorPathsById[colorPathWhite100ToBlack0Id] = {
		id: colorPathWhite100ToBlack0Id,
		segmentIds: [colorSegmentWhite100ToBlack0Id],
	}

	let colorFieldId = `b517b93f-19df-8e95-4507-68281e4ee060`
	data.document.colorFieldsById[colorFieldId] = {
		id: colorFieldId,
		aId: colorPathBlack100ToWhite0Id,
		bId: colorPathWhite100ToBlack0Id,
		colorTweenPathIds: [linearPathId],
	}
	let colorStripId = `748b5d38-d64c-0498-43dd-34d68d030263`
	data.document.colorStripsById[colorStripId] = {
		id: colorStripId,
		colorFieldIds: [colorFieldId],
		colorFieldTs: [0],
		parallelTPathIds: [linearPathId],
	}
	let colorStripPairId = `15053faa-9385-4890-41ac-368e0a9e6bbd`
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
