---
layout: post
title: Chartx
---


## Chartx 图表使用5分钟入门：

在DT时代里，数据可视化变得愈发的重要，在Chartx的世界里，创建一个图表是那样的简单，你只需要5分钟，不管是可视化熟手还是新人，你都可以早数据可视化这个领域里游刃有余，准备好了吗？我们一起出发吧...


### 环境准备

Chartx做了AMD(requirejs) , CMD(seajs) , KISSY 模块加载环境的自动适配，在使用Chartx图表之前请确保页面环境加载了前面任意一种模块加载器。

```html
<!DOCTYPE html>
<head>
    <meta charset="utf-8">
    <title>Chartx</title>
    <!-- 这里用requirejs来做模块加载器 -->
    <script src="http://requirejs.org/docs/release/2.1.20/minified/require.js"></script>
</head>
<body>
</body>
```


### 引入Chartx库文件

请在html页面中引入Chartx的js库文件，<a href="index.html?#chartx线上文件地址" target="_blank">文件详见</a>

```html
<!DOCTYPE html>
<head>
    <meta charset="utf-8">
    <title>Chartx</title>
    <!-- 准备requirejs来做模块加载器 -->
    <script src="http://requirejs.org/docs/release/2.1.20/minified/require.js"></script>
    <!-- Chartx图表库文件引入，这里已1.9.21的cdn版本为例 -->
    <script src="http://g.tbcdn.cn/thx/charts/1.9.51/chartx/index-min.js"></script>
</head>
<body>
</body>
```

### 为Chartx图表准备一个具备高宽的DOM容器

```html
<!DOCTYPE html>
<head>
    <meta charset="utf-8">
    <title>Chartx</title>
    <!-- 准备requirejs来做模块加载器 -->
    <script src="http://requirejs.org/docs/release/2.1.20/minified/require.js"></script>
    <!-- Chartx图表库文件引入，这里已1.9.21的cdn版本为例 -->
    <script src="http://g.tbcdn.cn/thx/charts/1.9.51/chartx/index-min.js"></script>
</head>
<body>
    <!-- 为Chartx准备一个具备大小（宽高）的Dom -->
    <div id="chartTest" style="width:600px;height:300px;"></div>
</body>
```

### 准备数据

在Chartx中，所有的图表都采用如下同一种数据格式，这样的数据格式并不具有任何图表相关的意义，对后台友好，和后台约定数据格式的时候能做到完全的解耦，不需要特定的为某图表来设计json格式。

第一行是表头。

```js
var data= [
    ["xfield","uv" ,"pv","click"],
    [ 1      , 101 , 20 , 33    ],
    [ 2      , 67  , 51 , 26    ],
    [ 3      , 76  , 45 , 43    ]
];
```


### 准备配置

在Chartx中的所有图表都有自己的默认配置，你可以很简单的只设定一些最基本的配置来创建一个图表。

我们已折线图为例：


```js
//chart的配置信息，可以极简到只需要配置xAxis，yAxis的字段
var options = {
    yAxis : {
        field : ["uv" , "pv"]
    },
    xAxis : {
        field : "xfield"
    }
};
```

其他配置信息具体详见[文档](doc.html)


### 绘制图表


最后一步，就是用准备好的目标容器DOM节点，数据，配置来绘制图表了。

#### 默认创建图表代码（推荐）

```js
Chartx.line("chartTest" , data , options);
```

#### [magix](http://thx.github.io/magix/)项目环境中创建图表方式（采用magix框架的项目推荐方式，非magix框架项目请忽略）


在magix的OPOA项目环境中，我们提供magix扩展来在业务中方便的使用chartx。

在项目的<code>ini.js</code>文件中找到<code>exts</code>配置，加入<code>chartx/magixext</code>。

加载了<code>chartx/magixext</code>后，magix会在view中扩展一个专门用来创建图表的接口函数<code>createChart</code>，现在你可以很方便的在每个view中创建图表了。在view中创建的图表在view自身销毁的时候也会自行销毁，不需要使用者手动去管理。

view.createChart 第一个参数<code>chartType</code>为要创建的图表类型，比如要创建折线图就传入"line"，后面三个参数则和上面的图表创建方式一一对应


```js
view.createChart( "line" , "chartTest" , data , options);

```




<div style="padding-top:50px;font-weight:bold;color:#333">我们在全局图表对象Chartx下面挂载着全部的图表类型。</div>

---

Chartx.bar(柱状图) ， Chartx.line（折线图） ， Chartx.map（地图） ， Chartx.pie（饼图） ， Chartx.progress（进度图） ， Chartx.radar（雷达图） ， Chartx.scat（散点图） ， Chartx.topo（拓扑图，树状图），Chartx.chord（和铉图），Chartx.hybrid（混搭图表），Chartx.venn（韦恩图），Chartx.force（力布局图），Chartx.original（自定义图表）

---


### 完整实例

图表效果：

<!-- 准备requirejs来做模块加载器 -->
<script src="http://requirejs.org/docs/release/2.1.20/minified/require.js"></script>
<!-- Chartx图表库文件引入，这里已1.9.21的cdn版本为例 -->
<script src="http://g.tbcdn.cn/thx/charts/1.9.51/chartx/index-min.js"></script>
<!-- 为Chartx准备一个具备大小（宽高）的Dom -->
<div class="highlight" style="padding:10px 0;background-color:#F8F8F8;border:1px solid #DDD;border-radius: 3px;">
    <div id="chartTest" style="width:600px;height:300px;"></div>
</div>
<style> 
    .chart-tips td,.chart-tips tr {
        border:none!important;    
        background:none!important;
        padding:0px;
    }
    .chart-tips table {
        margin:0;    
    }
</style>
<script>
    var data= [
        ["xfield","uv" ,"pv","click"],
        [ 1      , 3   , 20 , 33    ],
        [ 2      , 0   , 51 , 26    ],
        [ 3      , 32  , 45 , 43    ],
        [ 4      , 58  , 35 , 31    ],
        [ 5      , 79  , 73 , 71    ],
        [ 6      , 88  , 54 , 39    ],
        [ 7      , 55  , 68 , 65    ],
        [ 8      , 66  , 83 , 51    ]
    ];
    var options = {
        yAxis : {
            field : ["uv" , "pv"]
        },
        xAxis : {
            field : "xfield"
        }
    };
    Chartx.line("chartTest" , data , options);
</script>


完整代码：

```html
<!DOCTYPE html>
<head>
    <meta charset="utf-8">
    <title>Chartx</title>
    <!-- 准备requirejs来做模块加载器 -->
    <script src="http://requirejs.org/docs/release/2.1.20/minified/require.js"></script>
    <!-- Chartx图表库文件引入，这里已1.9.21的cdn版本为例 -->
    <script src="http://g.tbcdn.cn/thx/charts/1.9.51/chartx/index-min.js"></script>
</head>
<body>
    <!-- 为Chartx准备一个具备大小（宽高）的Dom -->
    <div id="chartTest" style="width:600px;height:300px;"></div>
    <script>
        var data= [
            ["xfield","uv" ,"pv","click"],
            [ 1      , 3   , 20 , 33    ],
            [ 2      , 0   , 51 , 26    ],
            [ 3      , 32  , 45 , 43    ],
            [ 4      , 58  , 35 , 31    ],
            [ 5      , 79  , 73 , 71    ],
            [ 6      , 88  , 54 , 39    ],
            [ 7      , 55  , 68 , 65    ],
            [ 8      , 66  , 83 , 51    ]
        ];
        var options = {
            yAxis : {
                field : ["uv" , "pv"]
            },
            xAxis : {
                field : "xfield"
            }
        };
        Chartx.line("chartTest" , data , options);
    </script>
</body>
```
