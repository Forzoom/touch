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

var Component = __webpack_require__(3)(
  /* script */
  __webpack_require__(2),
  /* template */
  __webpack_require__(4),
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

console.log(__WEBPACK_IMPORTED_MODULE_0__src_touch_vue___default.a);
/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__src_touch_vue___default.a);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
//


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
exports.default = {
    name: 'ROTouch',
    data: function data() {
        return {
            startX: null,
            endX: null,
            startY: null,
            endY: null,
            isScrolling: null,

            speedRecord: [0, 0], // 速度记录
            speedRecordIdx: 0,

            minFlingSpeed: 1, // px/millsecond
            maxFlingSpeed: 1,

            // touch.move只返回offset
            // touch.up touch.move touch.down返回startPos/currentPos，因为使用extend，生成的是新的对象

            /* 主要依赖：CSSOM/gBCR */

            // 所有的状态
            startPos: {
                x: 0,
                y: 0
            }, // touch开始的位置，对应的pageX,pageY
            currentPos: {
                x: 0,
                y: 0
            }, // 每次touchMove的情况下，对应的pageX/pageY都是currentPos
            lastRecordTime: -1 };
    },
    methods: {
        // 所生成的start-pos和current-pos，来计算出当前的offset
        onTouchStart: function onTouchStart(event) {
            // 获得当前的位置数据
            var touch = event.changedTouches[0]; // todo: 这里为什么使用changedTouches
            var self = this;
            self.startPos.x = touch.clientX;
            self.startPos.y = touch.clientY;
            self.currentPos.x = touch.clientX;
            self.currentPos.y = touch.clientY;

            // 发生点击的开始
            // 分别创建两个不同
            self.$emit('touch-down', {
                startPos: _extends({}, self.startPos),
                currentPos: _extends({}, self.currentPos)
            });
            // event.preventDefault();

            self.lastRecordTime = Date.now();
        },

        /*
         * @description 调用了event.preventDefault()的内容
         *
         *  存在这样的问题，在手机浏览器上，需要在 touchmove事件中调用preventDefault，来保证touchstart/touchmove/touchend事件能够正常进行
         */
        onTouchMove: function onTouchMove(event) {
            var touch = getTouches(event);
            var self = this;
            var pageX = touch.clientX;
            var pageY = touch.clientY;
            var offsetX = pageX - self.currentPos.x;
            var offsetY = pageY - self.currentPos.y;
            self.currentPos.x = pageX;
            self.currentPos.y = pageY;

            self.$emit('touch-move', {
                x: offsetX,
                y: offsetY
            });

            self.recordSpeed(offsetX);
            // preventDefault
            // event.preventDefault();
        },
        onTouchEnd: function onTouchEnd(event) {
            var touch = event.changedTouches[0];
            var self = this;

            // const pageX = touch.clientX;
            // const pageY = touch.clientY;
            // const offsetX = pageX - self.currentPos.x;
            // const offsetY = pageY - self.currentPos.y; // 为了触发touch.move
            self.currentPos.x = touch.clientX;
            self.currentPos.y = touch.clientY;

            var speed = (self.speedRecord[0] + self.speedRecord[1]) / 2;
            self.$emit('touch-up', {
                startPos: _extends({}, self.startPos),
                currentPos: _extends({}, self.currentPos)
            });
            if (Math.abs(speed) > self.minFlingSpeed) {
                self.$emit('touch-fling', {
                    startPos: _extends({}, self.startPos),
                    currentPos: _extends({}, self.currentPos),
                    speed: speed
                });
                self.speedRecord[0] = self.speedRecord[1] = 0;
            } else if (Math.abs(self.currentPos.x - self.startPos.x) > 0) {
                self.$emit('touch-slide', {
                    startPos: _extends({}, self.startPos),
                    currentPos: _extends({}, self.currentPos)
                });
            }

            // clearSpeed
            self.speedRecord[0] = self.speedRecord[1] = 0;
        },
        /*
         * @description 记录速度，暂时没有用，因为fling没有使用
         */
        recordSpeed: function recordSpeed(offset) {
            var self = this;
            var now = Date.now();
            var duration = now - self.lastRecordTime;
            var speed = offset / duration;
            // 记录数据
            self.speedRecord[self.speedRecordIdx++ & 1] = speed; // 让speedRecordIdx保存为0或者1的情况
            self.lastRecordTime = now;
        }
    },
    mounted: function mounted() {
        if (!('ontouchstart' in window)) {
            // 判断是否支持touchHelper
            throw new Error('touch event is not supported!');
        }
    }
};

/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ro-touch",
    staticStyle: {
      "width": "100%",
      "height": "100%"
    },
    on: {
      "touchstart": _vm.onTouchStart,
      "touchmove": function($event) {
        $event.preventDefault();
        _vm.onTouchMove($event)
      },
      "touchend": _vm.onTouchEnd
    }
  }, [_vm._t("default")], 2)
},staticRenderFns: []}

/***/ })
/******/ ]);
});