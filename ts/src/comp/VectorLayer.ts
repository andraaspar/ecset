/*
 * Copyright 2016 András Parditka.
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

import { IPath } from '../renderer/Path'
import * as Path from '../renderer/Path'
import { IBezierPath, IPropBezierPath } from '../renderer/BezierPath'
import { IPoint, IPropPoint } from '../renderer/Point'
import * as BezierPath from '../renderer/BezierPath'
import { bind } from 'illa/FunctionUtil'
import * as m from 'mithril'
import P from './P'
import VectorLayerModel from './VectorLayerModel'

export default class VectorLayer implements Mithril.Component<any> {

	private model: VectorLayerModel

	constructor(
		private width: number,
		private height: number,
		private bezierPath: IPropBezierPath
	) { }

	view() {
		let path: IBezierPath = JSON.parse(JSON.stringify(this.bezierPath))
		let pathD: string = BezierPath.toSvg(path)
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
					this.bezierPath.map((a, index) => {
						let handlesD = `M${a.handleIn.x()},${a.handleIn.y()}L${a.center.x()},${a.center.y()}L${a.handleOut.x()},${a.handleOut.y()}`
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
					this.bezierPath.map(bezierPoint => [
						(bezierPoint.handleIn ?
							m('circle', {
								'class': `${P}-point-handle`,
								'cx': bezierPoint.handleIn.x(),
								'cy': bezierPoint.handleIn.y(),
								'r': 5,
								'onmousedown': (e) => {
									this.model.startDrag(bezierPoint.handleIn, e)
									m.redraw.strategy('none')
								}
							})
							:
							''
						),
						(bezierPoint.handleOut ?
							m('circle', {
								'class': `${P}-point-handle`,
								'cx': bezierPoint.handleOut.x(),
								'cy': bezierPoint.handleOut.y(),
								'r': 5,
								'onmousedown': (e) => {
									this.model.startDrag(bezierPoint.handleOut, e)
									m.redraw.strategy('none')
								}
							})
							:
							''
						),
						m('circle', {
							'class': `${P}-point-center`,
							'cx': bezierPoint.center.x(),
							'cy': bezierPoint.center.y(),
							'r': 5,
							'onmousedown': (e) => {
								this.model.startDrag(bezierPoint.center, e)
								m.redraw.strategy('none')
							}
						})
					])
				)
			)
		)
	}
}