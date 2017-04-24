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

import { IRenderColorPath } from './IRenderColorPath'
import { IViewColorPath } from './IViewColorPath'
import { IViewDocument } from './IViewDocument'
import { getRenderColorSegment } from './ColorSegmentMethods'

export function viewColorPathToRenderColorPath(d: IViewDocument, p: IViewColorPath): IRenderColorPath {
	return {
		id: p.id,
		segments: p.segmentIds.map(id => getRenderColorSegment(d, id)),
		segmentTs: p.segmentTs.slice(0)
	}
}

export function getRenderColorPath(d: IViewDocument, id: string): IRenderColorPath {
	return viewColorPathToRenderColorPath(d, d.colorPathsById[id])
}
