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
import { IRenderColorStrip } from './IRenderColorStrip'
import { IViewColorStrip } from './IViewColorStrip'
import { IViewDocument } from './IViewDocument'
import { TSet } from './TSet'
import { getRenderBezierPath } from './BezierPathMethods'
import { getRenderColorField } from './ColorFieldMethods'

export function viewColorStripToRenderColorStrip(d: IViewDocument, s: TSet<IPath>, p: IViewColorStrip): IRenderColorStrip {
	return {
		id: p.id,
		colorFieldTs: p.colorFieldTs.slice(0),
		colorFields: p.colorFieldIds.map(id => getRenderColorField(d, s, id)),
		parallelTPaths: p.parallelTPathIds.map(id => getRenderBezierPath(d, s, id)),
	}
}

export function getRenderColorStrip(d: IViewDocument, s: TSet<IPath>, id: string): IRenderColorStrip {
	return viewColorStripToRenderColorStrip(d, s, d.colorStripsById[id])
}
