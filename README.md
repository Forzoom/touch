### 示例

```
import Touch from '@forzoom/touch';
Vue.component('Touch', Touch);
```

### 功能模块

#### TouchHub

负责处理touch事件，并且判断当前应该触发何种事件

##### API

###### onTouchDown(cb)

- 功能: 注册`touch-down`事件回调
- 参数:
	- {Function} cb

###### onTouchUp(cb)

- 功能: 注册`touch-up`事件回调
- 参数:
	- {Function} cb

###### onTouchMove(cb)

- 功能: 注册`touch-move`事件回调
- 参数:
	- {Function} cb

###### onTouchSlide(cb)

- 功能: 注册`touch-slide`事件回调
- 参数:
	- {Function} cb

###### onTouchFling(cb)

- 功能: 注册`touch-fling`事件回调
- 参数:
	- {Function} cb

###### work(active)

- since: 0.0.6
- 功能: 启动或停止TouchHub
- 参数:
	- {Boolean} active

### 组件

#### Touch

Touch是vue组件

##### Props

|名称|说明|值|默认|版本|
|---|---|---|---|---|
|coordinate|主要检测轴向|'x'/'y'|'x'|since 0.0.8|

##### 事件

|名称|说明|参数|
|---|---|---|
|touch-down|点击按下|\{startPos, currentPos\}|
|touch-up|点击抬起|\{startPos, currentPos\}|
|touch-move|每次滑动|\{x, y\}|
|touch-slide|总体滑动|\{startPos, currentPos\}|
|touch-fling|总体快速滑动|\{startPos, currentPos, speed\}|

### Roadmap

1. 尝试Karma