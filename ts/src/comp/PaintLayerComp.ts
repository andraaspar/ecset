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

import { IRenderStroke } from '../data/IRenderStroke'
import { IViewStroke } from '../data/IViewStroke'
import { P } from '../statics'
import { PaintLayerModel } from './PaintLayerModel'

export declare namespace PaintLayerComp {
	interface Attrs {
		width: number
		height: number
		strokeId: string
	}
	interface State {
		model?: PaintLayerModel
	}
}
type Vnode = m.Vnode<PaintLayerComp.Attrs, PaintLayerComp.State>
type VnodeDOM = m.VnodeDOM<PaintLayerComp.Attrs, PaintLayerComp.State>

export const PaintLayerComp: m.Comp<PaintLayerComp.Attrs, PaintLayerComp.State> = {
	
	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
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
		v.state.model = new PaintLayerModel(v.dom)
		v.state.model.update(v.attrs.strokeId)
	},
	onupdate(v) {
		v.state.model.update(v.attrs.strokeId)
	},
	// onbeforeremove(v) {},
	// onremove(v) {}
}
