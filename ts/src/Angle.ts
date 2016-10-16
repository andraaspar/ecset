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