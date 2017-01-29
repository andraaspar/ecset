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
	offset: Point.I
	scale: number
	rotation: number
	pivot: Point.I
}

export interface IProp {
	offsetId: P<string>
	scale: P<number>
	rotation: P<number>
	pivotId: P<string>
}

export function deprop(d: Document.IProp, p: IProp): I {
	return {
		offset: Point.getDepropped(d, p.offsetId()),
		pivot: Point.getDepropped(d, p.pivotId()),
		rotation: p.rotation(),
		scale: p.scale(),
	}
}

export function getDepropped(d: Document.IProp, id: string): I {
	return deprop(d, d.transformsById[id])
}
