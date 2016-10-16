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
	segment: ISegment
	length: number
	tGain: IGainInfo
	originDistance: number
	distanceChange: IPoint
	originT: number
	tChange: IPoint
}

export default class Renderer {
	
	private segmentCount: number
	private segmentInfos: ISegmentInfo[]
	private pathLength: number
	private startColor = [255, 0, 0, 255]
	private endColor = [0, 255, 0, 0]
	
	constructor(
		private imageData: ImageData,
		private path: IPath
	) {}

	render(): void {
		
		this.pathLength = Path.length(this.path)
		this.segmentInfos = this.calculateSegmentInfos()

		for (let i = 0, n = this.imageData.data.length; i < n; i += 4) {
			let x = i / 4 % this.imageData.width
			let y = Math.floor(i / 4 / this.imageData.width)
			let d = 1 / 3
			let color = this.getColor(x, y)
			color.push(color.shift()) // ARGB to RGBA
			for (let j = 0, o = color.length; j < o; j++) {
				this.imageData.data[i + j] = color[j]
			}
		}
	}

	protected getColor(x: number, y: number, force = false): IColor {
		let result: IColor = [0, 0, 0, 0]
		let currentLength = 0
		let currentT = 0
		let prevT: number = Infinity
		let closestDistance: number = Infinity
		let closestPathT: number = NaN
		for (let i = 0; i < this.segmentCount; i++) {
			let isFirst = i == 0
			let isLast = i + 1 == this.segmentCount
			let segmentInfo = this.segmentInfos[i]
			let segment = segmentInfo.segment
			// let t = Segment.pointT(segment, point)
			// let dist = Segment.pointDistance(segment, point)
			// let side = Segment.pointSide(segment, point)
			let t = segmentInfo.originT + segmentInfo.tChange.x * x + segmentInfo.tChange.y * y
			let dist = segmentInfo.originDistance + segmentInfo.distanceChange.x * x + segmentInfo.distanceChange.y * y
			let side = dist >= 0 ? 1 : -1
			dist = Math.abs(dist)
			let tGainA = segmentInfo.tGain.a * dist * side
			let tGainB = segmentInfo.tGain.b * dist * side
			let newRange = tGainA + 1 + tGainB
			let tRatio = newRange ? 1 / newRange : 0
			t = (t + tGainA) * tRatio
			let isOnPath = t >= 0 && t < 1
			let isBeforePath = isFirst && t < 0
			let isAfterPath = isLast && t >= 1
			if (isOnPath || isBeforePath || isAfterPath) {
				if (dist <= closestDistance) {
					closestDistance = dist
					closestPathT = this.pathLength ? (currentLength + segmentInfo.length * t) / this.pathLength : 0
				}
			}
			prevT = t
			currentLength += segmentInfo.length
			currentT = this.pathLength ? currentLength / this.pathLength : 0
		}
		if (!isNaN(closestPathT)) {
			result = Color.interpolate(this.startColor, this.endColor, closestPathT)
			result[Color.ALPHA] = 255 - closestDistance
		}
		return result
	}

	protected calculateSegmentInfos(): ISegmentInfo[] {
		let result: ISegmentInfo[] = []
		
		let prevSegment: ISegment
		let prevSegmentInfo: ISegmentInfo
		let prevVector: IPoint
		for (let i = 0, n = this.segmentCount = Path.segmentCount(this.path); i < n; i++) {
			let segment = Path.segment(this.path, i)
			
			let segmentInfo: ISegmentInfo = {
				segment: segment,
				length: Segment.length(segment),
				tGain: {a: 0, b: 0},
				originDistance: 0,
				distanceChange: {x: 0, y: 0},
				originT: 0,
				tChange: {x: 0, y: 0}
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
			
			let origin: IPoint = {x: 0, y: 0}
			let originDistance = Segment.pointDistance(segment, origin) * Segment.pointSide(segment, origin)
			let originT = Segment.pointT(segment, origin)
			
			let xPoint: IPoint = {x: 1, y: 0}
			let xPointDistance = Segment.pointDistance(segment, xPoint) * Segment.pointSide(segment, xPoint)
			let xPointT = Segment.pointT(segment, xPoint)
			
			let yPoint: IPoint = {x: 0, y: 1}
			let yPointDistance = Segment.pointDistance(segment, yPoint) * Segment.pointSide(segment, yPoint)
			let yPointT = Segment.pointT(segment, yPoint)
			
			segmentInfo.originDistance = originDistance
			segmentInfo.distanceChange.x = xPointDistance - originDistance
			segmentInfo.distanceChange.y = yPointDistance - originDistance
			
			segmentInfo.originT = originT
			segmentInfo.tChange.x = xPointT - originT
			segmentInfo.tChange.y = yPointT - originT
			
			prevSegment = segment
			prevSegmentInfo = segmentInfo
			prevVector = vector
		}
		return result
	}
}
