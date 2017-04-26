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
import { IRenderColorSegment } from './IRenderColorSegment'
import { IViewColorSegment } from './IViewColorSegment'
import { IViewDocument } from './IViewDocument'
import { TSet } from './TSet'
import { getRenderBezierPath } from './BezierPathMethods'
import { getRenderColorFromAplhaMultiplier } from './AlphaMultiplierMethods'

export function viewColorSegmentToRenderColorSegment(d: IViewDocument, s: TSet<IPath>, p: IViewColorSegment): IRenderColorSegment {
	return {
		id: p.id,
		a: getRenderColorFromAplhaMultiplier(d, p.aId),
		b: getRenderColorFromAplhaMultiplier(d, p.bId),
		tweenPath: getRenderBezierPath(d, s, p.tweenPathId),
	}
}

export function getRenderColorSegment(d: IViewDocument, s: TSet<IPath>, id: string): IRenderColorSegment {
	return viewColorSegmentToRenderColorSegment(d, s, d.colorSegmentsById[id])
}
