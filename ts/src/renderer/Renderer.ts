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

import { addPoints, reverseVector, toUnitVector } from '../data/PointMethods'
import { getSegmentOfPath, pathLength, pathSegmentCount, pathYForX } from '../data/PathMethods'
import { segmentLength, segmentPointSide, segmentPointT, segmentToPointDistance, segmentToVector } from '../data/SegmentMethods'

import { Color } from '../data/Color'
import { Path } from '../data/Path'
import { BezierPath } from '../data/BezierPath'
import { ColorField } from '../data/ColorField'
import { ColorPath } from '../data/ColorPath'
import { View } from '../data/View'
import { Segment } from '../data/Segment'
import { SegmentInfo } from '../data/SegmentInfo'
import { getBySide } from '../data/SideMethods'
import { interpolateColors } from '../data/ColorMethods'
import { interpolateValues } from '../data/ValueMethods'
import { itemAndItemT } from '../data/TMethods'
import { Point } from "../data/Point";
import { alphaMultiplierToColor, interpolateAlphaMultipliers } from "../data/AlphaMultiplierMethods";

export class Renderer {

	private segmentCount: number
	private segmentInfos: SegmentInfo[]
	private pathLength: number
	private path: Path
	private pixels: Uint8ClampedArray

	constructor(
		private view: View
	) {
		this.path = this.view.stroke.bezierPath.path
	}

	render(): void {

		this.pathLength = pathLength(this.path)
		this.segmentInfos = this.calculateSegmentInfos()
		this.pixels = new Uint8ClampedArray(this.view.width * this.view.height * this.view.channelCount)

		for (let i = 0, n = this.pixels.length; i < n; i += this.view.channelCount) {
			let x = i / this.view.channelCount % this.view.width
			let y = Math.floor(i / this.view.channelCount / this.view.width)
			let color = this.getColor(x, y)
			color.channelValues.push(color.channelValues.shift()) // ARGB to RGBA
			for (let j = 0, o = color.channelValues.length; j < o; j++) {
				this.pixels[i + j] = color.channelValues[j]
			}
		}
	}

	protected getColor(x: number, y: number): Color {
		// if (x == 1023 && y == 0) {
		// 	console.log('.')
		// }
		let result: Color = {
			channelValues: [0, 0, 0, 0],
		}
		let currentLength = 0
		let currentT = 0
		let prevT: number = Infinity
		let closestDistance: number = Infinity
		let closestPathT: number = NaN
		let closestThickness: number = NaN
		let closestPathSide: number = 0
		let closestSegment: Segment
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
				let pathT = this.pathLength ? (currentLength + segmentInfo.length * t) / this.pathLength : 0
				if (isBeforePath) {
					pathT = 0
				} else if (isAfterPath) {
					pathT = 1
				}
				let thicknessPath = getBySide(side, this.view.stroke.thicknessPair)
				let thickness = pathYForX(thicknessPath.path, pathT)

				if (distance <= thickness && distance <= closestDistance) {
					closestDistance = distance
					closestThickness = thickness
					closestPathT = pathT
					closestPathSide = side
					closestSegment = segment
				}
			}
			prevT = t
			currentLength += segmentInfo.length
			currentT = this.pathLength ? currentLength / this.pathLength : 0
		}
		if (!isNaN(closestPathT)) {
			let strip = getBySide(closestPathSide, this.view.stroke.stripPair)
			let [colorField, colorFieldT] = itemAndItemT(closestPathT, strip.colorFields, strip.colorFieldTs)
			let colorPath = this.getRenderColorPathAtT(colorField, colorFieldT)
			let colorPathTs = this.getColorPathTsAtT(strip.parallelTPaths, closestPathT)

			let colorPathT = closestDistance / closestThickness
			let [colorSegment, colorSegmentT] = itemAndItemT(colorPathT, colorPath.segments, colorPathTs)

			result = alphaMultiplierToColor(interpolateAlphaMultipliers(colorSegment.a, colorSegment.b, colorSegmentT, colorSegment.tweenPath.path))
		}
		return result
	}

	protected calculateSegmentInfos(): SegmentInfo[] {
		let result: SegmentInfo[] = []

		let prevSegment: Segment
		let prevSegmentInfo: SegmentInfo
		let prevVector: Point
		for (let i = 0, n = this.segmentCount = pathSegmentCount(this.path); i < n; i++) {
			let segment = getSegmentOfPath(this.path, i)

			let segmentInfo: SegmentInfo = {
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

			let origin: Point = { id: undefined, x: 0, y: 0 }
			let originDistance = segmentToPointDistance(segment, origin) * segmentPointSide(segment, origin)
			let originT = segmentPointT(segment, origin)

			let xPoint: Point = { id: undefined, x: 1, y: 0 }
			let xPointDistance = segmentToPointDistance(segment, xPoint) * segmentPointSide(segment, xPoint)
			let xPointT = segmentPointT(segment, xPoint)

			let yPoint: Point = { id: undefined, x: 0, y: 1 }
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

	calculateGain(prevSegmentInfo: SegmentInfo, segmentInfo: SegmentInfo, prevVector: Point, vector: Point, prevSegment: Segment, segment: Segment): void {
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

	calculateFocus(info: SegmentInfo): void {
		let totalTGain = info.tGain.a + info.tGain.b
		if (totalTGain > 0) {
			info.focusSide = -1
		} else {
			info.focusSide = 1
		}
		info.focusDistance = totalTGain ? Math.abs(1 / totalTGain) : 0
	}

	getRenderColorPathAtT(colorField: ColorField, t: number): ColorPath {
		let result: ColorPath = {
			segments: [],
		}
		let segmentTs: number[] = []
		for (let i = 0, n = colorField.a.segments.length; i < n; i++) {
			let segmentA = colorField.a.segments[i]
			let segmentB = colorField.b.segments[i]
			let colorTweenPath = colorField.colorTweenPaths[i]
			result.segments.push({
				a: interpolateAlphaMultipliers(segmentA.a, segmentB.a, t, colorTweenPath.path),
				b: interpolateAlphaMultipliers(segmentA.b, segmentB.b, t, colorTweenPath.path),
				tweenPath: segmentA.tweenPath,
			})
		}
		return result
	}

	getPixels(): Uint8ClampedArray {
		return this.pixels
	}
	
	getColorPathTsAtT(parallelPaths: BezierPath[], pathT: number) {
		let result = parallelPaths.map(path => pathYForX(path.path, pathT))
		let total = result.reduce((sum, value) => sum + value)
		let lastValue = 0
		return [0, ...result.map(value => {
			lastValue += value
			return total == 0 ? 0 : lastValue / total
		})]
	}
}
