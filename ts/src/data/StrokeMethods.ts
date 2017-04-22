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

import { IRenderStroke } from './IRenderStroke'
import { IViewDocument } from './IViewDocument'
import { IViewStroke } from './IViewStroke'
import { getRenderBezierPath } from './BezierPathMethods'
import { getRenderColorStripPair } from './ColorStripPairMethods'
import { getRenderTransform } from './TransformMethods'
import { getRenderValuePathPair } from './ValuePathPairMethods'

export function viewStrokeToRenderStroke(d: IViewDocument, p: IViewStroke): IRenderStroke {
	return {
		id: p.id,
		bezierPath: getRenderBezierPath(d, p.bezierPathId),
		stripPair: getRenderColorStripPair(d, p.stripPairId),
		thicknessPair: getRenderValuePathPair(d, p.thicknessPairId),
		cutoffPair: getRenderValuePathPair(d, p.cutoffPairId),
		children: p.childIds.map(id => getRenderStroke(d, id)),
		transform: getRenderTransform(d, p.transformId)
	}
}

export function getRenderStroke(d: IViewDocument, id: string): IRenderStroke {
	return viewStrokeToRenderStroke(d, d.strokesById[id])
}
