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
import { FormComp } from './FormComp'
import { P } from '../statics'
import { data } from '../data/DataMethods'

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
			m(FormComp)
		]
	},
	// oncreate(v) {},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	// onremove(v) {}
}