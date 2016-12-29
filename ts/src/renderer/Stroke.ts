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

import * as BezierPath from './BezierPath'
import * as ColorStripPair from './ColorStripPair'
import * as Document from './Document'
import * as Point from './Point'
import * as Transform from './Transform'
import * as ValuePathPair from './ValuePathPair'

export interface I {
	stripPair: ColorStripPair.I
	bezierPath: BezierPath.I
	thicknessPair: ValuePathPair.I
	cutoffPair: ValuePathPair.I
	children: I[]
	transform: Transform.I
}

export interface IProp {
	stripPairId: P<string>
	bezierPathId: P<string>
	thicknessPairId: P<string>
	cutoffPairId: P<string>
	childIds: P<string>[]
	transformId: P<string>
}

export function deprop(d: Document.IProp, p: IProp): I {
	return {
		bezierPath: BezierPath.getDepropped(d, p.bezierPathId()),
		stripPair: ColorStripPair.getDepropped(d, p.stripPairId()),
		thicknessPair: ValuePathPair.getDepropped(d, p.thicknessPairId()),
		cutoffPair: ValuePathPair.getDepropped(d, p.cutoffPairId()),
		children: p.childIds.map(id => getDepropped(d, id())),
		transform: Transform.getDepropped(d, p.transformId())
	}
}

export function getDepropped(d: Document.IProp, id: string): I {
	return deprop(d, d.strokesById[id])
}
