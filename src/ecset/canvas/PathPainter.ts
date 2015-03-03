/// <reference path='Color.ts'/>

module ecset.canvas {
	export class PathPainter {
		
		
		
		constructor(private iData: ImageData) {
			
		}
		
		getImageData(): ImageData {
			return this.iData;
		}
		
		drawPath(p: path.Path): void {
			var data = this.iData.data;
			
			for (var i = 0, n = data.length; i < n; i += 4) {
				var x = i / 4 % this.iData.width;
				var y = Math.floor(i / 4 / this.iData.width);
				var d = 1/3;
//				var color = Color.mix([
//					this.getColor(new path.Point(x - d, y - d), p),
//					this.getColor(new path.Point(x, y - d), p),
//					this.getColor(new path.Point(x + d, y - d), p),
//					this.getColor(new path.Point(x - d, y), p),
//					this.getColor(new path.Point(x, y), p),
//					this.getColor(new path.Point(x + d, y), p),
//					this.getColor(new path.Point(x - d, y + d), p),
//					this.getColor(new path.Point(x, y + d), p),
//					this.getColor(new path.Point(x + d, y + d), p)
//				]).toArray();
				var color = this.getColor(new path.Point(x, y), p).toArray();
				for (var j = 0; j < 4; j++) {
					data[i+j] = color[j];
				}
			}
		}
		
		getColor(pt: path.Point, p: path.Path): Color {
			var result: Color = new Color(0, 0, 0, 0);
			var startColor = new Color(255, 0, 0, 255);
			var endColor = new Color(0, 128, 255, 255);
			var pathLength = p.getLength();
			var currentLength = 0;
			var currentT = 0;
			var prevT: number = Infinity;
			var closest: path.Segment|path.Point;
			var closestDistance: number = Infinity;
			var closestPathT: number = 0;
			for (var i = 0, n = p.getSegmentCount(); i < n; i++) {
				var seg = p.getSegment(i);
				var segLength: number = seg.getLength();
				var perp = seg.getPerpendicular(pt);
				var t = seg.getIntersectionT(perp);
				var dist = Infinity;
				if (t < 0) {
					if (prevT > 1) {
						dist = seg.getPointA().getDistance(pt);
						if (dist <= closestDistance) {
							closest = seg.getPointA();
							closestDistance = dist;
							closestPathT = currentT;
						}
					}
				} else if (t > 1) {
					var isLast = i + 1 == n;
					if (isLast) {
						dist = seg.getPointB().getDistance(pt);
						if (dist <= closestDistance) {
							closest = seg.getPointB();
							closestDistance = dist;
							closestPathT = (currentLength + segLength) / pathLength;
						}
					}
				} else {
					dist = seg.getDistance(pt);
					if (dist <= closestDistance) {
						closest = seg;
						closestDistance = dist;
						closestPathT = (currentLength + segLength * t) / pathLength;
					}
				}
				prevT = t;
				currentLength += segLength;
				currentT = currentLength / pathLength;
			}
			if (closest) {
				result = startColor.interpolate(endColor, closestPathT).setAlpha(255 - closestDistance);
			}
			return result;
		}
	}
}