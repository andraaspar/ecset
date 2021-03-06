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

import { AlphaMultiplier } from './AlphaMultiplier'
import { Color } from './Color'
import { interpolateColors, sanitizeChannelValue } from './ColorMethods'
import { Path } from './Path'
import { interpolateValues } from './ValueMethods'

export function alphaMultiplierToColor(a: AlphaMultiplier) {
	return new Color(
		[
			sanitizeChannelValue(a.color.channelValues[0] * a.alphaMultiplier),
			...a.color.channelValues.slice(1),
		]
	)
}
export function interpolateAlphaMultipliers(a: AlphaMultiplier, b: AlphaMultiplier, t: number, path?: Path) {
	return new AlphaMultiplier(
		interpolateColors(a.color, b.color, t, path),
		interpolateValues(a.alphaMultiplier, b.alphaMultiplier, t, path),
	)
}
