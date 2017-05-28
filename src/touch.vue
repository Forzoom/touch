<template>
    
    <div class="ro-touch"
        style="width: 100%;height: 100%;"
        @touchstart="hub.start($event)"
        @touchmove.prevent="hub.move($event)"
        @touchend="hub.end($event)"
    >
        <slot></slot>
    </div>
</template>

<script>
    import {
        TouchHub,
    } from './touch-hub.js';
    /**
     * 事件
     * touch-down(startPos, currentPos)
     * touch-move(x, y)
     * touch-slide(startPos, currentPost)
     * touch-fling
     * touch-up(startPos, currentPos)
     */
    export default {
        name: 'ROTouch',
        data: function () {
            return {
                hub: new TouchHub(),
            };
        },
        created() {
            const vm = this;
            vm.hub.onTouchDown((res) => vm.$emit('touch-down', res));
            vm.hub.onTouchUp((res) => vm.$emit('touch-up', res));
            vm.hub.onTouchMove((res) => vm.$emit('touch-move', res));
            vm.hub.onTouchSlide((res) => vm.$emit('touch-slide', res));
            vm.hub.onTouchFling((res) => vm.$emit('touch-fling', res));
        },
        mounted: function() {
            if (!('ontouchstart' in window)) { // 判断是否支持touchHelper
                throw new Error('touch event is not supported!');
            }
        },
    };
</script>