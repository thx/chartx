---
layout: post
title:  Chartx Documentation 
---

## 简介

## 名词解释

<code>[xAxis](#xaxis)</code>

## 图表类型

### 折线图

```js
Chartx.line(el , data , options);
```

#### 数据

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

#### 配置

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
       * enabled   是否显示
       * lineWidth    线条大小
       * strokeStyle    [线条颜色，可以是一个颜色值，也可以是一个颜色值的数组，也可以是一个自定义函数](#color)
       * smooth    是否显示平滑曲线效果的折线 默认未true
     - node 线上的圆点配置
       * enabled    是否显示
       * corner    是否再拐角的时候才出现圆点 
       * r    圆点的半径，默认未2
       * fillStyle    默认为白色#ffffff，和line.strokeStyle一样，也可以是值，数组，和自定义函数[颜色值的规则](#color)
       * strokeStyle    默认和line.strokeStyle一致，和同样遵循[颜色值的规则](#color)
       * lineWidth    圆点border大小，默认未2
     - fill 填满折线到x轴之间的填充样式配置
       * enabled    是否显示填充色，默认为true
       * fillStyle    默认和line.strokeStyle一致，遵循[颜色值的规则](#color)。
       * alpha    填充色的透明度，如果不需要填充色的折线图可以把该配置设置未0


<span style="margin-top:50px;" id="color">颜色值的规则</span>
<table>
    <tr><td>类型</td><td>描述</td></tr>
    <tr><td>字符串</td><td>返回该值本身</td></tr>
    <tr><td>数组</td><td>会从该数组中根据自身的索引获取对应的数据</td></tr>
    <tr><td>自定义函数</td><td>获取该函数的返回值，该函数的参数为一个{iGroup: , iNode: }对象，其中iGroup变是第几条线的索引，iNode则是x方向第几个节点的索引，适用于配置线上面的圆点。</td></tr>
</table>




#### 事件

## 组件

### xAxis

### yAxis

### back

### anchor

### tips



