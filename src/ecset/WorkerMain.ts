/// <reference path='../../lib/illa/_module.ts'/>
/// <reference path='../../lib/illa/Axis2D.ts'/>
/// <reference path='../../lib/illa/End.ts'/>
/// <reference path='../../lib/illa/Log.ts'/>

/// <reference path='canvas/PathPainter.ts'/>
/// <reference path='path/BezierPath.ts'/>
/// <reference path='path/Path.ts'/>

module ecset {
	export class WorkerMain {
		
		private static instance = new WorkerMain();
		
		constructor() {
			illa.GLOBAL.onmessage = illa.bind(this.onMessage, this);
		}
		
		onMessage(e: MessageEvent): void {
			var imageData: ImageData = e.data.imageData;
			var rawPoints: {x: number; y: number}[] = e.data.path.points;
			var points: path.Point[] = [];
			for (var i = 0, n = rawPoints.length; i < n; i++) {
				var rawPoint = rawPoints[i];
				points.push(new path.Point(rawPoint.x, rawPoint.y));
			}
			var p: path.Path = new path.Path(points);
			
			var pathPainter = new canvas.PathPainter(imageData);
			pathPainter.drawPath(p);
			
			illa.GLOBAL.postMessage({imageData: pathPainter.getImageData()});
		}
	}
}