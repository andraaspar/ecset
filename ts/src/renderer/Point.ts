import Axis from 'illa/Axis2D'

export interface I {
	x: number
	y: number
}

export interface IProp {
	x: P<number>
	y: P<number>
}

export function position(p: I, axis: Axis): number {
	switch (axis) {
		case Axis.X: return p.x
		case Axis.Y: return p.y
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
