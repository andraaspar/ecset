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
import { IBezierPath, IPropBezierPath } from '../renderer/BezierPath'
import * as BezierPath from '../renderer/BezierPath'
import { bind } from 'illa/FunctionUtil'
import * as m from 'mithril'
import {prop as p} from 'mithril'
import P from './P'
import PaintLayer from './PaintLayer'
import VectorLayer from './VectorLayer'

export default class Canvas implements Mithril.Component<any> {
	
	private bezierPath: IPropBezierPath = /*{
		points: [
			{
				center: {
					x: p(255),
					y: p(255)
				},
				handleIn: {
					x: p(255),
					y: p(10)
				},
				handleOut: {
					x: p(255),
					y: p(500)
				}
			},
			{
				center: {
					x: p(1024 - 255),
					y: p(768 - 255)
				},
				handleIn: {
					x: p(1024 - 255),
					y: p(768 - 10)
				},
				handleOut: {
					x: p(1024 - 255),
					y: p(768 - 500)
				}
			}
		],
		isLoop: p(true)
	}*/
	JSON.parse('{"points":[{"center":{"x":571,"y":445},"handleIn":{"x":633,"y":430},"handleOut":{"x":580,"y":386}},{"center":{"x":545,"y":481},"handleIn":{"x":509,"y":376},"handleOut":{"x":620,"y":501}}],"isLoop":true}')
	
	constructor() {
		this.replaceProps(this.bezierPath)
	}
	
	replaceProps(data: {}): void {
		switch (typeof data) {
			case 'object':
				if (data) {
					for (let key of Array.isArray(data) ? data.map((item, index) => index) : Object.keys(data)) {
						let value = data[key]
						switch (typeof value) {
							case 'boolean':
							case 'number':
							case 'string':
								data[key] = p(value)
								break
							case 'object':
								if (value) {
									this.replaceProps(value)
								}
								break
							case 'function':
							default:
						}
					}
				}
			break
		}
	}

	view() {
		return (
			m('div', {'class': `${P}-canvas`},
				new PaintLayer(1024, 768, this.bezierPath),
				new VectorLayer(1024, 768, this.bezierPath)
			)
		)
	}
}