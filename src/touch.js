import {
    supportTouchEvent,
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
    props: {
        coordinate: {
            type: String,
            default: 'x',
        },
    },
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
    mounted() {
        this.hub.coordinate = this.coordinate;
    },
    render(h) {
        const vm = this;
        const v = {
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
};