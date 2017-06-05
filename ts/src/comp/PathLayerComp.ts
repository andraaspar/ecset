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

import { bezierPathToSvg, getRenderBezierPath } from '../data/BezierPathMethods'
import { deselectAllStrokes, selectStroke } from '../data/StrokeMethods'

import { BezierKind } from '../data/BezierKind'
import { IPath } from '../data/IPath'
import { IRenderBezierPath } from '../data/IRenderBezierPath'
import { IRenderPoint } from '../data/IRenderPoint'
import { IRenderStroke } from '../data/IRenderStroke'
import { IViewDocument } from '../data/IViewDocument'
import { IViewStroke } from '../data/IViewStroke'
import { P } from '../statics'
import { PathLayerModel } from './PathLayerModel'
import { TSet } from '../data/TSet'
import { data } from '../data/DataMethods'
import { scaleRenderBezierPoint } from '../data/BezierPointMethods'
import { vectorAngle } from '../data/PointMethods'

export declare namespace PathLayerComp {
	interface Attrs { }
	interface State {
		model?: PathLayerModel
	}
}
type Vnode = m.Vnode<PathLayerComp.Attrs, PathLayerComp.State>
type VnodeDOM = m.VnodeDOM<PathLayerComp.Attrs, PathLayerComp.State>

export const PathLayerComp: m.Comp<PathLayerComp.Attrs, PathLayerComp.State> = {

	// oninit(v) {},
	// onbeforeupdate(v, o) {},
	view(v) {
		let s: TSet<IPath> = {}
		let strokes = flattenStrokes(data.document.strokeIds)
		return (
			strokes.sort((a, b) => {
				let aSelected = data.selectedStrokeIds[a.id]
				let bSelected = data.selectedStrokeIds[b.id]
				if (aSelected == bSelected) return 0
				if (aSelected && !bSelected) return 1
				return -1
			}).map(stroke => {
				let path = data.document.bezierPathsById[stroke.bezierPathId]
				let pathD = bezierPathToSvg(getRenderBezierPath(data.document, s, path.id), data.canvasScale)
				return (
					m('svg', {
						'class': `${P}-canvas-layer-svg`,
						'width': data.document.width * data.canvasScale,
						'height': data.document.height * data.canvasScale,
						'key': path.id,
						'onmousedown': (e: MouseEvent) => {
							if (!data.selectedBezierPathIds[path.id]) {
								deselectAllStrokes(data)
								selectStroke(data, stroke.id)
							}
							v.state.model.startDrag(path, e)
						},
						'onclick': (e: MouseEvent) => {
							e.stopPropagation()
						},
					},
						(data.selectedBezierPathIds[path.id] ?
							[
								m('path', {
									'd': pathD,
									'class': `${P}-path-bg`
								}),
								m('path', {
									'd': pathD,
									'class': `${P}-path`
								}),
							]
							:
							m('path', {
								'd': pathD,
								'class': `${P}-path-ghost`
							})
						)
					)
				)
			})
		)
	},
	oncreate(v) {
		v.state.model = new PathLayerModel()
	},
	// onupdate(v) {},
	// onbeforeremove(v) {},
	onremove(v) {
		v.state.model.kill()
	}
}

function flattenStrokes(strokeIds: string[]) {
	let result: IViewStroke[] = []
	for (let strokeId of strokeIds) {
		let stroke = data.document.strokesById[strokeId]
		result.push(stroke)
		if (stroke.childIds && stroke.childIds.length) {
			result = result.concat(flattenStrokes(stroke.childIds))
		}
	}
	return result
}
