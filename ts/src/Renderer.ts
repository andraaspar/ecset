import { IPoint } from './Point'
import * as Point from './Point'
import { IPath } from './Path'
import { ISegment } from './Segment'
import * as Segment from './Segment'
import * as Path from './Path'
import { IColor } from './Color'
import * as Color from './Color'
import * as Angle from './Angle'

export interface IGainInfo {
	a: number
	b: number
}

export interface ISegmentInfo {
	tGain: IGainInfo
}

export function render(imageData: ImageData, path: IPath): void {
	
	let segmentInfos = calculateSegmentInfo(path)

	for (let i = 0, n = imageData.data.length; i < n; i += 4) {
		let x = i / 4 % imageData.width
		let y = Math.floor(i / 4 / imageData.width)
		let d = 1 / 3
		let color = getColor({ x: x, y: y }, path, segmentInfos)
		color.push(color.shift()) // ARGB to RGBA
		for (let j = 0; j < 4; j++) {
			imageData.data[i + j] = color[j]
		}
	}
}

export function getColor(point: IPoint, path: IPath, segmentInfos: ISegmentInfo[]): IColor {
	let result: IColor = [0, 0, 0, 0]
	let startColor = [255, 0, 0, 255]
	let endColor = [0, 255, 0, 0]
	let pathLength = Path.length(path)
	let currentLength = 0
	let currentT = 0
	let prevT: number = Infinity
	let closest: ISegment | IPoint
	let closestDistance: number = Infinity
	let closestPathT: number = 0
	for (let i = 0, n = Path.segmentCount(path); i < n; i++) {
		let segment = Path.segment(path, i)
		let segmentInfo = segmentInfos[i]
		let segmentLength: number = Segment.length(segment)
		let t = Segment.pointT(segment, point)
		let dist = Segment.pointDistance(segment, point)
		let side = Segment.pointSide(segment, point)
		let tGainA = segmentInfo.tGain.a * dist * side
		let tGainB = segmentInfo.tGain.b * dist * side
		let newRange = tGainA + 1 + tGainB
		let tRatio = newRange ? 1 / newRange : 0
		t = (t + tGainA) * tRatio
		if (t >= 0 && t < 1) {
			if (dist <= closestDistance) {
				closest = segment
				closestDistance = dist
				closestPathT = (currentLength + segmentLength * t) / pathLength
			}
		}
		prevT = t
		currentLength += segmentLength
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
	
	let prevSegment: ISegment
	let prevSegmentInfo: ISegmentInfo
	let prevVector: IPoint
	for (let i = 0, n = Path.segmentCount(path); i < n; i++) {
		let segment = Path.segment(path, i)
		
		let segmentInfo: ISegmentInfo = {
			tGain: {a: 0, b: 0}
		}
		result.push(segmentInfo)
		
		let vector = Segment.toVector(segment)
		vector = Point.toUnitVector(vector)
		
		if (prevSegmentInfo) {
			prevVector = Point.reverseVector(prevVector)
			
			let normalVector = Point.add(prevVector, vector)
			let normalPoint = Point.add(segment.a, normalVector)
			
			let distance = Segment.pointDistance(segment, normalPoint)
			let t = Segment.pointT(segment, normalPoint)
			let side = Segment.pointSide(segment, normalPoint)
			t *= -1 // Gain
			t *= side // On right side
			if (distance) t *= 1 / distance // Per distance pixel
			segmentInfo.tGain.a = t
			
			distance = Segment.pointDistance(prevSegment, normalPoint)
			t = Segment.pointT(prevSegment, normalPoint)
			side = Segment.pointSide(prevSegment, normalPoint)
			t -= 1 // End
			t *= side // On right side
			if (distance) t *= 1 / distance // Per distance pixel
			prevSegmentInfo.tGain.b = t
		}
		
		prevSegment = segment
		prevSegmentInfo = segmentInfo
		prevVector = vector
	}
	return result
}
