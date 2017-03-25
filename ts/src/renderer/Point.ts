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

import { Axis2D } from 'illa/Axis2D'

export interface I {
	id?: string
	x: number
	y: number
}

export interface IProp {
	x: number
	y: number
}

export function position(p: I, axis: Axis2D): number {
	switch (axis) {
		case Axis2D.X: return p.x
		case Axis2D.Y: return p.y
	}
}

export function distance(a: I, b: I): number {
	return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

export function add(a: I, b: I): I {
	let result: I = {
		x: a.x + b.x,
		y: a.y + b.y
	}
	return result
}

export function subtract(a: I, b: I): I {
	let result: I = {
		x: a.x - b.x,
		y: a.y - b.y
	}
	return result
}

export function perpProduct(a: I, b: I): number {
	return a.x * b.y - a.y * b.x
}

export function perpendicularVector(vector: I, clockwise?: boolean): I {
	let result: I
	if (clockwise) {
		result = {
			x: vector.y,
			y: -vector.x
		}
	} else {
		result = {
			x: -vector.y,
			y: vector.x
		}
	}
	return result
}

export function reverseVector(vector: I): I {
	return {
		x: -vector.x,
		y: -vector.y
	}
}

export function toUnitVector(vector: I, multiplier = 1): I {
	let size = vectorSize(vector)
	return {
		x: size ? vector.x / size * multiplier : 0,
		y: size ? vector.y / size * multiplier : 0
	}
}

export function vectorSize(vector: I): number {
	return Math.sqrt(vector.x ** 2 + vector.y ** 2)
}

export function equals(a: I, b: I): boolean {
	return a && b && a.x === b.x && a.y === b.y
}

export function angle(vector: I): number {
	return Math.atan2(vector.y, vector.x)
}

export function deprop(p: IProp, id: string): I {
	return {
		id: id,
		x: p.x,
		y: p.y
	}
}

export function getDepropped(d: Document.IProp, id: string): I {
	return deprop(d.pointsById[id], id)
}
