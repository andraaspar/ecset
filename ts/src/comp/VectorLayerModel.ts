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
import { IRenderPoint } from '../data/IRenderPoint'
import { IViewPoint } from '../data/IViewPoint'
import { bind } from 'illa/FunctionUtil'
import { render } from '../data/RenderMethods'

export class VectorLayerModel {

	private selection: IViewPoint
	private startMouse: IRenderPoint
	private startSelection: IRenderPoint

	startDrag(point: IViewPoint, e: MouseEvent): void {
		this.selection = point
		this.startSelection = JSON.parse(JSON.stringify(point))
		this.startMouse = { id: undefined, x: e.pageX, y: e.pageY }
		document.addEventListener('mouseup', this.stopDragBound)
		document.addEventListener('mousemove', this.onMouseMovedBound)
	}

	stopDragBound = bind(this.stopDrag, this)
	stopDrag(): void {
		this.selection = null
		document.removeEventListener('mouseup', this.stopDragBound)
		document.removeEventListener('mousemove', this.onMouseMovedBound)
		render()
	}

	onMouseMovedBound = bind(this.onMouseMoved, this)
	onMouseMoved(e: MouseEvent): void {
		this.selection.x = this.startSelection.x + e.pageX - this.startMouse.x
		this.selection.y = this.startSelection.y + e.pageY - this.startMouse.y
		m.redraw()
	}

	kill(): void {
		this.stopDrag()
	}
}
