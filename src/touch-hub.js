
const assign = Object.assign;

const noop = () => {};

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
export class TouchHub {

    /**
     * onTouchDown
     * onTouchUp
     * onTouchMove
     * onTouchSlide
     * onTouchFling
     */
    constructor() {

        this.speedRecord = [
            0,
            0,
        ]; // 速度记录
        this.speedRecordIdx = 0;

        this.minFlingSpeed = 1; // px/millsecond
        this.maxFlingSpeed = 1;

        /* 主要依赖：CSSOM/gBCR */

        // 所有的状态
        this.startPos = {
            x: 0,
            y: 0,
        }; // touch开始的位置，对应的pageX,pageY
        this.currentPos = {
            x: 0,
            y: 0,
        }; // 每次touchMove的情况下，对应的pageX/pageY都是currentPos
        this.lastRecordTime = -1, // 上次数据记录时间
        this._down = this._up = this._move = this._slide = this._fling = noop;
    }

    start(event) {
        // 获得当前的位置数据
        const touch = event.changedTouches[0]; // todo: 这里为什么使用changedTouches
        const self = this;
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
        // event.preventDefault();

        self.lastRecordTime = Date.now();
    }

    move(event) {
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
        // event.preventDefault();
    }

    end(event) {
        const touch = event.changedTouches[0];
        const self = this;

        // const pageX = touch.clientX;
        // const pageY = touch.clientY;
        // const offsetX = pageX - self.currentPos.x;
        // const offsetY = pageY - self.currentPos.y; // 为了触发touch.move
        self._setCurrentPosition(touch.clientX, touch.clientY);

        const speed = (self.speedRecord[0] + self.speedRecord[1]) / 2;
        self._up({
            startPos: assign({}, self.startPos),
            currentPos: assign({}, self.currentPos),
        });
        if (Math.abs(speed) > self.minFlingSpeed) {
            self._fling({
                startPos: assign({}, self.startPos),
                currentPos: assign({}, self.currentPos),
                speed,
            });
            self.speedRecord[0] = self.speedRecord[1] = 0;
        } else if (Math.abs(self.currentPos.x - self.startPos.x) > 0) {
            self._slide({
                startPos: assign({}, self.startPos),
                currentPos: assign({}, self.currentPos),
            });
        }

        // clearSpeed
        self.speedRecord[0] = self.speedRecord[1] = 0;
    }

    recordSpeed(offset) {
        const self = this;
        const now = Date.now();
        const duration = now - self.lastRecordTime;
        const speed = offset / duration;
        // 记录数据
        self.speedRecord[(self.speedRecordIdx++) & 1] = speed; // 让speedRecordIdx保存为0或者1的情况
        self.lastRecordTime = now;
    }

    _setStartPosition(x, y) {
        this.startPos.x = x;
        this.startPos.y = y;
    }

    /**
     * 
     */
    _setCurrentPosition(x, y) {
        this.currentPos.x = x;
        this.currentPos.y = y;
    }

    onTouchDown(cb) {
        this._down = cb;
    }

    onTouchUp(cb) {
        this._up = cb;
    }

    onTouchMove(cb) {
        this._move = cb;
    }

    onTouchSlide(cb) {
        this._slide = cb;
    }

    onTouchFling(cb) {
        this._fling = cb;
    }
}