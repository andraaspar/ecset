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

import * as BezierPath from '../renderer/BezierPath'
import * as Path from '../renderer/Path'
import * as Point from '../renderer/Point'
import * as Stroke from '../renderer/Stroke'
import * as View from '../renderer/View'
import * as m from 'mithril'

import { bind, debounce } from 'illa/FunctionUtil'

import P from './P'

export default class PaintLayerModel {

	private context: CanvasRenderingContext2D
	private imageData: ImageData
	private worker: Worker
	private renderStartTime: number
	private isRendering: boolean

	constructor(
		private stroke: Stroke.I,
		private canvas: HTMLCanvasElement
	) {
		this.context = this.canvas.getContext('2d')
	}

	render = debounce(this.renderInternal, this, 400)
	protected renderInternal() {
		if (this.isRendering) {
			this.abortRender()
		}
		if (!this.imageData) {
			this.imageData = this.context.createImageData(this.canvas.width, this.canvas.height)
		}
		if (!this.worker) {
			console.log('Creating new worker...')
			this.worker = new Worker('script/{{worker.js}}')
			this.worker.onmessage = (e) => {
				// console.log('Outputting image data...')
				this.isRendering = false
				this.context.putImageData(e.data.pixels, 0, 0)
				console.log(`Render took: ${Date.now() - this.renderStartTime} ms`)
			}
		}
		this.renderStartTime = Date.now()
		this.isRendering = true
		let view: View.I = {
			height: this.imageData.height,
			pixels: this.imageData.data,
			stroke: this.stroke,
			transforms: [],
			width: this.imageData.width
		}
		this.worker.postMessage(view);
	}
	
	abortRender(): void {
		this.render.cancel()
		if (this.worker) {
			console.log('Terminating worker...')
			this.worker.terminate()
			this.worker = null
		}
	}

	kill(): void {
		this.abortRender()
	}
}
