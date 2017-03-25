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

export declare namespace PaintLayer {
	interface Attrs {
		width: number
		height: number
		stroke: Stroke.I
	}
	interface State {
		model?: PaintLayerModel
	}
}
type Vnode = m.Vnode<PaintLayer.Attrs, PaintLayer.State>
type VnodeDOM = m.VnodeDOM<PaintLayer.Attrs, PaintLayer.State>

export const PaintLayer: m.Comp<PaintLayer.Attrs, PaintLayer.State> = {
	
	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		let pathD: string = BezierPath.toSvg(v.attrs.stroke.bezierPath)
		return (
			m('div', {'class': `${P}-canvas-layer`},
				m('canvas', {
					'class': `${P}-canvas-layer-canvas`,
					'width': v.attrs.width,
					'height': v.attrs.height,
				})
			)
		)
	},
	oncreate(v) {
		v.state.model = new PaintLayerModel(v.attrs.stroke, <HTMLDivElement>v.dom)
		v.state.model.render()
	},
	onupdate(v) {
		v.state.model.render()
	},
	// onbeforeremove(v) {},
	onremove(v) {
		v.state.model.kill()
	}
}
