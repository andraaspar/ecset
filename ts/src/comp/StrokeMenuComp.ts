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

import { MenuWindowComp } from './MenuWindowComp'
import { P } from '../statics'
import { Stroke } from '../data/Stroke'

export declare namespace StrokeMenuComp {
	interface Attrs {
		strokes: Stroke[]
		index: number
	}
	interface State { }
}
type Vnode = m.Vnode<StrokeMenuComp.Attrs, StrokeMenuComp.State>
type VnodeDOM = m.VnodeDOM<StrokeMenuComp.Attrs, StrokeMenuComp.State>

export const StrokeMenuComp: m.Comp<StrokeMenuComp.Attrs, StrokeMenuComp.State> = {

	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		return (
			m(MenuWindowComp, {
				content: m(`div`, { 'class': `${P}-buttons ${P}--1 ${P}--column` },
					m(`button`, {
						'type': `button`,
						'class': `${P}-button`,
						'onclick': () => {
							//let selectedStrokeIds = Object.keys(data.selectedStrokeIds)
							//deselectAllStrokes(data)
							//selectedStrokeIds.forEach(strokeId => {
							//	v.attrs.strokeIds.splice(v.attrs.index, 1)
							//	if (getIdCountInViewDocument(data.document, strokeId) == 1) {
							//		deleteStroke(data, getRenderStroke(data.document, {}, strokeId))
							//	}
							//})
							//render()
						},
					},
						`Delete selected strokes`,
					),
				),
			})
		)
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}
