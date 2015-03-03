

module ecset.path {
	export class Point {
		constructor(private x = 0, private y = 0) {

		}

		getOffset(axis: illa.Axis2D) {
			var result = NaN;
			switch (axis) {
				case illa.Axis2D.X:
					result = this.x;
					break;
				case illa.Axis2D.Y:
					result = this.y;
					break;
			}
			return result;
		}

		setOffset(axis: illa.Axis2D, value: number) {
			switch (axis) {
				case illa.Axis2D.X:
					this.x = value;
					break;
				case illa.Axis2D.Y:
					this.y = value;
					break;
			}
		}
		
		getX(): number {
			return this.x;
		}
		
		getY(): number {
			return this.y;
		}
		
		getDistance(p: Point): number {
			return Math.sqrt(Math.pow(p.x - this.x, 2) + Math.pow(p.y - this.y, 2));
		}
		
		add(p: Point): Point {
			return new Point(this.x + p.x, this.y + p.y);
		}
		
		subtract(p: Point): Point {
			return new Point(this.x - p.x, this.y - p.y);
		}
		
		getPerpProduct(pt: Point): number {
			return this.x * pt.y - this.y * pt.x;
		}
		
		getPerpendicular(cw = true): Point {
			if (cw) {
				return new Point(this.y, -this.x);
			} else {
				return new Point(-this.y, this.x);
			}
		}
	}
}