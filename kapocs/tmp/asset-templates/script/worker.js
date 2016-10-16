/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Renderer = __webpack_require__(1);
	var GLOBAL_1 = __webpack_require__(9);
	console.log('Web worker starting...');
	function onMessage(e) {
	    console.log('Render starting...');
	    var imageData = e.data.imageData;
	    var path = e.data.path;
	    Renderer.render(imageData, path);
	    console.log('Render finished.');
	    GLOBAL_1["default"].postMessage({ imageData: imageData });
	}
	exports.onMessage = onMessage;
	GLOBAL_1["default"].onmessage = onMessage.bind(this);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Point = __webpack_require__(2);
	var Segment = __webpack_require__(4);
	var Path = __webpack_require__(6);
	var Color = __webpack_require__(8);
	function render(imageData, path) {
	    var segmentInfos = calculateSegmentInfo(path);
	    for (var i = 0, n = imageData.data.length; i < n; i += 4) {
	        var x = i / 4 % imageData.width;
	        var y = Math.floor(i / 4 / imageData.width);
	        var d = 1 / 3;
	        var color = getColor({ x: x, y: y }, path, segmentInfos);
	        color.push(color.shift()); // ARGB to RGBA
	        for (var j = 0; j < 4; j++) {
	            imageData.data[i + j] = color[j];
	        }
	    }
	}
	exports.render = render;
	function getColor(point, path, segmentInfos) {
	    var result = [0, 0, 0, 0];
	    var startColor = [255, 0, 0, 255];
	    var endColor = [0, 255, 0, 0];
	    var pathLength = Path.length(path);
	    var currentLength = 0;
	    var currentT = 0;
	    var prevT = Infinity;
	    var closest;
	    var closestDistance = Infinity;
	    var closestPathT = 0;
	    for (var i = 0, n = Path.segmentCount(path); i < n; i++) {
	        var segment = Path.segment(path, i);
	        var segmentInfo = segmentInfos[i];
	        var segmentLength = Segment.length(segment);
	        var t = Segment.pointT(segment, point);
	        var dist = Segment.pointDistance(segment, point);
	        var side = Segment.pointSide(segment, point);
	        var tGainA = segmentInfo.tGain.a * dist * side;
	        var tGainB = segmentInfo.tGain.b * dist * side;
	        var newRange = tGainA + 1 + tGainB;
	        var tRatio = newRange ? 1 / newRange : 0;
	        t = (t + tGainA) * tRatio;
	        if (t >= 0 && t < 1) {
	            if (dist <= closestDistance) {
	                closest = segment;
	                closestDistance = dist;
	                closestPathT = (currentLength + segmentLength * t) / pathLength;
	            }
	        }
	        prevT = t;
	        currentLength += segmentLength;
	        currentT = currentLength / pathLength;
	    }
	    if (closest) {
	        result = Color.interpolate(startColor, endColor, closestPathT);
	        result[Color.ALPHA] = 255 - closestDistance;
	    }
	    return result;
	}
	exports.getColor = getColor;
	function calculateSegmentInfo(path) {
	    var result = [];
	    var prevSegment;
	    var prevSegmentInfo;
	    var prevVector;
	    for (var i = 0, n = Path.segmentCount(path); i < n; i++) {
	        var segment = Path.segment(path, i);
	        var segmentInfo = {
	            tGain: { a: 0, b: 0 }
	        };
	        result.push(segmentInfo);
	        var vector = Segment.toVector(segment);
	        vector = Point.toUnitVector(vector);
	        if (prevSegmentInfo) {
	            prevVector = Point.reverseVector(prevVector);
	            var normalVector = Point.add(prevVector, vector);
	            var normalPoint = Point.add(segment.a, normalVector);
	            var distance = Segment.pointDistance(segment, normalPoint);
	            var t = Segment.pointT(segment, normalPoint);
	            var side = Segment.pointSide(segment, normalPoint);
	            t *= -1; // Gain
	            t *= side; // On right side
	            if (distance)
	                t *= 1 / distance; // Per distance pixel
	            segmentInfo.tGain.a = t;
	            distance = Segment.pointDistance(prevSegment, normalPoint);
	            t = Segment.pointT(prevSegment, normalPoint);
	            side = Segment.pointSide(prevSegment, normalPoint);
	            t -= 1; // End
	            t *= side; // On right side
	            if (distance)
	                t *= 1 / distance; // Per distance pixel
	            prevSegmentInfo.tGain.b = t;
	        }
	        prevSegment = segment;
	        prevSegmentInfo = segmentInfo;
	        prevVector = vector;
	    }
	    return result;
	}
	exports.calculateSegmentInfo = calculateSegmentInfo;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Axis2D_1 = __webpack_require__(3);
	function position(p, axis) {
	    switch (axis) {
	        case Axis2D_1["default"].X: return p.x;
	        case Axis2D_1["default"].Y: return p.y;
	    }
	}
	exports.position = position;
	function distance(a, b) {
	    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
	}
	exports.distance = distance;
	function add(a, b) {
	    var result = {
	        x: a.x + b.x,
	        y: a.y + b.y
	    };
	    return result;
	}
	exports.add = add;
	function subtract(a, b) {
	    var result = {
	        x: a.x - b.x,
	        y: a.y - b.y
	    };
	    return result;
	}
	exports.subtract = subtract;
	function perpProduct(a, b) {
	    return a.x * b.y - a.y * b.x;
	}
	exports.perpProduct = perpProduct;
	function perpendicularVector(vector, clockwise) {
	    var result;
	    if (clockwise) {
	        result = {
	            x: vector.y,
	            y: -vector.x
	        };
	    }
	    else {
	        result = {
	            x: -vector.y,
	            y: vector.x
	        };
	    }
	    return result;
	}
	exports.perpendicularVector = perpendicularVector;
	function reverseVector(vector) {
	    return {
	        x: -vector.x,
	        y: -vector.y
	    };
	}
	exports.reverseVector = reverseVector;
	function toUnitVector(vector, multiplier) {
	    if (multiplier === void 0) { multiplier = 1; }
	    var size = vectorSize(vector);
	    return {
	        x: size ? vector.x / size * multiplier : 0,
	        y: size ? vector.y / size * multiplier : 0
	    };
	}
	exports.toUnitVector = toUnitVector;
	function vectorSize(vector) {
	    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
	}
	exports.vectorSize = vectorSize;
	function equals(a, b) {
	    return a && b && a.x === b.x && a.y === b.y;
	}
	exports.equals = equals;
	function angle(vector) {
	    return Math.atan2(vector.y, vector.x);
	}
	exports.angle = angle;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	(function (Axis2D) {
	    Axis2D[Axis2D["X"] = 0] = "X";
	    Axis2D[Axis2D["Y"] = 1] = "Y";
	})(exports.Axis2D || (exports.Axis2D = {}));
	var Axis2D = exports.Axis2D;
	exports.__esModule = true;
	exports["default"] = Axis2D;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Point = __webpack_require__(2);
	var Angle = __webpack_require__(5);
	function length(segment) {
	    return Point.distance(segment.a, segment.b);
	}
	exports.length = length;
	function pointDistance(segment, point) {
	    // http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
	    var distance = Math.abs((segment.b.y - segment.a.y) * point.x - (segment.b.x - segment.a.x) * point.y + segment.b.x * segment.a.y - segment.b.y * segment.a.x) / Math.sqrt(Math.pow(segment.b.y - segment.a.y, 2) + Math.pow(segment.b.x - segment.a.x, 2));
	    // distance *= pointSide(segment, point)
	    return distance;
	}
	exports.pointDistance = pointDistance;
	function pointSide(segment, point) {
	    var segmentVector = toVector(segment);
	    var pointVector = Point.subtract(point, segment.a);
	    var segmentAngle = Point.angle(segmentVector);
	    var pointAngle = Point.angle(pointVector);
	    return Angle.side(segmentAngle, pointAngle);
	}
	exports.pointSide = pointSide;
	function pointT(segment, point) {
	    var perpendicularSegment = perpendicular(segment, point);
	    return intersectionT(segment, perpendicularSegment);
	}
	exports.pointT = pointT;
	function toVector(segment) {
	    return Point.subtract(segment.b, segment.a);
	}
	exports.toVector = toVector;
	function intersectionT(a, b) {
	    var v1 = toVector(b);
	    var v2 = toVector(a);
	    var v3 = Point.subtract(b.a, a.a);
	    // http://www.tonypa.pri.ee/vectors/tut05.html
	    return Point.perpProduct(v3, v1) / Point.perpProduct(v2, v1);
	}
	exports.intersectionT = intersectionT;
	function perpendicular(segment, a, clockwise) {
	    var result = {
	        a: a,
	        b: Point.add(a, Point.perpendicularVector(toVector(segment), clockwise))
	    };
	    return result;
	}
	exports.perpendicular = perpendicular;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	var DOUBLE_PI = Math.PI * 2;
	function side(axis, angle) {
	    axis = normalize(axis);
	    angle = normalize(angle);
	    if ((angle <= axis && angle > axis - Math.PI) || (angle > axis + Math.PI && angle <= axis + 2 * Math.PI)) {
	        return -1;
	    }
	    else {
	        return 1;
	    }
	}
	exports.side = side;
	function normalize(angle) {
	    angle %= DOUBLE_PI;
	    if (angle < 0)
	        angle += DOUBLE_PI;
	    return angle;
	}
	exports.normalize = normalize;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var End_1 = __webpack_require__(7);
	var Point = __webpack_require__(2);
	function segment(path, i) {
	    var result = {
	        a: path[i],
	        b: path[i + 1]
	    };
	    if (!result.a || !result.b)
	        return null;
	    return result;
	}
	exports.segment = segment;
	function segmentCount(path) {
	    return path.length - 1;
	}
	exports.segmentCount = segmentCount;
	function size(path, axis) {
	    return position(path, axis, End_1["default"].MAX) - position(path, axis, End_1["default"].MIN);
	}
	exports.size = size;
	function position(path, axis, end) {
	    var result = end == End_1["default"].MIN ? Infinity : -Infinity;
	    var test = end == End_1["default"].MIN ? Math.min : Math.max;
	    for (var i = 0, n = path.length; i < n; i++) {
	        var pointOffset = Point.position(path[i], axis);
	        result = test(result, pointOffset);
	    }
	    if (!isFinite(result)) {
	        result = 0;
	    }
	    return result;
	}
	exports.position = position;
	function length(path) {
	    var result = 0;
	    if (path.length) {
	        var prevPt = path[0];
	        for (var i = 1, n = path.length; i < n; i++) {
	            var pt = path[i];
	            result += Point.distance(prevPt, pt);
	            prevPt = pt;
	        }
	    }
	    return result;
	}
	exports.length = length;
	function join(a, b) {
	    if (Point.equals(a[a.length], b[0]))
	        b = b.slice(1);
	    return a.concat(b);
	}
	exports.join = join;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	(function (End) {
	    End[End["MIN"] = 0] = "MIN";
	    End[End["MAX"] = 1] = "MAX";
	})(exports.End || (exports.End = {}));
	var End = exports.End;
	exports.__esModule = true;
	exports["default"] = End;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	exports.ALPHA = 0;
	function interpolate(a, b, t) {
	    var length = Math.max(a.length, b.length);
	    var result = [];
	    for (var i = 0; i < length; i++) {
	        var aValue = a[i] || 0;
	        var bValue = b[i] || 0;
	        result[i] = aValue + (bValue - aValue) * t;
	    }
	    return result;
	}
	exports.interpolate = interpolate;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * A reference to the global object.
	 * This is the window in a browser, and the global in node.
	 */
	exports.GLOBAL = new Function('return this')();
	exports.__esModule = true;
	exports["default"] = exports.GLOBAL;


/***/ }
/******/ ]);