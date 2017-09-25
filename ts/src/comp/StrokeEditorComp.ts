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

import { BorderComp } from './BorderComp'
import { P } from '../statics'
import { data } from '../data/DataMethods'
import { IRenderStroke } from "../data/IRenderStroke";

export declare namespace StrokeEditorComp {
	interface Attrs { }
	interface State { }
}
type Vnode = m.Vnode<StrokeEditorComp.Attrs, StrokeEditorComp.State>
type VnodeDOM = m.VnodeDOM<StrokeEditorComp.Attrs, StrokeEditorComp.State>

export const StrokeEditorComp: m.Comp<StrokeEditorComp.Attrs, StrokeEditorComp.State> = {

	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		//let selectedStrokeIds = Object.keys(data.selectedStrokeIds)
		let stroke = undefined as IRenderStroke //selectedStrokeIds.length == 1 ? data.document.strokesById[selectedStrokeIds[0]] : undefined
		return (
			m(`div`, { 'class': `${P}-form-section` },
				m(`div`, { 'class': `${P}-form-title` },
					`Edit stroke`,
				),
				m(BorderComp),
				(stroke ?
					[
						m(`div`, { 'class': `${P}-form-content` },
							m(`div`, { 'class': `${P}-form-item` },
								m(`span`, { 'class': `${P}-form-item-label` },
									`ID:`
								),
								` `,
								m(`span`, { 'class': `${P}-form-item-value` },
									stroke.id
								)
							),
							m(`div`, { 'class': `${P}-form-item` },
								m(`div`, { 'class': `${P}-form-item-label` },
									`Name:`,
								),
								m(`div`, { 'class': `${P}-form-item-value` },
									m(`input`, {
										'class': ``,
										'value': stroke.name,
										'oninput': m.withAttr(`value`, value => stroke.name = value),
										'placeholder': `Stroke`,
									})
								)
							)
						),
						m(BorderComp),
						m(`div`, { 'class': `${P}-form-buttons` },
							m(`div`, { 'class': `${P}-buttons ${P}--1` },

							),
						),
					]
					:
					m(`div`, { 'class': `${P}-form-content` },
						m(`div`, { 'class': `${P}-form-no-items` },
							/*selectedStrokeIds.length ? `Multiple strokes selected.` : */`No stroke selected.`
						)
					)
				)
			)
		)
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}
