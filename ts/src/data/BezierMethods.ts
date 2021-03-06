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

export function bezierPosition(coords: number[], t: number) {
	let result: number[] = []

	if (coords.length == 1) {
		result = coords
	} else {
		for (let i = 0, n = coords.length - 1; i < n; i++) {
			result.push(bezierPositionSingle(coords[i], coords[i + 1], t))
		}
		if (result.length > 1) {
			result = bezierPosition(result, t)
		}
	}

	return result
}

export function bezierPositionSingle(posA: number, posB: number, t: number) {
	return (posB - posA) * t + posA
}
