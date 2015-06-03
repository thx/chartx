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
Chartx.create.line(el , data , options);
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



|        | Are           | Cool  |
| ------------- | ------------- | -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

#### 事件

## 组件

### xAxis

### yAxis

### back

### anchor

### tips



