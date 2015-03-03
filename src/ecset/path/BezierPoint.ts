/// <reference path='Point.ts'/>

module ecset.path {
	export class BezierPoint extends Point {
		constructor(x = 0, y = 0, private inX: number = x, private inY: number = y, private outX: number = x, private outY: number = y) {
			super(x, y);
		}

		getHandleOffset(axis: illa.Axis2D, end: illa.End) {
			var result = NaN;
			switch (axis) {
				case illa.Axis2D.X:
					if (end == illa.End.MIN) result = this.inX;
					else if (end == illa.End.MAX) result = this.outX;
					break;
				case illa.Axis2D.Y:
					if (end == illa.End.MIN) result = this.inY;
					else if (end == illa.End.MAX) result = this.outY;
					break;
			}
			return result;
		}

		setHandleOffset(axis: illa.Axis2D, end: illa.End, value: number) {
			switch (axis) {
				case illa.Axis2D.X:
					if (end == illa.End.MIN) this.inX = value;
					else if (end == illa.End.MAX) this.outX = value;
					break;
				case illa.Axis2D.Y:
					if (end == illa.End.MIN) this.inY = value;
					else if (end == illa.End.MAX) this.outY = value;
					break;
			}
		}

		getIsLinear(end: illa.End) {
			return this.getOffset(illa.Axis2D.X) == this.getHandleOffset(illa.Axis2D.X, end) &&
				this.getOffset(illa.Axis2D.Y) == this.getHandleOffset(illa.Axis2D.Y, end);
		}
	}
}