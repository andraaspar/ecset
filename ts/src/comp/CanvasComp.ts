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

import { IViewDocument } from '../data/IViewDocument'
import { P } from '../statics'
import { PaintLayerComp } from './PaintLayerComp'
import { VectorLayerComp } from './VectorLayerComp'
import { data } from '../data/DataMethods'
import { getRenderStroke } from '../data/StrokeMethods'

export declare namespace CanvasComp {
	interface Attrs { }
	interface State { }
}
type Vnode = m.Vnode<CanvasComp.Attrs, CanvasComp.State>
type VnodeDOM = m.VnodeDOM<CanvasComp.Attrs, CanvasComp.State>

export const CanvasComp: m.Comp<CanvasComp.Attrs, CanvasComp.State> = {

	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		return (
			m('div', { 'class': `${P}-canvas` },
				data.document.strokeIds.map(id => (
					m(PaintLayerComp, {
						'width': data.document.width,
						'height': data.document.height,
						'strokeId': id,
					})
				)),
				data.document.strokeIds.map(id => (
					m(VectorLayerComp, {
						'width': data.document.width,
						'height': data.document.height,
						'document': data.document,
						'stroke': getRenderStroke(data.document, id),
					})
				))
			)
		)
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}
