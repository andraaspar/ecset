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

import * as BezierPath from '../renderer/BezierPath'
import * as Document from '../renderer/Document'
import * as Path from '../renderer/Path'
import * as Stroke from '../renderer/Stroke'
import * as m from 'mithril'

import P from './P'
import PaintLayer from './PaintLayer'
import VectorLayer from './VectorLayer'
import { bind } from 'illa/FunctionUtil'
import { prop as p } from 'mithril'

export default class Canvas implements Mithril.Component<any> {
	
	private document: Document.IProp = {
		bezierPathsById: {},
		bezierPointsById: {},
		colorFieldsById: {},
		colorPathsById: {},
		colorSegmentsById: {},
		colorStripPairsById: {},
		colorStripsById: {},
		colorsById: {},
		pointsById: {},
		strokeIds: [],
		strokesById: {},
		transformsById: {},
		valuePathPairsById: {},
		valuePathsById: {},
		valueSegmentsById: {}
	}	

	constructor() {
		//this.replaceProps(this.bezierPath)
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
				this.document.strokeIds.map(id => {
					let stroke = Stroke.getDepropped(this.document, id())
					return new PaintLayer(1024, 768, stroke)
				}),
				this.document.strokeIds.map(id => {
					let stroke = Stroke.getDepropped(this.document, id())
					return new VectorLayer(1024, 768, this.document, stroke)
				}),
				m('div', {'style': {marginTop: '768px'}},
					JSON.stringify(this.document/*, undefined, '\t'*/)
				)
			)
		)
	}
}
