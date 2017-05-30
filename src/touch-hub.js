// @flow

type Position = {
    x: number,
    y: number
};

const assign = Object.assign;

function noop() {};

// 对于changedTouches
// 对于touchEnd来说会出现touches为end
// 对于touchStart来说，changedTouches失败了
function getTouches (event) {
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
export default class TouchHub {

    active: boolean;
    speedX: Array<number>;
    speedXIdx: number;
    speedY: Array<number>;
    speedYIdx: number;

    minFlingSpeed: number;
    maxFlingSpeed: number;

    startPos: Position;
    currentPos: Position;

    lastRecordTime: number;

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
    }

    start(event: any): void {
        const self = this;
        if (!self.active) {
            return;
        }

        // 获得当前的位置数据
        const touch = event.changedTouches[0]; // todo: 这里为什么使用changedTouches
        const x = touch.clientX;
        const y = touch.clientY;
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
        if (!this.active) {
            return;
        }

        const touch = getTouches(event);
        const self = this;
        const pageX = touch.clientX;
        const pageY = touch.clientY;
        const offsetX = pageX - self.currentPos.x;
        const offsetY = pageY - self.currentPos.y;
        self._setCurrentPosition(pageX, pageY);

        self._move({
            x: offsetX,
            y: offsetY,
        });

        self.recordSpeed(offsetX);
        // preventDefault
        event.preventDefault();
    }

    end(event: any): void {
        if (!this.active) {
            return;
        }

        const touch = event.changedTouches[0];
        const self = this;

        // const pageX = touch.clientX;
        // const pageY = touch.clientY;
        // const offsetX = pageX - self.currentPos.x;
        // const offsetY = pageY - self.currentPos.y; // 为了触发touch.move
        self._setCurrentPosition(touch.clientX, touch.clientY);

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

    recordSpeed(offset: number): void {
        const self = this;
        const now = Date.now();
        const duration = now - self.lastRecordTime;
        const speed = offset / duration;
        // 记录数据
        self.speedX[(self.speedXIdx++) & 1] = speed; // 让speedIdx保存为0或者1的情况
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