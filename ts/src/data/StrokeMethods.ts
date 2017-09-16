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

import { AlphaMultiplier } from './AlphaMultiplier'
import { BezierKind } from './BezierKind'
import { CircularReferenceError } from '../error/CircularReferenceError'
import { Data } from './Data'
import { IColor } from './IColor'
import { IPath } from './IPath'
import { IRenderBezierPath } from './IRenderBezierPath'
import { IRenderBezierPathPair } from './IRenderBezierPathPair'
import { IRenderBezierPoint } from './IRenderBezierPoint'
import { IRenderColorField } from './IRenderColorField'
import { IRenderColorPath } from './IRenderColorPath'
import { IRenderColorSegment } from './IRenderColorSegment'
import { IRenderColorStrip } from './IRenderColorStrip'
import { IRenderColorStripPair } from './IRenderColorStripPair'
import { IRenderStroke } from './IRenderStroke'
import { IRenderTransform } from './IRenderTransform'
import { Point } from './IPoint'
import { TSet } from './TSet'
import { createGrayViewColor } from './ColorMethods'
import { uuid } from 'illa/StringUtil'

export function createStroke(channelCount: number) {

	let black = createGrayViewColor(channelCount, 255, 0)
	let white = createGrayViewColor(channelCount, 255, 255)

	let black100 = new AlphaMultiplier(black, 1)
	let black0 = new AlphaMultiplier(black, 0)
	let white100 = new AlphaMultiplier(white, 1)
	let white0 = new AlphaMultiplier(white, 0)

	let linearPath = new IRenderBezierPath(
		[
			new IRenderBezierPoint(
				new Point(0, 0),
				new Point(0, 0),
				new Point(0, 0),
			),
			new IRenderBezierPoint(
				new Point(1, 1),
				new Point(1, 1),
				new Point(1, 1),
			),
		],
		false
	)
	let curvePath = new IRenderBezierPath(
		[
			new IRenderBezierPoint(
				new Point(100, 100),
				new Point(300, 80),
				new Point(400, 100),
			),
			new IRenderBezierPoint(
				new Point(600, 900),
				new Point(700, 920),
				new Point(900, 900),
			),
		],
		false
	)

	let colorSegmentBlack100ToWhite0 = new IRenderColorSegment(
		black100,
		white0,
		linearPath,
	)
	let colorSegmentWhite100ToBlack0 = new IRenderColorSegment(
		white100,
		black0,
		linearPath,
	)
	let colorPathBlack100ToWhite0 = new IRenderColorPath(
		[
			colorSegmentBlack100ToWhite0,
			colorSegmentWhite100ToBlack0,
		]
	)
	let colorPathWhite100ToBlack0 = new IRenderColorPath(
		[
			colorSegmentWhite100ToBlack0,
			colorSegmentBlack100ToWhite0,
		]
	)

	let colorField = new IRenderColorField(
		colorPathBlack100ToWhite0,
		colorPathWhite100ToBlack0,
		[
			linearPath,
		]
	)

	let colorStrip = new IRenderColorStrip(
		[
			colorField,
		],
		[
			0,
		],
		[
			linearPath,
		]
	)
	let colorStripPair = new IRenderColorStripPair(
		colorStrip,
		colorStrip,
	)

	let thicknessBezierPointA = new IRenderBezierPoint(
		new Point(0, 0),
		new Point(0, 0),
		new Point(.25, 100),
	)
	let thicknessBezierPointB = new IRenderBezierPoint(
		new Point(.75, 100),
		new Point(1, 0),
		new Point(1, 0),
	)

	let thicknessPath = new IRenderBezierPath(
		[
			new IRenderBezierPoint(
				new Point(0, 0),
				new Point(0, 0),
				new Point(.25, 100),
			),
			new IRenderBezierPoint(
				new Point(.75, 100),
				new Point(1, 0),
				new Point(1, 0),
			),
		],
		false,
	)

	let thicknessPathPair = new IRenderBezierPathPair(
		thicknessPath,
		thicknessPath,
	)
	
	let transform = new IRenderTransform(
		new Point(0, 0),
		1,
		0,
		new Point(0, 0),
	)

	let stroke = new IRenderStroke(
		colorStripPair,
		curvePath,
		thicknessPathPair,
		[],
		transform,
	)

	return stroke
}
