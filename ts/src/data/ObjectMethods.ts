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

export function deepFind<T>(container: any, predicate: (obj: any, key: string | number, parent: any) => boolean, key?: string | number, parent?: any): T[] {
	let result: T[] = []
	if (container) {
		if (predicate(container, key, parent)) {
			result.push(container)
		}
	}
	if (isArray(container)) {
		for (let i = 0, n = container.length; i < n; i++) {
			if (container[i]) {
				result = result.concat(deepFind<T>(container[i], predicate, i, container))
			}
		}
	} else if (isObjectNotNull(container)) {
		for (let k of Object.keys(container)) {
			if (container[k]) {
				result = result.concat(deepFind<T>(container[k], predicate, k, container))
			}
		}
	}
	return result
}