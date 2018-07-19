2018-07-18:

本次修改为梳理全部图表配置时，发现很多不同组件中类似功能的配置但是配置方式不统一，所以，这次的change也是后面的配置定义规范的一部分

1，所有text配置都换为label,比如xAxis.text --> xAxis.label

2，涉及到半径的r属性还原为radius，后续所有的配置会写全名，避免理解误导

3，markLine.label.value -- > markLine.label.text

4，所有文本颜色配置都统一为fontColor

5，星系图的center.text ==> center.content， 添加了shapeType=='text'， 后续这里会增加icon ，logo等的内容，这样扩展性强点

6, tips的自定义content中，每个node中都必须有一个rowData属性来透出这一行数据的内容，目前所有graphs对象都已经实现

7, 每个 graphs的 nodeData中都有一个color属性，tips.content中可以统一拿这个属性， 目前tips.content中需要根据不同的graphs来获取不同的属性。 有的是fillStyle 有的是color 有的是fontColor。现在tips中都可以统一用node.color来获取颜色

8, format入参数统一个参数都是value，第二个参数是nodeData(graphs组件都有)，改动点--pie.label.format增加了第一个参数

9, 动画配置用animation, 但是驼峰命名中用Anim，比如tips.pointerAnim，  改动点，tips.pointerAnimation-->tips.pointerAnim

10, 所有旋转属性都用rotation