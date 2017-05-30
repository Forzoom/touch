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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(4)(
  /* script */
  __webpack_require__(2),
  /* template */
  __webpack_require__(5),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_touch_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_touch_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__src_touch_vue__);

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__src_touch_vue___default.a);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _touchHub = __webpack_require__(3);

var _touchHub2 = _interopRequireDefault(_touchHub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
            hub: new _touchHub2.default()
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
        // this.hub.work(false);
    },

    mounted: function mounted() {
        if (!('ontouchstart' in window)) {
            // 判断是否支持touchHelper
            throw new Error('touch event is not supported!');
        }
    }
}; //
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 3 */
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

// 对于changedTouches
// 对于touchEnd来说会出现touches为end
// 对于touchStart来说，changedTouches失败了
function getTouches(event) {
    return event.touches[0];
}

/**
 * 事件
 * touch-down(startPos, currentPos)
 * touch-move(x, y)
 * touch-slide(startPos, currentPost)
 * touch-fling
 * touch-up(startPos, currentPos)
 */

var TouchHub = function () {

    /**
     * onTouchDown
     * onTouchUp
     * onTouchMove
     * onTouchSlide
     * onTouchFling
     */
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
    }

    _createClass(TouchHub, [{
        key: "start",
        value: function start(event) {
            var self = this;
            if (!self.active) {
                return;
            }

            // 获得当前的位置数据
            var touch = event.changedTouches[0]; // todo: 这里为什么使用changedTouches
            var x = touch.clientX;
            var y = touch.clientY;
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
        key: "move",
        value: function move(event) {
            if (!this.active) {
                return;
            }

            var touch = getTouches(event);
            var self = this;
            var pageX = touch.clientX;
            var pageY = touch.clientY;
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
        key: "end",
        value: function end(event) {
            if (!this.active) {
                return;
            }

            var touch = event.changedTouches[0];
            var self = this;

            // const pageX = touch.clientX;
            // const pageY = touch.clientY;
            // const offsetX = pageX - self.currentPos.x;
            // const offsetY = pageY - self.currentPos.y; // 为了触发touch.move
            self._setCurrentPosition(touch.clientX, touch.clientY);

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
        key: "recordSpeed",
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
        key: "work",
        value: function work(active) {
            this.active = active;
        }
    }, {
        key: "_setStartPosition",
        value: function _setStartPosition(x, y) {
            this.startPos.x = x;
            this.startPos.y = y;
        }

        /**
         * 
         */

    }, {
        key: "_setCurrentPosition",
        value: function _setCurrentPosition(x, y) {
            this.currentPos.x = x;
            this.currentPos.y = y;
        }
    }, {
        key: "onTouchDown",
        value: function onTouchDown(cb) {
            this._down = cb;
        }
    }, {
        key: "onTouchUp",
        value: function onTouchUp(cb) {
            this._up = cb;
        }
    }, {
        key: "onTouchMove",
        value: function onTouchMove(cb) {
            this._move = cb;
        }
    }, {
        key: "onTouchSlide",
        value: function onTouchSlide(cb) {
            this._slide = cb;
        }
    }, {
        key: "onTouchFling",
        value: function onTouchFling(cb) {
            this._fling = cb;
        }
    }]);

    return TouchHub;
}();

exports.default = TouchHub;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ro-touch",
    staticStyle: {
      "width": "100%",
      "height": "100%"
    },
    on: {
      "touchstart": function($event) {
        _vm.hub.start($event)
      },
      "touchmove": function($event) {
        _vm.hub.move($event)
      },
      "touchend": function($event) {
        _vm.hub.end($event)
      }
    }
  }, [_vm._t("default")], 2)
},staticRenderFns: []}

/***/ })
/******/ ]);
});