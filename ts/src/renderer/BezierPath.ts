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

import { IBezierPoint, IPropBezierPoint } from './BezierPoint'
import { IPath } from './Path'
import * as Path from './Path'
import * as BezierSegment from './BezierSegment'

export type IBezierPath = IBezierPoint[]
export type IPropBezierPath = IPropBezierPoint[]

export function linearize(bezierPath: IBezierPath, steps: number): IPath {
	let path: IPath = []

	let n = bezierPath.length - 1
	for (let i = 0; i < n; i++) {
		let bezierSegment = {
			a: bezierPath[i],
			b: bezierPath[i + 1]
		}
		let segmentPath = BezierSegment.linearize(bezierSegment, steps)
		path = Path.join(path, segmentPath)
	}
	
	let isLooping = false
	if (isLooping) {
		
	} else {
		path = Path.join([{x: bezierPath[0].handleIn.x, y: bezierPath[0].handleIn.y}], path)
		path = Path.join(path, [{x: bezierPath[n].handleOut.x, y: bezierPath[n].handleOut.y}])
	}

	return path
}

export function toSvg(bezierPath: IBezierPath): string {
	let result = ''
	let prevBezierPoint: IBezierPoint
	for (let i = 0, n = bezierPath.length; i < n; i++) {
		let bezierPoint = bezierPath[i]
		if (i == 0) {
			result += `M${bezierPoint.center.x},${bezierPoint.center.y}`
		} else {
			result += `C${prevBezierPoint.handleOut.x},${prevBezierPoint.handleOut.y} ${bezierPoint.handleIn.x},${bezierPoint.handleIn.y} ${bezierPoint.center.x},${bezierPoint.center.y}`
		}
		prevBezierPoint = bezierPoint
	}
	return result
}
