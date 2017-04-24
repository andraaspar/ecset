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

import { getRenderBezierPath, linearizeBezierPath } from './BezierPathMethods'

import { IRenderDocument } from './IRenderDocument'
import { IViewDocument } from './IViewDocument'
import { getRenderStroke } from './StrokeMethods'

export function createViewDocument(): IViewDocument {
	return {
		aplhaMultipliersById: {},
		bezierPathsById: {},
		bezierPointsById: {},
		channelCount: 4,
		colorFieldsById: {},
		colorPathsById: {},
		colorsById: {},
		colorSegmentsById: {},
		colorStripPairsById: {},
		colorStripsById: {},
		height: 1000,
		pointsById: {},
		strokeIds: [],
		strokesById: {},
		transformsById: {},
		valuePathPairsById: {},
		valuePathsById: {},
		valueSegmentsById: {},
		width: 1000,
	}
}

export function viewDocumentToRenderDocument(d: IViewDocument): IRenderDocument {
	let result: IRenderDocument = {
		strokes: d.strokeIds.map(id => getRenderStroke(d, id)),
		pathsById: {},
	}
	Object.keys(d.bezierPathsById).forEach(id => {
		result.pathsById[id] = linearizeBezierPath(getRenderBezierPath(d, id), .05)
	})
	return result
}
