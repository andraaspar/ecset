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

import * as BezierPoint from './BezierPoint'
import * as BezierSegment from './BezierSegment'
import * as Document from './Document'
import * as Path from './Path'
import * as Point from './Point'

export interface IRender {
	id: string
	points: BezierPoint.IRender[]
	isLoop: boolean
}

export interface IView {
	id: string
	pointIds: string[]
	isLoop: boolean
}

export function linearize(bezierPath: IRender, detailMultiplier: number): Path.IRender {
	let path: Path.IRender = {
		points: [],
		isLoop: bezierPath.isLoop
	}

	let n = bezierPath.points.length - 1
	for (let i = 0; i < n; i++) {
		let bezierSegment = {
			a: bezierPath.points[i],
			b: bezierPath.points[i + 1]
		}
		let segmentPoints = BezierSegment.linearize(bezierSegment, detailMultiplier)
		path.points = path.points.concat(segmentPoints.slice(i ? 1 : 0))
	}
	
	if (bezierPath.isLoop) {
		let bezierSegment = {
			a: bezierPath.points[n],
			b: bezierPath.points[0]
		}
		let segmentPath = BezierSegment.linearize(bezierSegment, detailMultiplier)
		path.points = path.points.concat(segmentPath.slice(1, -1))
	} else {
		path.points = [{id: undefined, x: bezierPath.points[0].handleIn.x, y: bezierPath.points[0].handleIn.y}, ...path.points, {id: undefined, x: bezierPath.points[n].handleOut.x, y: bezierPath.points[n].handleOut.y}]
	}

	return path
}

export function toSvg(bezierPath: IRender): string {
	let result = ''
	let prevBezierPoint: BezierPoint.IRender
	for (let i = 0, n = bezierPath.points.length; i < n; i++) {
		let bezierPoint = bezierPath.points[i]
		if (i == 0) {
			result += `M${bezierPoint.center.x},${bezierPoint.center.y}`
		} else {
			result += `C${prevBezierPoint.handleOut.x},${prevBezierPoint.handleOut.y} ${bezierPoint.handleIn.x},${bezierPoint.handleIn.y} ${bezierPoint.center.x},${bezierPoint.center.y}`
		}
		prevBezierPoint = bezierPoint
	}
	if (bezierPath.isLoop) {
		let bezierPoint = bezierPath.points[0]
		result += `C${prevBezierPoint.handleOut.x},${prevBezierPoint.handleOut.y} ${bezierPoint.handleIn.x},${bezierPoint.handleIn.y} ${bezierPoint.center.x},${bezierPoint.center.y}`
	}
	return result
}

export function iRenderify(d: Document.IView, p: IView): IRender {
	return {
		id: p.id,
		points: p.pointIds.map(id => BezierPoint.getIRender(d, id)),
		isLoop: p.isLoop
	}
}

export function getIRender(d: Document.IView, id: string ): IRender {
	return iRenderify(d, d.bezierPathsById[id])
}
