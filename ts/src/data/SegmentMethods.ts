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

import { addPoints, perpProduct, perpendicularVector, pointDistance, subtractPoints, vectorAngle } from './PointMethods'

import { ISegment } from './ISegment'
import { Point } from './IPoint'
import { angleSide } from './AngleMethods'

export function segmentLength(segment: ISegment): number {
	return pointDistance(segment.a, segment.b)
}

export function segmentToPointDistance(segment: ISegment, point: Point): number {
	// http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
	let distance = Math.abs((segment.b.y - segment.a.y) * point.x - (segment.b.x - segment.a.x) * point.y + segment.b.x * segment.a.y - segment.b.y * segment.a.x) / Math.sqrt(Math.pow(segment.b.y - segment.a.y, 2) + Math.pow(segment.b.x - segment.a.x, 2))
	// distance *= pointSide(segment, point)
	return distance
}

export function segmentPointSide(segment: ISegment, point: Point): number {
	let segmentVector = segmentToVector(segment)
	let pointVector = subtractPoints(point, segment.a)
	let segmentAngle = vectorAngle(segmentVector)
	let pointAngle = vectorAngle(pointVector)
	return angleSide(segmentAngle, pointAngle)
}

export function segmentPointT(segment: ISegment, point: Point): number {
	let ps = perpendicularSegment(segment, point)
	return segmentIntersectionT(segment, ps)
}

export function segmentToVector(segment: ISegment): Point {
	return subtractPoints(segment.b, segment.a)
}

export function segmentIntersectionT(a: ISegment, b: ISegment): number {
	let v1 = segmentToVector(b)
	let v2 = segmentToVector(a)
	let v3 = subtractPoints(b.a, a.a)
	// http://www.tonypa.pri.ee/vectors/tut05.html
	return perpProduct(v3, v1) / perpProduct(v2, v1)
}

export function perpendicularSegment(segment: ISegment, a: Point, clockwise?: boolean): ISegment {
	let result: ISegment = {
		a: a,
		b: addPoints(a, perpendicularVector(segmentToVector(segment), clockwise))
	}
	return result
}