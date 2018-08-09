Chartx全局属性\方法
=================

假设你已经通过npm或者cdn把Chartx引入到了你的项目，然后拿到了Chartx模块，那么你可以使用下面这些挂载在这个全局对象上面的一些属性和方法。

## 全局属性

`.instances`

当前项目所有绘制的图标实例


## 全局方法

`.create( el, data, options )`

绘制图表方法。

参数：
- `el` {string/domElement} 页面准备的dom容器id或者这个dom对象(jquery对象)
- `data` {array}

  示例：
  ```javascript
  var data = [
    { "time": "2017-03-21", "pv": 10, "uv": 12, "click": 112, "ppc": 45 },
    { "time": "2017-03-22", "pv": 20, "uv": 32, "click": 122, "ppc": 35 }
  ];
  ```
- `options` {object} 图表配置，详见[快速上手](./start.html) 第四点。


返回值：

Chartx instance 图表实例，这个图表实例有个id，可以在 .getChart 的时候作为参数使用

---

`.setGlobalTheme( colors )`

设置全局项目皮肤

参数：

- colors {array} 一组皮肤颜色值数组


---

`.getGlobalTheme()`

获取全局项目皮肤颜色值列表

返回值：

- colors {array} 一组皮肤颜色值数组


---

`.getChart( chartId )`

从全局`instances`中获取到图表实例

参数：

- chartId，图表实例的id

返回值：

- 图表实例
