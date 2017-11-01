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

import { GLOBAL } from 'illa/GLOBAL'
import { Path } from '../data/Path'
import { RenderBezierPath } from '../data/RenderBezierPath'
import { PathLayerComp } from './PathLayerComp'
import { Point } from '../data/Point'
import { bind } from 'illa/FunctionUtil'
import { data } from '../data/DataMethods'
import { render } from '../data/RenderMethods'
import { cloneBezierPath } from "../data/BezierPathMethods";

export class PathLayerModel {

	private selection: RenderBezierPath
	private startSelection: RenderBezierPath
	private startMouse: Point

	startDrag(path: RenderBezierPath, e: MouseEvent): void {
		if (e.button == 0) {
			this.selection = path
			this.startSelection = cloneBezierPath(path)
			this.startMouse = {
				x: e.pageX,
				y: e.pageY,
			}
			document.addEventListener('mouseup', this.stopDragBound)
			document.addEventListener('mousemove', this.onMouseMovedBound)
		}
	}

	protected stopDragBound = bind(this.stopDrag, this)
	protected stopDrag(e?: MouseEvent): void {
		if (!e || e.button == 0) {
			this.selection = null
			this.startSelection = null
			document.removeEventListener('mouseup', this.stopDragBound)
			document.removeEventListener('mousemove', this.onMouseMovedBound)
			render()
		}
	}

	protected onMouseMovedBound = bind(this.onMouseMoved, this)
	protected onMouseMoved(e: MouseEvent): void {
		let movePoint = new Point(
			(e.pageX - this.startMouse.x) / data.canvasScale,
			(e.pageY - this.startMouse.y) / data.canvasScale,
		)
		this.startSelection.points.forEach((startBezierPoint, index) => {
			let bezierPoint = this.selection.points[index]
			;[
				[startBezierPoint.center, bezierPoint.center],
				[startBezierPoint.handleIn, bezierPoint.handleIn],
				[startBezierPoint.handleOut, bezierPoint.handleOut],
			].forEach(([startPoint, point]) => {
				point.x = startPoint.x + movePoint.x
				point.y = startPoint.y + movePoint.y
			})
		})
		m.redraw()
	}

	kill(): void {
		this.stopDrag()
	}
}
