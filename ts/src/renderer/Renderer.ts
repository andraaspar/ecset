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
	focusDistance: number
	focusSide: number
}

export default class Renderer {

	private segmentCount: number
	private segmentInfos: ISegmentInfo[]
	private pathLength: number
	private startColorLeft = [255, 0, 0, 255]
	private endColorLeft = [255, 255, 0, 0]
	private startColorRight = [255, 255, 255, 0]
	private endColorRight = [255, 0, 255, 128]

	constructor(
		private imageData: ImageData,
		private path: IPath
	) { }

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
		// if (x == 1023 && y == 0) {
		// 	console.log('.')
		// }
		let result: IColor = [0, 0, 0, 0]
		let currentLength = 0
		let currentT = 0
		let prevT: number = Infinity
		let closestDistance: number = Infinity
		let closestPathT: number = NaN
		let closestPathSide: number = 0
		let closestSegment: ISegment
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
			let isBeyondFocus = side == segmentInfo.focusSide && dist > segmentInfo.focusDistance
			let tGainA = segmentInfo.tGain.a * dist * side
			let tGainB = segmentInfo.tGain.b * dist * side
			let newRange = tGainA + 1 + tGainB
			let tRatio = newRange ? 1 / newRange : 0
			t = (t + tGainA) * tRatio
			let isOnPath = !isBeyondFocus && t >= 0 && t < 1
			let isBeforePath = !this.path.isLoop && isFirst && t < 0
			let isAfterPath = !this.path.isLoop && isLast && t >= 1
			if (isOnPath || isBeforePath || isAfterPath) {
				if (dist <= closestDistance) {
					closestDistance = dist
					closestPathT = this.pathLength ? (currentLength + segmentInfo.length * t) / this.pathLength : 0
					closestPathSide = side
					closestSegment = segment
				}
			}
			prevT = t
			currentLength += segmentInfo.length
			currentT = this.pathLength ? currentLength / this.pathLength : 0
		}
		if (!isNaN(closestPathT)) {
			result = Color.interpolate(closestPathSide < 0 ? this.startColorLeft : this.startColorRight, closestPathSide < 0 ? this.endColorLeft : this.endColorRight, closestPathT)
			result[Color.ALPHA] = 255 //- closestDistance
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
				tGain: { a: 0, b: 0 },
				originDistance: 0,
				distanceChange: { x: 0, y: 0 },
				originT: 0,
				tChange: { x: 0, y: 0 },
				focusDistance: Infinity,
				focusSide: 0
			}
			result.push(segmentInfo)

			let vector = Segment.toVector(segment)
			vector = Point.toUnitVector(vector)

			if (prevSegmentInfo) {
				this.calculateGain(prevSegmentInfo, segmentInfo, prevVector, vector, prevSegment, segment)
				
				this.calculateFocus(prevSegmentInfo)
			}
			
			let isLast = i + 1 == n
			if (isLast) {
				if (this.path.isLoop) {
					let firstSegment = Path.segment(this.path, 0)
					this.calculateGain(segmentInfo, result[0], vector, Point.toUnitVector(Segment.toVector(firstSegment)), segment, firstSegment)
					
					this.calculateFocus(result[0])
				}
				
				this.calculateFocus(segmentInfo)
			}

			let origin: IPoint = { x: 0, y: 0 }
			let originDistance = Segment.pointDistance(segment, origin) * Segment.pointSide(segment, origin)
			let originT = Segment.pointT(segment, origin)

			let xPoint: IPoint = { x: 1, y: 0 }
			let xPointDistance = Segment.pointDistance(segment, xPoint) * Segment.pointSide(segment, xPoint)
			let xPointT = Segment.pointT(segment, xPoint)

			let yPoint: IPoint = { x: 0, y: 1 }
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
	
	calculateGain(prevSegmentInfo: ISegmentInfo, segmentInfo: ISegmentInfo, prevVector: IPoint, vector: IPoint, prevSegment: ISegment, segment: ISegment): void {
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
	
	calculateFocus(info: ISegmentInfo): void {
		let totalTGain = info.tGain.a + info.tGain.b
		if (totalTGain > 0) {
			info.focusSide = -1
		} else {
			info.focusSide = 1
		}
		info.focusDistance = totalTGain ? Math.abs(1 / totalTGain) : 0
	}
}
