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

import { pointDistance, pointPosition, subtractPoints, vectorAngle } from './PointMethods'

import { Axis2D } from 'illa/Axis2D'
import { RenderBezierSegment } from './RenderBezierSegment'
import { Point } from './Point'
import { angleDifference } from './AngleMethods'
import { bezierPosition } from './BezierMethods'

const AXES = [Axis2D.X, Axis2D.Y]
const DOUBLE_PI = Math.PI * 2

export function linearizeBezierSegment(segment: RenderBezierSegment, detailMultiplier: number): Point[] {
	let result: Point[] = []
	let positionsX: number[] = []
	
	let steps = pointDistance(segment.a.center, segment.a.handleOut)
	steps += pointDistance(segment.a.handleOut, segment.b.handleIn)
	steps += pointDistance(segment.b.handleIn, segment.b.center)
	steps = steps * detailMultiplier
	// console.log(`Steps: ${Math.ceil(steps)}`)
	
	let angleA = vectorAngle(subtractPoints(segment.a.center, segment.a.handleOut))
	let angleB = vectorAngle(subtractPoints(segment.b.handleIn, segment.a.handleOut))
	let angleAB = angleDifference(angleA, angleB)
	let angleC = vectorAngle(subtractPoints(segment.a.handleOut, segment.b.handleIn))
	let angleD = vectorAngle(subtractPoints(segment.b.center, segment.b.handleIn))
	let angleCD = angleDifference(angleC, angleD)
	let multiplier = (angleAB + angleCD) / DOUBLE_PI
	steps = Math.max(1, Math.ceil(steps * multiplier))
	// console.log(`Multiplied steps: ${steps}`)
	
	let pointsPerSegment = steps + 1

	for (let axisID = 0; axisID < AXES.length; axisID++) {
		let axis = AXES[axisID]
		for (let t = 0; t < pointsPerSegment; t++) {
			let ratio = t / (pointsPerSegment - 1)

			let pos = bezierPosition(
				[
					pointPosition(segment.a.center, axis),
					pointPosition(segment.a.handleOut, axis),
					pointPosition(segment.b.handleIn, axis),
					pointPosition(segment.b.center, axis)
				],
				ratio
			)

			if (axis == Axis2D.X) {
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