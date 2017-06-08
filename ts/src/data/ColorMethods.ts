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
import { IPath } from './IPath'
import { interpolateValues } from './ValueMethods'

export function interpolateColors(a: IColor, b: IColor, t: number, path?: IPath): IColor {
	let length = Math.max(a.channelValues.length, b.channelValues.length)
	let result: IColor = {
		channelValues: [],
	}
	for (let i = 0; i < length; i++) {
		let aValue = a.channelValues[i] || 0
		let bValue = b.channelValues[i] || 0
		result.channelValues[i] = interpolateValues(aValue, bValue, t, path)
	}
	return result
}

export function createViewColor(channelCount: number, alphaValue: number, ...values: number[]) {
	let result: IColor = new IColor(
		[alphaValue].concat(values).map(sanitizeChannelValue),
	)
	if (channelCount != result.channelValues.length) throw 'oorba3'
	return result
}

export function createGrayViewColor(channelCount: number, alphaValue: number, value: number) {
	let values: number[] = []
	for (let i = 1; i < channelCount; i++) {
		values.push(value)
	}
	return createViewColor(channelCount, alphaValue, ...values)
}

export function sanitizeChannelValue(v: number) {
	return Math.max(0, Math.min(255, Math.floor(v)) || 0)
}
