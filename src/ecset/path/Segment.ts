

module ecset.path {
	export class Segment {
		
		
		
		constructor(private pointA: Point, private pointB: Point) {
			
		}
		
		getPointA(): Point {
			return this.pointA;
		}
		
		getPointB(): Point {
			return this.pointB;
		}
		
		getLength(): number {
			return this.pointA.getDistance(this.pointB);
		}
		
		getDistance(pt: Point): number {
			var x0 = pt.getX();
			var y0 = pt.getY();
			var x1 = this.pointA.getX();
			var y1 = this.pointA.getY();
			var x2 = this.pointB.getX();
			var y2 = this.pointB.getY();
			// http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
			return Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) / Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
		}
		
		getVector(): Point {
			return this.pointB.subtract(this.pointA);
		}
		
		getIntersectionT(seg: Segment): number {
			var v1 = seg.getVector();
			var v2 = this.getVector();
			var v3 = seg.pointA.subtract(this.pointA);
			// http://www.tonypa.pri.ee/vectors/tut05.html
			return v3.getPerpProduct(v1) / v2.getPerpProduct(v1);
		}
		
		getPerpendicular(p: Point, cw?: boolean): Segment {
			return new Segment(p, p.add(this.getVector().getPerpendicular(cw)));
		}
	}
}