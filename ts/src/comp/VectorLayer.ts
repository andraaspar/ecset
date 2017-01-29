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

import * as BezierPath from '../renderer/BezierPath'
import * as BezierPoint from '../renderer/BezierPoint'
import * as Document from '../renderer/Document'
import * as Path from '../renderer/Path'
import * as Point from '../renderer/Point'
import * as Stroke from '../renderer/Stroke'
import * as m from 'mithril'

import P from './P'
import VectorLayerModel from './VectorLayerModel'
import { bind } from 'illa/FunctionUtil'

export default class VectorLayer implements Mithril.Component<any> {

	private model: VectorLayerModel

	constructor(
		private width: number,
		private height: number,
		private document: Document.IProp,
		private stroke: Stroke.I
	) { }

	view() {
		let pathD: string = BezierPath.toSvg(this.stroke.bezierPath)
		return (
			m('div', {
				'class': `${P}-canvas-layer`,
				'config': (elem, inited, context, velem) => {
					if (!inited) {
						this.model = context['model'] = new VectorLayerModel()
						context.onunload = () => this.model.kill()
					} else {
						this.model = context['model']
					}
				}
				},
				m('svg', {
					'class': `${P}-canvas-layer-svg`,
					'width': this.width,
					'height': this.height
					},
					m('path', {
						'd': pathD,
						'class': `${P}-path-bg`
					}),
					m('path', {
						'd': pathD,
						'class': `${P}-path`
					}),
					this.stroke.bezierPath.points.map((bezierPoint, index) => {
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
					this.stroke.bezierPath.points.map(bezierPoint => [
						(bezierPoint.handleIn ?
							m('polygon', {
								'class': `${P}-point-handle`,
								'points': `8 0, -6 -7, -6 7`,
								'transform': this.getTriangleTransform(bezierPoint.handleIn, bezierPoint.center, false),
								'onmousedown': (e) => {
									this.model.startDrag(this.document.pointsById[bezierPoint.handleIn.id], e)
									m.redraw.strategy('none')
								}
							})
							:
							''
						),
						(bezierPoint.handleOut ?
							m('polygon', {
								'class': `${P}-point-handle`,
								'points': `8 0, -6 -7, -6 7`,
								'transform': this.getTriangleTransform(bezierPoint.center, bezierPoint.handleOut, true),
								'onmousedown': (e) => {
									this.model.startDrag(this.document.pointsById[bezierPoint.handleOut.id], e)
									m.redraw.strategy('none')
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
							'onmousedown': (e) => {
								this.model.startDrag(this.document.pointsById[bezierPoint.center.id], e)
								m.redraw.strategy('none')
							}
						})
					])
				)
			)
		)
	}
	
	getTriangleTransform(a: Point.I, b: Point.I, placeAtB: boolean): string {
		let location = placeAtB ? b : a
		return `rotate(${Point.angle({x: b.x - a.x, y: b.y - a.y}) / Math.PI * 180} ${location.x} ${location.y}) translate(${location.x} ${location.y})`
	}
}
