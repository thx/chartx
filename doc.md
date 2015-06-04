---
layout: post
title:  Chartx Documentation 
---

## 简介

## 名词解释

<code>[xAxis](#xaxis)</code>


## 折线图


```js
Chartx.line(el , data , options);
```

### 折线图数据

```js
var data= [
    ["xfield","uv" ,"pv","click"],
    [ 1      , 101 , 20 , 33    ],
    [ 2      , 67  , 51 , 26    ],
    [ 3      , 76  , 45 , 43    ],
    [ 4      , 58  , 35 , 31    ],
    [ 5      , 79  , 73 , 71    ],
    [ 6      , 88  , 54 , 39    ],
    [ 7      , 56  , 68 , 65    ],
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
     - line  折线的配置
       <table>
           <tr><td>enabled</td><td>是否显示</td></tr>
           <tr><td>lineWidth</td><td>线条大小，默认为2</td></tr>
           <tr><td>strokeStyle</td><td>可以是一个颜色值，也可以是一个颜色值的数组，也可以是一个自定义函数，[<a href="#color">颜色值的规则</a>]</td></tr>
           <tr><td>smooth</td><td>是否显示平滑曲线效果的折线 默认未true</td></tr>
       </table>
     - node 线上的圆点配置
       <table>
       <tr><td>enabled</td><td>是否显示</td></tr>
       <tr><td>corner</td><td>是否再拐角的时候才出现圆点</td></tr>
       <tr><td>r</td><td>圆点的半径，默认未2</td></tr>
       <tr><td>fillStyle</td><td>默认为白色#ffffff，和line.strokeStyle一样，也可以是值，数组，和自定义函数[<a href="#color">颜色值的规则</a>]</td></tr>
       <tr><td>strokeStyle</td><td>默认和line.strokeStyle一致，和同样遵循[<a href="#color">颜色值的规则</a>]</td></tr>
       <tr><td>lineWidth</td><td>圆点border大小，默认未2</td></tr>
       </table>
     - fill 填满折线到x轴之间的填充样式配置
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

### yAxis

### back

### anchor

### tips



