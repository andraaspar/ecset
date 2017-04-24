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

import { IRenderPoint } from '../data/IRenderPoint'
import { IRenderStroke } from '../data/IRenderStroke'
import { IViewDocument } from '../data/IViewDocument'
import { P } from '../statics'
import { VectorLayerModel } from './VectorLayerModel'
import { vectorAngle } from '../data/PointMethods'

export declare namespace VectorLayerComp {
	interface Attrs {
		width: number
		height: number
		document: IViewDocument
		stroke: IRenderStroke
	}
	interface State {
		model?: VectorLayerModel
	}
}
type Vnode = m.Vnode<VectorLayerComp.Attrs, VectorLayerComp.State>
type VnodeDOM = m.VnodeDOM<VectorLayerComp.Attrs, VectorLayerComp.State>

export const VectorLayerComp: m.Comp<VectorLayerComp.Attrs, VectorLayerComp.State> = {

	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		let path = getRenderBezierPath(v.attrs.document, v.attrs.stroke.bezierPathId)
		let pathD: string = bezierPathToSvg(path)
		return (
			m('div', {
				'class': `${P}-canvas-layer`,
			},
				m('svg', {
					'class': `${P}-canvas-layer-svg`,
					'width': v.attrs.width,
					'height': v.attrs.height
				},
					m('path', {
						'd': pathD,
						'class': `${P}-path-bg`
					}),
					m('path', {
						'd': pathD,
						'class': `${P}-path`
					}),
					path.points.map((bezierPoint, index) => {
						let handlesD = `M${bezierPoint.handleIn.x},${bezierPoint.handleIn.y}L${bezierPoint.center.x},${bezierPoint.center.y}L${bezierPoint.handleOut.x},${bezierPoint.handleOut.y}`
						return [
							m('path', {
								'd': handlesD,
								'class': `${P}-path-handles-bg`
							}),
							m('path', {
								'd': handlesD,
								'class': `${P}-path-handles`
							})
						]
					}),
					path.points.map(bezierPoint => [
						(bezierPoint.handleIn ?
							m('polygon', {
								'class': `${P}-point-handle`,
								'points': `8 0, -6 -7, -6 7`,
								'transform': getTriangleTransform(bezierPoint.handleIn, bezierPoint.center, false),
								'onmousedown': (e: MouseEvent) => {
									v.state.model.startDrag(v.attrs.document.pointsById[bezierPoint.handleIn.id], e)
								}
							})
							:
							''
						),
						(bezierPoint.handleOut ?
							m('polygon', {
								'class': `${P}-point-handle`,
								'points': `8 0, -6 -7, -6 7`,
								'transform': getTriangleTransform(bezierPoint.center, bezierPoint.handleOut, true),
								'onmousedown': (e: MouseEvent) => {
									v.state.model.startDrag(v.attrs.document.pointsById[bezierPoint.handleOut.id], e)
								}
							})
							:
							''
						),
						m('circle', {
							'class': `${P}-point-center`,
							'cx': bezierPoint.center.x,
							'cy': bezierPoint.center.y,
							'r': 5,
							'onmousedown': (e: MouseEvent) => {
								v.state.model.startDrag(v.attrs.document.pointsById[bezierPoint.center.id], e)
							}
						})
					])
				)
			)
		)
	},
	oncreate(v) {
		v.state.model = new VectorLayerModel()
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
