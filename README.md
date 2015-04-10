## xChart使用方式

### 1，在页面引入xChart的库文件

daily环境为 <script>http://g-assets.daily.taobao.net/thx/charts/chartx/index.js</scirpt>

cdn环境为   <script>http://g.tbcdn.cn/thx/charts/{{版本号}}/chartx/index.js</scirpt>

当前最新CDN版本号为1.6.1

### 2，创建图表

在全局图表对象Chartx下面有一个create对象，上面挂载着全部的图表类型
目前有['bar' , 'force' , 'line' , 'map' , 'pie' , 'planet' , 'progress' , 'radar' , 'scat' , 'tree']
该类型方法需要三个参数，

| 参数位置  | 说明 |
| --------- | ---- |
| 1 |el   --> DOM树中对应的节点，可以是id 也可以是kissy.all("#id")或者jquery("#id")对象|
| 2 |data --> 绘制图表的数据，无数据则传入空数组[]|
| 3 |options --> 绘制图表的配置|

```javascript
Chartx.create.map("canvasTest" , data , options).then(function( chart ){
    //在 promise 中 拿到创建好的图表实例
    chart.draw();
})
```
