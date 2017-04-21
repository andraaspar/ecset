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
import * as ColorStripPair from './ColorStripPair'
import * as Document from './Document'
import * as Point from './Point'
import * as Transform from './Transform'
import * as ValuePathPair from './ValuePathPair'

export interface IRender {
	id: string
	stripPair: ColorStripPair.IRender
	bezierPath: BezierPath.IRender
	thicknessPair: ValuePathPair.IRender
	cutoffPair: ValuePathPair.IRender
	children: IRender[]
	transform: Transform.IRender
}

export interface IView {
	id: string
	stripPairId: string
	bezierPathId: string
	thicknessPairId: string
	cutoffPairId: string
	childIds: string[]
	transformId: string
}

export function iRenderify(d: Document.IView, p: IView): IRender {
	return {
		id: p.id,
		bezierPath: BezierPath.getIRender(d, p.bezierPathId),
		stripPair: ColorStripPair.getIRender(d, p.stripPairId),
		thicknessPair: ValuePathPair.getIRender(d, p.thicknessPairId),
		cutoffPair: ValuePathPair.getIRender(d, p.cutoffPairId),
		children: p.childIds.map(id => getIRender(d, id)),
		transform: Transform.getIRender(d, p.transformId)
	}
}

export function getIRender(d: Document.IView, id: string): IRender {
	return iRenderify(d, d.strokesById[id])
}
