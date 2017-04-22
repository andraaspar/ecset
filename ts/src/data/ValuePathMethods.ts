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

import { IRenderValuePath } from './IRenderValuePath'
import { IViewDocument } from './IViewDocument'
import { IViewValuePath } from './IViewValuePath'
import { getRenderValueSegment } from './ValueSegmentMethods'

export function viewValuePathToRenderValuePath(d: IViewDocument, p: IViewValuePath): IRenderValuePath {
	return {
		id: p.id,
		segments: p.segmentIds.map(id => getRenderValueSegment(d, id)),
		segmentTs: p.segmentEndTs.slice(0)
	}
}

export function getRenderValuePath(d: IViewDocument, id: string): IRenderValuePath {
	return viewValuePathToRenderValuePath(d, d.valuePathsById[id])
}
