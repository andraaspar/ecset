webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Canvas_1 = __webpack_require__(1);
	var BezierPath = __webpack_require__(4);
	var m = __webpack_require__(2);
	var ECSET_ELEMENT = document.getElementById('ecset');
	var bezierPath = [
	    {
	        center: {
	            x: 255,
	            y: 255
	        },
	        handleIn: null,
	        handleOut: {
	            x: 255,
	            y: 768 - 255
	        }
	    },
	    {
	        center: {
	            x: 1024 - 255,
	            y: 768 - 255
	        },
	        handleIn: {
	            x: 1024 - 255,
	            y: 255
	        },
	        handleOut: null
	    }
	];
	var path = BezierPath.linearize(bezierPath, 100);
	m.mount(ECSET_ELEMENT, new Canvas_1["default"](1024, 768, path));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var m = __webpack_require__(2);
	var Canvas = (function () {
	    function Canvas(width, height, path) {
	        this.width = width;
	        this.height = height;
	        this.path = path;
	    }
	    Canvas.prototype.view = function () {
	        var _this = this;
	        return (m('canvas', {
	            'width': this.width,
	            'height': this.height,
	            'config': function (elem, inited, context, velem) {
	                if (!inited) {
	                    _this.canvas = elem;
	                    _this.context = _this.canvas.getContext('2d');
	                    _this.imageData = _this.context.createImageData(_this.canvas.width, _this.canvas.height);
	                    _this.worker = new Worker('script/{{worker.js}}');
	                    _this.worker.onmessage = function (e) {
	                        console.log('Outputting image data...');
	                        _this.context.putImageData(e.data.imageData, 0, 0);
	                        console.log("Render took: " + (Date.now() - _this.renderStartTime) + " ms");
	                    };
	                    _this.renderStartTime = Date.now();
	                    _this.worker.postMessage({ imageData: _this.imageData, path: _this.path });
	                    context.onunload = function () {
	                        _this.worker.terminate();
	                        _this.canvas = _this.context = _this.imageData = _this.worker = null;
	                    };
	                }
	            }
	        }));
	    };
	    return Canvas;
	}());
	exports.__esModule = true;
	exports["default"] = Canvas;


/***/ },
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Path = __webpack_require__(5);
	var BezierSegment = __webpack_require__(9);
	function linearize(bezierPath, steps) {
	    var path = [];
	    for (var i = 0, n = bezierPath.length - 1; i < n; i++) {
	        var bezierSegment = {
	            a: bezierPath[i],
	            b: bezierPath[i + 1]
	        };
	        var segmentPath = BezierSegment.linearize(bezierSegment, steps);
	        path = Path.join(path, segmentPath);
	    }
	    return path;
	}
	exports.linearize = linearize;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var End_1 = __webpack_require__(6);
	var Point = __webpack_require__(7);
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
/* 6 */
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Axis2D_1 = __webpack_require__(8);
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
/* 8 */
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Axis2D_1 = __webpack_require__(8);
	var BezierUtil_1 = __webpack_require__(10);
	var Point = __webpack_require__(7);
	var AXES = [Axis2D_1["default"].X, Axis2D_1["default"].Y];
	function linearize(segment, steps) {
	    var result = [];
	    var positionsX = [];
	    var pointsPerSegment = steps + 1;
	    for (var axisID = 0; axisID < AXES.length; axisID++) {
	        var axis = AXES[axisID];
	        for (var t = 0; t < pointsPerSegment; t++) {
	            var ratio = t / (pointsPerSegment - 1);
	            var pos = BezierUtil_1.calculateBezierPosition([
	                Point.position(segment.a.center, axis),
	                Point.position(segment.a.handleOut, axis),
	                Point.position(segment.b.handleIn, axis),
	                Point.position(segment.b.center, axis)
	            ], ratio);
	            if (axis == Axis2D_1["default"].X) {
	                positionsX.push(pos[0]);
	            }
	            else {
	                result.push({
	                    x: positionsX[t],
	                    y: pos[0]
	                });
	            }
	        }
	    }
	    return result;
	}
	exports.linearize = linearize;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	function calculateBezierPosition(coords, t) {
	    var result = [];
	    if (coords.length == 1) {
	        result = coords;
	    }
	    else {
	        for (var i = 0, n = coords.length - 1; i < n; i++) {
	            result.push(this.calculateBezierPositionSingle(coords[i], coords[i + 1], t));
	        }
	        if (result.length > 1) {
	            result = this.calculateBezierPosition(result, t);
	        }
	    }
	    return result;
	}
	exports.calculateBezierPosition = calculateBezierPosition;
	function calculateBezierPositionSingle(posA, posB, t) {
	    return (posB - posA) * t + posA;
	}
	exports.calculateBezierPositionSingle = calculateBezierPositionSingle;


/***/ }
]);