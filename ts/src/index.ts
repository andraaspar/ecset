import Canvas from './Canvas'
import { IBezierPath } from './BezierPath'
import * as BezierPath from './BezierPath'
import * as m from 'mithril'

const ECSET_ELEMENT = document.getElementById('ecset')

let bezierPath: IBezierPath = [
	{
		center: {
			x: 255,
			y: 255
		},
		handleIn: null,
		handleOut: {
			x: 255,
			y: 768 - 255
		}
	},
	{
		center: {
			x: 1024 - 255,
			y: 768 - 255
		},
		handleIn: {
			x: 1024 - 255,
			y: 255
		},
		handleOut: null
	}
]

let path = BezierPath.linearize(bezierPath, 100)
m.mount(ECSET_ELEMENT, new Canvas(1024, 768, path))


