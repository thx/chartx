[
   [ 
      {title:"数量指标",subtitles:["展现uv","展现次数","目标人群覆盖率"]} ,
      {title:"质量指标",subtitles:["人均曝光次数" , "点击率" , "回搜率"]}
   ],
   {data : [ "钻石展位" , [1,2,3] , [4,5,6]],children:[]},
   {
     data : [ "钻石展位" , [1,2,3] , [4,5,6]],
     children : [
        [ "钻石展位" , [1,2,3] , [4,5,6]],
        [ "钻石展位" , [1,2,3] , [4,5,6]]
     ]
   }
   
]




name    : 渠道信息
showUv  : 展现uv
showNum : 展现次数
populaCover : 目标人群覆盖率
clickRate : 点击率
exposureNum : 人均曝光次数
searchRate : 回搜率

[
  {name:"钻石展位",showUv:100,showNum:100,populaCover:100,clickRate:20,exposureNum:10,searchRate:10},
  {
      name:"钻石展位",showUv:100,showNum:100,populaCover:100,clickRate:20,exposureNum:10,searchRate:10
      children : [
          {name:"钻石展位",showUv:100,showNum:100,populaCover:100,clickRate:20,exposureNum:10,searchRate:10}
      ]
  },
]

1，阿里妈妈o2o-cms系统开发上线。
2，在cms上面开发支持 o2o营运活动, 妈妈魔盒, p4p外投等业务的组件.
3，canvax 图形渲染引擎的完善。
4，chartx 基于canvax引擎的图表库开发丰富完善和在业务中应用
5，基于canvax在业务上面一些轻度动画效果开发（比如应用在dmp标签市场上面的波浪效果）
6，ma的开发刚刚开始



本周:
1, ma多次交互评审会议
2，ma渠道管理开发 80%
3，图表接入feedback（接入了饼图，折线，柱状图，雷达图） ，发现些小bug修复
4，修改chartx的包管理方式
   把以前用site.local site.daily 等方式去掉
   换为获取chartx/index.js 本身的url 来作为包地址
5，和春哥一起讨论 dmp 中的星系图 实现


下周：
ma人群管理开发