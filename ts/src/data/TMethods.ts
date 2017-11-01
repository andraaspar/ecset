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

export function itemAndItemT<T>(t: number, items: T[], startTs: number[]): [T, number] {
	let index = itemIndexForT(t, startTs)
	return [items[index], itemT(index, t, startTs)]
}

export function itemT(index: number, t: number, startTs: number[]) {
	let [startT, endT] = itemTs(index, startTs)
	let tLength = endT - startT
	return (t - startT) / tLength
}

export function itemIndexForT(t: number, startTs: number[]) {
	let result = 0
	for (let index = 0, n = startTs.length; index < n; index++) {
		let startT = startTs[index]
		if (t > startT) {
			result = index
		} else {
			break
		}
	}
	return result
}

export function itemTs(index: number, startTs: number[]): [number, number] {
	let startT = startTs[index]
	let endT = startTs[index + 1]
	if (isNaN(endT)) endT = 1
	return [startT, endT]
}
