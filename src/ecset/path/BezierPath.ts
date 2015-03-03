/// <reference path='Path.ts'/>
/// <reference path='BezierPoint.ts'/>

module ecset.path {
	export class BezierPath extends Path {
		constructor(points: Array<BezierPoint>) {
			super(points);
		}
		
		getPoint(i): BezierPoint {
			return <BezierPoint>super.getPoint(i);
		}

		linearize(steps: number): Path {
			var newPoints: Array<Point> = [];

			for (var i = 0, n = this.getPointCount() - 1; i < n; i++) {
				newPoints.pop();
				var pointA = this.getPoint(i);
				var pointB = this.getPoint(i + 1);
				newPoints = newPoints.concat(this.linearizeSegment(pointA, pointB, steps));
			}

			return new Path(newPoints);
		}

		linearizeSegment(pointA: BezierPoint, pointB: BezierPoint, steps: number) {
			var result: Array<Point> = [];
			var axes = [illa.Axis2D.X, illa.Axis2D.Y];
			var positionsX: Array<number> = [];
			var pointsPerSegment = steps + 1;

			for (var axisID = 0; axisID < axes.length; axisID++) {
				var axis = axes[axisID];
				for (var t = 0; t < pointsPerSegment; t++) {
					var ratio = t / (pointsPerSegment - 1);

					var pos = this.calculateBezierPosition([pointA.getOffset(axis), pointA.getHandleOffset(axis, illa.End.MAX),
						pointB.getHandleOffset(axis, illa.End.MIN), pointB.getOffset(axis)], ratio);

					if (axis == illa.Axis2D.X) {
						positionsX.push(pos[0]);
					} else {
						result.push(new Point(positionsX[t], pos[0]));
					}

				}
			}

			return result;
		}

		calculateBezierPosition(coords: Array<number>, t: number) {
			var result: Array<number> = [];

			if (coords.length == 1) {
				result = coords;
			} else {
				for (var i = 0, n = coords.length - 1; i < n; i++) {
					result.push(this.calculateBezierPositionSingle(coords[i], coords[i + 1], t));
				}
				if (result.length > 1) {
					result = this.calculateBezierPosition(result, t);
				}
			}

			return result;
		}

		calculateBezierPositionSingle(posA: number, posB: number, t: number) {
			return (posB - posA) * t + posA;
		}
	}
}