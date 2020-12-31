'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var noop = function noop() {};

var AXIS_X = 1;
var AXIS_Y = 2;
var defaultOptions = {
  flingThresh: 1
};
var supportTouchEvent = 'ontouchstart' in window;
/**
 * 事件
 * touch-down(startPos, currentPos)
 * touch-move(x, y)
 * touch-slide(startPos, currentPost)
 * touch-fling
 * touch-up(startPos, currentPos)
 */

var TouchHub =
/*#__PURE__*/
function () {
  /** 关于x轴速度记录 */

  /** 关于x轴速度记录的index */

  /** 关于y轴速度记录 */

  /** 关于y轴速度记录的index */

  /** 缓存记录 */

  /** 缓存记录 */
  // 主要检测哪个轴向上的内容
  // mouse事件所使用的变量
  // 所有的触发函数

  /**
   * onTouchDown
   * onTouchUp
   * onTouchMove
   * onTouchSlide
   * onTouchFling
   */
  function TouchHub(options) {
    _classCallCheck(this, TouchHub);

    var self = this; // 是否停止检测

    self.active = true;
    self.options = Object.assign({}, defaultOptions, options);
    self.speedX = [0, 0]; // 速度记录

    self.speedXIdx = 0;
    self.speedY = [0, 0];
    self.speedYIdx = 0;
    self.minFlingSpeed = self.options.flingThresh; // px/millsecond

    self.maxFlingSpeed = 1; // 当前主要检测的轴向

    self.coordinate = 'x';
    self.moveCoordinate = null;
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
    self._down = self._up = self._move = self._slide = self._fling = noop; // 输出

    if (supportTouchEvent) {
      console.log('[touch] support touch event');
    } else {
      console.log('[touch] fallback to mouse event');
    }
  }

  _createClass(TouchHub, [{
    key: "start",
    value: function start(event) {
      console.log('start');
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
      } // 获得当前的位置数据


      var x = e.clientX;
      var y = e.clientY;

      self._setStartPosition(x, y);

      self._setCurrentPosition(x, y); // 发生点击的开始
      // 分别创建两个不同


      self._down({
        startPos: Object.assign({}, self.startPos),
        currentPos: Object.assign({}, self.currentPos)
      });

      self.lastRecordTime = Date.now();
    }
  }, {
    key: "move",
    value: function move(event) {
      console.log('move');
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

      var moveCoordinate = Math.abs(offsetX) > Math.abs(offsetY) ? 'x' : 'y';

      if (!self.moveCoordinate) {
        self.moveCoordinate = moveCoordinate;
      }

      self._move({
        x: offsetX,
        y: offsetY,
        startMoveCoordinate: self.moveCoordinate,
        moveCoordinate: moveCoordinate
      });

      var now = Date.now();
      self.recordSpeed(offsetX, AXIS_X, now);
      self.recordSpeed(offsetY, AXIS_Y, now);
      self.lastRecordTime = now; // preventDefault，是为了阻止后面元素的滚动

      if (self.moveCoordinate == self.coordinate) {
        event.preventDefault();
      }
    }
  }, {
    key: "end",
    value: function end(event) {
      console.log('end');
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
      } // var pageX = touch.clientX;
      // var pageY = touch.clientY;
      // var offsetX = pageX - self.currentPos.x;
      // var offsetY = pageY - self.currentPos.y; // 为了触发touch.move


      self._setCurrentPosition(e.clientX, e.clientY);

      var speedX = (self.speedX[0] + self.speedX[1]) / 2;
      var speedY = (self.speedY[0] + self.speedY[1]) / 2;

      self._up({
        startPos: Object.assign({}, self.startPos),
        currentPos: Object.assign({}, self.currentPos)
      });

      if (self.moveCoordinate === 'x' ? Math.abs(speedX) > self.minFlingSpeed : Math.abs(speedY) > self.minFlingSpeed) {
        self._fling({
          startPos: Object.assign({}, self.startPos),
          currentPos: Object.assign({}, self.currentPos),
          speedX: speedX,
          speedY: speedY
        });
      } else if (self.moveCoordinate === 'x' ? Math.abs(self.currentPos.x - self.startPos.x) > 0 : Math.abs(self.currentPos.y - self.startPos.y) > 0) {
        self._slide({
          startPos: Object.assign({}, self.startPos),
          currentPos: Object.assign({}, self.currentPos)
        });
      } // clearSpeed


      self.speedX[0] = self.speedX[1] = 0;
      self.speedY[0] = self.speedY[1] = 0; //

      self.moveCoordinate = null;
    }
    /**
     * 记录速度
     */

  }, {
    key: "recordSpeed",
    value: function recordSpeed(offset, axis, now) {
      var self = this;
      var duration = now - self.lastRecordTime;
      var speed = offset / duration; // 记录数据

      if (axis === AXIS_X) {
        self.speedX[self.speedXIdx++ & 1] = speed; // 让speedIdx保存为0或者1的情况
      } else if (axis === AXIS_Y) {
        self.speedY[self.speedYIdx++ & 1] = speed; // 让speedIdx保存为0或者1的情况
      }
    }
    /**
     * 允许开始工作
     * @param active
     */

  }, {
    key: "work",
    value: function work(active) {
      this.active = active;
    }
    /**
     * 记录开始位置
     * @param x
     * @param y
     */

  }, {
    key: "_setStartPosition",
    value: function _setStartPosition(x, y) {
      this.startPos.x = x;
      this.startPos.y = y;
    }
    /**
     * 记录当前位置
     */

  }, {
    key: "_setCurrentPosition",
    value: function _setCurrentPosition(x, y) {
      this.currentPos.x = x;
      this.currentPos.y = y;
    }
    /**
     * 当touch-down发生时应该调用
     */

  }, {
    key: "onTouchDown",
    value: function onTouchDown(cb) {
      this._down = cb;
    }
    /**
     * 当touch-up发生时应该调用
     */

  }, {
    key: "onTouchUp",
    value: function onTouchUp(cb) {
      this._up = cb;
    }
    /**
     * 当touch-move发生时应该调用
     */

  }, {
    key: "onTouchMove",
    value: function onTouchMove(cb) {
      this._move = cb;
    }
    /**
     * 当touch-slide发生时应该调用
     */

  }, {
    key: "onTouchSlide",
    value: function onTouchSlide(cb) {
      this._slide = cb;
    }
    /**
     * 当touch-fling发生时应该调用
     */

  }, {
    key: "onTouchFling",
    value: function onTouchFling(cb) {
      this._fling = cb;
    }
  }]);

  return TouchHub;
}();

/**
 * 事件
 * touch-down(startPos, currentPos)
 * touch-move(x, y)
 * touch-slide(startPos, currentPost)
 * touch-fling
 * touch-up(startPos, currentPos)
 */

var TouchDetector = {
  name: 'TouchDetector',
  props: {
    /**
     * 当前正在处理的coordinate
     */
    coordinate: {
      type: String,
      "default": 'x'
    },

    /**
     * 是否active
     */
    active: {
      type: Boolean,
      "default": true
    }
  },
  data: function data() {
    return {
      hub: new TouchHub()
    };
  },
  watch: {
    /**
     * 检查active
     */
    active: function active(val) {
      this.hub.active = val;
    }
  },
  methods: {
    touchstart: function touchstart(e) {
      this.hub.start.call(this.hub, e);
    },
    touchmove: function touchmove(e) {
      this.hub.move.call(this.hub, e);
    },
    touchend: function touchend(e) {
      this.hub.end.call(this.hub, e);
    }
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
  mounted: function mounted() {
    this.hub.coordinate = this.coordinate;
    this.hub.active = this.active;
  },
  render: function render(h) {
    var vm = this;
    var el = document.createElement('div'); // el.style

    var v = {
      'class': ['ro-touch'],
      style: {
        width: '100%',
        height: '100%'
      },
      on: {}
    };

    if (supportTouchEvent) {
      v.on.touchstart = vm.hub.start.bind(vm.hub);
      v.on.touchmove = vm.hub.move.bind(vm.hub);
      v.on.touchend = vm.hub.end.bind(vm.hub);
    } else {
      v.on.mousedown = vm.hub.start.bind(vm.hub);
      v.on.mousemove = vm.hub.move.bind(vm.hub);
      v.on.mouseup = vm.hub.end.bind(vm.hub);
    }

    return h('div', v, this.$slots["default"]);
  } // template: `<div class="ro-touch" style="width:100%;height:100%" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"><slot></slot></div>`,

};

exports.TouchDetector = TouchDetector;
