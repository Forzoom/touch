import Vue, { ComponentOptions } from 'vue';
import { CombinedVueInstance } from 'vue/types/vue';

// TouchComponent是一个组件
export type TouchDetectorComponent = CombinedVueInstance<Vue, {}, {}, {}, {}>;
export type TouchDetectorComponentOption = ComponentOptions<Vue, {}, {}, {}, {}>;

export interface TouchHubOptions {
    flingThresh?: number;
}

export type Axis = 'x' | 'y';

export interface Pos {
    x: number;
    y: number;
}

export interface TouchMoveArg1 {
    x: number;
    y: number;
    moveCoordinate: Axis;
    startMoveCoordinate: Axis;
}

export const TouchDetector: TouchDetectorComponentOption;

/**
 * 计算
 */
export class TouchHub {
    constructor(options?: Partial<TouchHubOptions>);
    onTouchDown(cb: Function): void;
    onTouchUp(cb: Function): void;
    onTouchMove(cb: Function): void;
    onTouchSlide(cb: Function): void;
    onTouchFling(cb: Function): void;
    start(pos: Pos): void;
    move(pos: Pos): void;
    end(pos: Pos): void;
}
