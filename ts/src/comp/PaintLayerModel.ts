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

import { data } from '../data/DataMethods'
import jQuery from 'jquery-ts'

export class PaintLayerModel {

	private canvas: HTMLCanvasElement
	private context: CanvasRenderingContext2D

	constructor(
		canvasContainer: Element,
	) {
		this.canvas = <HTMLCanvasElement>jQuery(canvasContainer).find('canvas')[0]
		this.context = this.canvas.getContext('2d')
	}

	update(strokeId: string) {
		let pixels = data.pixelsByStrokeId[strokeId]
		if (pixels) {
			let imageData = this.context.createImageData(this.canvas.width, this.canvas.height)
			imageData.data.set(pixels)
			this.context.putImageData(imageData, 0, 0)
		}
	}
}
