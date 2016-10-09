
![](https://img.alicdn.com/tps/TB14JPTJpXXXXbHXXXXXXXXXXXX-697-303.png)

Chartx Gitlab：[http://gitlab.alibaba-inc.com/thx/charts](http://gitlab.alibaba-inc.com/thx/charts)

Chartx 官网：[http://thx.github.io/chartx](http://thx.github.io/chartx)

### 关于Chartx
        
经过两年多,多少个版本的积累，我们阿里妈妈UED的图表库Chartx不断在完善和成长，今天，Chartx已经覆盖了阿里妈妈所有产品，以及易传媒，数据平台等兄弟部门的产品。我们开发了多达12种类的常规图表，和7个从产品的实际需求中诞生的自有原创图表。


### 基础底层渲染引擎Canvax

说到chartx，不得不也搭车说下Canvax，又按照国际惯例先放出地址：[canvax.org](http://canvax.org)。

Canvax是chartx的基础,底层渲染引擎,在这个之上可以快速开发chart,在研发chartx之前，我们针对图表场景精心设计了Canvax，在图表这样对帧率要求不高的场景中，如果使用Main Loop主循环来不停渲染的话，会带来巨大的cpu资源浪费，不利于移动端的覆盖，而如果每次有属性变化都让开发者手动调用一次draw的话又实在太不友好，为此，我们精心设计了Virtual Context来主动驱动canvax引擎渲染的技术（已经向知识产权局提交了专利申请），既解决了Main Loop带来的浪费，又解决了需要开发者手动申请渲染的尴尬。



### Chartx的能力

#### 跨平台跨终端

Chartx在ie9- 不支持canvas的浏览器中会自动输出flash文件来实现兼容，在移动端Chartx也同样有不俗的表现

#### 丰富的图表类型

Chartx目前有12类常规图表类型：bar(柱状图)，line（折线图），map（地图），pie（饼图），progress（进度图），radar（雷达图），scat（散点图），topo（拓扑图，树状图），chord（和铉图），hybrid（混搭图表），venn（韦恩图），force（力布局图），和7个自定义自有的图表。


![](https://img.alicdn.com/tps/TB165YGJpXXXXagXVXXXXXXXXXX-818-1374.jpg)

#### 图表扩展能力

我们每一种图表，都可通过自由的配置来实现其强大的扩展能力。
比如折线图：

![](https://img.alicdn.com/tps/TB1EMfOJpXXXXbOXpXXXXXXXXXX-1074-974.jpg)


#### 自有创新图表开发能力

我们拥有从底层建筑到上层树木的构建能力，这样可以拥有应对天马行空的需求场景的能力。

![](https://img.alicdn.com/tps/TB19TDBJpXXXXc_XVXXXXXXXXXX-1066-580.jpg)


### chartx的使用

先上一张图表玉照：

![](https://img.alicdn.com/tps/TB1GHLrJpXXXXb4aXXXXXXXXXXX-602-310.png)

#### 友好的数据格式，真正的数据驱动

我们的数据定义，采用下面的格式：

```
var data= [
    ["xfield","uv" ,"pv","click"],
    [ 1      , 3   , 20 , 33    ],
    [ 2      , 0   , 51 , 26    ],
    [ 3      , 32  , 45 , 43    ]
];     
```
这样，数据和具体的图表逻辑脱钩，对前后台的数据格式约定非常友好，后台输出数据的时候只需要把表格直接输出。


#### 堆积木一样的搭建图表

任何一个图表。都会有很多不一样的需求，所以我们把每个图表分拆为很多组件，然后以堆积木的方式来应对不同的需求场景。

```
var options = {
    xAxis : {}, //xAxis组件，配置直角坐标系的x轴
    yAxis : {}, //yAxis组件，配置直角坐标系的y轴
    back  : {}, //背景组件，配置背景
    tips  : {}  //tips组件，toolTip配置 
}
```
每一个组件的配置里面还又很丰富的细节配置，可以满足视觉设计师和产品经理的各种需求。



### 欢迎大家一起使用交流

欢迎大家一起使用，共建chartx。对chartx，canvax敢兴趣或者对数据可视化开发感兴趣的同学欢迎加入旺旺群：1238542386，一起探讨。

我们的数据可视化开发小组成员：@逢春，@释剑，@自勉

特别的鸣谢：感谢@李牧，@左莫在chartx的成长中的各种支持

