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
import * as Path from '../renderer/Path'
import * as Point from '../renderer/Point'
import * as Stroke from '../renderer/Stroke'
import * as m from 'mithril'

import P from './P'
import PaintLayerModel from './PaintLayerModel'
import { bind } from 'illa/FunctionUtil'

export default class PaintLayer implements Mithril.Component<any> {

	private model: PaintLayerModel

	constructor(
		private width: number,
		private height: number,
		private stroke: Stroke.I
	) { }

	view() {
		let pathD: string = BezierPath.toSvg(this.stroke.bezierPath)
		return (
			m('div', {'class': `${P}-canvas-layer`},
				m('canvas', {
					'class': `${P}-canvas-layer-canvas`,
					'width': this.width,
					'height': this.height,
					'config': (elem, inited, context, velem) => {
						if (!inited) {
							this.model = context['model'] = new PaintLayerModel(this.stroke, <HTMLCanvasElement>elem)
							context.onunload = () => this.model.kill()
						} else {
							this.model = context['model']
						}
						this.model.render()
					}
				})
			)
		)
	}
}
