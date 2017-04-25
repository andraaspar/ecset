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

import { getRenderColor, sanitizeChannelValue, viewColorToRenderColor } from './ColorMethods'

import { IRenderColor } from './IRenderColor'
import { IViewAlphaMultiplier } from './IViewAlphaMultiplier'
import { IViewDocument } from './IViewDocument'

export function viewAlphaMultiplierToRenderColor(d: IViewDocument, p: IViewAlphaMultiplier): IRenderColor {
	let result = getRenderColor(d, p.colorId)
	result.channelValues[0] = sanitizeChannelValue(result.channelValues[0] * p.alphaMultiplier)
	return result
}

export function getRenderColorFromAplhaMultiplier(d: IViewDocument, id: string): IRenderColor {
	return viewAlphaMultiplierToRenderColor(d, d.aplhaMultipliersById[id])
}