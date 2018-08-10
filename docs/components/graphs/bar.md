bar
=================

### 配置（属性/事件）

- `field` 数据字段

    在参考了众多的charts里面，大家对实现柱状图的各种组合形态，比如多组柱状图，多组柱状图+堆叠等等，大部分是采用增加stack配置的形式来实现，而我们，巧妙的独树一帜的利用了把field属性设计成支持多维数组的形式来巧妙而且强大的解决了这个问题，还是看图说话吧：

```js
    graphs: {
        type: "bar",
        field: "pv" //field直接配置为一个数据字段字符串，那么这个就是个单柱柱状图
    }
```
<img src="./assets/graphs_bar.jpg" style="width:200px;">

```js
    graphs: {
        type: "bar",
        field: [ "pv","uv" ] //field为一维数组，那么就是一个多分组柱状图
    }
```
<img src="./assets/graphs_bar_1.jpg" style="width:200px;">

```js
    graphs: {
        type: "bar",
        field: [ 
            ["pv","uv"] 
        ] //field为二维数组，那么就是一个堆叠
    }
```
<img src="./assets/graphs_bar_2.jpg" style="width:200px;">

```js
    graphs: {
        type: "bar",
        field: [ 
            [ "pv","uv" ],
            'uv'
        ] //如果要实现多分组，其中某个分组又是堆叠的，就这样实现
    }
```
<img src="./assets/graphs_bar_3.jpg" style="width:200px;">

是不是很形象的配置方式，用过其他图表库的用我们的方式来实现多分组或者堆叠图表，你会发现这简直舒服而且强大到残暴的地步。

- `proportion` 该graphs是不是比例柱状图

- `yAxisAlign` 默认"left"，设置该graphs对应的那一y轴

- `absolute` 默认false，trimGraphs的时候是否需要和其他的 bar graphs一起并排计算，true的话这个就会和别的重叠，和css中得absolute概念一致，脱离文档流的绝对定位

- `node` 一个数据节点的配置

    - `shapeType` 'rect' node的图形类型，默认只实现了rect

    - `width` node图形对应的width

    - `maxWidth` node图形最大width限制

    - `minWidth` node图形最小width限制

    - `minHeight` node图形最小高度限制

    - `radius` node图形为rect的时候的圆角设置

    - `fillStyle` node图形的填充色，可以是单颜色值，可以是数组，数组的话安装group索引自动获取，也可以是自定义函数（node对应的data做为入参数）

    - `fillAlpha` node图形的填充透明色

    - `filter` node图形的过滤函数，入参数有node图形的图形对象以及node的data

- `label` 

    - `enabled` 

    - `fontColor` 如果有设置text.fontColor那么优先使用fontColor

    - `fontSize` 12

    - `format` 把原始文本格式化到显示文本的格式函数

    ```js
        format( val, nodeData ){
            //第一个参数就label的文本值，第二参数是具体的node数据
        }
    ```

    - `lineWidth` 默认0， 文本描边大小

    - `strokeStyle` 文本描边颜色

    - `rotation` 文本选择角度

    - `align` 文本水平布局类型，默认center, 可选有left,center,right

    - `verticalAlign` 文本垂直布局类型，默认bottom,可选有top middle 
    
    - `position` 文本的位置，默认top,可选有top,topRight,right,rightBottom,bottom,bottomLeft,left,leftTop,center

    - `offsetX` 文本的x方向偏移

    - `offsetY` 文本的y方向偏移


- `select` 分组的选中，不是选中具体的某个node，这里的选中靠groupRegion来表现出来

    - `enabled` 是否开启分组选中功能，默认false
        
    - `alpha`  分组选中状态的透明度，默认0.2
        
    - `fillStyle` 分组选中状态的的颜色，可以设置单颜色值，或者数组，或者函数（参数为 `{iNode:,rowData:}`）
        
    - `triggerEventType` 触发selected的事件类型，默认"click"

    - `inds` 选中的列的索引集合
    

### 方法

#### selectAt

    选中分组

#### unselectAt

    取消选中的分组

####  getSelectedRowList

    获取选中分组的数据列表

