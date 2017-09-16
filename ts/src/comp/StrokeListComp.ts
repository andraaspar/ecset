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
import { createStroke } from '../data/StrokeMethods'

import { BorderComp } from './BorderComp'
import { MenuWindowComp } from './MenuWindowComp'
import { StrokeMenuComp } from './StrokeMenuComp'
import { data } from '../data/DataMethods'
import { render } from '../data/RenderMethods'
import { uuid } from 'illa/StringUtil'
import { IRenderStroke } from '../data/IRenderStroke'

export declare namespace StrokeListComp {
	interface Attrs {
		stroke?: IRenderStroke
		strokes: IRenderStroke[]
	}
	interface State {
		onContextMenu?: (e: MouseEvent) => void
	}
}
type Vnode = m.Vnode<StrokeListComp.Attrs, StrokeListComp.State>
type VnodeDOM = m.VnodeDOM<StrokeListComp.Attrs, StrokeListComp.State>

export const StrokeListComp: m.Comp<StrokeListComp.Attrs, StrokeListComp.State> = {

	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		return [
			v.attrs.strokes.map((stroke, index) => {
				//let isSelected = !!data.selectedStrokeIds[id]
				return (
					m(`div`, {
						'key': stroke.id,
						'class': `${P}-form-list-item`,
					},
						m(`div`, { 'class': `${P}-buttons ${P}--1 ${P}--column ${P}-form-list-item-end` },
							m(`div`, { 'class': `${P}-buttons ${P}--1` },
								m(`button`, {
									'type': `button`,
									'class': `${P}-button ${P}-form-list-item-name ${P}--unnamed`,
									'onclick': (e: MouseEvent) => {
										//deselectAllStrokes(data)
										//selectStroke(data, id)
									},
									'oncreate': (v2: m.VnodeDOM<any, any>) => {
										v2.dom.addEventListener('contextmenu', v.state.onContextMenu = (e: MouseEvent) => {
											e.preventDefault()
											data.windows.push({
												id: uuid(),
												contentFactory: () => m(StrokeMenuComp, {
													strokes: v.attrs.strokes,
													index: index,
												}),
											})
											m.redraw()
										}, true)
									},
									'onremove': (v: m.VnodeDOM<any, any>) => {
										v.dom.removeEventListener('contextmenu', v.state.onContextMenu, true)
									},
								},
									`Stroke`
								),
							),
							//v.state.openStrokeIds.has(stroke) &&
							//m(StrokeListComp, {
							//	'stroke': stroke,
							//	'strokeIds': stroke.childIds,
							//})
						)
					)
				)
			}),
			m('button', {
				'type': `button`,
				'class': `${P}-button ${P}-form-list-placeholder`,
				'title': `Create new`,
				'onclick': () => {
					let stroke = createStroke(data.document.channelCount)
					v.attrs.strokes.push(stroke)
					//deselectAllStrokes(data)
					//selectStroke(data, id)
					render()
				},
			},
				`+`
			)
		]
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}
