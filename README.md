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

  ** Chart 图表基类

     1，这次添加了组件管理机制 components
     
     2，然后，对于reset 和 resetData两个接口，这次做了绝对清晰的划分，也就是reset 实质上和重新绘制是一回事，而resetData却仅仅是数据的变化，然后调用各个组价的resetData 来实现整体数据的更新（ 之前版本里做的太复杂，reset会去计算用户reset的意图，比如reset里少了个yAxis的字段，那么就会自动remove掉一条线，这是个大坑，而且性价比非常低，但是代码量和可维护性非常低 ）

