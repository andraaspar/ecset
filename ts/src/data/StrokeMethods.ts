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
import { Color } from './Color'
import { Path } from './Path'
import { RenderBezierPath } from './RenderBezierPath'
import { RenderBezierPathPair } from './RenderBezierPathPair'
import { RenderBezierPoint } from './RenderBezierPoint'
import { RenderColorField } from './RenderColorField'
import { RenderColorPath } from './RenderColorPath'
import { RenderColorSegment } from './RenderColorSegment'
import { RenderColorStrip } from './RenderColorStrip'
import { RenderColorStripPair } from './RenderColorStripPair'
import { RenderStroke } from './RenderStroke'
import { RenderTransform } from './RenderTransform'
import { Point } from './Point'
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

	let linearPath = new RenderBezierPath(
		[
			new RenderBezierPoint(
				new Point(0, 0),
				new Point(0, 0),
				new Point(0, 0),
			),
			new RenderBezierPoint(
				new Point(1, 1),
				new Point(1, 1),
				new Point(1, 1),
			),
		],
		false
	)
	let curvePath = new RenderBezierPath(
		[
			new RenderBezierPoint(
				new Point(100, 100),
				new Point(300, 80),
				new Point(400, 100),
			),
			new RenderBezierPoint(
				new Point(600, 900),
				new Point(700, 920),
				new Point(900, 900),
			),
		],
		false
	)

	let colorSegmentBlack100ToWhite0 = new RenderColorSegment(
		black100,
		white0,
		linearPath,
	)
	let colorSegmentWhite100ToBlack0 = new RenderColorSegment(
		white100,
		black0,
		linearPath,
	)
	let colorPathBlack100ToWhite0 = new RenderColorPath(
		[
			colorSegmentBlack100ToWhite0,
			colorSegmentWhite100ToBlack0,
		]
	)
	let colorPathWhite100ToBlack0 = new RenderColorPath(
		[
			colorSegmentWhite100ToBlack0,
			colorSegmentBlack100ToWhite0,
		]
	)

	let colorField = new RenderColorField(
		colorPathBlack100ToWhite0,
		colorPathWhite100ToBlack0,
		[
			linearPath,
		]
	)

	let colorStrip = new RenderColorStrip(
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
	let colorStripPair = new RenderColorStripPair(
		colorStrip,
		colorStrip,
	)

	let thicknessBezierPointA = new RenderBezierPoint(
		new Point(0, 0),
		new Point(0, 0),
		new Point(.25, 100),
	)
	let thicknessBezierPointB = new RenderBezierPoint(
		new Point(.75, 100),
		new Point(1, 0),
		new Point(1, 0),
	)

	let thicknessPath = new RenderBezierPath(
		[
			new RenderBezierPoint(
				new Point(0, 0),
				new Point(0, 0),
				new Point(.25, 100),
			),
			new RenderBezierPoint(
				new Point(.75, 100),
				new Point(1, 0),
				new Point(1, 0),
			),
		],
		false,
	)

	let thicknessPathPair = new RenderBezierPathPair(
		thicknessPath,
		thicknessPath,
	)
	
	let transform = new RenderTransform(
		new Point(0, 0),
		1,
		0,
		new Point(0, 0),
	)

	let stroke = new RenderStroke(
		colorStripPair,
		curvePath,
		thicknessPathPair,
		[],
		transform,
	)

	return stroke
}
