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

import { CanvasModel } from './CanvasModel'
import { IPath } from '../data/IPath'
import { IPoint } from '../data/IPoint'
import { IViewDocument } from '../data/IViewDocument'
import { P } from '../statics'
import { PaintLayerComp } from './PaintLayerComp'
import { TSet } from '../data/TSet'
import { VectorLayerComp } from './VectorLayerComp'
import { getRenderStroke } from '../data/StrokeMethods'

export declare namespace CanvasComp {
	interface Attrs {
		document: IViewDocument
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
						'width': v.attrs.document.width * v.attrs.scale + 'px',
						'height': v.attrs.document.height * v.attrs.scale + 'px',
						'left': `calc(50% - ${(v.attrs.document.width / 2 - v.attrs.location.x) * v.attrs.scale}px)`,
						'top': `calc(50% - ${(v.attrs.document.height / 2 - v.attrs.location.y) * v.attrs.scale}px)`,
					}
				},
					v.attrs.document.strokeIds.map(id => (
						m(PaintLayerComp, {
							'width': v.attrs.document.width,
							'height': v.attrs.document.height,
							'strokeId': id,
							'scale': v.attrs.scale,
						})
					)),
					v.attrs.document.strokeIds.map(id => (
						m(VectorLayerComp, {
							'width': v.attrs.document.width,
							'height': v.attrs.document.height,
							'document': v.attrs.document,
							'stroke': getRenderStroke(v.attrs.document, s, id),
							'scale': v.attrs.scale,
						})
					))
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
