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
import { addMemorizedStrokeIdsAsChildren, clearMemorizedStrokeIds, createStroke, deselectAllStrokes, memorizeStrokeIds, selectStroke } from '../data/StrokeMethods'

import { BorderComp } from './BorderComp'
import { IViewStroke } from '../data/IViewStroke'
import { MenuWindowComp } from './MenuWindowComp'
import { data } from '../data/DataMethods'
import { render } from '../data/RenderMethods'
import { uuid } from 'illa/StringUtil'

export declare namespace StrokeListComp {
	interface Attrs {
		stroke?: IViewStroke
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
		return [
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
							m(`div`, { 'class': `${P}-buttons ${P}--1` },
								m(`button`, {
									'type': `button`,
									'class': `${P}-button ${P}-form-list-item-name ${stroke.name ? `` : `${P}--unnamed`} ${isSelected ? `${P}--highlighted` : ``}`,
									'onclick': (e: MouseEvent) => {
										deselectAllStrokes(data)
										selectStroke(data, id)
									},
									'oncreate': (v: m.VnodeDOM<any, any>) => {
										console.log('A')
										v.dom.addEventListener('contextmenu', onContextMenu, true)
									},
									'onremove': (v: m.VnodeDOM<any, any>) => {
										console.log('B')
										v.dom.removeEventListener('contextmenu', onContextMenu, true)
									},
								},
									stroke.name || `Stroke`
								),
								m(`button`, {
									'type': `button`,
									'class': `${P}-button ${P}-form-list-item-extra-button`,
									'onclick': () => {
										memorizeStrokeIds(data, id)
									},
									'title': `Memorize`,
								},
									`M`
								),
							),
							v.state.openStrokeIds.has(stroke) && get(() => !!stroke.childIds.length) &&
							m(StrokeListComp, {
								'stroke': stroke,
								'strokeIds': stroke.childIds,
							})
						)
					)
				)
			}),
			m('button', {
				'type': `button`,
				'class': `${P}-button ${P}-form-list-placeholder`,
				'title': data.memorizedStrokeIds.length ? `Insert ${data.memorizedStrokeIds.length} memorized` : `Create new`,
				'onclick': () => {
					if (data.memorizedStrokeIds.length) {
						if (v.attrs.stroke) {
							addMemorizedStrokeIdsAsChildren(data, v.attrs.stroke)
						} else {
							data.document.strokeIds.splice(data.document.strokeIds.length, 0, ...data.memorizedStrokeIds)
						}
					} else {
						let id = createStroke(data)
						data.document.strokeIds.push(id)
						deselectAllStrokes(data)
						selectStroke(data, id)
					}
					render()
				},
			},
				`+ ${data.memorizedStrokeIds.length || ``}`
			)
		]
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}

function onContextMenu(e: MouseEvent) {
	e.preventDefault()
	data.windows.push({
		id: uuid(),
		contentFactory: () => m(MenuWindowComp, {
			content: m(`div`, { 'class': `` }, `Yay`)
		}),
	})
	m.redraw()
}