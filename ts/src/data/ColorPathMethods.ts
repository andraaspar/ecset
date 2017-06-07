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

import { deleteColorSegment, getRenderColorSegment } from './ColorSegmentMethods'

import { Data } from './Data'
import { IPath } from './IPath'
import { IRenderColorPath } from './IRenderColorPath'
import { IViewColorPath } from './IViewColorPath'
import { IViewDocument } from './IViewDocument'
import { TSet } from './TSet'
import { getIdCountInViewDocument } from './DocumentMethods'

export function viewColorPathToRenderColorPath(d: IViewDocument, s: TSet<IPath>, p: IViewColorPath): IRenderColorPath {
	return {
		id: p.id,
		segments: p.segmentIds.map(id => getRenderColorSegment(d, s, id)),
	}
}

export function getRenderColorPath(d: IViewDocument, s: TSet<IPath>, id: string): IRenderColorPath {
	return viewColorPathToRenderColorPath(d, s, d.colorPathsById[id])
}

export function deleteColorPath(data: Data, path: IRenderColorPath) {
	delete data.document.colorPathsById[path.id]
	let deleteCount
	do {
		deleteCount = 0
		for (let segment of path.segments) {
			if (getIdCountInViewDocument(data.document, segment.id) == 1) {
				deleteCount++
				deleteColorSegment(data, segment)
			}
		}
	} while (deleteCount)
}
