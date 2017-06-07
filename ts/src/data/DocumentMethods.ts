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

import { IPath } from './IPath'
import { IRenderBezierPoint } from './IRenderBezierPoint'
import { IRenderDocument } from './IRenderDocument'
import { IRenderStroke } from './IRenderStroke'
import { IViewDocument } from './IViewDocument'
import { TSet } from './TSet'
import { deepFind } from './ObjectMethods'
import { getRenderBezierPath } from './BezierPathMethods'
import { getRenderStroke } from './StrokeMethods'

export function createViewDocument(): IViewDocument {
	return {
		aplhaMultipliersById: {},
		bezierPathPairsById: {},
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
		width: 1000,
	}
}

export function viewDocumentToRenderDocument(d: IViewDocument): IRenderDocument {
	let s: TSet<IPath> = {}
	let result: IRenderDocument = {
		strokes: d.strokeIds.map(id => getRenderStroke(d, s, id)),
	}
	return result
}

export function getIdCountInRenderDocument(d: IRenderDocument, id: string) {
	return deepFind<string>(d, (obj, key, parent) => {
		return key === `id` && obj === id
	}).length
}

export function getIdCountInViewDocument(d: IViewDocument, id: string) {
	return deepFind<string>(d, (obj, key, parent) => {
		return obj === id
	}).length
}

export function getBezierPointsFromStrokes(strokes: IRenderStroke[]) {
	let result: IRenderBezierPoint[] = []
	for (let stroke of strokes) {
		result = result.concat(stroke.bezierPath.points, getBezierPointsFromStrokes(stroke.children))
	}
	return result
}