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

import { PaintLayerComp } from './PaintLayerComp'
import { RendererState } from '../data/RendererState'
import { data } from '../data/DataMethods'
import { get } from '../statics'
import jQuery from 'jquery-ts'

export class PaintLayerModel {

	private tempCanvas = document.createElement('canvas')
	private tempContext = this.tempCanvas.getContext('2d')
	private canvas: HTMLCanvasElement
	private context: CanvasRenderingContext2D
	private lastComposited = 0

	constructor(
		canvas: HTMLCanvasElement,
	) {
		this.canvas = canvas
		this.context = this.canvas.getContext('2d')
	}

	update() {
		if (data.lastRenderFinished > this.lastComposited && data.rendererStates.filter(state => state == RendererState.BUSY).length == 0) {
			this.tempCanvas.width = this.canvas.width
			this.tempCanvas.height = this.canvas.height
			let imageData = this.tempContext.createImageData(this.canvas.width, this.canvas.height)

			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

			for (let stroke of data.document.strokes) {
				let pixels = get(() => data.pixelsByStrokeId[stroke.id])
				if (pixels) {
					imageData.data.set(pixels)
					this.tempContext.putImageData(imageData, 0, 0)

					this.context.drawImage(this.tempCanvas, 0, 0)
				}
			}
			
			this.lastComposited = Date.now()
		}
	}
}
