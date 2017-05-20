<template>
    
    <div class="ro-touch"
        @touchstart="onTouchStart" 
        @touchmove.prevent="onTouchMove" 
        @touchend="onTouchEnd" 
    >
        <slot></slot>
    </div>
</template>

<script>
    
    // 对于changedTouches
    // 对于touchEnd来说会出现touches为end
    // 对于touchStart来说，changedTouches失败了
    function getTouches (event) {
        return event.touches[0];
    }

    const Status = {
        no: 'no',
        down: 'down',
        move: 'move',
        up: 'up',
    };

    /**
     * 事件
     * touch-down
     * touch-move
     * touch-slide
     * touch-fling
     * touch-up
     */
    export default {
        name: 'ROTouch',
        data: function () {
            return {
                startX: null,
                endX: null,
                startY: null,
                endY: null,
                isScrolling: null,

                speedRecord: [
                    0,
                    0,
                ], // 速度记录
                speedRecordIdx: 0,

                minFlingSpeed: 0.2, // px/millsecond
                maxFlingSpeed: 1,

                // touch.move只返回offset
                // touch.up touch.move touch.down返回startPos/currentPos，因为使用extend，生成的是新的对象

                /* 主要依赖：CSSOM/gBCR */

                // 所有的状态
                startPos: {
                    x: 0,
                    y: 0,
                }, // touch开始的位置，对应的pageX,pageY
                currentPos: {
                    x: 0,
                    y: 0,
                }, // 每次touchMove的情况下，对应的pageX/pageY都是currentPos
                status: Status.no, // 当前的状态
                lastRecordTime: -1, // 上次数据记录时间
            };
        },
        methods: {
            // 所生成的start-pos和current-pos，来计算出当前的offset
            onTouchStart: function(event) {
                // 获得当前的位置数据
                const touch = event.changedTouches[0]; // todo: 这里为什么使用changedTouches
                const self = this;
                self.startPos.x = touch.clientX;
                self.startPos.y = touch.clientY;
                self.currentPos.x = touch.clientX;
                self.currentPos.y = touch.clientY;

                // 发生点击的开始
                // 分别创建两个不同
                self.status = Status.down;
                self.$emit('touch-down', {
                    startPos: Object.assign({}, self.startPos),
                    currentPos: Object.assign({}, self.currentPos),
                });
                // event.preventDefault();

                self.lastRecordTime = Date.now();
            },

            /*
             * @description 调用了event.preventDefault()的内容
             *
             *  存在这样的问题，在手机浏览器上，需要在 touchmove事件中调用preventDefault，来保证touchstart/touchmove/touchend事件能够正常进行
             */
            onTouchMove: function(event) {
                const touch = getTouches(event);
                const self = this;
                const pageX = touch.clientX;
                const pageY = touch.clientY;
                const offsetX = pageX - self.currentPos.x;
                const offsetY = pageY - self.currentPos.y;

                self.status = Status.move;
                self.$emit('touch-move', {
                    x: offsetX,
                    y: offsetY,
                });
                // 当发生了touchMove的情况下，需要一个touch.move事件，对于slide的情况下，需要整体的长度问题
                if (self.status === Status.move) {
                    self.currentPos.x = pageX;
                    self.currentPos.y = pageY;
                    self.$emit('touch-slide', {
                        startPos: Object.assign({}, self.startPos),
                        currentPos: Object.assign({}, self.currentPos),
                    });
                }

                const timeNow = Date.now();
                const duration = timeNow - self.lastRecordTime;

                self.recordSpeed(offsetY, duration);
                // preventDefault
                // event.preventDefault();
            },

            // 使用var的方式，可能会由变量提升的问题
            // 在这里使用var touchEndHandler = functino() {}会出现问题，因为函数体并没有被提升
            onTouchEnd: function(event) {
                const touch = event.changedTouches[0];
                const self = this;

                self.status = Status.up;

                // const pageX = touch.clientX;
                const pageY = touch.clientY;
                // const offsetX = pageX - self.currentPos.x;
                const offsetY = pageY - self.currentPos.y; // 为了触发touch.move
                self.currentPos.x = touch.clientX;
                self.currentPos.y = touch.clientY;

                const timeNow = Date.now();
                const duration = timeNow - self.lastRecordTime;

                self.recordSpeed(offsetY, duration);
                const speed = (self.speedRecord[0] + self.speedRecord[1]) / 2;

                if (Math.abs(speed) > self.minFlingSpeed) {
                    self.$emit('touch-fling', {
                        startPos: Object.assign({}, self.startPos),
                        currentPos: Object.assign({}, self.currentPos),
                        speed,
                    });
                    self.speedRecord[0] = self.speedRecord[1] = 0;
                } else {
                    self.$emit('touch-slide', {
                        startPos: Object.assign({}, self.startPos),
                        currentPos: Object.assign({}, self.currentPos),
                    });
                    self.$emit('touch-up', {
                        startPos: Object.assign({}, self.startPos),
                        currentPos: Object.assign({}, self.currentPos),
                    });
                }
            },
            /*
             * @description 记录速度，暂时没有用，因为fling没有使用
             */
            recordSpeed: function(offset, duration) {
                const self = this;
                const speed = offset / duration;
                self.speedRecord[self.speedRecordIdx++] = speed;
                self.speedRecordIdx &= 1; // 让speedRecordIdx保存为0或者1的情况
            },
        },
        mounted: function() {
            if (!('ontouchstart' in window)) { // 判断是否支持touchHelper
                throw new Error('touch event is not supported!');
            }
        },
    };
</script>

<style>
    .ro-touch {
        width: 100%;
        height: 100%;
    }
</style>