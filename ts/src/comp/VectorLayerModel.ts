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

import { bind } from 'illa/FunctionUtil'
import { GLOBAL } from 'illa/GLOBAL'
import * as BezierPath from '../renderer/BezierPath'
import * as Point from '../renderer/Point'
import * as m from 'mithril'

export default class VectorLayerModel {

	private selection: Point.IProp
	private startMouse: Point.I
	private startSelection: Point.I

	startDrag(point: Point.IProp, e: MouseEvent): void {
		this.selection = point
		this.startSelection = JSON.parse(JSON.stringify(point))
		this.startMouse = { x: e.pageX, y: e.pageY }
		document.addEventListener('mouseup', this.stopDragBound)
		document.addEventListener('mousemove', this.onMouseMovedBound)
	}

	stopDragBound = bind(this.stopDrag, this)
	stopDrag(): void {
		this.selection = null
		document.removeEventListener('mouseup', this.stopDragBound)
		document.removeEventListener('mousemove', this.onMouseMovedBound)
	}

	onMouseMovedBound = bind(this.onMouseMoved, this)
	onMouseMoved(e: MouseEvent): void {
		m.startComputation()
		this.selection.x(this.startSelection.x + e.pageX - this.startMouse.x)
		this.selection.y(this.startSelection.y + e.pageY - this.startMouse.y)
		m.endComputation()
	}

	kill(): void {
		this.stopDrag()
	}
}