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

import { RenderDocument } from './RenderDocument'
import { RenderView } from './RenderView'
import { Window } from './Window'
import { Point } from './Point'
import { RendererState } from './RendererState'
import { TSet } from './TSet'
import { RenderStroke } from "./RenderStroke";
import { RenderBezierPath } from "./RenderBezierPath";
import { RenderBezierPoint } from "./RenderBezierPoint";

export class Data {
	document: RenderDocument = new RenderDocument(
		4,
		1024,
		1024,
		[],
	)
	renderers: Worker[] = []
	rendererStates: RendererState[] = []
	maxRenderers: number = navigator.hardwareConcurrency || 1
	lastRenderFinished: number = 0
	pixelsByStrokeId: TSet<Uint8ClampedArray> = {}
	viewsByStrokeId: TSet<RenderView> = {}
	canvasLocation: Point = new Point(
		0,
		0,
	)
	canvasScale: number = 1
	selectedStrokes: RenderStroke[] = []
	selectedBezierPaths: RenderBezierPath[] = []
	selectedBezierPoints: RenderBezierPoint[] = []
	selectedPoints: Point[] = []
	windows: Window[] = []
}
