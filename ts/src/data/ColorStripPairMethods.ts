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

import { IRenderColorStripPair } from './IRenderColorStripPair'
import { IViewColorStripPair } from './IViewColorStripPair'
import { IViewDocument } from './IViewDocument'
import { getRenderColorStrip } from './ColorStripMethods'

export function viewColorStripPairToRenderColorStripPair(d: IViewDocument, p: IViewColorStripPair): IRenderColorStripPair {
	return {
		id: p.id,
		left: getRenderColorStrip(d, p.leftId),
		right: getRenderColorStrip(d, p.rightId)
	}
}

export function getRenderColorStripPair(d: IViewDocument, id: string): IRenderColorStripPair {
	return viewColorStripPairToRenderColorStripPair(d, d.colorStripPairsById[id])
}
