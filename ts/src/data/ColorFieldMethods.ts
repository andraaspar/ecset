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

import { IRenderColorField } from './IRenderColorField'
import { IViewColorField } from './IViewColorField'
import { IViewDocument } from './IViewDocument'
import { getRenderColorPath } from './ColorPathMethods'

export function viewColorFieldToRenderColorField(d: IViewDocument, p: IViewColorField): IRenderColorField {
	return {
		id: p.id,
		a: getRenderColorPath(d, p.aId),
		b: getRenderColorPath(d, p.bId),
		colorTweenPathIds: p.colorTweenPathIds.slice(0),
		tTweenPathIds: p.tTweenPathIds.slice(0),
	}
}

export function getRenderColorField(d: IViewDocument, id: string): IRenderColorField {
	return viewColorFieldToRenderColorField(d, d.colorFieldsById[id])
}
