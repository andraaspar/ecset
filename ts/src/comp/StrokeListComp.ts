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

import { P, get } from '../statics'
import { deselectAllStrokes, selectStroke } from '../data/StrokeMethods'

import { BorderComp } from './BorderComp'
import { IViewStroke } from '../data/IViewStroke'
import { data } from '../data/DataMethods'

export declare namespace StrokeListComp {
	interface Attrs {
		strokeIds: string[]
	}
	interface State {
		openStrokeIds?: WeakSet<IViewStroke>
	}
}
type Vnode = m.Vnode<StrokeListComp.Attrs, StrokeListComp.State>
type VnodeDOM = m.VnodeDOM<StrokeListComp.Attrs, StrokeListComp.State>

export const StrokeListComp: m.Comp<StrokeListComp.Attrs, StrokeListComp.State> = {

	oninit(v) {
		v.state.openStrokeIds = new WeakSet<IViewStroke>([])
	},
	// onbeforeupdate(v, o) {},
	view(v) {
		return (
			v.attrs.strokeIds.map(id => {
				let stroke = data.document.strokesById[id]
				let isSelected = !!data.selectedStrokeIds[id]
				return (
					m(`div`, {
						'key': id,
						'class': `${P}-form-list-item`,
					},
						m(`button`, {
							'type': `button`,
							'class': `${P}-button ${P}-form-list-item-opener`,
							'onclick': () => {
								let stroke = data.document.strokesById[id]
								if (v.state.openStrokeIds.has(stroke)) {
									v.state.openStrokeIds.delete(stroke)
								} else {
									v.state.openStrokeIds.add(stroke)
								}
							},
						},
							(v.state.openStrokeIds.has(stroke) ?
								`▼`
								:
								`►`
							)
						),
						m(BorderComp),
						m(`div`, { 'class': `${P}-form-list-item-end` },
							m(`div`, { 'class': `${P}-buttons` },
								m(`button`, {
									'type': `button`,
									'class': `${P}-button ${P}-form-list-item-name ${stroke.name ? `` : `${P}--unnamed`} ${isSelected ? `${P}--highlighted` : ``}`,
									'onclick': () => {
										deselectAllStrokes(data)
										selectStroke(data, id)
									},
								},
									stroke.name || `Stroke`
								),
							),
							v.state.openStrokeIds.has(stroke) && get(() => !!stroke.childIds.length) &&
							m(StrokeListComp, {
								'strokeIds': stroke.childIds,
							})
						)
					)
				)
			})
		)
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}