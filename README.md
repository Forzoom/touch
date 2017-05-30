1. 支持两个坐标轴
2. 支持在必要时停止对于touch的检测，通过变量设置

touch-hub，进行具体的计算. 1. prevent由touch-hub控制
touch是vue的封装

### 组件

#### Touch

Touch是vue组件

##### 事件

|名称|说明|参数|
|---|---|---|
|touch-down|点击按下|\{startPos, currentPos\}|
|touch-up|点击抬起|\{startPos, currentPos\}|
|touch-move|每次滑动|\{x, y\}|
|touch-slide|总体滑动|\{startPos, currentPos\}|
|touch-fling|总体快速滑动|\{startPos, currentPos, speed\}|