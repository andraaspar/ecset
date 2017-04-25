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
import { StrokeListComp } from './StrokeListComp'

export declare namespace FormComp {
	interface Attrs {}
	interface State {}
}
type Vnode = m.Vnode<FormComp.Attrs, FormComp.State>
type VnodeDOM = m.VnodeDOM<FormComp.Attrs, FormComp.State>

export const FormComp: m.Comp<FormComp.Attrs, FormComp.State> = {
	
	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		return (
			m(`div`, {'class': `${P}-form-area`},
				m(StrokeListComp)
			)
		)
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}