export function calculateBezierPosition(coords: number[], t: number) {
	let result: number[] = []

	if (coords.length == 1) {
		result = coords
	} else {
		for (let i = 0, n = coords.length - 1; i < n; i++) {
			result.push(this.calculateBezierPositionSingle(coords[i], coords[i + 1], t))
		}
		if (result.length > 1) {
			result = this.calculateBezierPosition(result, t)
		}
	}

	return result
}

export function calculateBezierPositionSingle(posA: number, posB: number, t: number) {
	return (posB - posA) * t + posA
}