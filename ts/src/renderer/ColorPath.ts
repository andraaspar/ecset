/*
 * Copyright 2016 András Parditka.
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

export interface I {
	segments: ColorSegment.I[]
	segmentEndTs: number[]
}

export interface IProp {
	segmentIds: P<string>[]
	segmentEndTs: P<number>[]
}

export function deprop(d: Documemt.IProp, p: IProp): I {
	return {
		segments: p.segmentIds.map(id => ColorSegment.getDepropped(d, id())),
		segmentEndTs: p.segmentEndTs.map(t => t())
	}
}

export function getDepropped(d: Documemt.IProp, id: string): I {
	return deprop(d, d.colorPathsById[id])
}
