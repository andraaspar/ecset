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

import { cloneBezierPoint } from '../data/BezierPointMethods'

import { BezierPoint } from '../data/BezierPoint'
import { data } from '../data/DataMethods'
import { bind } from 'illa/FunctionUtil'
import { Point } from '../data/Point'
import { render } from '../data/RenderMethods'

export class BezierPointLayerModel {

	private selection: BezierPoint
	private startMouse: Point
	private startSelection: BezierPoint

	startDrag(bezierPoint: BezierPoint, e: MouseEvent): void {
		if (e.button == 0) {
			this.selection = bezierPoint
			this.startSelection = cloneBezierPoint(bezierPoint)
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
			document.removeEventListener('mouseup', this.stopDragBound)
			document.removeEventListener('mousemove', this.onMouseMovedBound)
			render()
		}
	}

	protected onMouseMovedBound = bind(this.onMouseMoved, this)
	protected onMouseMoved(e: MouseEvent): void {
		// this.selection.x = this.startSelection.x + (e.pageX - this.startMouse.x) / data.canvasScale
		let movePoint: Point = {
			x: (e.pageX - this.startMouse.x) / data.canvasScale,
			y: (e.pageY - this.startMouse.y) / data.canvasScale,
		};
		[
			[this.startSelection.center, this.selection.center],
			[this.startSelection.handleIn, this.selection.handleIn],
			[this.startSelection.handleOut, this.selection.handleOut],
		].forEach(([startPoint, point]) => {
			point.x = startPoint.x + movePoint.x
			point.y = startPoint.y + movePoint.y
		})
		m.redraw()
	}

	kill(): void {
		this.stopDrag()
	}
}
