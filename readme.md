chartx2.0 代码规范
=================

* 配置使用规范约定

  首先，chartx2.0 和之前的版本使用方式保持一致，需要有 dom 节点， data数据，和配置。

  不同的是2.0中数据支持行列式的数据格式

  ```javascript
  var data = [
      [ "xfield", "uv", "pv" ],
      [ 1       ,  2  ,  3   ],
      [ 2       ,  3  ,  4   ]
  ]
  ```

  同时也支持json格式列表
   ```javascript
  var data = [
      { xfield: 1, uv:2, pv:3  },
      { xfield: 1, uv:2, pv:3  },
      { xfield: 1, uv:2, pv:3  }
  ]
  ```
  chartx会主动识别并且处理，只要符合其中一种数据格式，你就只管塞就好了。

  然后，chartx2.0中 所有的图标类型都会提供一份根据数据来得默认配置，也就是说，你可以只要有数据，不用些任何配置，就可以创建一个图表：

  ```javascript
  Chartx.Line( "dom" , data, {} ) 
  //最后面的那个配置可以不要，Chartx.Line( "dom" , data )
  //那么比如在直角坐标系中，我们会默认拿第一个字段xfield作为xAxis.field, 其他字段都作为yAxis.field
  ```



  chartx2.0 相比1.xxx 更加纯粹的采用了组件式配置的原则，比如一个直角坐标系的折线图line，它的配置会是这样

  ```javascript
  //其中除开coordinate 和 graphs 默认会有以外，其他的所有 组件 都是组装式的，在options 里面组装了这个组件，才会有对应的功能，2.0里面包括tips也不再默认放出（ 这么多年的经验得出，默认的tips基本没有可看性，项目里面基本会对tips.content重构 ）
  var options = {
      coordinate : {
          xAxis : {},
          yAxis : {}
      },
      graphs : {

      },
      legend : {

      },
      markLine : {

      },
      markPoint : {

      },
      dataZoom: {

      },
      tips : {

      }
  }
  ```

  * 图表类视图规划

    2.0中，把图表区 按照坐标系类别分类，而不在是单独个图表类型，各自写各自的逻辑代码

    + Chart
        + Descartes(笛卡尔坐标系)
            - bar 
            - line
            - bar_line
            - bar_tgi
            - scat
        + Polar(极坐标系)
            - Pie
            - Dingle（丁格尔玫瑰图）
            - Planet （星云图）
        + Other


  * 接口约定规范

  ** chart 图表基类

     1，这次添加了组件管理机制 components

     2，然后，对于reset 和 resetData两个接口，这次做了绝对清晰的划分，也就是reset 实质上和重新绘制是一回事，而resetData却仅仅是数据的变化，然后调用各个组价的resetData 来实现整体数据的更新（ 之前版本里做的太复杂，reset会去计算用户reset的意图，比如reset里少了个yAxis的字段，那么就会自动remove掉一条线，这是个大坑，而且性价比非常低，但是代码量和可维护性非常低 ）

  ** descartes 笛卡尔系统类（ bar,line,scat 等都继承自该类 ）


  简单代码约定规范

  _coordinate 为实例
  coordinate 为配置


  交互事件的规范
  1.xx 版本中，所有的事件都是在 chart.on("nodeclick") 等这样的层面实现的

  2.0中，所有的事件都写入到配置中去

  比如在scat中得节点点击事件

 ```javascript
  graphs : [
        {
            type : "scat",
            field : "money",
            groupField : "sex",
            node : {
                r : "house", 

                //事件直接注册到对于的配置中来，这样，减少了命名的麻烦，统一的命名，而且直观, 
                //一眼就知道在那些元素上面注册了事件
                onclick : function( nodeData, Graphs ){
                    debugger
                }
            }
        }
    ]
 ```
  
file:../canvax

直角坐标系的两类轴（xAxis,yAxis）,和极坐标系的两类轴（aAxis,rAxis ）， 都至少有field和ruler
ruler用来表示刻度ui，axis上面别的所有的属性都是逻辑属性，ruler用来控制是否有ui。

graphs 约定
所有得graphs中把所有的ui设置都归为了4个属性（这么多年的经验来看， 基本能满足目前为止的所有需求）
node --》 (对应一个数据节点，而不是ui元素)
line --》（多个数据节点的链接，在雷达图和line折线图中表现为用折线绘制连接）
area --》（同样地，表示多个数据节点的链接，然后有一个闭环，出现了一个面）
text --》 文本


nodeData, nodeElement ， data和图形之间互相引用的属性约定

text的值统一为value属性（以前很多地方是content，这个全部统一），只有tips的内容的属性用content,因为这个内容是一个内容的片段，text.value属性一般都是返回一单个string