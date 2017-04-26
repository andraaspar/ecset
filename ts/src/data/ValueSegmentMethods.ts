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
import { IRenderValueSegment } from './IRenderValueSegment'
import { IViewDocument } from './IViewDocument'
import { IViewValueSegment } from './IViewValueSegment'
import { TSet } from './TSet'
import { getRenderBezierPath } from './BezierPathMethods'

export function viewValueSegmentToRenderValueSegment(d: IViewDocument, s: TSet<IPath>, p: IViewValueSegment): IRenderValueSegment {
	return {
		id: p.id,
		a: p.a,
		b: p.b,
		tweenPath: getRenderBezierPath(d, s, p.tweenPathId),
	}
}

export function getRenderValueSegment(d: IViewDocument, s: TSet<IPath>, id: string): IRenderValueSegment {
	return viewValueSegmentToRenderValueSegment(d, s, d.valueSegmentsById[id])
}
