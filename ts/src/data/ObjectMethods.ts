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

import { isArray, isObjectNotNull } from 'illa/Type'

export function deepFind<T>(o: any, predicate: (o: any, key: string | number, parent: any) => boolean, key?: string | number, parent?: any): T[] {
	let result: T[] = []
	if (o) {
		if (predicate(o, key, parent)) {
			result.push(o)
		}
	}
	if (isArray(o)) {
		for (let i = 0, n = o.length; i < n; i++) {
			if (o[i]) {
				result = result.concat(deepFind<T>(o[i], predicate, i, o))
			}
		}
	} else if (isObjectNotNull(o)) {
		for (let k of Object.keys(o)) {
			if (o[k]) {
				result = result.concat(deepFind<T>(o[k], predicate, k, o))
			}
		}
	}
	return result
}