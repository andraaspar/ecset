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

import { IData } from './IData'
import { createViewDocument } from './DocumentMethods'

export let data: IData

export function setData(v: IData) {
	if (data) throw 'oor9sa'
	data = v
}

export function createData() {
	setData({
		document: createViewDocument(),
		renderers: [],
		rendererStates: [],
		maxRenderers: navigator.hardwareConcurrency || 1,
		lastRenderFinished: 0,
		pixelsByStrokeId: {},
		viewsByStrokeId: {},
		canvasLocation: {
			x: 0,
			y: 0,
		},
		canvasScale: 1,
		selectedStrokeIds: {},
		selectedBezierPathIds: {},
		selectedBezierPointIds: {},
		selectedPointIds: {},
	})
}