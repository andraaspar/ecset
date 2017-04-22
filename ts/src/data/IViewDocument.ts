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

import { IViewBezierPath } from './IViewBezierPath'
import { IViewBezierPoint } from './IViewBezierPoint'
import { IViewColor } from './IViewColor'
import { IViewColorField } from './IViewColorField'
import { IViewColorPath } from './IViewColorPath'
import { IViewColorSegment } from './IViewColorSegment'
import { IViewColorStrip } from './IViewColorStrip'
import { IViewColorStripPair } from './IViewColorStripPair'
import { IViewPoint } from './IViewPoint'
import { IViewStroke } from './IViewStroke'
import { IViewTransform } from './IViewTransform'
import { IViewValuePath } from './IViewValuePath'
import { IViewValuePathPair } from './IViewValuePathPair'
import { IViewValueSegment } from './IViewValueSegment'

export interface IViewDocument {
	bezierPathsById: {[id: string]: IViewBezierPath}
	bezierPointsById: {[id: string]: IViewBezierPoint}
	channelCount: number
	colorFieldsById: {[id: string]: IViewColorField}
	colorPathsById: {[id: string]: IViewColorPath}
	colorsById: {[id: string]: IViewColor}
	colorSegmentsById: {[id: string]: IViewColorSegment}
	colorStripPairsById: {[id: string]: IViewColorStripPair}
	colorStripsById: {[id: string]: IViewColorStrip}
	height: number
	pointsById: {[id: string]: IViewPoint}
	strokeIds: string[]
	strokesById: {[id: string]: IViewStroke}
	transformsById: {[id: string]: IViewTransform}
	valuePathPairsById: {[id: string]: IViewValuePathPair}
	valuePathsById: {[id: string]: IViewValuePath}
	valueSegmentsById: {[id: string]: IViewValueSegment}
	width: number
}