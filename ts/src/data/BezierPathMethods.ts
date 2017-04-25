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

import { getRenderBezierPoint, scaleRenderBezierPoint } from './BezierPointMethods'

import { IPath } from './IPath'
import { IRenderBezierPath } from './IRenderBezierPath'
import { IRenderBezierPoint } from './IRenderBezierPoint'
import { IViewBezierPath } from './IViewBezierPath'
import { IViewDocument } from './IViewDocument'
import { linearizeBezierSegment } from './BezierSegmentMethods'
import { scaleVector } from './PointMethods'

export function linearizeBezierPath(bezierPath: IRenderBezierPath, detailMultiplier: number): IPath {
	let path: IPath = {
		points: [],
		isLoop: bezierPath.isLoop
	}

	let n = bezierPath.points.length - 1
	for (let i = 0; i < n; i++) {
		let bezierSegment = {
			a: bezierPath.points[i],
			b: bezierPath.points[i + 1]
		}
		let segmentPoints = linearizeBezierSegment(bezierSegment, detailMultiplier)
		path.points = path.points.concat(segmentPoints.slice(i ? 1 : 0))
	}
	
	if (bezierPath.isLoop) {
		let bezierSegment = {
			a: bezierPath.points[n],
			b: bezierPath.points[0]
		}
		let segmentPath = linearizeBezierSegment(bezierSegment, detailMultiplier)
		path.points = path.points.concat(segmentPath.slice(1, -1))
	} else {
		path.points = [{x: bezierPath.points[0].handleIn.x, y: bezierPath.points[0].handleIn.y}, ...path.points, {x: bezierPath.points[n].handleOut.x, y: bezierPath.points[n].handleOut.y}]
	}

	return path
}

export function bezierPathToSvg(bezierPath: IRenderBezierPath, scale: number): string {
	let result = ''
	let prevBezierPoint: IRenderBezierPoint
	for (let i = 0, n = bezierPath.points.length; i < n; i++) {
		let bezierPoint = scaleRenderBezierPoint(bezierPath.points[i], scale)
		if (i == 0) {
			result += `M${bezierPoint.center.x},${bezierPoint.center.y}`
		} else {
			result += `C${prevBezierPoint.handleOut.x},${prevBezierPoint.handleOut.y} ${bezierPoint.handleIn.x},${bezierPoint.handleIn.y} ${bezierPoint.center.x},${bezierPoint.center.y}`
		}
		prevBezierPoint = bezierPoint
	}
	if (bezierPath.isLoop) {
		let bezierPoint = scaleRenderBezierPoint(bezierPath.points[0], scale)
		result += `C${prevBezierPoint.handleOut.x},${prevBezierPoint.handleOut.y} ${bezierPoint.handleIn.x},${bezierPoint.handleIn.y} ${bezierPoint.center.x},${bezierPoint.center.y}`
	}
	return result
}

export function viewBezierPathToRenderBezierPath(d: IViewDocument, p: IViewBezierPath): IRenderBezierPath {
	return {
		id: p.id,
		points: p.pointIds.map(id => getRenderBezierPoint(d, id)),
		isLoop: p.isLoop
	}
}

export function getRenderBezierPath(d: IViewDocument, id: string ): IRenderBezierPath {
	return viewBezierPathToRenderBezierPath(d, d.bezierPathsById[id])
}