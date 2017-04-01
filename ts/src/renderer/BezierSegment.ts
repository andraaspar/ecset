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

import * as Bezier from './Bezier'
import * as BezierPoint from './BezierPoint'
import * as Path from './Path'
import * as Point from './Point'

import { Axis2D } from 'illa/Axis2D'

const AXES = [Axis2D.X, Axis2D.Y]
const DOUBLE_PI = Math.PI * 2

export interface IRender {
	a: BezierPoint.IRender
	b: BezierPoint.IRender
}

function angleDifference(a: number, b: number): number {
	let result = a - b
	if (result < 0) result += DOUBLE_PI // 0 -> 360
	result -= Math.PI // -180 -> 180
	result = Math.abs(result) // 0 -> 180
	return result
}

export function linearize(segment: IRender, detailMultiplier: number): Point.IRender[] {
	let result: Point.IRender[] = []
	let positionsX: number[] = []
	
	let steps = Point.distance(segment.a.center, segment.a.handleOut)
	steps += Point.distance(segment.a.handleOut, segment.b.handleIn)
	steps += Point.distance(segment.b.handleIn, segment.b.center)
	steps = steps * detailMultiplier
	// console.log(`Steps: ${Math.ceil(steps)}`)
	
	let angleA = Point.angle(Point.subtract(segment.a.center, segment.a.handleOut))
	let angleB = Point.angle(Point.subtract(segment.b.handleIn, segment.a.handleOut))
	let angleAB = angleDifference(angleA, angleB)
	let angleC = Point.angle(Point.subtract(segment.a.handleOut, segment.b.handleIn))
	let angleD = Point.angle(Point.subtract(segment.b.center, segment.b.handleIn))
	let angleCD = angleDifference(angleC, angleD)
	let multiplier = (angleAB + angleCD) / DOUBLE_PI
	steps = Math.max(1, Math.ceil(steps * multiplier))
	// console.log(`Multiplied steps: ${steps}`)
	
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