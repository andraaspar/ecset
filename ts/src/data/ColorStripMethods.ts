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

import { deleteColorField, getRenderColorField } from './ColorFieldMethods'

import { Data } from './Data'
import { IPath } from './IPath'
import { IRenderColorStrip } from './IRenderColorStrip'
import { IViewColorStrip } from './IViewColorStrip'
import { IViewDocument } from './IViewDocument'
import { TSet } from './TSet'
import { getIdCountInViewDocument } from './DocumentMethods'
import { getRenderBezierPath } from './BezierPathMethods'

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

export function deleteColorStrip(data: Data, strip: IRenderColorStrip) {
	delete data.document.colorStripsById[strip.id]
	let deleteCount
	do {
		deleteCount = 0
		for (let field of strip.colorFields) {
			if (getIdCountInViewDocument(data.document, field.id) == 1) {
				deleteCount++
				deleteColorField(data, field)
			}
		}
		for (let path of strip.parallelTPaths) {
			if (getIdCountInViewDocument(data.document, path.id) == 1) {
				deleteCount++
				deleteColorStrip(data, strip)
			}
		}
	} while (deleteCount)
}
