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

import { ALPHA_CHANNEL_INDEX, createGrayViewColor, createViewColor, interpolateColors } from '../data/ColorMethods'
import { addPoints, pointDistance, reverseVector, toUnitVector } from '../data/PointMethods'
import { getSegmentOfPath, pathLength, pathSegmentCount } from '../data/PathMethods'
import { segmentLength, segmentPointSide, segmentPointT, segmentToPointDistance, segmentToVector } from '../data/SegmentMethods'

import { IColor } from '../data/IColor'
import { IGainInfo } from '../data/IGainInfo'
import { IPath } from '../data/IPath'
import { IRenderColor } from '../data/IRenderColor'
import { IRenderPoint } from '../data/IRenderPoint'
import { IRenderView } from '../data/IRenderView'
import { ISegment } from '../data/ISegment'
import { ISegmentInfo } from '../data/ISegmentInfo'
import { linearizeBezierPath } from '../data/BezierPathMethods'

export class Renderer {

	private segmentCount: number
	private segmentInfos: ISegmentInfo[]
	private pathLength: number
	private startColorLeft = createViewColor(undefined, 255, 0, 0, 255)
	private endColorLeft = createViewColor(undefined, 255, 255, 0, 0)
	private startColorRight = createViewColor(undefined, 255, 255, 255, 0)
	private endColorRight = createViewColor(undefined, 255, 0, 255, 128)
	private distanceLimit = 200
	private path: IPath

	constructor(
		private view: IRenderView
	) {
		this.path = linearizeBezierPath(this.view.stroke.bezierPath, .05)
	}

	render(): void {

		this.pathLength = pathLength(this.path)
		this.segmentInfos = this.calculateSegmentInfos()

		for (let i = 0, n = this.view.pixels.length; i < n; i += 4) {
			let x = i / 4 % this.view.width
			let y = Math.floor(i / 4 / this.view.width)
			let d = 1 / 3
			let color = this.getColor(x, y)
			color.channelValues.push(color.channelValues.shift()) // ARGB to RGBA
			for (let j = 0, o = color.channelValues.length; j < o; j++) {
				this.view.pixels[i + j] = color.channelValues[j]
			}
		}
	}

	protected getColor(x: number, y: number, force = false): IColor {
		// if (x == 1023 && y == 0) {
		// 	console.log('.')
		// }
		let result: IColor = createGrayViewColor(undefined, 0, 0)
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
			let distance = segmentInfo.originDistance + segmentInfo.distanceChange.x * x + segmentInfo.distanceChange.y * y
			let side = distance >= 0 ? 1 : -1
			distance = Math.abs(distance)
			let isBeyondFocus = side == segmentInfo.focusSide && distance > segmentInfo.focusDistance
			let tGainA = segmentInfo.tGain.a * distance * side
			let tGainB = segmentInfo.tGain.b * distance * side
			let newRange = tGainA + 1 + tGainB
			let tRatio = newRange ? 1 / newRange : 0
			t = (t + tGainA) * tRatio
			let isOnPath = !isBeyondFocus && t >= 0 && t < 1
			let isBeforePath = !this.path.isLoop && isFirst && (isBeyondFocus ? t >= 1 : t < 0)
			let isAfterPath = !this.path.isLoop && isLast && (isBeyondFocus ? t < 0 : t >= 1)
			if (isOnPath || isBeforePath || isAfterPath) {
				if (distance <= this.distanceLimit && distance <= closestDistance) {
					closestDistance = distance
					if (isBeforePath) {
						closestPathT = 0
					} else if (isAfterPath) {
						closestPathT = 1
					} else {
						closestPathT = this.pathLength ? (currentLength + segmentInfo.length * t) / this.pathLength : 0
					}
					closestPathSide = side
					closestSegment = segment
				}
			}
			prevT = t
			currentLength += segmentInfo.length
			currentT = this.pathLength ? currentLength / this.pathLength : 0
		}
		if (!isNaN(closestPathT)) {
			result = interpolateColors(closestPathSide < 0 ? this.startColorLeft : this.startColorRight, closestPathSide < 0 ? this.endColorLeft : this.endColorRight, closestPathT)
			result.channelValues[ALPHA_CHANNEL_INDEX] = 255 //- closestDistance
		}
		return result
	}

	protected calculateSegmentInfos(): ISegmentInfo[] {
		let result: ISegmentInfo[] = []

		let prevSegment: ISegment
		let prevSegmentInfo: ISegmentInfo
		let prevVector: IRenderPoint
		for (let i = 0, n = this.segmentCount = pathSegmentCount(this.path); i < n; i++) {
			let segment = getSegmentOfPath(this.path, i)

			let segmentInfo: ISegmentInfo = {
				segment: segment,
				length: segmentLength(segment),
				tGain: { a: 0, b: 0 },
				originDistance: 0,
				distanceChange: { id: undefined, x: 0, y: 0 },
				originT: 0,
				tChange: { id: undefined, x: 0, y: 0 },
				focusDistance: Infinity,
				focusSide: 0
			}
			result.push(segmentInfo)

			let vector = segmentToVector(segment)
			vector = toUnitVector(vector)

			if (prevSegmentInfo) {
				this.calculateGain(prevSegmentInfo, segmentInfo, prevVector, vector, prevSegment, segment)
				
				this.calculateFocus(prevSegmentInfo)
			}
			
			let isLast = i + 1 == n
			if (isLast) {
				if (this.path.isLoop) {
					let firstSegment = getSegmentOfPath(this.path, 0)
					this.calculateGain(segmentInfo, result[0], vector, toUnitVector(segmentToVector(firstSegment)), segment, firstSegment)
					
					this.calculateFocus(result[0])
				}
				
				this.calculateFocus(segmentInfo)
			}

			let origin: IRenderPoint = { id: undefined, x: 0, y: 0 }
			let originDistance = segmentToPointDistance(segment, origin) * segmentPointSide(segment, origin)
			let originT = segmentPointT(segment, origin)

			let xPoint: IRenderPoint = { id: undefined, x: 1, y: 0 }
			let xPointDistance = segmentToPointDistance(segment, xPoint) * segmentPointSide(segment, xPoint)
			let xPointT = segmentPointT(segment, xPoint)

			let yPoint: IRenderPoint = { id: undefined, x: 0, y: 1 }
			let yPointDistance = segmentToPointDistance(segment, yPoint) * segmentPointSide(segment, yPoint)
			let yPointT = segmentPointT(segment, yPoint)

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
	
	calculateGain(prevSegmentInfo: ISegmentInfo, segmentInfo: ISegmentInfo, prevVector: IRenderPoint, vector: IRenderPoint, prevSegment: ISegment, segment: ISegment): void {
		prevVector = reverseVector(prevVector)

		let normalVector = addPoints(prevVector, vector)
		let normalPoint = addPoints(segment.a, normalVector)

		let distance = segmentToPointDistance(segment, normalPoint)
		let t = segmentPointT(segment, normalPoint)
		let side = segmentPointSide(segment, normalPoint)
		t *= -1 // Gain
		t *= side // On right side
		if (distance) t *= 1 / distance // Per distance pixel
		segmentInfo.tGain.a = t

		distance = segmentToPointDistance(prevSegment, normalPoint)
		t = segmentPointT(prevSegment, normalPoint)
		side = segmentPointSide(prevSegment, normalPoint)
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
