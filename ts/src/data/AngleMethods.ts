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

export function angleSide(axis: number, angle: number): number {
	axis = normalizeAngle(axis)
	angle = normalizeAngle(angle)
	if ((angle <= axis && angle > axis - Math.PI) || (angle > axis + Math.PI && angle <= axis + 2 * Math.PI)) {
		return -1
	} else {
		return 1
	}
}

export function normalizeAngle(angle: number): number {
	angle %= DOUBLE_PI
	if (angle < 0) angle += DOUBLE_PI
	return angle
}

export function angleDifference(a: number, b: number): number {
	let result = a - b
	if (result < 0) result += DOUBLE_PI // 0 -> 360
	result -= Math.PI // -180 -> 180
	result = Math.abs(result) // 0 -> 180
	return result
}
