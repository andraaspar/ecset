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

import { pointDistance, pointPosition } from './PointMethods'

import { Axis2D } from 'illa/Axis2D'
import { End } from 'illa/End'
import { IPath } from './IPath'
import { ISegment } from './ISegment'
import { interpolateValues } from './ValueMethods'

export function getSegmentOfPath(path: IPath, i: number): ISegment {
	let result = {
		a: path.points[i],
		b: path.points[(i + 1) % path.points.length]
	}
	if (!result.a || !result.b) return null
	return result
}

export function pathSegmentCount(path: IPath): number {
	return path.points.length - (path.isLoop ? 0 : 1)
}

export function pathSize(path: IPath, axis: Axis2D): number {
	return pathPosition(path, axis, End.MAX) - pathPosition(path, axis, End.MIN)
}

export function pathPosition(path: IPath, axis: Axis2D, end: End): number {
	let result = end == End.MIN ? Infinity : -Infinity
	let test = end == End.MIN ? Math.min : Math.max

	for (let i = 0, n = path.points.length; i < n; i++) {
		let pointOffset = pointPosition(path.points[i], axis)
		result = test(result, pointOffset)
	}

	if (!isFinite(result)) {
		result = 0
	}
	return result
}

export function pathLength(path: IPath): number {
	let result = 0
	let pointCount = path.points.length
	if (pointCount) {
		let prevPt = path.points[0]
		for (let i = 1, n = pointCount + (path.isLoop ? 1 : 0); i < n; i++) {
			let pt = path.points[i % pointCount]
			result += pointDistance(prevPt, pt)
			prevPt = pt
		}
	}
	return result
}

export function pathYForX(path: IPath, x: number) {
	let pointA = path.points[0]
	if (x < pointA.x) return pointA.y
	for (let i = 1, n = path.points.length; i < n; i++) {
		let pointB = path.points[i]
		if (pointA.x <= x && pointB.x > x) {
			let t = (x - pointA.x) / (pointB.x - pointA.x)
			return interpolateValues(pointA.y, pointB.y, t)
		}
		pointA = pointB
	}
	return path.points[path.points.length - 1].y
}
