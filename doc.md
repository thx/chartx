---
layout: post
title:  Chartx Documentation 
---

## 简介

## 名词解释

<code>[xAxis](#xaxis)</code>


## 折线图

折线图line，柱状图bar，散点图scat这三个图表的分布都包含xAxis，yAxis，graphs三个区域，如图 --> 

<img src="./assets/chart/line/line.png" style="width:300px;"></img>

其中xAxis为xAxis组件部分，yAxis为yAxis组件部分，而graphs，则为line本身的绘图区域，这个三个区域的划分还充分表现再配置上options，再graphs区域的底部，你看到的横向竖向的背景线，其实还有一个back背景组件。

_调用代码 --> _


```js
Chartx.line(el , data , options);
```

### 折线图数据

```js
var data= [
    ["xfield","uv" ,"pv","click"],
    [ 1      , 101 , 20 , 33    ],
    [ 2      , 67  , 51 , 26    ],
    [ 8      , 99  , 83 , 51    ]
];
```

### 折线图配置

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


### 折线图事件

请再then promise 中给chart实例添加事件侦听。

```js
Chartx.line(el , data , options).then(function( chart ){
    chart.on("" , function(){
        ... 
    });
});
```

#### PC事件  <a target="_blank" href="./demo/line/index_event.html">demo</a>

* click  --> 点击事件
* mouseover --> 进入graphs区域触发
* mousemove --> 再graphs区域移动时触发
* mouseout  --> 离开graphs区域触发

#### Mobile事件 <a target="_blank" href="./demo/line/index_touch.html">demo</a>

* tap --> 手势点击graphs区域触发
* panstart --> 手势点击graphs区域，然后开始移动时触发
* panmove --> 手势在graphs区域移动中触发
* panend --> 手势的移动结束时触发


## 柱状图



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
 + filter --> 和xAxis.filter同样的功能，唯一不同的是，params.layoutData的内容
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

### anchor

### tips



