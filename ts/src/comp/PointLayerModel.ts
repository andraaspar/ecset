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

import { IPoint } from '../data/IPoint'
import { IViewPoint } from '../data/IViewPoint'
import { PointLayerComp } from './PointLayerComp'
import { bind } from 'illa/FunctionUtil'
import { data } from '../data/DataMethods'
import jQuery from 'jquery-ts'
import { render } from '../data/RenderMethods'

export class PointLayerModel {

	private selection: IViewPoint
	private startMouse: IPoint
	private startSelection: IViewPoint

	startDrag(point: IViewPoint, e: MouseEvent): void {
		if (e.button == 0) {
			this.selection = point
			this.startSelection = JSON.parse(JSON.stringify(point))
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
		this.selection.x = this.startSelection.x + (e.pageX - this.startMouse.x) / data.canvasScale
		this.selection.y = this.startSelection.y + (e.pageY - this.startMouse.y) / data.canvasScale
		m.redraw()
	}

	kill(): void {
		this.stopDrag()
	}
}