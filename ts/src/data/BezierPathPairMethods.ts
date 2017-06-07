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

import { deleteBezierPath, getRenderBezierPath } from './BezierPathMethods'

import { Data } from './Data'
import { IPath } from './IPath'
import { IRenderBezierPathPair } from './IRenderBezierPathPair'
import { IViewBezierPathPair } from './IViewBezierPathPair'
import { IViewDocument } from './IViewDocument'
import { TSet } from './TSet'
import { getIdCountInViewDocument } from './DocumentMethods'

export function viewBezierPathPairToRenderBezierPathPair(d: IViewDocument, s: TSet<IPath>, p: IViewBezierPathPair): IRenderBezierPathPair {
	return {
		id: p.id,
		left: getRenderBezierPath(d, s, p.leftId),
		right: getRenderBezierPath(d, s, p.rightId),
	}
}

export function getRenderBezierPathPair(d: IViewDocument, s: TSet<IPath>, id: string) {
	return viewBezierPathPairToRenderBezierPathPair(d, s, d.bezierPathPairsById[id])
}

export function deleteBezierPathPair(data: Data, pair: IRenderBezierPathPair) {
	delete data.document.bezierPathPairsById[pair.id]
	let deleteCount
	do {
		deleteCount = 0
		for (let path of [
			pair.left,
			pair.right,
		]) {
			if (getIdCountInViewDocument(data.document, path.id) == 1) {
				deleteCount++
				deleteBezierPath(data, path)
			}
		}
	} while (deleteCount)
}