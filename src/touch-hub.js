// @flow

type Position = {
    x: number,
    y: number
};

type AXIS = number;

const assign = Object.assign;

const noop = () => {};

const AXIS_X = 1;
const AXIS_Y = 2;

export const supportTouchEvent = 'ontouchstart' in window;

/**
 * 事件
 * touch-down(startPos, currentPos)
 * touch-move(x, y)
 * touch-slide(startPos, currentPost)
 * touch-fling
 * touch-up(startPos, currentPos)
 */
export class TouchHub {

    active: boolean;
    speedX: Array<number>; // 关于x轴速度记录
    speedXIdx: number; // 关于x轴速度记录的index
    speedY: Array<number>; // 关于y轴速度记录
    speedYIdx: number; // 关于y轴速度记录的index

    minFlingSpeed: number;
    maxFlingSpeed: number;

    startPos: Position; // 缓存记录
    currentPos: Position; // 缓存记录

    lastRecordTime: number;

    mouseStatus: number;

    // 所有的触发函数
    _down: Function;
    _up: Function;
    _move: Function;
    _slide: Function;
    _fling: Function;

    /**
     * onTouchDown
     * onTouchUp
     * onTouchMove
     * onTouchSlide
     * onTouchFling
     */
    constructor() {
        const self = this;
        // 是否停止检测
        self.active = true;

        self.speedX = [ 0, 0, ]; // 速度记录
        self.speedXIdx = 0;
        self.speedY = [ 0, 0, ];
        self.speedYIdx = 0;

        self.minFlingSpeed = 1; // px/millsecond
        self.maxFlingSpeed = 1;

        /* 主要依赖：CSSOM/gBCR */

        // 所有的状态
        self.startPos = {
            x: 0,
            y: 0,
        }; // touch开始的位置，对应的pageX,pageY
        self.currentPos = {
            x: 0,
            y: 0,
        }; // 每次touchMove的情况下，对应的pageX/pageY都是currentPos
        self.lastRecordTime = -1, // 上次数据记录时间
        self._down = self._up = self._move = self._slide = self._fling = noop;

        if (supportTouchEvent) {
            console.log('[touch] support touch event');
        } else {
            console.log('[touch] fallback to mouse event');
        }
    }

    start(event: any): void {
        const self = this;
        if (!self.active) {
            return;
        }

        let e = null;
        if (supportTouchEvent) {
            e = event.changedTouches[0];
        } else {
            e = event;
            self.mouseStatus = 1;
        }

        // 获得当前的位置数据
        const x = e.clientX;
        const y = e.clientY;
        self._setStartPosition(x, y);
        self._setCurrentPosition(x, y);

        // 发生点击的开始
        // 分别创建两个不同
        self._down({
            startPos: assign({}, self.startPos),
            currentPos: assign({}, self.currentPos),
        });

        self.lastRecordTime = Date.now();
    }

    move(event: any): void {
        const self = this;
        if (!self.active) {
            return;
        }

        let e = null;
        if (supportTouchEvent) {
            e = event.touches[0];
        } else {
            e = event;
            if (self.mouseStatus != 1) {
                return;
            }
        }
        
        
        const pageX = e.clientX;
        const pageY = e.clientY;
        const offsetX = pageX - self.currentPos.x;
        const offsetY = pageY - self.currentPos.y;
        self._setCurrentPosition(pageX, pageY);

        self._move({
            x: offsetX,
            y: offsetY,
        });

        self.recordSpeed(offsetX, AXIS_X);
        self.recordSpeed(offsetY, AXIS_Y);
        // preventDefault
        event.preventDefault();
    }

    end(event: any): void {
        const self = this;
        if (!self.active) {
            return;
        }

        let e = null;
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

        const speedX = (self.speedX[0] + self.speedX[1]) / 2;
        self._up({
            startPos: assign({}, self.startPos),
            currentPos: assign({}, self.currentPos),
        });
        if (Math.abs(speedX) > self.minFlingSpeed) {
            self._fling({
                startPos: assign({}, self.startPos),
                currentPos: assign({}, self.currentPos),
                speedX,
            });
            self.speedX[0] = self.speedX[1] = 0;
        } else if (Math.abs(self.currentPos.x - self.startPos.x) > 0) {
            self._slide({
                startPos: assign({}, self.startPos),
                currentPos: assign({}, self.currentPos),
            });
        }

        // clearSpeed
        self.speedX[0] = self.speedX[1] = 0;
    }

    recordSpeed(offset: number, axis: AXIS): void {
        const self = this;
        const now = Date.now();
        const duration = now - self.lastRecordTime;
        const speed = offset / duration;
        // 记录数据
        if (axis === AXIS_X) {
            self.speedX[(self.speedXIdx++) & 1] = speed; // 让speedIdx保存为0或者1的情况
        } else if (axis === AXIS_Y) {
            self.speedY[(self.speedYIdx++) & 1] = speed; // 让speedIdx保存为0或者1的情况
        }
        self.lastRecordTime = now;
    }

    work(active: boolean): void {
        this.active = active;
    }

    _setStartPosition(x: number, y: number): void {
        this.startPos.x = x;
        this.startPos.y = y;
    }

    /**
     * 
     */
    _setCurrentPosition(x: number, y: number): void {
        this.currentPos.x = x;
        this.currentPos.y = y;
    }

    onTouchDown(cb: Function): void {
        this._down = cb;
    }

    onTouchUp(cb: Function): void {
        this._up = cb;
    }

    onTouchMove(cb: Function): void {
        this._move = cb;
    }

    onTouchSlide(cb: Function): void {
        this._slide = cb;
    }

    onTouchFling(cb: Function): void {
        this._fling = cb;
    }
}