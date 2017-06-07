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
import { Data } from './Data'
import { IPoint } from './IPoint'
import { IRenderPoint } from './IRenderPoint'
import { IViewDocument } from './IViewDocument'
import { IViewPoint } from './IViewPoint'

export function pointPosition(p: IPoint, axis: Axis2D): number {
	switch (axis) {
		case Axis2D.X: return p.x
		case Axis2D.Y: return p.y
	}
}

export function pointDistance(a: IPoint, b: IPoint): number {
	return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

export function addPoints(a: IPoint, b: IPoint): IPoint {
	let result: IPoint = {
		x: a.x + b.x,
		y: a.y + b.y
	}
	return result
}

export function subtractPoints(a: IPoint, b: IPoint): IPoint {
	let result: IPoint = {
		x: a.x - b.x,
		y: a.y - b.y
	}
	return result
}

export function perpProduct(a: IPoint, b: IPoint): number {
	return a.x * b.y - a.y * b.x
}

export function perpendicularVector(vector: IPoint, clockwise?: boolean): IPoint {
	let result: IPoint
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

export function reverseVector(vector: IPoint): IPoint {
	return {
		x: -vector.x,
		y: -vector.y
	}
}

export function toUnitVector(vector: IPoint, multiplier = 1): IPoint {
	let size = vectorSize(vector)
	return {
		x: size ? vector.x / size * multiplier : 0,
		y: size ? vector.y / size * multiplier : 0
	}
}

export function vectorSize(vector: IPoint): number {
	return Math.sqrt(vector.x ** 2 + vector.y ** 2)
}

export function pointsEqual(a: IPoint, b: IPoint): boolean {
	return a && b && a.x === b.x && a.y === b.y
}

export function vectorAngle(vector: IPoint): number {
	return Math.atan2(vector.y, vector.x)
}

export function viewPointToRenderPoint(p: IViewPoint, id: string): IRenderPoint {
	return {
		id: id,
		x: p.x,
		y: p.y
	}
}

export function getRenderPoint(d: IViewDocument, id: string): IRenderPoint {
	return viewPointToRenderPoint(d.pointsById[id], id)
}

export function scaleVector(v: IPoint, scale: number): IPoint {
	return {
		x: v.x * scale,
		y: v.y * scale,
	}
}

export function deselectAllPoints(data: Data) {
	data.selectedPointIds = {}
}

export function selectPoint(data: Data, id: string) {
	data.selectedPointIds[id] = true
}

export function deletePoint(data: Data, p: IRenderPoint) {
	delete data.selectedPointIds[p.id]
	delete data.document.pointsById[p.id]
}