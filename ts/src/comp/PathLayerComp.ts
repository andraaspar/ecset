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

import * as m from 'mithril'

import { bezierPathToSvg, getRenderBezierPath } from '../data/BezierPathMethods'

import { IPath } from '../data/IPath'
import { IRenderBezierPath } from '../data/IRenderBezierPath'
import { IRenderPoint } from '../data/IRenderPoint'
import { IRenderStroke } from '../data/IRenderStroke'
import { IViewDocument } from '../data/IViewDocument'
import { P } from '../statics'
import { PathLayerModel } from './PathLayerModel'
import { TSet } from '../data/TSet'
import { data } from '../data/DataMethods'
import { scaleRenderBezierPoint } from '../data/BezierPointMethods'
import { vectorAngle } from '../data/PointMethods'

export declare namespace PathLayerComp {
	interface Attrs { }
	interface State {
		model?: PathLayerModel
	}
}
type Vnode = m.Vnode<PathLayerComp.Attrs, PathLayerComp.State>
type VnodeDOM = m.VnodeDOM<PathLayerComp.Attrs, PathLayerComp.State>

export const PathLayerComp: m.Comp<PathLayerComp.Attrs, PathLayerComp.State> = {

	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		let s: TSet<IPath> = {}
		return (
			Object.keys(data.document.bezierPathsById).map(id => {
				let renderBezierPath = getRenderBezierPath(data.document, s, id)
				let pathD: string = bezierPathToSvg(renderBezierPath, data.canvasScale)
				return m.fragment({
					'key': id,
				},
					[
						m('path', {
							'd': pathD,
							'class': `${P}-path-bg`
						}),
						m('path', {
							'd': pathD,
							'class': `${P}-path`
						}),
						// v.attrs.renderBezierPath.points.map((bezierPoint, index) => {
						// 	let scaledPoint = scaleRenderBezierPoint(bezierPoint, v.attrs.scale)
						// 	let handlesD = `M${scaledPoint.handleIn.x},${scaledPoint.handleIn.y}L${scaledPoint.center.x},${scaledPoint.center.y}L${scaledPoint.handleOut.x},${scaledPoint.handleOut.y}`
						// 	return [
						// 		m('path', {
						// 			'd': handlesD,
						// 			'class': `${P}-path-handles-bg`
						// 		}),
						// 		m('path', {
						// 			'd': handlesD,
						// 			'class': `${P}-path-handles`
						// 		})
						// 	]
						// }),
						// v.attrs.renderBezierPath.points.map(bezierPoint => {
						// 	let scaledPoint = scaleRenderBezierPoint(bezierPoint, v.attrs.scale)
						// 	return [
						// 		m('polygon', {
						// 			'class': `${P}-point-handle`,
						// 			'points': `8 0, -6 -7, -6 7`,
						// 			'transform': getTriangleTransform(scaledPoint.handleIn, scaledPoint.center, false),
						// 			'onmousedown': (e: MouseEvent) => {
						// 				v.state.model.startDrag(data.document.pointsById[bezierPoint.handleIn.id], e)
						// 			}
						// 		}),
						// 		m('polygon', {
						// 			'class': `${P}-point-handle`,
						// 			'points': `8 0, -6 -7, -6 7`,
						// 			'transform': getTriangleTransform(scaledPoint.center, scaledPoint.handleOut, true),
						// 			'onmousedown': (e: MouseEvent) => {
						// 				v.state.model.startDrag(data.document.pointsById[bezierPoint.handleOut.id], e)
						// 			}
						// 		}),
						// 		m('circle', {
						// 			'class': `${P}-point-center`,
						// 			'cx': scaledPoint.center.x,
						// 			'cy': scaledPoint.center.y,
						// 			'r': 5,
						// 			'onmousedown': (e: MouseEvent) => {
						// 				v.state.model.startDrag(data.document.pointsById[bezierPoint.center.id], e)
						// 			}
						// 		})
						// 	]
						// })
					]
				)
			})
		)
	},
	oncreate(v) {
		v.state.model = new PathLayerModel()
	},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	onremove(v) {
		v.state.model.kill()
	}
}

function getTriangleTransform(a: IRenderPoint, b: IRenderPoint, placeAtB: boolean): string {
	let location = placeAtB ? b : a
	return `rotate(${vectorAngle({ x: b.x - a.x, y: b.y - a.y }) / Math.PI * 180} ${location.x} ${location.y}) translate(${location.x} ${location.y})`
}
