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

export interface I {
	id?: string
	center: Point.I
	handleIn: Point.I
	handleOut: Point.I
}

export interface IProp {
	centerId: P<string>
	handleInId: P<string>
	handleOutId: P<string>
}

export function deprop(d: Document.IProp, p: IProp, id: string): I {
	return {
		id: id,
		center: Point.getDepropped(d, p.centerId()),
		handleIn: Point.getDepropped(d, p.handleInId()),
		handleOut: Point.getDepropped(d, p.handleOutId())
	}
}

export function getDepropped(d: Document.IProp, id: string): I {
	return deprop(d, d.bezierPointsById[id], id)
}
