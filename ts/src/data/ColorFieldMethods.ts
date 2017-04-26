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
import { IRenderColorField } from './IRenderColorField'
import { IViewColorField } from './IViewColorField'
import { IViewDocument } from './IViewDocument'
import { TSet } from './TSet'
import { getRenderBezierPath } from './BezierPathMethods'
import { getRenderColorPath } from './ColorPathMethods'

export function viewColorFieldToRenderColorField(d: IViewDocument, s: TSet<IPath>, p: IViewColorField): IRenderColorField {
	return {
		id: p.id,
		a: getRenderColorPath(d, s, p.aId),
		b: getRenderColorPath(d, s, p.bId),
		colorTweenPaths: p.colorTweenPathIds.map(id => getRenderBezierPath(d, s, id)),
		tTweenPaths: p.tTweenPathIds.map(id => getRenderBezierPath(d, s, id)),
	}
}

export function getRenderColorField(d: IViewDocument, s: TSet<IPath>, id: string): IRenderColorField {
	return viewColorFieldToRenderColorField(d, s, d.colorFieldsById[id])
}
