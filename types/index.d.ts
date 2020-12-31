import Vue, { ComponentOptions } from 'vue';
import { CombinedVueInstance } from 'vue/types/vue';

// TouchComponent是一个组件
export type TouchDetectorComponent = CombinedVueInstance<Vue, {}, {}, {}, {}>;
export type TouchDetectorComponentOption = ComponentOptions<Vue, {}, {}, {}, {}>;

export interface TouchHubOptions {
    flingThresh?: number;
}

export type Axis = 'x' | 'y';

export interface TouchMoveArg1 {
    x: number;
    y: number;
    moveCoordinate: Axis;
    startMoveCoordinate: Axis;
}

export const TouchDetector: TouchDetectorComponentOption;
