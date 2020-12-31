### Changelog

#### 0.0.6

1. touch-hub添加work函数
2. speed支持对于x,y两个轴
3. 添加flow对于touch-hub进行简单的类型检查

#### 0.0.7

1. 使用mousedown/mousemove/mouseup三个事件实现当不支持touch事件时候的fallback

#### 0.0.8

1. 添加对于y轴的支持，允许在touch组件中使用prop: coordinate进行切换，主要处理slide和fling相关的逻辑

#### 0.0.9

1. 修复Object.assign的错误

#### 0.0.10

1. 完善preventDefault的控制逻辑

#### 0.0.11

1. move事件中添加startMoveCoordinate和moveCoordinate数据

### BreakChange

#### 0.0.6

1. onTouchFling参数由(startPos, currentPos, speed)改为(startPos, currentPos, speedX, speedY)

#### 0.0.7

1. touch-hub 由 export default class TouchHub 改为 export const supportTouchEvent 和 export class TouchHub

#### 0.0.8

1. 添加y轴支持

#### 0.1.0

1. 从webpack修改为rollup打包
1. 使用typescript进行重写