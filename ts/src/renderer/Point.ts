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

export interface IRender {
	id: string
	x: number
	y: number
}

export interface IView {
	id: string
	x: number
	y: number
}

export function position(p: IRender, axis: Axis2D): number {
	switch (axis) {
		case Axis2D.X: return p.x
		case Axis2D.Y: return p.y
	}
}

export function distance(a: IRender, b: IRender): number {
	return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

export function add(a: IRender, b: IRender): IRender {
	let result: IRender = {
		id: undefined,
		x: a.x + b.x,
		y: a.y + b.y
	}
	return result
}

export function subtract(a: IRender, b: IRender): IRender {
	let result: IRender = {
		id: undefined,
		x: a.x - b.x,
		y: a.y - b.y
	}
	return result
}

export function perpProduct(a: IRender, b: IRender): number {
	return a.x * b.y - a.y * b.x
}

export function perpendicularVector(vector: IRender, clockwise?: boolean): IRender {
	let result: IRender
	if (clockwise) {
		result = {
			id: undefined,
			x: vector.y,
			y: -vector.x
		}
	} else {
		result = {
			id: undefined,
			x: -vector.y,
			y: vector.x
		}
	}
	return result
}

export function reverseVector(vector: IRender): IRender {
	return {
		id: undefined,
		x: -vector.x,
		y: -vector.y
	}
}

export function toUnitVector(vector: IRender, multiplier = 1): IRender {
	let size = vectorSize(vector)
	return {
		id: undefined,
		x: size ? vector.x / size * multiplier : 0,
		y: size ? vector.y / size * multiplier : 0
	}
}

export function vectorSize(vector: IRender): number {
	return Math.sqrt(vector.x ** 2 + vector.y ** 2)
}

export function equals(a: IRender, b: IRender): boolean {
	return a && b && a.x === b.x && a.y === b.y
}

export function angle(vector: IRender): number {
	return Math.atan2(vector.y, vector.x)
}

export function iRenderify(p: IView, id: string): IRender {
	return {
		id: id,
		x: p.x,
		y: p.y
	}
}

export function getIRender(d: Document.IView, id: string): IRender {
	return iRenderify(d.pointsById[id], id)
}
