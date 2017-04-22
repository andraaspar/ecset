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

import { IColor } from './IColor'
import { IRenderColor } from './IRenderColor'
import { IViewColor } from './IViewColor'
import { IViewDocument } from './IViewDocument'
import { data } from './DataMethods'

export const ALPHA_CHANNEL_INDEX = 0

export function interpolateColors(a: IColor, b: IColor, t: number): IColor {
	let length = Math.max(a.channelValues.length, b.channelValues.length)
	let result: IColor = {
		channelValues: [],
	}
	for (let i = 0; i < length; i++) {
		let aValue = a.channelValues[i] || 0
		let bValue = b.channelValues[i] || 0
		result.channelValues[i] = aValue + (bValue - aValue) * t
	}
	return result
}

export function viewColorToRenderColor(p: IViewColor): IRenderColor {
	return {
		id: p.id,
		channelValues: p.channelValues.slice(0)
	}
}

export function getRenderColor(d: IViewDocument, id: string): IRenderColor {
	return viewColorToRenderColor(d.colorsById[id])
}

export function createViewColor(id: string, alphaValue: number, ...values: number[]) {
	let result: IViewColor = {
		id: id,
		channelValues: [alphaValue].concat(values).map(value => Math.max(0, Math.min(255, Math.floor(value)) || 0)),
	}
	if (data.document.channelCount != result.channelValues.length) throw 'oorba3'
	return result
}

export function createGrayViewColor(id: string, alphaValue: number, value: number) {
	let values: number[] = []
	for (let i = 1; i < data.document.channelCount; i++) {
		values.push(value)
	}
	return createViewColor(id, alphaValue, ...values)
}
