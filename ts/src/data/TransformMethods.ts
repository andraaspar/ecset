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

import { deletePoint, getRenderPoint } from './PointMethods'

import { IData } from './IData'
import { IRenderPoint } from './IRenderPoint'
import { IRenderTransform } from './IRenderTransform'
import { IViewDocument } from './IViewDocument'
import { IViewTransform } from './IViewTransform'
import { getIdCountInViewDocument } from './DocumentMethods'

export function viewTransformToRenderTransform(d: IViewDocument, p: IViewTransform): IRenderTransform {
	return {
		id: p.id,
		offset: getRenderPoint(d, p.offsetId),
		pivot: getRenderPoint(d, p.pivotId),
		rotation: p.rotation,
		scale: p.scale,
	}
}

export function getRenderTransform(d: IViewDocument, id: string): IRenderTransform {
	return viewTransformToRenderTransform(d, d.transformsById[id])
}

export function deleteTransform(data: IData, transform: IRenderTransform) {
	delete data.document.transformsById[transform.id]
	let deleteCount
	do {
		deleteCount = 0
		for (let p of [
			transform.offset,
			transform.pivot,
		]) {
			if (getIdCountInViewDocument(data.document, p.id) == 1) {
				deleteCount++
				deletePoint(data, p)
			}
		}
	} while (deleteCount)
}