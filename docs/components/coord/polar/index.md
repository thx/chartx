极坐标系
=================

### type

coord.type == polar（直角坐标），则坐标系统组件的配置走直角坐标系组件的配置

### allAngle

默认360， 极坐标的总角度值，0-360区间

### maxR

最大半径

### squareRange

default true, 说明将会绘制一个width===height的矩形范围内，否则就跟着画布走

### aAxis 

角度轴，类似rect中的xAxis，只是这里的这个轴，在ui上面是个以圆心为中心的圆弧

- `enabled` 默认判断配置中又没有aAxis，以及aAxis.field

- `field` 数据字段

- `layoutType` 默认"average"角度均分，可选“proportion”和rect中一样，数据真实比例划分角度

- `beginAngle` 起始角度

- `label` 

    - `enabled` 

    - `format`

    文本的format格式化函数配置，默认为null

    参数：text 文本的原始数据

    - `fontColor`  "#666"

### rAxis

半径维度轴

- `field` 数据字段

- `enabled` 是否开启

- `dataSection`

### grid 

背景网格

- `enabled` 是否开启,pie默认关闭

- `ring` 环

    - `shapeType` "poly" 换线类型，可选“circle”
    
    - `lineType` 1
    
    - `strokeStyle` "#e5e5e5",可以传颜色值数组，会根据索引一次获取

    - `fillStyle` 默认null，同strokeStyle一样可以设置颜色值，也可以是颜色值数组

    - `fillAlpha` 0.5

- `ray` 射线

    - `lineWidth` 1 

    - `strokeStyle` "#e5e5e5"
