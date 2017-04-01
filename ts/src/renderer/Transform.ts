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

import * as Document from './Document'
import * as Point from './Point'

export interface IRender {
	offset: Point.IRender
	scale: number
	rotation: number
	pivot: Point.IRender
}

export interface IView {
	offsetId: string
	scale: number
	rotation: number
	pivotId: string
}

export function iRenderify(d: Document.IView, p: IView): IRender {
	return {
		offset: Point.getIRender(d, p.offsetId),
		pivot: Point.getIRender(d, p.pivotId),
		rotation: p.rotation,
		scale: p.scale,
	}
}

export function getIRender(d: Document.IView, id: string): IRender {
	return iRenderify(d, d.transformsById[id])
}
