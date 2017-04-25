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

import { IRenderValuePathPair } from './IRenderValuePathPair'
import { IViewDocument } from './IViewDocument'
import { IViewValuePathPair } from './IViewValuePathPair'
import { getRenderValuePath } from './ValuePathMethods'

export function viewValuePathPairToRenderValuePathPair(d: IViewDocument, p: IViewValuePathPair): IRenderValuePathPair {
	return {
		id: p.id,
		left: getRenderValuePath(d, p.leftId),
		right: getRenderValuePath(d, p.rightId)
	}
}

export function getRenderValuePathPair(d: IViewDocument, id: string): IRenderValuePathPair {
	return viewValuePathPairToRenderValuePathPair(d, d.valuePathPairsById[id])
}