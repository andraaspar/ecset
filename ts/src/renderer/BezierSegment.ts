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

import { IBezierPoint } from './BezierPoint'
import * as Bezier from './Bezier'
import { IPath } from './Path'
import { IPoint } from './Point'
import * as Point from './Point'

const AXES = [Axis.X, Axis.Y]

export interface IBezierSegment {
	a: IBezierPoint
	b: IBezierPoint
}

export function linearize(segment: IBezierSegment, steps: number): IPoint[] {
	let result: IPoint[] = []
	let positionsX: number[] = []
	let pointsPerSegment = steps + 1

	for (let axisID = 0; axisID < AXES.length; axisID++) {
		let axis = AXES[axisID]
		for (let t = 0; t < pointsPerSegment; t++) {
			let ratio = t / (pointsPerSegment - 1)

			let pos = Bezier.position(
				[
					Point.position(segment.a.center, axis),
					Point.position(segment.a.handleOut, axis),
					Point.position(segment.b.handleIn, axis),
					Point.position(segment.b.center, axis)
				],
				ratio
			)

			if (axis == Axis.X) {
				positionsX.push(pos[0])
			} else {
				result.push({
					x: positionsX[t],
					y: pos[0]
				})
			}

		}
	}

	return result
}