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

import { data } from '../data/DataMethods'
import { PointLayerModel } from './PointLayerModel'
import { P } from '../statics'

export declare namespace PointLayerComp {
	interface Attrs { }
	interface State {
		model?: PointLayerModel
	}
}
type Vnode = m.Vnode<PointLayerComp.Attrs, PointLayerComp.State>
type VnodeDOM = m.VnodeDOM<PointLayerComp.Attrs, PointLayerComp.State>

export const PointLayerComp: m.Comp<PointLayerComp.Attrs, PointLayerComp.State> = {

	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		return (
			data.selectedPoints.map(point => (
				m('svg', {
					'class': `${P}-canvas-layer-svg`,
					'width': data.document.width * data.canvasScale,
					'height': data.document.height * data.canvasScale,
					'key': point.id,
					'onmousedown': (e: MouseEvent) => {
						v.state.model.startDrag(point, e)
					},
					'onclick': (e: MouseEvent) => {
						e.stopPropagation()
					},
				},
					m('circle', {
						'class': `${P}-point-bg`,
						'cx': point.x * data.canvasScale,
						'cy': point.y * data.canvasScale,
						'r': 5,
					}),
					m('circle', {
						'class': `${P}-point`,
						'cx': point.x * data.canvasScale,
						'cy': point.y * data.canvasScale,
						'r': 1,
					})
				)
			))
		)
	},
	oncreate(v) {
		v.state.model = new PointLayerModel()
	},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	onremove(v) {
		v.state.model.kill()
	}
}
