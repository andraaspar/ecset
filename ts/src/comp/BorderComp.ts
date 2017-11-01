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

export declare namespace BorderComp {
	interface Attrs {}
	interface State {}
}
type Vnode = m.Vnode<BorderComp.Attrs, BorderComp.State>
type VnodeDOM = m.VnodeDOM<BorderComp.Attrs, BorderComp.State>

export const BorderComp: m.Comp<BorderComp.Attrs, BorderComp.State> = {
	
	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		return (
			m(`div`, {'class': `${P}-border`})
		)
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}
