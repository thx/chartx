## line

- **yAxisAlign** 默认"left"，设置该graphs对应的那一y轴

- **field** 数据字段，和柱状图一样，但是目前没有实现堆叠的line，即面积图

- **line** 折线设置

    - **enabled** true，是否开启

    - **shapeType** "brokenLine"，目前只实现了折线

    - **strokeStyle** 线的颜色，默认从皮肤中获取，可以设置颜色值，也可以设置数组，也可以设置函数

    - **lineWidth** 2

    - **lineType** 'solid'可选dashed(虚线)

    - **smooth** true，是否平滑折线

- **icon** 线上对应的数据节点图形

    - **enabled** 默认true

    - **shapeType** 默认'circle'，icon的shape类型，其他类型开发中

    - **corner** 默认true,拐角才有节点

    - **radius** 默认4,shapeType为circle时候的半径

    - **fillStyle** 默认"#ffffff",icon填充色设置

    - **strokeStyle** 默认null，icon描边

    - **lineWidth** 默认2，icon描边宽度

- **label** 

    - **enabled** 默认false

    - **fillStyle** 默认null会取line的颜色

    - **strokeStyle** 默认null

    - **fontSize** 默认12

    - **format** 默认null，label信息的格式化函数

- **area**

    - **enabled** 默认true

    - **fillStyle** 默认null会取line同色

    - **alpha** 默认0.3 