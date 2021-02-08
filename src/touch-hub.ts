import {
    Pos,
    TouchHubOptions,
} from '../types/index';

type Position = {
    x: number,
    y: number
};
type AXIS = number;

const noop = () => {};

const AXIS_X = 1;
const AXIS_Y = 2;

const defaultOptions: Partial<TouchHubOptions> = {
    flingThresh: 1,
};

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
    public options: TouchHubOptions;

    public active: boolean;
    /** 关于x轴速度记录 */
    public speedX: Array<number>;
    /** 关于x轴速度记录的index */
    public speedXIdx: number;
    /** 关于y轴速度记录 */
    public speedY: Array<number>;
    /** 关于y轴速度记录的index */
    public speedYIdx: number;

    public minFlingSpeed: number;
    public maxFlingSpeed: number;

    /** 缓存记录 */
    public startPos: Position;
    /** 缓存记录 */
    public currentPos: Position;

    public lastRecordTime: number;

    // 主要检测哪个轴向上的内容
    public coordinate: string;
    public moveCoordinate: string;

    // mouse事件所使用的变量
    public mouseStatus: number;

    // 所有的触发函数
    public _down: Function;
    public _up: Function;
    public _move: Function;
    public _slide: Function;
    public _fling: Function;

    /**
     * onTouchDown
     * onTouchUp
     * onTouchMove
     * onTouchSlide
     * onTouchFling
     */
    public constructor(options?: Partial<TouchHubOptions>) {
        const self = this;
        // 是否停止检测
        self.active = true;

        self.options = Object.assign({}, defaultOptions, options);

        self.speedX = [ 0, 0 ]; // 速度记录
        self.speedXIdx = 0;
        self.speedY = [ 0, 0 ];
        self.speedYIdx = 0;

        self.minFlingSpeed = self.options.flingThresh; // px/millsecond
        self.maxFlingSpeed = 1;

        // 当前主要检测的轴向
        self.coordinate = 'x';
        self.moveCoordinate = null;

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

        // 输出
        if (supportTouchEvent) {
            console.log('[touch] support touch event');
        } else {
            console.log('[touch] fallback to mouse event');
        }
    }

    public start(pos: Pos): void {
        console.log('start');
        const self = this;
        if (!self.active) {
            return;
        }

        // 获得当前的位置数据
        const { x, y } = pos;
        self._setStartPosition(x, y);
        self._setCurrentPosition(x, y);

        // 发生点击的开始
        // 分别创建两个不同
        self._down({
            startPos: Object.assign({}, self.startPos),
            currentPos: Object.assign({}, self.currentPos),
        });

        self.lastRecordTime = Date.now();
    }

    public move(pos: Pos): void {
        console.log('move');
        const self = this;
        if (!self.active) {
            return;
        }

        const { x: pageX, y: pageY } = pos;
        const offsetX = pageX - self.currentPos.x;
        const offsetY = pageY - self.currentPos.y;
        self._setCurrentPosition(pageX, pageY);

        const moveCoordinate = Math.abs(offsetX) > Math.abs(offsetY) ? 'x' : 'y'
        if (!self.moveCoordinate) {
            self.moveCoordinate = moveCoordinate;
        }

        self._move({
            x: offsetX,
            y: offsetY,
            startMoveCoordinate: self.moveCoordinate,
            moveCoordinate,
        });

        const now = Date.now();
        self.recordSpeed(offsetX, AXIS_X, now);
        self.recordSpeed(offsetY, AXIS_Y, now);
        self.lastRecordTime = now;

        // preventDefault，是为了阻止后面元素的滚动
        if (self.moveCoordinate == self.coordinate) {
            event.preventDefault();
        }
    }

    public end(pos: Pos): void {
        console.log('end');
        var self = this;
        if (!self.active) {
            return;
        }
        // let e = null;
        // if (supportTouchEvent) {
        //     e = event.changedTouches[0];
        // } else {
        //     e = event;
        //     self.mouseStatus = 0;
        // }
        // var pageX = touch.clientX;
        // var pageY = touch.clientY;
        // var offsetX = pageX - self.currentPos.x;
        // var offsetY = pageY - self.currentPos.y; // 为了触发touch.move
        self._setCurrentPosition(pos.x, pos.y);

        const speedX = (self.speedX[0] + self.speedX[1]) / 2;
        const speedY = (self.speedY[0] + self.speedY[1]) / 2;
        self._up({
            startPos: Object.assign({}, self.startPos),
            currentPos: Object.assign({}, self.currentPos),
        });
        if (self.moveCoordinate === 'x' ? Math.abs(speedX) > self.minFlingSpeed : Math.abs(speedY) > self.minFlingSpeed) {
            self._fling({
                startPos: Object.assign({}, self.startPos),
                currentPos: Object.assign({}, self.currentPos),
                speedX,
                speedY,
            });
        } else if (self.moveCoordinate === 'x' ? Math.abs(self.currentPos.x - self.startPos.x) > 0 : Math.abs(self.currentPos.y - self.startPos.y) > 0) {
            self._slide({
                startPos: Object.assign({}, self.startPos),
                currentPos: Object.assign({}, self.currentPos),
            });
        }

        // clearSpeed
        self.speedX[0] = self.speedX[1] = 0;
        self.speedY[0] = self.speedY[1] = 0;

        //
        self.moveCoordinate = null;
    }

    /**
     * 记录速度
     */
    public recordSpeed(offset: number, axis: AXIS, now: number): void {
        var self = this;
        var duration = now - self.lastRecordTime;
        var speed = offset / duration;
        // 记录数据
        if (axis === AXIS_X) {
            self.speedX[(self.speedXIdx++) & 1] = speed; // 让speedIdx保存为0或者1的情况
        } else if (axis === AXIS_Y) {
            self.speedY[(self.speedYIdx++) & 1] = speed; // 让speedIdx保存为0或者1的情况
        }
    }

    /**
     * 允许开始工作
     * @param active
     */
    public work(active): void {
        this.active = active;
    }

    /**
     * 记录开始位置
     * @param x
     * @param y
     */
    public _setStartPosition(x: number, y: number): void {
        this.startPos.x = x;
        this.startPos.y = y;
    }

    /**
     * 记录当前位置
     */
    public _setCurrentPosition(x: number, y: number): void {
        this.currentPos.x = x;
        this.currentPos.y = y;
    }

    /**
     * 当touch-down发生时应该调用
     */
    public onTouchDown(cb: Function): void {
        this._down = cb;
    }

    /**
     * 当touch-up发生时应该调用
     */
    public onTouchUp(cb: Function): void {
        this._up = cb;
    }

    /**
     * 当touch-move发生时应该调用
     */
    public onTouchMove(cb: Function): void {
        this._move = cb;
    }

    /**
     * 当touch-slide发生时应该调用
     */
    public onTouchSlide(cb: Function): void {
        this._slide = cb;
    }

    /**
     * 当touch-fling发生时应该调用
     */
    public onTouchFling(cb: Function): void {
        this._fling = cb;
    }
}