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

import { createStroke, deleteStroke, deselectAllStrokes, getRenderStroke, selectStroke } from '../data/StrokeMethods'

import { BorderComp } from './BorderComp'
import { IPath } from '../data/IPath'
import { IViewStroke } from '../data/IViewStroke'
import { P } from '../statics'
import { TSet } from '../data/TSet'
import { data } from '../data/DataMethods'
import { render } from '../data/RenderMethods'

export declare namespace StrokeListComp {
	interface Attrs { }
	interface State {
		editedStrokeIds?: WeakSet<IViewStroke>
	}
}
type Vnode = m.Vnode<StrokeListComp.Attrs, StrokeListComp.State>
type VnodeDOM = m.VnodeDOM<StrokeListComp.Attrs, StrokeListComp.State>

export const StrokeListComp: m.Comp<StrokeListComp.Attrs, StrokeListComp.State> = {

	oninit(v) {
		v.state.editedStrokeIds = new WeakSet<IViewStroke>([])
	},
	// onbeforeupdate(v, o) {},
	view(v) {
		return [
			m(`div`, { 'class': `${P}-form-title` },
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
							m(`button`, {
								'type': `button`,
								'class': `${P}-button ${P}-form-list-item-opener`,
								'onclick': () => {
									let stroke = data.document.strokesById[id]
									if (v.state.editedStrokeIds.has(stroke)) {
										v.state.editedStrokeIds.delete(stroke)
									} else {
										v.state.editedStrokeIds.add(stroke)
									}
								},
							},
								(v.state.editedStrokeIds.has(stroke) ?
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
										'class': `${P}-button ${P}-form-list-item-name ${stroke.name ? `` : `${P}--unnamed`}`,
										'onclick': () => {
											deselectAllStrokes(data)
											selectStroke(data, id)
										},
									},
										stroke.name || `Stroke`
									),
								),
								v.state.editedStrokeIds.has(stroke) &&
								m(`div`, { 'class': `${P}-form-list-item-meta` },
									m(`span`, { 'class': `${P}-form-list-item-meta-label` },
										`ID:`
									),
									` `,
									m(`span`, { 'class': `${P}-form-list-item-meta-value` },
										stroke.id
									)
								)
							)
						)
					)
				})
			),
			m(BorderComp),
			m(`div`, { 'class': `${P}-buttons ${P}--1` },
				m(`button`, {
					'type': `button`,
					'class': `${P}-button`,
					'onclick': () => {
						let id = createStroke(data)
						deselectAllStrokes(data)
						selectStroke(data, id)
						render()
					},
				},
					m(`span`, `New`)
				),
				m(`button`, {
					'type': `button`,
					'class': `${P}-button`,
					'onclick': () => {
						let s: TSet<IPath> = {}
						for (let strokeId of Object.keys(data.selectedStrokeIds)) {
							let renderStroke = getRenderStroke(data.document, s, strokeId)
							deleteStroke(data, renderStroke)
						}
						render()
					},
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