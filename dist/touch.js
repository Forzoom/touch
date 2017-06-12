(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["touch"] = factory();
	else
		root["touch"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _touchHub = __webpack_require__(1);

/**
 * 事件
 * touch-down(startPos, currentPos)
 * touch-move(x, y)
 * touch-slide(startPos, currentPost)
 * touch-fling
 * touch-up(startPos, currentPos)
 */
exports.default = {
    name: 'ROTouch',
    data: function data() {
        return {
            hub: new _touchHub.TouchHub()
        };
    },
    created: function created() {
        var vm = this;
        vm.hub.onTouchDown(function (res) {
            return vm.$emit('touch-down', res);
        });
        vm.hub.onTouchUp(function (res) {
            return vm.$emit('touch-up', res);
        });
        vm.hub.onTouchMove(function (res) {
            return vm.$emit('touch-move', res);
        });
        vm.hub.onTouchSlide(function (res) {
            return vm.$emit('touch-slide', res);
        });
        vm.hub.onTouchFling(function (res) {
            return vm.$emit('touch-fling', res);
        });
    },
    render: function render(h) {
        var vm = this;
        var v = {
            'class': ['ro-touch'],
            style: {
                width: '100%',
                height: '100%'
            },
            on: {}
        };
        if (_touchHub.supportTouchEvent) {
            v.on.touchstart = vm.hub.start.bind(vm.hub);
            v.on.touchmove = vm.hub.move.bind(vm.hub);
            v.on.touchend = vm.hub.end.bind(vm.hub);
        } else {
            v.on.mousedown = vm.hub.start.bind(vm.hub);
            v.on.mousemove = vm.hub.move.bind(vm.hub);
            v.on.mouseup = vm.hub.end.bind(vm.hub);
        }
        return h('div', v, this.$slots.default);
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assign = Object.assign;

var noop = function noop() {};

var AXIS_X = 1;
var AXIS_Y = 2;

var supportTouchEvent = exports.supportTouchEvent = 'ontouchstart' in window;

/**
 * 事件
 * touch-down(startPos, currentPos)
 * touch-move(x, y)
 * touch-slide(startPos, currentPost)
 * touch-fling
 * touch-up(startPos, currentPos)
 */

var TouchHub = exports.TouchHub = function () {

    /**
     * onTouchDown
     * onTouchUp
     * onTouchMove
     * onTouchSlide
     * onTouchFling
     */
    // 缓存记录
    // 关于y轴速度记录
    // 关于x轴速度记录
    function TouchHub() {
        _classCallCheck(this, TouchHub);

        var self = this;
        // 是否停止检测
        self.active = true;

        self.speedX = [0, 0]; // 速度记录
        self.speedXIdx = 0;
        self.speedY = [0, 0];
        self.speedYIdx = 0;

        self.minFlingSpeed = 1; // px/millsecond
        self.maxFlingSpeed = 1;

        /* 主要依赖：CSSOM/gBCR */

        // 所有的状态
        self.startPos = {
            x: 0,
            y: 0
        }; // touch开始的位置，对应的pageX,pageY
        self.currentPos = {
            x: 0,
            y: 0
        }; // 每次touchMove的情况下，对应的pageX/pageY都是currentPos
        self.lastRecordTime = -1, // 上次数据记录时间
        self._down = self._up = self._move = self._slide = self._fling = noop;

        if (supportTouchEvent) {
            console.log('[touch] support touch event');
        } else {
            console.log('[touch] fallback to mouse event');
        }
    }

    // 所有的触发函数
    // 缓存记录

    // 关于y轴速度记录的index

    // 关于x轴速度记录的index


    _createClass(TouchHub, [{
        key: 'start',
        value: function start(event) {
            var self = this;
            if (!self.active) {
                return;
            }

            var e = null;
            if (supportTouchEvent) {
                e = event.changedTouches[0];
            } else {
                e = event;
                self.mouseStatus = 1;
            }

            // 获得当前的位置数据
            var x = e.clientX;
            var y = e.clientY;
            self._setStartPosition(x, y);
            self._setCurrentPosition(x, y);

            // 发生点击的开始
            // 分别创建两个不同
            self._down({
                startPos: assign({}, self.startPos),
                currentPos: assign({}, self.currentPos)
            });

            self.lastRecordTime = Date.now();
        }
    }, {
        key: 'move',
        value: function move(event) {
            var self = this;
            if (!self.active) {
                return;
            }

            var e = null;
            if (supportTouchEvent) {
                e = event.touches[0];
            } else {
                e = event;
                if (self.mouseStatus != 1) {
                    return;
                }
            }

            var pageX = e.clientX;
            var pageY = e.clientY;
            var offsetX = pageX - self.currentPos.x;
            var offsetY = pageY - self.currentPos.y;
            self._setCurrentPosition(pageX, pageY);

            self._move({
                x: offsetX,
                y: offsetY
            });

            self.recordSpeed(offsetX, AXIS_X);
            self.recordSpeed(offsetY, AXIS_Y);
            // preventDefault
            event.preventDefault();
        }
    }, {
        key: 'end',
        value: function end(event) {
            var self = this;
            if (!self.active) {
                return;
            }

            var e = null;
            if (supportTouchEvent) {
                e = event.changedTouches[0];
            } else {
                e = event;
                self.mouseStatus = 0;
            }

            // const pageX = touch.clientX;
            // const pageY = touch.clientY;
            // const offsetX = pageX - self.currentPos.x;
            // const offsetY = pageY - self.currentPos.y; // 为了触发touch.move
            self._setCurrentPosition(e.clientX, e.clientY);

            var speedX = (self.speedX[0] + self.speedX[1]) / 2;
            self._up({
                startPos: assign({}, self.startPos),
                currentPos: assign({}, self.currentPos)
            });
            if (Math.abs(speedX) > self.minFlingSpeed) {
                self._fling({
                    startPos: assign({}, self.startPos),
                    currentPos: assign({}, self.currentPos),
                    speedX: speedX
                });
                self.speedX[0] = self.speedX[1] = 0;
            } else if (Math.abs(self.currentPos.x - self.startPos.x) > 0) {
                self._slide({
                    startPos: assign({}, self.startPos),
                    currentPos: assign({}, self.currentPos)
                });
            }

            // clearSpeed
            self.speedX[0] = self.speedX[1] = 0;
        }
    }, {
        key: 'recordSpeed',
        value: function recordSpeed(offset, axis) {
            var self = this;
            var now = Date.now();
            var duration = now - self.lastRecordTime;
            var speed = offset / duration;
            // 记录数据
            if (axis === AXIS_X) {
                self.speedX[self.speedXIdx++ & 1] = speed; // 让speedIdx保存为0或者1的情况
            } else if (axis === AXIS_Y) {
                self.speedY[self.speedYIdx++ & 1] = speed; // 让speedIdx保存为0或者1的情况
            }
            self.lastRecordTime = now;
        }
    }, {
        key: 'work',
        value: function work(active) {
            this.active = active;
        }
    }, {
        key: '_setStartPosition',
        value: function _setStartPosition(x, y) {
            this.startPos.x = x;
            this.startPos.y = y;
        }

        /**
         * 
         */

    }, {
        key: '_setCurrentPosition',
        value: function _setCurrentPosition(x, y) {
            this.currentPos.x = x;
            this.currentPos.y = y;
        }
    }, {
        key: 'onTouchDown',
        value: function onTouchDown(cb) {
            this._down = cb;
        }
    }, {
        key: 'onTouchUp',
        value: function onTouchUp(cb) {
            this._up = cb;
        }
    }, {
        key: 'onTouchMove',
        value: function onTouchMove(cb) {
            this._move = cb;
        }
    }, {
        key: 'onTouchSlide',
        value: function onTouchSlide(cb) {
            this._slide = cb;
        }
    }, {
        key: 'onTouchFling',
        value: function onTouchFling(cb) {
            this._fling = cb;
        }
    }]);

    return TouchHub;
}();

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_touch_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_touch_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__src_touch_js__);

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__src_touch_js___default.a);

/***/ })
/******/ ]);
});