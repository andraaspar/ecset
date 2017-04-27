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

import { IRenderPoint } from '../data/IRenderPoint'
import { IViewPoint } from '../data/IViewPoint'
import { P } from '../statics'
import { PointLayerModel } from './PointLayerModel'
import { data } from '../data/DataMethods'
import { scaleVector } from '../data/PointMethods'

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
			Object.keys(data.document.pointsById).map(id => {
				let point = data.document.pointsById[id]
				return (
					m('circle', {
						'key': id,
						'class': `${P}-point-center`,
						'cx': point.x * data.canvasScale,
						'cy': point.y * data.canvasScale,
						'r': 5,
						'onmousedown': (e: MouseEvent) => {
							v.state.model.startDrag(point, e)
						}
					})
				)
			})
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