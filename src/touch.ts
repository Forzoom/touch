import Vue from 'vue';
import { Pos } from '../types';
import {
    supportTouchEvent,
    TouchHub,
} from './touch-hub';

/**
 * 事件
 * touch-down(startPos, currentPos)
 * touch-move(x, y)
 * touch-slide(startPos, currentPost)
 * touch-fling
 * touch-up(startPos, currentPos)
 */
export const TouchDetector = {
    name: 'TouchDetector',
    props: {
        /**
         * 当前正在处理的coordinate
         */
        coordinate: {
            type: String,
            default: 'x',
        },
        /**
         * 是否active
         */
        active: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            hub: new TouchHub(),
        };
    },
    watch: {
        /**
         * 检查active
         */
        active(val) {
            this.hub.active = val;
        },
    },
    methods: {
        touchstart(e: TouchEvent | MouseEvent) {
            const pos: Pos = { x: 0, y: 0 };
            if (supportTouchEvent) {
                pos.x = (e as TouchEvent).changedTouches[0].clientX;
                pos.y = (e as TouchEvent).changedTouches[0].clientY;
            } else {
                pos.x = (e as MouseEvent).clientX;
                pos.y = (e as MouseEvent).clientY;
                // self.mouseStatus = 1;
            }
            (this.hub as TouchHub).start(pos);
        },
        touchmove(e: TouchEvent | MouseEvent) {
            const pos: Pos = { x: 0, y: 0 };
            if (supportTouchEvent) {
                pos.x = (e as TouchEvent).touches[0].clientX;
                pos.y = (e as TouchEvent).touches[0].clientY;
            } else {
                pos.x = (e as MouseEvent).clientX;
                pos.y = (e as MouseEvent).clientY;
                // self.mouseStatus = 1;
            }
            (this.hub as TouchHub).move(pos);
        },
        touchend(e: TouchEvent | MouseEvent) {
            const pos: Pos = { x: 0, y: 0 };
            if (supportTouchEvent) {
                pos.x = (e as TouchEvent).changedTouches[0].clientX;
                pos.y = (e as TouchEvent).changedTouches[0].clientY;
            } else {
                pos.x = (e as MouseEvent).clientX;
                pos.y = (e as MouseEvent).clientY;
                // self.mouseStatus = 0;
            }
            (this.hub as TouchHub).end(pos);
        },
    },
    created() {
        const vm = this;
        vm.hub.onTouchDown((res) => vm.$emit('touch-down', res));
        vm.hub.onTouchUp((res) => vm.$emit('touch-up', res));
        vm.hub.onTouchMove((res) => vm.$emit('touch-move', res));
        vm.hub.onTouchSlide((res) => vm.$emit('touch-slide', res));
        vm.hub.onTouchFling((res) => vm.$emit('touch-fling', res));
    },
    mounted() {
        this.hub.coordinate = this.coordinate;
        this.hub.active = this.active;
    },
    render: function(h: typeof Vue.prototype.$createElement) {
        var vm = this;
        const el = document.createElement('div')
        // el.style
        var v: {
            'class': string[],
            style: {
                [name: string]: any,
            },
            on: {
                [name: string]: any,
            },
        } = {
            'class': ['ro-touch'],
            style: {
                width: '100%',
                height: '100%',
            },
            on: {},
        };
        if (supportTouchEvent) {
            v.on.touchstart = this.touchstart;
            v.on.touchmove = this.touchmove;
            v.on.touchend = vm.hub.end.bind(vm.hub);
        } else {
            v.on.mousedown = this.touchstart;
            v.on.mousemove = this.touchmove;
            v.on.mouseup = vm.hub.end.bind(vm.hub);
        }
        return h('div', v, this.$slots.default);
    },
};
