## pie

- **field** 用来处理pie比例的数据字段

- **sort** 是否排序，默认null，即不做任何排序，按照用户数据来显示，可选desc（降序），asc（升序）

- **startAngle** 起始角度

- **allAngles** 绘制pie的总角度

- **node** pie中每个数据单元的配置，默认对应一个扇形区块

    - **radius** 每个扇形单元的半径，也可以配置一个字段，就成了丁格尔玫瑰图

    - **innerRadius** 扇形的内圆半径

    - **outRadius** 最大外围半径

    - **minRadius** outRadius - innerRadius ， 也就是radius的最小值

    - **moveDis**  要预留moveDis位置来hover sector 的时候外扩

    - **fillStyle** 单个扇形区域的颜色

    - **focus** 鼠标hover活的焦点时候的状态设置

        - **enabled** 是否开启单个图形的hover激活

    - **select** 单个图形的选中状态设置

        - **enabled** 是否开启单个图形的选中功能

        - **radius** 选中时，表示选中的外围图形的半径

        - **alpha** 选中时，表示选中的外围图形的透明度
    
    - **label** pie的label设置

        - **enabled** 默认false，pie的label默认是关闭的，想要显示label

        - **field**

