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

import { Axis2D } from 'illa/Axis2D'
import { Point } from './IPoint'

export function pointPosition(p: Point, axis: Axis2D): number {
	switch (axis) {
		case Axis2D.X: return p.x
		case Axis2D.Y: return p.y
	}
}

export function pointDistance(a: Point, b: Point): number {
	return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

export function addPoints(a: Point, b: Point): Point {
	return new Point(
		a.x + b.x,
		a.y + b.y,
	)
}

export function subtractPoints(a: Point, b: Point): Point {
	return new Point(
		a.x - b.x,
		a.y - b.y,
	)
}

export function perpProduct(a: Point, b: Point): number {
	return a.x * b.y - a.y * b.x
}

export function perpendicularVector(vector: Point, clockwise?: boolean): Point {
	if (clockwise) {
		return new Point(
			vector.y,
			-vector.x
		)
	} else {
		return new Point(
			-vector.y,
			vector.x
		)
	}
}

export function reverseVector(vector: Point): Point {
	return new Point(
		-vector.x,
		-vector.y
	)
}

export function toUnitVector(vector: Point, multiplier = 1): Point {
	let size = vectorSize(vector)
	return new Point(
		size ? vector.x / size * multiplier : 0,
		size ? vector.y / size * multiplier : 0
	)
}

export function vectorSize(vector: Point): number {
	return Math.sqrt(vector.x ** 2 + vector.y ** 2)
}

export function pointsEqual(a: Point, b: Point): boolean {
	return a && b && a.x === b.x && a.y === b.y
}

export function vectorAngle(vector: Point): number {
	return Math.atan2(vector.y, vector.x)
}

export function scaleVector(v: Point, scale: number): Point {
	return new Point(
		v.x * scale,
		v.y * scale,
	)
}

export function clonePoint(p: Point): Point {
	return new Point(
		p.x,
		p.y,
	)
}