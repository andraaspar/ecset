import { IPoint } from './Point'
import * as Point from './Point'
import { IPath } from './Path'
import { ISegment } from './Segment'
import * as Segment from './Segment'
import * as Path from './Path'
import { IColor } from './Color'
import * as Color from './Color'

export interface IGainInfo {
	a: number
	b: number
}

export interface ISegmentInfo {
	positiveTGain: IGainInfo
	negativeTGain: IGainInfo
}

export function render(iData: ImageData, p: IPath): void {

	for (let i = 0, n = iData.data.length; i < n; i += 4) {
		let x = i / 4 % iData.width
		let y = Math.floor(i / 4 / iData.width)
		let d = 1 / 3
		let color = getColor({ x: x, y: y }, p)
		color.push(color.shift()) // ARGB to RGBA
		for (let j = 0; j < 4; j++) {
			iData.data[i + j] = color[j]
		}
	}
}

export function getColor(pt: IPoint, p: IPath): IColor {
	let result: IColor = [0, 0, 0, 0]
	let startColor = [255, 0, 0, 255]
	let endColor = [0, 255, 0, 0]
	let pathLength = Path.length(p)
	let currentLength = 0
	let currentT = 0
	let prevT: number = Infinity
	let closest: ISegment | IPoint
	let closestDistance: number = Infinity
	let closestPathT: number = 0
	for (let i = 0, n = Path.segmentCount(p); i < n; i++) {
		let seg = Path.segment(p, i)
		let segLength: number = Segment.length(seg)
		let perp = Segment.perpendicular(seg, pt)
		let t = Segment.intersectionT(seg, perp)
		let dist = Infinity
		if (t < 0) {
			if (prevT > 1) {
				dist = Point.distance(seg.a, pt)
				if (dist <= closestDistance) {
					closest = seg.a
					closestDistance = dist
					closestPathT = currentT
				}
			}
		} else if (t > 1) {
			var isLast = i + 1 == n
			if (isLast) {
				dist = Point.distance(seg.b, pt)
				if (dist <= closestDistance) {
					closest = seg.b
					closestDistance = dist
					closestPathT = (currentLength + segLength) / pathLength
				}
			}
		} else {
			dist = Segment.pointDistance(seg, pt)
			if (dist <= closestDistance) {
				closest = seg
				closestDistance = dist
				closestPathT = (currentLength + segLength * t) / pathLength
			}
		}
		prevT = t
		currentLength += segLength
		currentT = currentLength / pathLength
	}
	if (closest) {
		result = Color.interpolate(startColor, endColor, closestPathT)
		result[Color.ALPHA] = 255 - closestDistance
	}
	return result
}

export function calculateSegmentInfo(path: IPath): ISegmentInfo[] {
	let result: ISegmentInfo[] = []
	for (let i = 0, n = Path.segmentCount(path); i < n; i++) {
		let prevSegment = Path.segment(path, i - 1)
		let segment = Path.segment(path, i)
		let nextSegment = Path.segment(path, i + 1)
		let segmentInfo: ISegmentInfo = {
			negativeTGain: {a: 0, b: 0},
			positiveTGain: {a: 0, b: 0}
		}
		if (prevSegment) {
			
		} else {
			
		}
	}
	return result
}
