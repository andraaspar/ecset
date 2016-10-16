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

import { IPath } from './Path'
import { bind } from 'illa/FunctionUtil'
import * as m from 'mithril'

export default class Canvas implements Mithril.Component<any> {

	private canvas: HTMLCanvasElement
	private context: CanvasRenderingContext2D
	private imageData: ImageData
	private worker: Worker
	private renderStartTime: number

	constructor(
		private width: number,
		private height: number,
		private path: IPath
	) { }

	view() {
		return (
			m('canvas', {
				'width': this.width,
				'height': this.height,
				'config': (elem, inited, context, velem) => {
					if (!inited) {
						this.canvas = <HTMLCanvasElement>elem
						this.context = this.canvas.getContext('2d')
						this.imageData = this.context.createImageData(this.canvas.width, this.canvas.height)
						this.worker = new Worker('script/{{worker.js}}')
						this.worker.onmessage = (e) => {
							console.log('Outputting image data...')
							this.context.putImageData(e.data.imageData, 0, 0)
							console.log(`Render took: ${Date.now() - this.renderStartTime} ms`)
						}
						this.renderStartTime = Date.now()
						this.worker.postMessage({ imageData: this.imageData, path: this.path });
						context.onunload = () => {
							this.worker.terminate()
							this.canvas = this.context = this.imageData = this.worker = null
						}
					}
				}
			})
		)
	}
}