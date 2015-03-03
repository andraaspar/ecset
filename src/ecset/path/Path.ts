/// <reference path='Point.ts'/>
/// <reference path='Segment.ts'/>

module ecset.path {
	export class Path {
		constructor(private points: Array<Point>) {

		}
		
		getPoint(i:number) {
			return this.points[i];
		}
		
		getPointCount() {
			return this.points.length;
		}
		
		getSegment(i: number): Segment {
			return new Segment(this.points[i], this.points[i+1]);
		}
		
		getSegmentCount() {
			return this.points.length - 1;
		}
		
		getSize(axis: illa.Axis2D) {
			return this.getOffset(axis, illa.End.MAX) - this.getOffset(axis, illa.End.MIN);
		}
		
		getOffset(axis: illa.Axis2D, end: illa.End) {
			var offset = end == illa.End.MIN ? Infinity : -Infinity;
			var test = end == illa.End.MIN ? Math.min : Math.max;
			
			for (var i = 0, n = this.points.length; i < n; i++) {
				var pointOffset = this.points[i].getOffset(axis);
				offset = test(offset, pointOffset);
			}
			
			if (!isFinite(offset)) {
				offset = 0;
			}
			return offset;
		}
		
		getLength(): number {
			var result = 0;
			if (this.points.length) {
				var prevPt = this.points[0];
				for (var i = 1, n = this.points.length; i < n; i++) {
					var pt = this.points[i];
					result += prevPt.getDistance(pt);
					prevPt = pt;
				}
			}
			return result;
		}
	}
}