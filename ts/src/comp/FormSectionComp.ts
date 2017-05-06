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

export declare namespace FormSectionComp {
	interface Attrs {
		title: m.Children
		content: m.Children
		buttons?: m.Children
	}
	interface State { }
}
type Vnode = m.Vnode<FormSectionComp.Attrs, FormSectionComp.State>
type VnodeDOM = m.VnodeDOM<FormSectionComp.Attrs, FormSectionComp.State>

export const FormSectionComp: m.Comp<FormSectionComp.Attrs, FormSectionComp.State> = {

	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		return (
			m(`div`, { 'class': `${P}-form-section` },
				m(`div`, { 'class': `${P}-form-title` },
					v.attrs.title,
				),
				m(BorderComp),
				v.attrs.content,
				v.attrs.buttons &&
				[
					m(BorderComp),
					m(`div`, { 'class': `${P}-form-buttons` },
						v.attrs.buttons,
					)
				]
			)
		)
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}