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

import { deletePoint, deselectAllPoints, getRenderPoint, scaleVector, selectPoint } from './PointMethods'

import { Data } from './Data'
import { IRenderBezierPoint } from './IRenderBezierPoint'
import { IViewBezierPoint } from './IViewBezierPoint'
import { IViewDocument } from './IViewDocument'
import { getIdCountInViewDocument } from './DocumentMethods'

export function scaleRenderBezierPoint(p: IRenderBezierPoint, scale: number): IRenderBezierPoint {
	return {
		handleIn: scaleVector(p.handleIn, scale),
		center: scaleVector(p.center, scale),
		handleOut: scaleVector(p.handleOut, scale),
	}
}

export function viewBezierPointToRenderBezierPoint(d: IViewDocument, p: IViewBezierPoint, id: string): IRenderBezierPoint {
	return {
		id: id,
		center: getRenderPoint(d, p.centerId),
		handleIn: getRenderPoint(d, p.handleInId),
		handleOut: getRenderPoint(d, p.handleOutId)
	}
}

export function getRenderBezierPoint(d: IViewDocument, id: string): IRenderBezierPoint {
	return viewBezierPointToRenderBezierPoint(d, d.bezierPointsById[id], id)
}

export function deselectAllBezierPoints(data: Data) {
	data.selectedBezierPointIds = {}
	deselectAllPoints(data)
}

export function selectBezierPoint(data: Data, id: string) {
	data.selectedBezierPointIds[id] = true
	let bp = data.document.bezierPointsById[id];
	[bp.centerId, bp.handleInId, bp.handleOutId].forEach(p => selectPoint(data, p))
}

export function deleteBezierPoint(data: Data, point: IRenderBezierPoint) {
	delete data.selectedBezierPointIds[point.id]
	delete data.document.bezierPointsById[point.id]
	let deleteCount
	do {
		deleteCount = 0
		for (let p of [
			point.center,
			point.handleIn,
			point.handleOut,
		]) {
			if (getIdCountInViewDocument(data.document, p.id) == 1) {
				deleteCount++
				deletePoint(data, p)
			}
		}
	} while (deleteCount)
}
