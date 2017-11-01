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

import { clonePoint, scaleVector } from './PointMethods'

import { BezierPoint } from './BezierPoint'

export function scaleRenderBezierPoint(p: BezierPoint, scale: number): BezierPoint {
	return new BezierPoint(
		scaleVector(p.handleIn, scale),
		scaleVector(p.center, scale),
		scaleVector(p.handleOut, scale),
	)
}

export function cloneBezierPoint(p: BezierPoint): BezierPoint {
	return new BezierPoint(
		clonePoint(p.center),
		clonePoint(p.handleIn),
		clonePoint(p.handleOut),
	)
}
