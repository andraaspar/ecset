import {IPoint} from './Point'

export interface IBezierPoint {
	center: IPoint
	handleIn: IPoint
	handleOut: IPoint
}