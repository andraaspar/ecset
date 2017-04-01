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

import * as Document from '../renderer/Document'
import * as m from 'mithril'

import { IView } from 'ts/src/renderer/BezierPath'

export declare namespace Ecset {
	interface Attrs {}
	interface State {
		document?: Document.IView
		renderers?: Worker[]
	}
}
type Vnode = m.Vnode<Ecset.Attrs, Ecset.State>
type VnodeDOM = m.VnodeDOM<Ecset.Attrs, Ecset.State>

export const Ecset: m.Comp<Ecset.Attrs, Ecset.State> = {
	
	oninit(v) {
		v.state.document = Document.create()
		v.state.renderers = []
		for (let i = 0; i < 4; i++) {
			v.state.renderers.push(new Worker('script/{{worker.js}}'))
		}
	},
	// onbeforeupdate(v, o) {},
	view(v) {
		return (
			m('div',
				'Ecset here.'
			)
		)
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}