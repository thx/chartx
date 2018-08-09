快速上手
=================

## 1，把Chartx安装到项目中来

我们的项目已经发布到`npm`上面，[https://www.npmjs.com/package/chartx](https://www.npmjs.com/package/chartx)，你可以从`npm`安装

```javascript
npm install chartx
```

如果你想用`cdn`的方式来引入到项目，我们没有提供具体线上的cdn，但是你可以把我们的github项目clone下来到本地，然后`dist`目录下面有`amd,umd,cjs,iife`四种格式的文件`(dist/chartx.js就是iife格式)`，你可以部署到你自己的项目里。

我们用的rollup打包，这里放一份rollup对这四种格式人间的定义

```html
 amd – Asynchronous Module Definition, used with module loaders like RequireJS
 cjs – CommonJS, suitable for Node and Browserify/Webpack
 iife – A self-executing function, suitable for inclusion as a <script> tag. 
      （If you want to create a bundle for your application, you probably want 
       to use this, because it leads to smaller file sizes.）
 umd – Universal Module Definition, works as amd, cjs and iife all in one
```

github项目地址：[https://github.com/thx/chartx](https://github.com/thx/chartx)

```javascript
git clone git@github.com:thx/chartx.git
```

然后你根据你引入项目的方式，采用对应的方式在要绘制图表的时候能拿到Chartx模块

`已npm方式为例：`

先在package.json文件中配置好chartx的packageName

```javascript
"dependencies": {
    "chartx": "^1.0.32" //具体version可前往https://www.npmjs.com/package/chartx查看
},
```

```javascript
import Chartx from 'chartx';
```

好，假设你已经能拿到Chartx模块了，我们继续走

## 2，要绘制的位置准备好一个接收图表绘制的容器

ps：这个容器比如要有高宽值，否则会绘制不出来

```javascript
<div id='mychart' style='width:600px;height:300px;'></div>
```

## 3，准备一份数据

```javascript
var data = [
    { "time": "2017-03-21", "pv": 10, "uv": 12, "click": 112, "ppc": 45 },
    { "time": "2017-03-22", "pv": 20, "uv": 32, "click": 122, "ppc": 35 }
];
```

## 4，编写要绘制的图表的配置

```javascript
var options = {
    coord: { //配置一个coord坐标系组件
        type: "rect", //这个组件的type是rect(直角坐标系)，另外还有polar（极坐标）可选
        xAxis: { //直角坐标系的x轴是必选
            field: "time" //设置哪个数据字段来作为x轴
        }
    },
    graphs: { //配置一个绘图组件
        type: "bar", //告诉系统这个绘图的类型是bar（即柱状图）
        field: "uv" //然后拿哪个数据字段来绘制这个柱状图形
    }
}
```

## 5，调用Chartx绘制图表接口，完成绘图

```javascript
Chartx.create( "mychart" , data, options );
```

好了，用chartx绘制图表，其实真的挺简单的，也挺好理解的对么，你们对chartx已经上手了，接下来业务中需要用到具体的配置直接去查阅文档吧，我相信你已经能轻车熟路的从文档里找到自己想要的配置了。