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

import { P } from '../statics'

export declare namespace MenuWindowComp {
	interface Attrs {
		content: m.Comp<any, any>
	}
	interface State { }
}
type Vnode = m.Vnode<MenuWindowComp.Attrs, MenuWindowComp.State>
type VnodeDOM = m.VnodeDOM<MenuWindowComp.Attrs, MenuWindowComp.State>

export const MenuWindowComp: m.Comp<MenuWindowComp.Attrs, MenuWindowComp.State> = {
	
	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		return (
			m(`div`, {'class': `${P}-window ${P}--menu`},
				v.attrs.content
			)
		)
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}
