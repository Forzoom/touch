import Vue from 'vue';
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
        touchstart(e) {
            this.hub.start.call(this.hub, e);
        },
        touchmove(e) {
            this.hub.move.call(this.hub, e);
        },
        touchend(e) {
            this.hub.end.call(this.hub, e);
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
            v.on.touchstart = vm.hub.start.bind(vm.hub);
            v.on.touchmove = vm.hub.move.bind(vm.hub);
            v.on.touchend = vm.hub.end.bind(vm.hub);
        } else {
            v.on.mousedown = vm.hub.start.bind(vm.hub);
            v.on.mousemove = vm.hub.move.bind(vm.hub);
            v.on.mouseup = vm.hub.end.bind(vm.hub);
        }
        return h('div', v, this.$slots.default);
    },
    // template: `<div class="ro-touch" style="width:100%;height:100%" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"><slot></slot></div>`,
};
