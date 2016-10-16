/*
 * Copyright 2016 András Parditka.
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

import Axis from 'illa/Axis2D'
import End from 'illa/End'

import { IPoint } from './Point'
import * as Point from './Point'
import { ISegment } from './Segment'

export type IPath = IPoint[]

export function segment(path: IPath, i: number): ISegment {
	let result = {
		a: path[i],
		b: path[i + 1]
	}
	if (!result.a || !result.b) return null
	return result
}

export function segmentCount(path: IPath) {
	return path.length - 1
}

export function size(path: IPath, axis: Axis) {
	return position(path, axis, End.MAX) - position(path, axis, End.MIN)
}

export function position(path: IPath, axis: Axis, end: End) {
	let result = end == End.MIN ? Infinity : -Infinity
	let test = end == End.MIN ? Math.min : Math.max

	for (let i = 0, n = path.length; i < n; i++) {
		let pointOffset = Point.position(path[i], axis)
		result = test(result, pointOffset)
	}

	if (!isFinite(result)) {
		result = 0
	}
	return result
}

export function length(path: IPath): number {
	let result = 0
	if (path.length) {
		let prevPt = path[0]
		for (let i = 1, n = path.length; i < n; i++) {
			let pt = path[i]
			result += Point.distance(prevPt, pt)
			prevPt = pt
		}
	}
	return result
}

export function join(a: IPath, b: IPath): IPath {
	if (Point.equals(a[a.length], b[0])) b = b.slice(1)
	return a.concat(b)
}