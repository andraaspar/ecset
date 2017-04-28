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

import { getRenderBezierPoint, scaleRenderBezierPoint } from '../data/BezierPointMethods'

import { BezierKind } from '../data/BezierKind'
import { BezierPointLayerModel } from './BezierPointLayerModel'
import { P } from '../statics'
import { data } from '../data/DataMethods'

export declare namespace BezierPointLayerComp {
	interface Attrs { }
	interface State {
		model?: BezierPointLayerModel
	}
}
type Vnode = m.Vnode<BezierPointLayerComp.Attrs, BezierPointLayerComp.State>
type VnodeDOM = m.VnodeDOM<BezierPointLayerComp.Attrs, BezierPointLayerComp.State>

export const BezierPointLayerComp: m.Comp<BezierPointLayerComp.Attrs, BezierPointLayerComp.State> = {

	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		return (
			Object.keys(data.document.bezierPointsById)
				.map(id => data.document.bezierPointsById[id])
				.filter(bezierPoint => data.selectedBezierPointIds[bezierPoint.id] && bezierPoint.kind == BezierKind.ART)
				.map(bezierPoint => {
					let scaledPoint = scaleRenderBezierPoint(getRenderBezierPoint(data.document, bezierPoint.id), data.canvasScale)
					let handlesD = `M${scaledPoint.handleIn.x},${scaledPoint.handleIn.y}L${scaledPoint.center.x},${scaledPoint.center.y}L${scaledPoint.handleOut.x},${scaledPoint.handleOut.y}`
					return (
						m('svg', {
							'class': `${P}-canvas-layer-svg`,
							'width': data.document.width * data.canvasScale,
							'height': data.document.height * data.canvasScale,
							'key': bezierPoint.id,
							'onmousedown': (e: MouseEvent) => {
								v.state.model.startDrag(bezierPoint, e)
							},
							'onclick': (e: MouseEvent) => {
								e.stopPropagation()
							},
						},
							m('path', {
								'd': handlesD,
								'class': `${P}-bezier-point-bg`
							}),
							m('path', {
								'd': handlesD,
								'class': `${P}-bezier-point`
							})
						)
					)
				})
		)
	},
	oncreate(v) {
		v.state.model = new BezierPointLayerModel()
	},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	onremove(v) {
		v.state.model.kill()
	}
}