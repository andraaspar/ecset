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

import { deleteColorStrip, getRenderColorStrip } from './ColorStripMethods'

import { Data } from './Data'
import { IPath } from './IPath'
import { IRenderColorStripPair } from './IRenderColorStripPair'
import { IViewColorStripPair } from './IViewColorStripPair'
import { IViewDocument } from './IViewDocument'
import { TSet } from './TSet'
import { getIdCountInViewDocument } from './DocumentMethods'

export function viewColorStripPairToRenderColorStripPair(d: IViewDocument, s: TSet<IPath>, p: IViewColorStripPair): IRenderColorStripPair {
	return {
		id: p.id,
		left: getRenderColorStrip(d, s, p.leftId),
		right: getRenderColorStrip(d, s, p.rightId)
	}
}

export function getRenderColorStripPair(d: IViewDocument, s: TSet<IPath>, id: string): IRenderColorStripPair {
	return viewColorStripPairToRenderColorStripPair(d, s, d.colorStripPairsById[id])
}

export function deleteColorStripPair(data: Data, pair: IRenderColorStripPair) {
	delete data.document.colorStripPairsById[pair.id]
	let deleteCount
	do {
		deleteCount = 0
		for (let strip of [
			pair.left,
			pair.right,
		]) {
			if (getIdCountInViewDocument(data.document, strip.id) == 1) {
				deleteCount++
				deleteColorStrip(data, strip)
			}
		}
	} while (deleteCount)
}
