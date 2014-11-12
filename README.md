# m2ux 数据可视化解决方案

## 概要
* git库 git@gitlab.alibaba-inc.com:thx/charts.git
* daily环境最新版本 daily/1.2.3
* daily环境包地址 http://g.assets.daily.taobao.net/thx/charts/1.2.3/
* 线上环境最新版本  publish/1.2.2
* 线上环境包地址 http://g.tbcdn.cn/thx/charts/1.2.2/

## 相关成员
* 交互+视觉 ：小路，罗素
* 前端开发  ：逢春，释剑，自勉

## Chart开发相关规范

* 所有的chart 都 应该从chart/index创建而来

Example 

```js
KISSY.add("chart" , function(S , Chart){
    return Chart.extend({
        init : function(){
        
        },
        draw : function(){
        
        }
    })
} , {
    required : [
        'dvix/chart/'
    ]
})
```

就这样开发一个最简单的chart，这个简单的chart看上去还一无所闻，事实上Chart基类已经为它准备好了下面（具体可以查看 dvix/chart/index.js文件）。

属性：
* el 指向页面上的存放chart的dom
* width      chart的width
* height     chart的height
* canvax     chart持有一个canvax对象来管理所有的绘图原件
* stage      chart默认拥有的一个stage，你也还可以继续在cavnax上添加其他的stage
* dataFrame  把使用chart的时候传入的 data 转换为 chart内部使用的dataFrame集合

方法：
* clear  无参数，清除当前chart内容
* resize 无参数，如果chart存放在页面上对应的dom元素大小有改变，执行chart的resize方法，会自动适配到对应dom最新的大小，然后渲染自己
* reset  参数为一个object --> {data : 可选 , options : 可选},如果chart的数据源或者options配置有改动，则可以用该方法重新渲染

事件：

* chart基类继承自cavnax的EventDispatcher事件系统，可以在chart上面派发自定义事件。

Example

 ```js
 return Chart.extend({
        init : function(){
            ...do something
            this.fire("init");
        }
    })
 ```

然后在使用该图表的时候

 ```js
 var pie = new Chart(S.all("#chart") , data , options);
 pie.on("init" , function(){
     alert("Im ready now");
 })
 ```