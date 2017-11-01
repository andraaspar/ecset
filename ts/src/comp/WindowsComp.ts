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

import { data } from '../data/DataMethods'
import jQuery from 'jquery-ts'
import { P } from '../statics'

export declare namespace WindowsComp {
	interface Attrs { }
	interface State { }
}
type Vnode = m.Vnode<WindowsComp.Attrs, WindowsComp.State>
type VnodeDOM = m.VnodeDOM<WindowsComp.Attrs, WindowsComp.State>

export const WindowsComp: m.Comp<WindowsComp.Attrs, WindowsComp.State> = {

	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		return (
			m(`div`, { 'class': `${P}-windows` },
				data.windows.map(w => (
					m(`div`, {
						'key': w.id,
						'class': `${P}-window-modal-mask`,
						'onclick': (e: MouseEvent) => {
							if (jQuery(e.target).is(`.${P}-window-modal-mask`)) {
								let index = data.windows.indexOf(w)
								if (index >= 0) data.windows.splice(index, 1)
							}
						},
					},
						w.contentFactory()
					)
				))
			)
		)
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}
