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

import * as Document from './Document'
import * as ValueSegment from './ValueSegment'

export interface IRender {
	segments: ValueSegment.IRender[]
	segmentTs: number[]
}

export interface IView {
	segmentIds: string[]
	segmentTs: number[]
}

export function iRenderify(d: Document.IView, p: IView): IRender {
	return {
		segments: p.segmentIds.map(id => ValueSegment.getIRender(d, id)),
		segmentTs: p.segmentTs.slice(0)
	}
}

export function getIRender(d: Document.IView, id: string): IRender {
	return iRenderify(d, d.valuePathsById[id])
}
