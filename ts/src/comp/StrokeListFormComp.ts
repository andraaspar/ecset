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
import { clearMemorizedStrokeIds, createStroke, deleteStroke, deselectAllStrokes, getRenderStroke, selectStroke } from '../data/StrokeMethods'

import { BorderComp } from './BorderComp'
import { FormSectionComp } from './FormSectionComp'
import { IPath } from '../data/IPath'
import { StrokeListComp } from './StrokeListComp'
import { TSet } from '../data/TSet'
import { data } from '../data/DataMethods'
import { render } from '../data/RenderMethods'

export declare namespace StrokeListFormComp {
	interface Attrs { }
	interface State { }
}
type Vnode = m.Vnode<StrokeListFormComp.Attrs, StrokeListFormComp.State>
type VnodeDOM = m.VnodeDOM<StrokeListFormComp.Attrs, StrokeListFormComp.State>

export const StrokeListFormComp: m.Comp<StrokeListFormComp.Attrs, StrokeListFormComp.State> = {
	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		return (
			m(FormSectionComp, {
				title: `Strokes`,
				content: m(`div`, { 'class': `${P}-form-list` },
					m(StrokeListComp, {
						'strokeIds': get(() => data.document.strokeIds) || [],
					})
				),
				buttons: [
					m(`div`, { 'class': `${P}-buttons ${P}--1` },
						m(`button`, {
							'type': `button`,
							'class': `${P}-button`,
							'onclick': () => {
								let id = createStroke(data)
								data.document.strokeIds.push(id)
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
						)
					),
					[
						m(BorderComp),
						m(`div`, { 'class': `${P}-buttons ${P}--1` },
							!!data.memorizedStrokeIds.length &&
							m(`button`, {
								'type': `button`,
								'class': `${P}-button`,
								'onclick': () => {
									clearMemorizedStrokeIds(data)
								},
							},
								m(`span`, `Forget strokes: ${data.memorizedStrokeIds.length}`)
							),
						)
					]
				]
			})
		)
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}