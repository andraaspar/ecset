import Axis from 'illa/Axis2D'

export interface IPoint {
	x: number
	y: number
}

export function position(p: IPoint, axis: Axis): number {
	switch (axis) {
		case Axis.X: return p.x
		case Axis.Y: return p.y
	}
}

export function distance(a: IPoint, b: IPoint): number {
	return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

export function add(a: IPoint, b: IPoint): IPoint {
	let result: IPoint = {
		x: a.x + b.x,
		y: a.y + b.y
	}
	return result
}

export function subtract(a: IPoint, b: IPoint): IPoint {
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

export function equals(a: IPoint, b: IPoint): boolean {
	return a && b && a.x === b.x && a.y === b.y
}

export function angle(vector: IPoint): number {
	return Math.atan2(vector.y, vector.x)
}
