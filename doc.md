---
layout: post
title:  Chartx Documentation 
---

## Chartx的使用

请确认在引入Chart js库文件的时候页面已经有AMD(requires),CMD(seajs),KISSY等任一模块加载环境。


### 引入Chartx库文件

请在html页面中引入Chartx的js库文件

daily环境为 <code>http://g-assets.daily.taobao.net/thx/charts/chartx/index[-min].js</code>

cdn环境为   <code>http://g.tbcdn.cn/thx/charts/{{"版本号"}}/chartx/index[-min].js</code>

当前最新CDN版本号为1.8.0。

当然，上面是alicdn上提供的地址， 你也可以下载源代码存放在自己的目录中。


### 创建图表

在全局图表对象Chartx下面挂载着全部的图表类型
目前有['bar' , 'force' , 'line' , 'map' , 'pie' , 'planet' , 'progress' , 'radar' , 'scat' , 'topo']
该类型方法需要三个参数。

- el      --> DOM树中对应的节点，可以是id 也可以是kissy.all("#id")或者jquery("#id")对象 
- data    --> 绘制图表的数据，无数据则传入空数组[]                                      
- options --> 绘制图表的配置                                                         



创建一个line chart

```js
Chartx.line(#el , data , options)
```


如果需要拿到chart的图表实例，来绑定事件之类的，则需要在其promise中操作

```js
Chartx.line(#el , data , options).then(function( chart ){
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
view.createChart( chartType , #el , data , options )
```

TODO：view.createChart 第一个参数为要创建的图表类型，后面三个参数则和上面的图表创建方式一一对应

如果需要拿到chart的图表实例，来绑定事件之类的，则需要在其promise中操作

```js
view.createChart( chartType , #el , data , options).then(function( chart ){
    chart.on("eventType" , function(e){
        do something ......
    });
});

```

TODO：同上，promise then 回调函数的执行在 chart的 绘制之前。。。


DEMO：

```js
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

## Chartx的数据格式

在Chartx中，所有的图表都采用如下同一种数据格式，这样的数据格式并不具有任何图表相关的意义，和后台约定数据格式的时候能做到完全的解耦，不需要特定的为某图表来设计json格式。

然后每个图表都会有自己的dataFormat函数来将其转换为自己需要的数据。


第一行是表头。

```js
var data= [
    ["xfield","uv" ,"pv","click"],
    [ 1      , 101 , 20 , 33    ],
    [ 2      , 67  , 51 , 26    ],
    [ 3      , 76  , 45 , 43    ]
];
```

比如用上面的数据来创建折线图。

```js
//chart的配置信息，所有的图表都可以极简到只需要配置xAxis，yAxis的字段
var options = {
    yAxis : {
        field : ["uv" , "pv"]
    },
    xAxis : {
        field : "xfield"
    }
};
//Chartx.line开始初始化chart实例
Chartx.line( #el , data , options);
```

在options中 把表头的字段配置入对应的xAxis yAxis 的field。然后折线图内部的dataFormat处理函数会转换出一个图表自己所需要的数据格式chart.dataFrame

```js
chart.dataFrame  = {    //数据集合对象
    org        : [],   //最原始的数据 , 也就是传入的data 
    data       : [],   //最原始的数据转化后的数据格式：[o,o,o] o={field:'val1',index:0,data:[1,2,3]}
    yAxis      : {     //y轴
        field  : [],   //字段集合 对应this.data
        org    : []    //二维 原始数据[[100,200],[1000,2000]]
    },
    xAxis      : {     //x轴
        field  : [],   //字段 对应this.data
        org    : []    //原始数据['星期一','星期二']
    }
}
```

## Chartx的配置

在Chartx的世界里，我们的图表的适配到各种不一样的风格和交互行为都从配置中得到体现。

我们所有的chart实例上不再拥有专门用来存放配置的config或者options对象，我们通过深度merge来把配置直接挂载在chart实例上。

而图表中<code>_</code>开头的变量，都是属于内部变量，大部分由内部计算的来，不建议在options参数中配置。

__接下来在下面的文档中，我们会详细讲述每一类型的图表配置和组件配置。__

---

## 图表

### 折线图

折线图line，柱状图bar，散点图scat这三个图表的分布都包含xAxis，yAxis，graphs三个区域，如图： 

<img src="./assets/chart/line/line.png" style="width:300px;"></img>

其中xAxis为xAxis组件部分，yAxis为yAxis组件部分，而graphs，则为line本身的绘图区域，这个三个区域的划分还充分表现再配置上options，再graphs区域的底部，你看到的横向竖向的背景线，其实还有一个back背景组件。

_调用代码_ ，<a href="./demo/line/index.html" target="_blank">demo</a> 

 
```js
Chartx.line(#el , data , options);
```

#### 折线图数据

```js
var data= [
    ["xfield","uv" ,"pv","click"],
    [ 1      , 101 , 20 , 33    ],
    [ 2      , 67  , 51 , 26    ],
    [ 8      , 99  , 83 , 51    ]
];
```

#### 折线图配置

```js
var options = {
    xAxis : {}, //x轴组件配置
    yAxis : {}, //y轴组件配置
    back  : {}, //背景组件配置
    anchor: {}, //瞄准器组件配置，可选，不需要瞄准器可以不做配置
    tips  : {}, //tips组件配置
    graphs: {}  //折线图绘图配置
}
```
 - options
   + [xAxis](#xaxis)
   + [yAxis](#yaxis)
   + [back](#back)
   + [anchor](#anchor)
   + [tips](#tips)
   + graphs
     - line --> 折线的配置
       <table>
           <tr><td>enabled</td><td>是否显示</td></tr>
           <tr><td>lineWidth</td><td>线条大小，默认为2</td></tr>
           <tr><td>strokeStyle</td><td>可以是一个颜色值，也可以是一个颜色值的数组，也可以是一个自定义函数，[<a href="#color">颜色值的规则</a>]</td></tr>
           <tr><td>smooth</td><td>是否显示平滑曲线效果的折线 默认未true</td></tr>
       </table>
     - node --> 线上的圆点配置
       <table>
       <tr><td>enabled</td><td>是否显示</td></tr>
       <tr><td>corner</td><td>是否再拐角的时候才出现圆点</td></tr>
       <tr><td>r</td><td>圆点的半径，默认未2</td></tr>
       <tr><td>fillStyle</td><td>默认为白色#ffffff，和line.strokeStyle一样，也可以是值，数组，和自定义函数[<a href="#color">颜色值的规则</a>]</td></tr>
       <tr><td>strokeStyle</td><td>默认和line.strokeStyle一致，和同样遵循[<a href="#color">颜色值的规则</a>]</td></tr>
       <tr><td>lineWidth</td><td>圆点border大小，默认未2</td></tr>
       </table>
     - fill --> 填满折线到x轴之间的填充样式配置
       <table>
       <tr><td>enabled</td><td>是否显示填充色，默认为true</td></tr>
       <tr><td>fillStyle</td><td>默认和line.strokeStyle一致，遵循[<a href="#color">颜色值的规则</a>]。</td></tr>
       <tr><td>alpha</td><td>填充色的透明度，如果不需要填充色的折线图可以把该配置设置未0</td></tr>
       </table>


<span style="margin-top:50px;" id="color">颜色值的配置规则</span>
<table>
    <tr><td>类型</td><td>描述</td></tr>
    <tr><td>字符串</td><td>返回该值本身</td></tr>
    <tr><td>数组</td><td>会从该数组中根据自身的索引获取对应的数据</td></tr>
    <tr><td>自定义函数</td><td>获取该函数的返回值，该函数的参数为一个{iGroup: , iNode: }对象，其中iGroup变是第几条线的索引，iNode则是x方向第几个节点的索引，适用于配置线上面的圆点。</td></tr>
</table>


#### 折线图事件

请再then promise 中给chart实例添加事件侦听。

```js
Chartx.line(#el , data , options).then(function( chart ){
    chart.on("" , function(){
        ... 
    });
});
```

##### PC事件  <a target="_blank" href="./demo/line/index_event.html">demo</a>

* click  --> 点击事件
* mouseover --> 进入graphs区域触发
* mousemove --> 再graphs区域移动时触发
* mouseout  --> 离开graphs区域触发

##### Mobile事件 <a target="_blank" href="./demo/line/index_touch.html">demo</a>

* tap --> 手势点击graphs区域触发
* panstart --> 手势点击graphs区域，然后开始移动时触发
* panmove --> 手势在graphs区域移动中触发
* panend --> 手势的移动结束时触发


### 柱状图



## 组件

### xAxis

 + enabled --> 是否显示xAxis组件
 - line --> 刻度线
   + enabled --> 是否显示刻度线
   + width -->   刻度线的width，默认为1
   + height -->  刻度线的height，默认为4
   + strokeStyle --> 刻度线的strokeStyle线条颜色
 - text --> 标识文本
   + fillStyle --> 文本的颜色，默认为"#999"
   + fontSize --> 字体大小，默认12px
   + rotation --> 文本以右上角做坐标原点的旋转角度，默认为0代表不旋转
   + format --> <span id='xaxisformat'>{function}一个用来把原始元数据转换到最终展示的文本的转换函数，比如，代表一个星期的数据，元数据是1,2,3,4,5,6,7,8，但是xAxis轴上面需要显示为"星期一"，"星期二"，"星期三"，"星期四"，"星期五"，"星期六"，"星期天"。这个format函数的参数便是每一个元数据，比如是判断参数为1，就return “星期一”。</span>
   + textAlign --> 文本的横向对齐方式，默认为center，可选left，right
 - filter --> 过滤器，该过滤器和text.format不同，filter是依次来处理每个单元的line 和text，可以非常方便的来自定义ui层面的结构，比如，还是周一到周五，如果我只需要显示周一周三周五周天，那么我们可以这样。

 ```js
 xAxis : {
     filter : function( param ){
         //filter的参数params为一个obj
         //{
         //    layoutData  : arr, 轴上所有显示中的节点列表[ { content :  , x :  } ... ]
         //    index       : a,   layoutdata 中的每个节点对应的索引
         //    txt         : txt, 节点上的txt
         //    line        : line || null 节点上的刻度线
         //}
         if( (param.index+1) % 2 == 0 ){
             //2,4,6 visible = false
             param.txt.context.visible = flase;
         }
     }    
 }
 ```


### yAxis

 + enabled --> 是否显示yAxis轴组件
 - line    --> yAxis轴刻度线
   + enabled --> 是否显示刻度线
   + width -->  刻度线的width，默认为6
   + lineWidth  -->  刻度线的粗细，默认为3
   + strokeStyle --> 刻度线的颜色，默认为'#BEBEBE'
 - text --> yAxis轴的文本
   + fillStyle --> 文本颜色，默认“#999”
   + fontSize --> 文本大小，默认12px
   + textAlign --> 文本横向对齐方式，默认right，可选left，center
   + format    --> 和[xAxis.text.format](#xaxisformat)一样
 + filter --> 和xAxis.filter同样的功能，唯一不同的是，params.layoutData的内容，需要注意的是layoutData每个节点中的y坐标值，是 [0 , -10 , -20 .. ]

 ```js
  yAxis : {
     filter : function( param ){
         //filter的参数params为一个obj
         //{
         //    layoutData  : arr, 轴上所有显示中的节点列表[ { content :  , y :  } ... ]
         //    index       : a,   layoutdata 中的每个节点对应的索引
         //    txt         : txt, 节点上的txt
         //    line        : line || null 节点上的刻度线
         //}
     }    
 }
 ```

### back

 - enabled --> 是否显示背景
 - xOrigin --> 原点开始的x轴线
   + enabled --> 是否显示
   + lineWidth --> 线的lineWidth
   + strokeStyle --> 线颜色
 - yOrigin --> 原点开始的x轴线
   + enabled --> 是否显示
   + lineWidth --> 线的lineWidth
   + strokeStyle --> 线颜色
 - xAxis  --> x轴方向上的线
   + enabled --> 是否显示
   + lineType --> 默认为实线，可选（dashed 虚线）
   + lineWidth --> 线大小
   + strokeStyle --> 线颜色，默认“#f5f5f5”
   + filter --> 过滤函数，用来定制每条线条的样式。

```js
back : {
    xAxis : {
        filter : function( param ){
            //param为一个包含了yAxis组件layoutData 以及该条件再layoutData中的索引，和着条line的canvax实例
            //{
            //   layoutData : self.yAxis.layoutData,
            //   index      : a,
            //   line       : line
            //}
            // 比如，我们要把第一条线隐藏，第二条线设置为红色
            if( param.index == 0 ){
                param.line.context.visible = false;    
            }
            if( param.index == 1 ){
                param.line.context.strokeStyle = "red";    
            }
        }    
    }    
}
```

 - yAxis  --> y轴方向上的线
   + enabled --> 是否显示
   + lineType --> 默认为实线，可选（dashed 虚线）
   + lineWidth --> 线大小
   + strokeStyle --> 线颜色，默认“#f5f5f5”
   + filter --> 过滤函数，和上面的back.xAxis.filter功能一致，用来定制每条线条的样式。

```js
back : {
    yAxis : {
        filter : function( param ){
            //param为一个包含了xAxis组件layoutData 以及该条件再layoutData中的索引，和着条line的canvax实例
            //{
            //   layoutData : self.xAxis.layoutData,
            //   index      : a,
            //   line       : line
            //}
            // 比如，我们要把第一条线隐藏，第二条线设置为红色
            if( param.index == 0 ){
                param.line.context.visible = false;    
            }
            if( param.index == 1 ){
                param.line.context.strokeStyle = "red";    
            }
        }    
    }    
}
```

### anchor

### tips



