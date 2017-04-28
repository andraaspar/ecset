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
import { IPath } from '../data/IPath'
import { IPoint } from '../data/IPoint'
import { IViewDocument } from '../data/IViewDocument'
import { P } from '../statics'
import { PaintLayerComp } from './PaintLayerComp'
import { PathLayerComp } from './PathLayerComp'
import { PointLayerComp } from './PointLayerComp'
import { TSet } from '../data/TSet'
import { data } from '../data/DataMethods'
import { getRenderBezierPath } from '../data/BezierPathMethods'
import { getRenderPoint } from '../data/PointMethods'
import { getRenderStroke } from '../data/StrokeMethods'

export declare namespace CanvasComp {
	interface Attrs {
		location: IPoint
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
		let s: TSet<IPath> = {}
		return (
			m('div', {
				'class': `${P}-canvas-area`,
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
					Object.keys(data.document.strokesById).map(id => (
						m(PaintLayerComp, {
							'key': id,
							'strokeId': id,
						})
					)),
					m('svg', {
						'class': `${P}-canvas-layer-svg`,
						'width': data.document.width,
						'height': data.document.height,
					},
						m(PathLayerComp),
						m(BezierPointLayerComp),
						m(PointLayerComp)
					)
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
