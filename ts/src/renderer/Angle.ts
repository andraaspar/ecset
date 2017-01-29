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

const DOUBLE_PI = Math.PI * 2

export function side(axis: number, angle: number): number {
	axis = normalize(axis)
	angle = normalize(angle)
	if ((angle <= axis && angle > axis - Math.PI) || (angle > axis + Math.PI && angle <= axis + 2 * Math.PI)) {
		return -1
	} else {
		return 1
	}
}

export function normalize(angle: number): number {
	angle %= DOUBLE_PI
	if (angle < 0) angle += DOUBLE_PI
	return angle
}