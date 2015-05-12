## xChart使用方式

### 1，在页面引入xChart的库文件

daily环境为 <script>http://g-assets.daily.taobao.net/thx/charts/chartx/index.js</scirpt>

cdn环境为   <script>http://g.tbcdn.cn/thx/charts/{{版本号}}/chartx/index.js</scirpt>

当前最新CDN版本号为1.6.8

### 2，创建图表

在全局图表对象Chartx下面有一个create对象，上面挂载着全部的图表类型
目前有['bar' , 'force' , 'line' , 'map' , 'pie' , 'planet' , 'progress' , 'radar' , 'scat' , 'tree']
该类型方法需要三个参数，

| 参数位置  | 说明 |
| --------- | ---- |
| 1 |el   --> DOM树中对应的节点，可以是id 也可以是kissy.all("#id")或者jquery("#id")对象|
| 2 |data --> 绘制图表的数据，无数据则传入空数组[]|
| 3 |options --> 绘制图表的配置|



##### 创建一个line chart
```javascript
Chartx.create.line(el , data , options)
```


##### 如果需要拿到chart的图表实例，来绑定事件之类的，则需要在其promise中操作

```javascript
Chartx.create.line(el , data , options).then(function( chart ){
    chart.on("eventType" , function(e){
        do something ......
    });
});

```

TODO：promise then 回调函数的执行在 chart的 绘制之前。。。



### 3，在magix环境的项目中使用chartx

在magix的OPOA项目环境中，我们提供magix扩展来在业务中方便的使用chartx。

首先，请在项目的ini.js文件，找到`exts`配置，加入`chartx/magixext`。

这个时候我们可以在view中很方便的使用`createChart`方法来创建图表了。

```javascript
view.createChart( chartType , el , data , options ).then(function(chart){
    chart.draw()
});
```

view.createChart 唯一的不一样就是第一个参数为要创建的图表类型，后面三个参数则和上面的图表创建方式一一对应

如果需要拿到chart的图表实例，来绑定事件之类的，则需要在其promise中操作

```javascript
view.createChart( chartType , el , data , options).then(function( chart ){
    chart.on("eventType" , function(e){
        do something ......
    });
});

```

TODO：同上，promise then 回调函数的执行在 chart的 绘制之前。。。


DEMO：
```javascript
return View.extend({
    init: function(data) {
    },
    render: function(e) {
        var me = this
        me.renderByPagelet({});
        me._createWorldMap();
    },
    _createWorldMap : function(){
        var me = this;
        me.createChart("map" , $("#worldmap") , [] , {
            mapType : "world"
        });
    }
});

```
