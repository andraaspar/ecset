export type IColor = number[]

export const ALPHA = 0

export function interpolate(a: IColor, b: IColor, t: number): IColor {
	let length = Math.max(a.length, b.length)
	let result: IColor = []
	for (let i = 0; i < length; i++) {
		let aValue = a[i] || 0
		let bValue = b[i] || 0
		result[i] = aValue + (bValue - aValue) * t
	}
	return result
}