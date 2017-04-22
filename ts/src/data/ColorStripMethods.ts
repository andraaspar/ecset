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
import { IRenderColorStrip } from './IRenderColorStrip'
import { IViewColorStrip } from './IViewColorStrip'
import { IViewDocument } from './IViewDocument'
import { getRenderColorField } from './ColorFieldMethods'

export function viewColorStripToRenderColorStrip(d: IViewDocument, p: IViewColorStrip): IRenderColorStrip {
	return {
		id: p.id,
		colorFieldEndTs: p.colorFieldEndTs.slice(0),
		colorFields: p.colorFieldIds.map(id => getRenderColorField(d, id))
	}
}

export function getRenderColorStrip(d: IViewDocument, id: string): IRenderColorStrip {
	return viewColorStripToRenderColorStrip(d, d.colorStripsById[id])
}
