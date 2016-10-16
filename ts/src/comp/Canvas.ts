/*
 * Copyright 2016 András Parditka.
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

import { IPath } from '../renderer/Path'
import * as Path from '../renderer/Path'
import { IBezierPath } from '../renderer/BezierPath'
import * as BezierPath from '../renderer/BezierPath'
import { bind } from 'illa/FunctionUtil'
import * as m from 'mithril'
import P from './P'
import CanvasLayer from './CanvasLayer'

export default class Canvas implements Mithril.Component<any> {
	
	private bezierPath: IBezierPath = [
	{
		center: {
			x: 255,
			y: 255
		},
		handleIn: null,
		handleOut: {
			x: 255,
			y: 768 - 255
		}
	},
	{
		center: {
			x: 1024 - 255,
			y: 768 - 255
		},
		handleIn: {
			x: 1024 - 255,
			y: 255
		},
		handleOut: null
	}
]

	view() {
		return (
			m('div', {'class': `${P}-canvas`},
				new CanvasLayer(1024, 768, this.bezierPath)
			)
		)
	}
}