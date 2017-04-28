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

import { createStroke, data, deselectAllStrokes, selectStroke } from '../data/DataMethods'

import { BorderComp } from './BorderComp'
import { P } from '../statics'
import { render } from '../data/RenderMethods'

export declare namespace StrokeListComp {
	interface Attrs { }
	interface State { }
}
type Vnode = m.Vnode<StrokeListComp.Attrs, StrokeListComp.State>
type VnodeDOM = m.VnodeDOM<StrokeListComp.Attrs, StrokeListComp.State>

export const StrokeListComp: m.Comp<StrokeListComp.Attrs, StrokeListComp.State> = {

	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		return [
			m(`div`, {'class': `${P}-form-title`},
				`Strokes`,
			),
			m(BorderComp),
			m(`div`, { 'class': `${P}-form-list` },
				data.document.strokeIds.map(id => {
					let stroke = data.document.strokesById[id]
					return (
						m(`div`, {
							'key': id,
							'class': `${P}-form-list-item`,
						},
							stroke.id
						)
					)
				})
			),
			m(BorderComp),
			m(`div`, {'class': `${P}-buttons ${P}--1`},
				m(`button`, {
					'type': `button`,
					'class': `${P}-button`,
					'onclick': () => {
						let id = createStroke()
						deselectAllStrokes()
						selectStroke(id)
						render()
					},
				},
					m(`span`, `New`)
				),
				m(`button`, {
					'type': `button`,
					'class': `${P}-button`,
				},
					m(`span`, `Delete`)
				),
			)
		]
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}