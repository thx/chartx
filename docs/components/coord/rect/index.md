直角坐标系
=================

### type

coord.type == rect（直角坐标），则坐标系统组件的配置走直角坐标系组件的配置

### enabled

默认为true，如果设置为flase，则整个坐标系组件ui都处于隐藏状态，但是不代表不配置coord组件啊，逻辑上面是必须的，只是ui上面隐藏。

### horizontal

默认false，是否横向反转直角坐标系，比如横向的柱状图


### xAxis

`xAxis` x轴，目前只支持单x轴设计

- `field` 用来绘制x轴的数据字段

- `animation` 是否有动画

- `enabled` 默认true，是否显示ui标尺，如果为false，那么这个axis的高宽为0

- `title` 轴的标题
    
    - `content` 默认为空，title的内容

    - `fontColor` title的颜色

    - `fontSize` title的字体大小

- `tickLine` 刻度线

    - `enabled` true，是否有刻度线

    - `lineWidth` 1 线宽

    - `lineLength` 4 线长

    - `distance` 2 刻度线到轴线的偏移量

    - `strokeStyle` '#cccccc' 线颜色

- `axisLine` 轴线

    - `enabled` 1 是否有轴线
    
    - `lineWidth` 1 线宽

    - `strokeStyle` '#cccccc' 轴线颜色

- `label` 文本配置
    
    - `enabled` true 
    
    - `fontColor` '#999' 

    - `fontSize`  12
    
    - `rotation`  0 文本旋转角度

    - `format`

        文本的format格式化函数配置，默认为null

        参数：text 文本的原始数据

    - `distance` 2 偏移量

    - `textAlign` "center" 

    - `lineHeight` 1
    
- `dataSection` 默认就等于源数据,也可以用户自定义传入来指定

- `filter` 这里可以由用户来自定义过滤 来 决定 该node的样式

  参数opts：

  ```javascript
    opts = {
        layoutData: arr, //全部layoutData数据
        index: a, //当前节点在layoutData中的索引
        txt: _txt || null,  //当前节点的文本canvax对象
        line: _line || null //当前节点的刻度线canvax对象
    }
  ```


- `trimLayout` 

  如果用户有手动的 trimLayout ，那么就全部visible为true，然后调用用户自己的过滤程序
  trimLayout就事把arr种的每个元素的visible设置为true和false的过程

- `posParseToInt` 比如在柱状图中，有得时候需要高精度的能间隔1px的柱子，那么x轴的计算也必须要都是整除的
  

### yAxis

`yAxis` y轴，支持双y轴配置

- `align` 默认’left‘，可选’right‘

- `animation` 是否有动画

- `enabled` 默认true，是否显示ui标尺，如果为false，那么这个axis的高宽为0

- `title` 轴的标题
    
    - `content` 默认为空，title的内容

    - `fontColor` title的颜色

    - `fontSize` title的字体大小

- `tickLine` 刻度线

    - `enabled` true，是否有刻度线

    - `lineWidth` 1 线宽

    - `lineLength` 4 线长

    - `distance` 2 偏移量

    - `strokeStyle` '#cccccc' 线颜色

- `axisLine` 轴线

    - `enabled` 1 是否有轴线
    
    - `lineWidth` 1 线宽

    - `strokeStyle` '#cccccc' 轴线颜色

- `label` 文本配置
    
    - `enabled` true 
    
    - `fontColor` '#999' 

    - `fontSize` 12
    
    - `rotation` 0 文本旋转角度

    - `format` 

        文本的format格式化函数配置，默认为null

        参数：text 文本的原始数据

    - `distance` 2

    - `textAlign` "center"

    - `lineHeight` 1

    
- `dataSection` 默认就等于源数据,也可以用户自定义传入来指定

- `filter` 这里可以由用户来自定义过滤 来 决定 该node的样式

  参数opts：

  ```javascript
    opts = {
        layoutData: arr, //全部layoutData数据
        index: a, //当前节点在layoutData中的索引
        txt: _txt || null,  //当前节点的文本canvax对象
        line: _line || null //当前节点的刻度线canvax对象
    }
  ```

- `waterLine` 水位data，需要混入 计算 dataSection， 如果有设置waterLineData， dataSection的最高水位不会低于这个值

- `middleweight` 如果middleweight有设置的话 dataSectionGroup 为被middleweight分割出来的n个数组>..[ [0,50 , 100],[100,500,1000] ]


### grid

`grid` 坐标系的背景网格

- `enabled` {true}  

- `xDirection`  x方向上的元素配置

    - `shapeType` "line" 可选类型有'line','region'

    - `enabled` true 

    - `lineType` 'solid' shapeType==line的时候可以配置

    - `lineWidth` 1 shapeType==line的时候可以配置

    - `strokeStyle` "#f0f0f0" shapeType==line的时候可以配置

    - `filter` 该shape的过滤函数

- `yDirection`  x方向上的元素配置

    - `shapeType` "line" 可选类型有'line','region'

    - `enabled` true 

    - `lineType` 'solid' shapeType==line的时候可以配置

    - `lineWidth` 1 shapeType==line的时候可以配置

    - `strokeStyle` "#f0f0f0" shapeType==line的时候可以配置

    - `filter` 该shape的过滤函数

