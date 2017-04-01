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

import * as ColorSegment from './ColorSegment'
import * as Documemt from './Document'

export interface IRender {
	segments: ColorSegment.IRender[]
	segmentEndTs: number[]
}

export interface IView {
	segmentIds: string[]
	segmentEndTs: number[]
}

export function iRenderify(d: Documemt.IView, p: IView): IRender {
	return {
		segments: p.segmentIds.map(id => ColorSegment.getIRender(d, id)),
		segmentEndTs: p.segmentEndTs.slice(0)
	}
}

export function getIRender(d: Documemt.IView, id: string): IRender {
	return iRenderify(d, d.colorPathsById[id])
}
