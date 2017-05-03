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
import { IRenderStroke } from './IRenderStroke'
import { IViewDocument } from './IViewDocument'
import { IViewStroke } from './IViewStroke'
import { TSet } from './TSet'
import { getRenderBezierPath } from './BezierPathMethods'
import { getRenderBezierPathPair } from './BezierPathPairMethods'
import { getRenderColorStripPair } from './ColorStripPairMethods'
import { getRenderTransform } from './TransformMethods'

export function viewStrokeToRenderStroke(d: IViewDocument, s: TSet<IPath>, p: IViewStroke): IRenderStroke {
	return {
		id: p.id,
		bezierPath: getRenderBezierPath(d, s, p.bezierPathId),
		stripPair: getRenderColorStripPair(d, s, p.stripPairId),
		thicknessPair: getRenderBezierPathPair(d, s, p.thicknessPairId),
		children: p.childIds.map(id => getRenderStroke(d, s, id)),
		transform: getRenderTransform(d, p.transformId)
	}
}

export function getRenderStroke(d: IViewDocument, s: TSet<IPath>, id: string): IRenderStroke {
	return viewStrokeToRenderStroke(d, s, d.strokesById[id])
}
