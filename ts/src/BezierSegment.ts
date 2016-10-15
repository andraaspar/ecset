import Axis from 'illa/Axis2D'

import {IBezierPoint} from './BezierPoint'
import {
	calculateBezierPosition
} from './BezierUtil'
import {IPath} from './Path'
import * as Point from './Point'

const AXES = [Axis.X, Axis.Y]

export interface IBezierSegment {
	a: IBezierPoint
	b: IBezierPoint
}

export function linearize(segment: IBezierSegment, steps: number): IPath {
	let result: IPath = []
	let positionsX: number[] = []
	let pointsPerSegment = steps + 1

	for (let axisID = 0; axisID < AXES.length; axisID++) {
		let axis = AXES[axisID]
		for (let t = 0; t < pointsPerSegment; t++) {
			let ratio = t / (pointsPerSegment - 1)

			let pos = calculateBezierPosition(
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