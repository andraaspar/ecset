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

import { IPoint } from './IPoint'
import { IRenderView } from './IRenderView'
import { IViewDocument } from './IViewDocument'
import { IWindow } from './IWindow'
import { RendererState } from './RendererState'
import { TSet } from './TSet'
import { createViewDocument } from './DocumentMethods'

export class Data {
	document: IViewDocument = createViewDocument()
	renderers: Worker[] = []
	rendererStates: RendererState[] = []
	maxRenderers: number = navigator.hardwareConcurrency || 1
	lastRenderFinished: number = 0
	pixelsByStrokeId: TSet<Uint8ClampedArray> = {}
	viewsByStrokeId: TSet<IRenderView> = {}
	canvasLocation: IPoint = {
		x: 0,
		y: 0,
	}
	canvasScale: number = 1
	selectedStrokeIds: TSet<boolean> = {}
	selectedBezierPathIds: TSet<boolean> = {}
	selectedBezierPointIds: TSet<boolean> = {}
	selectedPointIds: TSet<boolean> = {}
	memorizedStrokeIds: string[] = []
	windows: IWindow[] = []
}