---
layout: post
title: Chartx
---

Chartx是一套数据可视化解决方案，其底层基于自有canvas渲染引擎Canvax（canvax的基于心跳包的主动渲染机制在图表这样并不需要高帧率的场景中有着非常良好的性能）。

能自动适配AMD,CMD,KISSY的模块加载环境。

能自动适配到ie6，7，8等低端浏览器（采用flashcanvas来实现兼容）。

能适配PC,Mobile终端。


## Chartx的使用

请确认在引入Chart js库文件的时候页面已经有AMD(requires),CMD(seajs),KISSY等任一模块加载环境。


### 在页面引入Chartx库文件

daily环境为 <code>http://g-assets.daily.taobao.net/thx/charts/chartx/index.js</code>

cdn环境为   <code>http://g.tbcdn.cn/thx/charts/{{"版本号"}}/chartx/index.js</code>

当前最新CDN版本号为1.6.1


### 创建图表

在全局图表对象Chartx下面有一个create对象，上面挂载着全部的图表类型
目前有['bar' , 'force' , 'line' , 'map' , 'pie' , 'planet' , 'progress' , 'radar' , 'scat' , 'tree']
该类型方法需要三个参数。

- el      --> DOM树中对应的节点，可以是id 也可以是kissy.all("#id")或者jquery("#id")对象 
- data    --> 绘制图表的数据，无数据则传入空数组[]                                      
- options --> 绘制图表的配置                                                         



创建一个line chart

``` js
Chartx.create.line(el , data , options)
```


如果需要拿到chart的图表实例，来绑定事件之类的，则需要在其promise中操作

``` js
Chartx.create.line(el , data , options).then(function( chart ){
    chart.on("eventType" , function(e){
        do something ......
    });
});

```

TODO：promise then 回调函数的执行在 chart的 绘制之前。。。



## 在magix环境中使用chartx
### 扩展插件


在magix的OPOA项目环境中，我们提供magix扩展来在业务中方便的使用chartx。

首先肯定是要先在页面中引入Chartx的js库文件，然后在项目的<code>ini.js</code>文件中找到<code>exts</code>配置，加入<code>chartx/magixext</code>。


### 创建图表


加载了<code>chartx/magixext</code>后，magix会在view中扩展一个专门用来创建图表的接口函数<code>createChart</code>，现在你可以很方便的在每个view中创建图表了。在view中创建的图表在view自身销毁的时候也会自行销毁，不需要使用者手动去管理。


```js
view.createChart( chartType , el , data , options )
```
