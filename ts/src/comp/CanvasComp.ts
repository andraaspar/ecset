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

import { BezierPointLayerComp } from './BezierPointLayerComp'
import { CanvasModel } from './CanvasModel'
import { data } from '../data/DataMethods'
import { PaintLayerComp } from './PaintLayerComp'
import { Path } from '../data/Path'
import { PathLayerComp } from './PathLayerComp'
import { Point } from '../data/Point'
import { PointLayerComp } from './PointLayerComp'
import { P } from '../statics'
import { TSet } from '../data/TSet'

export declare namespace CanvasComp {
	interface Attrs {
		location: Point
		scale: number
		scaleSetter: (v: number) => void
	}
	interface State {
		model?: CanvasModel
	}
}
type Vnode = m.Vnode<CanvasComp.Attrs, CanvasComp.State>
type VnodeDOM = m.VnodeDOM<CanvasComp.Attrs, CanvasComp.State>

export const CanvasComp: m.Comp<CanvasComp.Attrs, CanvasComp.State> = {

	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		let s: TSet<Path> = {}
		return (
			m('div', {
				'class': `${P}-canvas-area`,
				'onclick': () => {
					//deselectAllStrokes(data)
				},
			},
				m('div', {
					'class': `${P}-canvas`,
					'style': {
						'width': data.document.width * v.attrs.scale + 'px',
						'height': data.document.height * v.attrs.scale + 'px',
						'left': `calc(50% - ${(data.document.width / 2 - v.attrs.location.x) * v.attrs.scale}px)`,
						'top': `calc(50% - ${(data.document.height / 2 - v.attrs.location.y) * v.attrs.scale}px)`,
					}
				},
					
					m(PaintLayerComp),
					// m('svg', {
					// 	'class': `${P}-canvas-layer-svg`,
					// 	'width': data.document.width * data.canvasScale,
					// 	'height': data.document.height * data.canvasScale,
					// },
					m(PathLayerComp),
					m(BezierPointLayerComp),
					m(PointLayerComp),
					// )
				)
			)
		)
	},
	oncreate(v) {
		v.state.model = new CanvasModel().initCanvasModel(v.dom, v.attrs)
	},
	onupdate(v) {
		v.state.model.update(v.attrs)
	},
	// onbeforeremove(v) {},
	onremove(v) {
		v.state.model.kill()
	}
}
