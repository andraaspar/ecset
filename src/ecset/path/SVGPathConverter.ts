/// <reference path='BezierPath.ts'/>
/// <reference path='BezierPoint.ts'/>

module ecset.path {
	export interface ICoords {
		x:number;
		y:number;
	}
	
	export class SVGPathConverter {
		static MOVE_TO = 'M';
		static CURVE_TO = 'C';
		static LINE_TO = 'L';

		static convert(d: string) {
			var points: Array<BezierPoint> = [];
			var dArr = d.split(' ');
			var currentCommand = '';
			
			var lastPoint: BezierPoint;

			for (var i = 0, n = dArr.length; i < n; i++) {
				var dPart = dArr[i];
				switch (dPart) {
					case SVGPathConverter.MOVE_TO:
					case SVGPathConverter.LINE_TO:
					case SVGPathConverter.CURVE_TO:
						currentCommand = dPart;
						break;
					default:
						switch (currentCommand) {
							case SVGPathConverter.MOVE_TO:
							case SVGPathConverter.LINE_TO:
								lastPoint = SVGPathConverter.convertBezierPoint(dPart);
								points.push(lastPoint);
								break;
							case SVGPathConverter.CURVE_TO:
								var handleCoords = SVGPathConverter.convertCoords(dPart);
								lastPoint.setHandleOffset(illa.Axis2D.X, illa.End.MAX, handleCoords.x);
								lastPoint.setHandleOffset(illa.Axis2D.Y, illa.End.MAX, handleCoords.y);
								
								lastPoint = SVGPathConverter.convertBezierPoint(dArr[i + 2], dArr[i + 1]);
								points.push(lastPoint);
								i += 2;
								break;
							default:
						}
				}
			}

			return new BezierPath(points);
		}
		
		static convertBezierPoint(coords:string, inCoords?:string, outCoords?:string) {
			var coordsConverted = SVGPathConverter.convertCoords(coords);
			var inCoordsConverted = coordsConverted;
			var outCoordsConverted = coordsConverted;
			if (inCoords) {
				inCoordsConverted = SVGPathConverter.convertCoords(inCoords);
			}
			if (outCoords) {
				outCoordsConverted = SVGPathConverter.convertCoords(outCoords);
			}
			return new BezierPoint(coordsConverted.x, coordsConverted.y, inCoordsConverted.x, inCoordsConverted.y, outCoordsConverted.x, outCoordsConverted.y);
		}
		
		static convertCoords(coords:string):ICoords {
			var result:ICoords = null;
			var found = coords.match(/^(-?[0-9.]+),?(-?[0-9.]+)$/);
			if (found && found.length == 3) {
				result = {
					x: Number(found[1]),
					y: Number(found[2])
				};
			}
			return result;
		}
	}
}