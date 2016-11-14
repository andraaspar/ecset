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

import * as Path from '../renderer/Path'
import * as Point from '../renderer/Point'
import * as BezierPath from '../renderer/BezierPath'
import { bind } from 'illa/FunctionUtil'
import * as m from 'mithril'
import P from './P'
import PaintLayerModel from './PaintLayerModel'

export default class PaintLayer implements Mithril.Component<any> {

	private model: PaintLayerModel

	constructor(
		private width: number,
		private height: number,
		private bezierPath: BezierPath.IProp
	) { }

	view() {
		let path: BezierPath.I = JSON.parse(JSON.stringify(this.bezierPath))
		let pathD: string = BezierPath.toSvg(path)
		return (
			m('div', {'class': `${P}-canvas-layer`},
				m('canvas', {
					'class': `${P}-canvas-layer-canvas`,
					'width': this.width,
					'height': this.height,
					'config': (elem, inited, context, velem) => {
						if (!inited) {
							this.model = context['model'] = new PaintLayerModel(this.bezierPath, <HTMLCanvasElement>elem)
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