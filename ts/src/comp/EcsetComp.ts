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
import { CanvasComp } from './CanvasComp'
import { setOut } from '../console'
import { data } from '../data/DataMethods'
import { FormComp } from './FormComp'
import { WindowsComp } from './WindowsComp'

export declare namespace EcsetComp {
	interface Attrs { }
	interface State { }
}
type Vnode = m.Vnode<EcsetComp.Attrs, EcsetComp.State>
type VnodeDOM = m.VnodeDOM<EcsetComp.Attrs, EcsetComp.State>

export const EcsetComp: m.Comp<EcsetComp.Attrs, EcsetComp.State> = {

	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		return [
			m(CanvasComp, {
				'location': data.canvasLocation,
				'scale': data.canvasScale,
				'scaleSetter': (v: number) => data.canvasScale = v,
			}),
			m(BorderComp),
			m(FormComp),
			m('div', {
				'style': 'width: 200px; overflow: auto; font-family: monospace; font-size: 12px; line-height: 1',
				'oncreate': (v) => {
					setOut(v.dom as HTMLElement)
				},
			}),
			m(WindowsComp),
		]
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}
