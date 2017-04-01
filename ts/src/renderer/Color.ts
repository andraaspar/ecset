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

export type IRender = number[]

export type IView = number[]

export const ALPHA = 0

export function interpolate(a: IRender, b: IRender, t: number): IRender {
	let length = Math.max(a.length, b.length)
	let result: IRender = []
	for (let i = 0; i < length; i++) {
		let aValue = a[i] || 0
		let bValue = b[i] || 0
		result[i] = aValue + (bValue - aValue) * t
	}
	return result
}

export function iRenderify(p: IView): IRender {
	return p.slice(0)
}

export function getIRender(d: Document.IView, id: string): IRender {
	return iRenderify(d.colorsById[id])
}
