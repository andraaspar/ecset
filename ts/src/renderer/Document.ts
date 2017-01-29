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

import * as BezierPath from './BezierPath'
import * as BezierPoint from './BezierPoint'
import * as Color from './Color'
import * as ColorField from './ColorField'
import * as ColorPath from './ColorPath'
import * as ColorSegment from './ColorSegment'
import * as ColorStrip from './ColorStrip'
import * as ColorStripPair from './ColorStripPair'
import * as Point from './Point'
import * as Stroke from './Stroke'
import * as Transform from './Transform'
import * as ValuePath from './ValuePath'
import * as ValuePathPair from './ValuePathPair'
import * as ValueSegment from './ValueSegment'

export interface I {
	strokes: Stroke.I[]
}

export interface IProp {
	bezierPathsById: {[id: string]: BezierPath.IProp}
	bezierPointsById: {[id: string]: BezierPoint.IProp}
	colorFieldsById: {[id: string]: ColorField.IProp}
	colorPathsById: {[id: string]: ColorPath.IProp}
	colorsById: {[id: string]: Color.IProp}
	colorSegmentsById: {[id: string]: ColorSegment.IProp}
	colorStripPairsById: {[id: string]: ColorStripPair.IProp}
	colorStripsById: {[id: string]: ColorStrip.IProp}
	pointsById: {[id: string]: Point.IProp}
	strokeIds: P<string>[]
	strokesById: {[id: string]: Stroke.IProp}
	transformsById: {[id: string]: Transform.IProp}
	valuePathPairsById: {[id: string]: ValuePathPair.IProp}
	valuePathsById: {[id: string]: ValuePath.IProp}
	valueSegmentsById: {[id: string]: ValueSegment.IProp}
}

export function create(): IProp {
	return {
		bezierPathsById: {},
		bezierPointsById: {},
		colorFieldsById: {},
		colorPathsById: {},
		colorsById: {},
		colorSegmentsById: {},
		colorStripPairsById: {},
		colorStripsById: {},
		pointsById: {},
		strokeIds: [],
		strokesById: {},
		transformsById: {},
		valuePathPairsById: {},
		valuePathsById: {},
		valueSegmentsById: {}
	}
}

export function deprop(d: IProp): I {
	return {
		strokes: d.strokeIds.map(id => Stroke.getDepropped(d, id()))
	}
}
