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

import { addPoints, scaleVector, subtractPoints } from '../data/PointMethods'

import { CanvasComp } from './CanvasComp'
import { data } from '../data/DataMethods'
import { bind } from 'illa/FunctionUtil'
import jQuery from 'jquery-ts'
import { Point } from '../data/Point'

export class CanvasModel {
	private attrs: CanvasComp.Attrs
	private areaJq: jQuery.IInstance
	private canvasJq: jQuery.IInstance
	private dragStartPoint: Point
	private locationStartPoint: Point
	private moveHandlersAttached: boolean

	initCanvasModel(elem: Element, attrs: CanvasComp.Attrs) {
		this.update(attrs)

		this.areaJq = jQuery(elem)
		this.areaJq.on('mousedown', this.onMouseDownBound)
		this.areaJq.on('wheel', this.onWheelBound)
		
		let targetScale = Math.min(this.areaJq.width() / data.document.width, this.areaJq.height() / data.document.height)
		let scale = this.attrs.scale
		while (scale > targetScale) {
			scale /= 2
		}
		this.attrs.scaleSetter(scale)
		setTimeout(() => m.redraw(), 0)

		this.canvasJq = this.areaJq.children()
		return this
	}
	
	update(attrs: CanvasComp.Attrs) {
		this.attrs = attrs
	}
	
	protected onWheelBound = bind(this.onWheel, this)
	protected onWheel(e: jQuery.IEvent) {
		e.preventDefault()
		
		let wheelEvent = <WheelEvent>e.originalEvent
		
		if (wheelEvent.deltaY < 0) {
			this.attrs.scaleSetter(this.attrs.scale * 2)
		} else if (wheelEvent.deltaY > 0) {
			this.attrs.scaleSetter(this.attrs.scale / 2)
		}
		m.redraw()
	}

	protected onMouseDownBound = bind(this.onMouseDown, this)
	protected onMouseDown(e: jQuery.IEvent) {
		if (e.button == 1 && !this.moveHandlersAttached) {
			e.preventDefault()

			jQuery(document)
				.on('mousemove', this.onMouseMoveBound)
				.on('mouseup', this.onMouseUpBound)
			this.moveHandlersAttached = true
			this.dragStartPoint = {
				x: e.pageX,
				y: e.pageY,
			}
			this.locationStartPoint = {
				x: this.attrs.location.x,
				y: this.attrs.location.y,
			}
		}
	}

	protected onMouseMoveBound = bind(this.onMouseMove, this)
	protected onMouseMove(e: jQuery.IEvent) {
		e.preventDefault()

		let mousePoint = {
			x: e.pageX,
			y: e.pageY,
		}
		let moveVector = addPoints(this.locationStartPoint, scaleVector(subtractPoints(mousePoint, this.dragStartPoint), 1 / this.attrs.scale))
		this.attrs.location.x = moveVector.x
		this.attrs.location.y = moveVector.y
		m.redraw()
	}

	protected onMouseUpBound = bind(this.onMouseUp, this)
	protected onMouseUp(e: jQuery.IEvent) {
		if (e.button == 1) {
			e.preventDefault()

			this.detachMoveHandlers()
		}
	}

	protected detachMoveHandlers() {
		jQuery(document)
			.off('mousemove', this.onMouseMoveBound)
			.off('mouseup', this.onMouseUpBound)
		this.moveHandlersAttached = false
	}

	kill() {
		this.areaJq.off('mousedown', this.onMouseDownBound)
		this.detachMoveHandlers()
	}
}
