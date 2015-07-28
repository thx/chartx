---
layout: post
title:  Chartx Documentation 
---

## Chartx的使用

请确认在引入Chart js库文件的时候页面已经有AMD(requires)，CMD(seajs) ，KISSY等任一模块加载环境。


### 引入Chartx库文件

请在html页面中引入Chartx的js库文件

daily环境为 <code>http://g-assets.daily.taobao.net/thx/charts/chartx/index[-min].js</code>

cdn环境为   <code>http://g.tbcdn.cn/thx/charts/{{"版本号"}}/chartx/index[-min].js</code>

当前最新CDN版本号为<code>1.9.3</code>。

当然，上面是alicdn上提供的地址， 你也可以下载源代码存放在自己的目录中。

### 创建图表

在全局图表对象Chartx下面挂载着全部的图表类型

Chartx.bar(柱状图) , Chartx.force（力布局图） , Chartx.line（折线图） , Chartx.map（地图） , Chartx.pie（饼图） , Chartx.planet（行星图） , Chartx.progress（进度图） , Chartx.radar（雷达图） , Chartx.scat（散点图） , Chartx.topo（拓扑图，树状图

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

PS：promise then 回调函数的执行在 chart的 绘制之前。。。


## 在magix环境中使用chartx
### 扩展插件


在magix的OPOA项目环境中，我们提供magix扩展来在业务中方便的使用chartx。

首先肯定是要先在页面中引入Chartx的js库文件，然后在项目的<code>ini.js</code>文件中找到<code>exts</code>配置，加入<code>chartx/magixext</code>。


### 创建图表


加载了<code>chartx/magixext</code>后，magix会在view中扩展一个专门用来创建图表的接口函数<code>createChart</code>，现在你可以很方便的在每个view中创建图表了。在view中创建的图表在view自身销毁的时候也会自行销毁，不需要使用者手动去管理。

创建图表：

```js
view.createChart( chartType , #el , data , options )
```

view.createChart 第一个参数<code>chartType</code>为要创建的图表类型，比如要创建折线图就传入"line"，后面三个参数则和上面的图表创建方式一一对应

如果需要拿到chart的图表实例，来绑定事件之类的，则需要在其promise中操作

```js
view.createChart( chartType , #el , data , options).then(function( chart ){
    chart.on("eventType" , function(e){
        do something ......
    });
});

```

同上，promise then 回调函数的执行在 chart的 绘制之前。。。


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


## 图表

### 折线图(line)

<div id="linelayout">折线图line，柱状图bar，散点图scat这三个图表的分布都包含xAxis，yAxis，graphs三个区域，如图： </div>

<img src="./assets/chart/line/line.png" style="width:300px;"></img>

其中xAxis部分为[xAxis组件](#axis)，yAxis部分为[yAxis组件](#yaxis)，而graphs，则为折线图本身的绘图区域，再graphs区域的底部，你看到的横向竖向的背景线，其实还有一个[back背景组件](#back)。

创建折线图代码 ，<a href="./demo/line/index.html" target="_blank">demo</a> 

 
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
 options配置：

   + [xAxis](#xaxis)
   + [yAxis](#yaxis)
   + [back](#back)
   + [anchor](#anchor)
   + [tips](#tips)
   + graphs
     - line --> 折线的配置
       * enabled --> 是否显示
       * lineWidth --> 线条大小，默认为2
       * strokeStyle --> 可以是一个颜色值，也可以是一个颜色值的数组，也可以是一个自定义函数，[<a href="#color">颜色值的规则</a>]
       * smooth --> 是否显示平滑曲线效果的折线 默认未true
     - node --> 线上的圆点配置
       * enabled --> 是否显示
       * corner  --> 是否再拐角的时候才出现圆点
       * r --> 圆点的半径，默认未2
       * fillStyle --> 默认为白色#ffffff，和line.strokeStyle一样，也可以是值，数组，和自定义函数[<a href="#color">颜色值的规则</a>]
       * strokeStyle --> 默认和line.strokeStyle一致，和同样遵循[<a href="#color">颜色值的规则</a>]
       * lineWidth --> 圆点border大小，默认未2
     - fill --> 填满折线到x轴之间的填充样式配置
       * enabled --> 是否显示填充色，默认为true
       * fillStyle --> 默认和line.strokeStyle一致，遵循[<a href="#color">颜色值的规则</a>]
       * alpha --> 填充色的透明度，如果不需要填充色的折线图可以把该配置设置为0


<span style="margin-top:50px;" id="color">颜色值的配置规则</span>
<table style="margin-left:0;">
    <tr><td style="width:100px;">类型</td><td>描述</td></tr>
    <tr><td>字符串</td><td>返回该值本身</td></tr>
    <tr><td>数组</td><td>会从该数组中根据自身的索引获取对应的数据</td></tr>
    <tr><td>自定义函数</td><td>获取该函数的返回值，该函数的参数为一个{iGroup: , iNode: }对象，其中iGroup变是第几条线的索引，iNode则是x方向第几个节点的索引，适用于配置线上面的圆点。</td></tr>
</table>


#### 折线图事件

请再then promise 中给chart实例添加事件侦听。

```js
Chartx.line(#el , data , options).then(function( chart ){
    chart.on("click mouseover mousemove mouseout" , function( e ){
        if( e.type == "click" ){
            ... do something    
        }
    });
});
```

mobile端事件侦听目前已经全部对接了hammer.js的大部分手势，可以添加tap(点击)， panstart(手势准备移动) ，panmove(手势拖动中)， panend(手势移动结束)。全部手势可以前往[hammer.js](http://hammerjs.github.io/)参考。

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


### 柱状图(bar)

柱状图的[布局和折线图（line）一样](#linelayout)。

创建柱状图代码 ，<a href="./demo/bar/index.html" target="_blank">demo</a> 

 
```js
Chartx.bar(#el , data , options);
```

#### 柱状图数据

```js
var data= [
    ["xfield","uv" ,"pv","click"],
    [ 1      , 101 , 20 , 33    ],
    [ 2      , 67  , 51 , 26    ],
    [ 8      , 99  , 83 , 51    ]
];
```

#### 柱状图配置

```js
var options = {
    type  : //可选，如果填写horizontal，则会渲染横向柱状图
    xAxis : {}, //x轴组件配置
    yAxis : {}, //y轴组件配置
    back  : {}, //背景组件配置
    tips  : {}, //tips组件配置
    graphs: {}  //柱状图绘图配置
}
```
 options配置：

 - type --> 可选，如果填写horizontal，则会渲染横向柱状图，默认不配则为纵向柱状图
 + [xAxis](#xaxis)
 + [yAxis](#yaxis)
 + [back](#back)
 + [tips](#tips)
 + graphs 
   - bar --> 单条bar柱状图形的样式
     *  width --> 单条bar宽度，默认12
     *  fillStyle --> 单条bar的填充色，遵循[<a href="#color">颜色值的规则</a>]
     *  radius --> bar的圆角
   - text --> bar上面的文本
     *  enabled --> 是否显示
     *  fillStyle --> 目前不支持配置，值为"#999"
     *  fontSize  --> 描述文本大小
     *  format --> {function}把原始文本转换座位最终显示文本的转换函数。比如原始数据都是[0.1 , 0.2 , 0.3]，但是实际的显示需要是10%,20%,30%这样的。

            ```js
            graphs : {
                text : {
                    format : function( n ){
                        return n * 100 + "%"
                    }    
                }    
            }
            ```


### 地图(map)

地图类型里目前包括有世界地图和中国地图，其中中国地图可以实现省市联动。

demo： <a href="./demo/map/world.html" target="_blank">世界地图</a> <a href="./demo/map/world.html" target="_blank">中国地图</a> <a href="./demo/map/world.html" target="_blank">中国地图省市联动</a>

创建地图代码：

```js
Chartx.map(#el , data , options)
```

#### 地图数据格式

var data = [
    [ "area"   , "click" , "color"],
    [ "广东省" , 111     , "#3871BF"],
    [ "浙江省" , 100     , "#3871BF"]
];

#### 地图配置

```js
var options = {
    mapName : "china" ,//地图类型，默认为china中国地图，world则为世界地图
    areaField : "area" , //areaField字段,默认获取第一个字段，比如上面的data则就是默认area
    area : {}, //地图的单块区域配置样式，比如中国地图是由n个省地图块拼接而成的，area就是中国地图上面单个path比如湖南省地图的样式配置。
    tips : {}
}
```

 - area 
   + strokeStyle --> path区域边框颜色，默认为"white"
   + lineWidth  --> path区域的lineWidth大小，默认为1
   + linkage --> 是否开启省市联动，目前只有mapName为“china”的时候才有效
   + text
     - fillStyle --> 区域名字文本颜色，默认为"#000"
     - enabled --> 是否显示区域名字文本
   + fillStyle --> 单个区域填充色，该配置可以是一个颜色值，也可以是一个函数，如果是函数的话，其参数如下：
     - area --> 单个区域的对象，包括了{id, name , path,}等属性。
     - data --> 假如该区域在data中存在，就代表该行的data数据，比如用上面的数据来渲染中国地图的时候，在绘制"广东省"区域的时候，其fillStyle函数的参数中的data，就是<img src="./assets/chart/mapdataitem.png" style="width:200px;" />，并且数据已经被结合title序列化成了一个object：

         ```js
         data : {
             area  : "广东省",
             click : 111,
             color : "#3871BF"
         }
         ```

     - dataIndex --> 和data一样，只是dataIndex返回的是该行，在整个data中的行的索引，那么”广东省“的dataIndex就是0（不包含title行）

### 饼图(pie)

<a target="_blank" href="./demo/pie/index.html">基础饼图demo</a>

创建饼图代码：

```js
Chartx.pie( #el , data , options );
```

#### pie数据格式：

```js
var data= [
    ["ie"     , 30],
    ["chrome" , 35],
    ["firefox", 20],
    ["safari" , 10],
    ["其他"   , 5]
];
```

TODO：目前pie图的数据格式是唯一不同没有titles行的数据格式，因为再pie里面是默认了第一列座位key字段，后续会统一过来。

#### pie图的配置

- innerRadius --> 内圆半径，默认为0，即为实心饼图
- animation --> 是否执行进场动画
- dataLabel --> 拼图的外接触角tips配置
  + enabled --> 是否显示
  + format --> 格式化模板，比如下面的代码：
 
      ```js
      //周边tip
      dataLabel: {
          enabled: true,
          format: '{point.name} : {point.percentage}'
      }
      ```
    会得到这样的效果<img src="./assets/chart/pielabeltip.png" style="width:200px;" />  


### 雷达图(radar)

雷达图的基本布局：

<img src="./assets/chart/radarlayout.png" style="width:300px;" />

雷达图的布局和折线图柱状图散点图这样的[xAxis，yAxis，graphs的很清晰的三国分立布局](#linelayout)不一样，但是它也其实也可以理解为是弯曲了的x轴和y轴，就好比一本书，它有着清晰的xy轴的坐标系，但是你把它握成一个圆筒的时候，这个时候它的x轴就成了一个环状。

## 组件


<h3 id="xaxis">xAxis</h3>

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
   + format --> <span id='xaxisformat'>{function}一个用来把原始元数据转换到最终展示的文本的转换函数，比如，代表一个星期的数据，元数据是0,1,2,3,4,5,6,7，但是xAxis轴上面需要显示为"星期一"，"星期二"，"星期三"，"星期四"，"星期五"，"星期六"，"星期天"。这个format函数的参数便是每一个元数据，比如是判断参数为0，就return “星期一”。</span>

         ```js
         xAxis : {
             text : {
                 format : function( v ){
                     if( v == 0 ){
                         return "星期一"    
                     }
                 }  
             }    
         }
         ```

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


<h3 id="yaxis">yAxis</h3>

 + enabled --> 是否显示yAxis轴组件
 - line    --> yAxis轴刻度线
   + enabled --> 是否显示刻度线
   + width -->  刻度线的width，默认为6
   + lineWidth  -->  刻度线的粗细，默认为3
   + strokeStyle --> 刻度线的颜色，默认为'#BEBEBE'
 - text --> yAxis轴的文本
   + fillStyle --> 文本颜色，默认“#999”
   + fontSize --> 文本大小，默认12px
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

<h3 id="back">back</h3>


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

<h3 id="anchor">anchor(十字坐标瞄准器)</h3>

<img src="http://nickli.github.io/chartx/assets/chart/line/anchor.gif" style="width:300px;" />

上图的红色十字坐标瞄准器就是anchor组件，<a href="./demo/line/anchor.html" target="_blank">该图表demo点这里</a>

 - w --> anchor的区域width
 - h --> anchor的区域height
 - enabled --> 是否显示
 - xAxis
   + lineWidth --> x轴线的lineWidth
   + fillStyle --> x轴线的fillStyle，默认为“#cc3300”
 - yAxis
   + lineWidth --> y轴线的lineWidth
   + fillStyle --> y轴线的fillStyle，默认为“#cc3300”
 - node --> 坐标交叉点的圆点
   + enabled --> 是否需要显示圆点
   + r  --> 圆点半径
   + fillStyle --> 圆点的填充色，默认为“#cc3300”
   + strokeStyle --> 圆点的描边颜色，默认为“#cc3300”
   + lineWidth --> 圆点描边的lineWidth
 - pos --> anchor区域的原点坐标
   + x 
   + y
 - cross --> 十字交叉点的坐标
   + x 
   + y

<h3 id="tips">tips</h3>

 - backR --> tip框圆角大小
 - fillStyle --> tip框背景色，默认"#000000"
 - text
   + fillStyle --> tip内容文本颜色，默认"#ffffff"
 - alpha --> tip框透明度
 - offset --> tip框到鼠标位置的偏移量
 - prefix --> 假如yAxis.fields配置为[ "uv" , "click" ]，那么这个时候的tip内容为这样<img src="./assets/chart/tip_prefix.png" style="height:50px;" />，给tips.prefix配置为["用户数","点击量"]后，那么结果会是这样<img src="./assets/chart/tip_prefix1.png" style="height:50px;" />
 - content --> {function}如果tips配置了content的话，那么tip框内的内容都会是content函数的返回内容，这个时候prefix会失效。content函数的参数详情如下
   + 折线图(line)，柱状图(bar)，散点图(scat)中的tips content 函数参数：

     <table>
         <tr>
             <td>xAxis</td>
             <td>
                 tip点位置对应的x轴数据。{ field : "xAxis的field配置" , value : "对应xAxis的value值" }
             </td>
         </tr>
         <tr>
             <td>iGroup</td>
             <td>对应yAxis轴方向第几组数据，比如折线图中代表第几条折线</td>
         </tr>
         <tr>
             <td>iNode</td>
             <td>对应xAxis轴上第几个节点，比如折线图中代表线条的第几个节点</td>
         </tr>
         <tr>
             <td>nodesInfoList</td>
             <td>
             [ { field : "这个节点对应的yAxis字段field" ,alpha: , color:  , fillStyle: , lineWidth: , r: , strokeStyle: , value: , x: , y: , } ... ]
             </td>
         </tr>
     </table>
  
   + 地图(map)中的tips content 函数参数：


