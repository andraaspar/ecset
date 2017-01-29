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

import * as BezierPath from './BezierPath'
import * as Document from './Document'

export interface I {
	a: number
	b: number
	tweenPath: BezierPath.I
}

export interface IProp {
	a: P<number>
	b: P<number>
	tweenPathId: P<string>
}

export function deprop(d: Document.IProp, p: IProp): I {
	return {
		a: p.a(),
		b: p.b(),
		tweenPath: BezierPath.getDepropped(d, p.tweenPathId()) 
	}
}

export function getDepropped(d: Document.IProp, id: string): I {
	return deprop(d, d.valueSegmentsById[id])
}
