import {IPoint} from './Point'
import * as Point from './Point'

export interface ISegment {
	a: IPoint,
	b: IPoint
}

export function length(segment: ISegment): number {
	return Point.distance(segment.a, segment.b)
}

export function pointDistance(segment: ISegment, point: IPoint): number {
	// http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
	let distance = Math.abs((segment.b.y - segment.a.y) * point.x - (segment.b.x - segment.a.x) * point.y + segment.b.x * segment.a.y - segment.b.y * segment.a.x) / Math.sqrt(Math.pow(segment.b.y - segment.a.y, 2) + Math.pow(segment.b.x - segment.a.x, 2))
	// distance *= pointSide(segment, point)
	return distance
}

export function pointSide(segment: ISegment, point: IPoint): number {
	let segmentVector = toVector(segment)
	let pointVector = Point.subtract(point, segment.a)
	let segmentAngle = Math.atan2(segmentVector.y, segmentVector.x)
	let pointAngle = Math.atan2(pointVector.y, pointVector.x)
	if ((pointAngle <= segmentAngle && pointAngle > segmentAngle - Math.PI) || (pointAngle > segmentAngle + Math.PI && pointAngle <= segmentAngle + 2 * Math.PI)) {
		return 1
	} else {
		return -1
	}
}

export function toVector(segment: ISegment): IPoint {
	return Point.subtract(segment.b, segment.a)
}

export function intersectionT(a: ISegment, b: ISegment): number {
	let v1 = toVector(b)
	let v2 = toVector(a)
	let v3 = Point.subtract(b.a, a.a)
	// http://www.tonypa.pri.ee/vectors/tut05.html
	return Point.perpProduct(v3, v1) / Point.perpProduct(v2, v1)
}

export function perpendicular(segment: ISegment, a: IPoint, clockwise?: boolean): ISegment {
	let result: ISegment = {
		a: a,
		b: Point.add(a, Point.perpendicularVector(toVector(segment), clockwise))
	}
	return result
}