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

import * as Point from './Point'
import * as Angle from './Angle'

export interface I {
	a: Point.I,
	b: Point.I
}

export function length(segment: I): number {
	return Point.distance(segment.a, segment.b)
}

export function pointDistance(segment: I, point: Point.I): number {
	// http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
	let distance = Math.abs((segment.b.y - segment.a.y) * point.x - (segment.b.x - segment.a.x) * point.y + segment.b.x * segment.a.y - segment.b.y * segment.a.x) / Math.sqrt(Math.pow(segment.b.y - segment.a.y, 2) + Math.pow(segment.b.x - segment.a.x, 2))
	// distance *= pointSide(segment, point)
	return distance
}

export function pointSide(segment: I, point: Point.I): number {
	let segmentVector = toVector(segment)
	let pointVector = Point.subtract(point, segment.a)
	let segmentAngle = Point.angle(segmentVector)
	let pointAngle = Point.angle(pointVector)
	return Angle.side(segmentAngle, pointAngle)
}

export function pointT(segment: I, point: Point.I): number {
	let perpendicularSegment = perpendicular(segment, point)
	return intersectionT(segment, perpendicularSegment)
}

export function toVector(segment: I): Point.I {
	return Point.subtract(segment.b, segment.a)
}

export function intersectionT(a: I, b: I): number {
	let v1 = toVector(b)
	let v2 = toVector(a)
	let v3 = Point.subtract(b.a, a.a)
	// http://www.tonypa.pri.ee/vectors/tut05.html
	return Point.perpProduct(v3, v1) / Point.perpProduct(v2, v1)
}

export function perpendicular(segment: I, a: Point.I, clockwise?: boolean): I {
	let result: I = {
		a: a,
		b: Point.add(a, Point.perpendicularVector(toVector(segment), clockwise))
	}
	return result
}