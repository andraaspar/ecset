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

import { IBezierPoint } from './BezierPoint'
import { IPath } from './Path'
import * as Path from './Path'
import * as BezierSegment from './BezierSegment'

export type IBezierPath = IBezierPoint[]

export function linearize(bezierPath: IBezierPath, steps: number): IPath {
	let path: IPath = []

	for (let i = 0, n = bezierPath.length - 1; i < n; i++) {
		let bezierSegment = {
			a: bezierPath[i],
			b: bezierPath[i + 1]
		}
		let segmentPath = BezierSegment.linearize(bezierSegment, steps)
		path = Path.join(path, segmentPath)
	}

	return path
}