import {IBezierPoint} from './BezierPoint'
import {IPath} from './Path'
import * as Path from './Path'
import * as BezierSegment from './BezierSegment'

export type IBezierPath = IBezierPoint[]

export function linearize(bezierPath: IBezierPath, steps: number): IPath {
	let path: IPath = []

	for (let i = 0, n = bezierPath.length - 1; i < n; i++) {
		let bezierSegment = {
			a: bezierPath[i],
			b: bezierPath[i + 1]
		}
		let segmentPath = BezierSegment.linearize(bezierSegment, steps)
		path = Path.join(path, segmentPath)
	}

	return path
}