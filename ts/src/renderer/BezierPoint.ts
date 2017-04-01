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
	id?: string
	center: Point.IRender
	handleIn: Point.IRender
	handleOut: Point.IRender
}

export interface IView {
	centerId: string
	handleInId: string
	handleOutId: string
}

export function iRenderify(d: Document.IView, p: IView, id: string): IRender {
	return {
		id: id,
		center: Point.getIRender(d, p.centerId),
		handleIn: Point.getIRender(d, p.handleInId),
		handleOut: Point.getIRender(d, p.handleOutId)
	}
}

export function getIRender(d: Document.IView, id: string): IRender {
	return iRenderify(d, d.bezierPointsById[id], id)
}
