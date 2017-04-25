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
import { IPoint } from '../data/IPoint'
import { IRenderPoint } from '../data/IRenderPoint'
import { IViewPoint } from '../data/IViewPoint'
import { VectorLayerComp } from './VectorLayerComp'
import { bind } from 'illa/FunctionUtil'
import { render } from '../data/RenderMethods'

export class VectorLayerModel {

	private attrs: VectorLayerComp.Attrs
	private selection: IViewPoint
	private startMouse: IPoint
	private startSelection: IRenderPoint
	
	initVectorLayerModel(attrs: VectorLayerComp.Attrs) {
		this.update(attrs)
		return this
	}
	
	update(attrs: VectorLayerComp.Attrs) {
		this.attrs = attrs
	}

	startDrag(point: IViewPoint, e: MouseEvent): void {
		this.selection = point
		this.startSelection = JSON.parse(JSON.stringify(point))
		this.startMouse = {
			x: e.pageX,
			y: e.pageY,
		}
		document.addEventListener('mouseup', this.stopDragBound)
		document.addEventListener('mousemove', this.onMouseMovedBound)
	}

	protected stopDragBound = bind(this.stopDrag, this)
	protected stopDrag(): void {
		this.selection = null
		document.removeEventListener('mouseup', this.stopDragBound)
		document.removeEventListener('mousemove', this.onMouseMovedBound)
		render()
	}

	protected onMouseMovedBound = bind(this.onMouseMoved, this)
	protected onMouseMoved(e: MouseEvent): void {
		this.selection.x = this.startSelection.x + (e.pageX - this.startMouse.x) / this.attrs.scale
		this.selection.y = this.startSelection.y + (e.pageY - this.startMouse.y) / this.attrs.scale
		m.redraw()
	}

	kill(): void {
		this.stopDrag()
	}
}
