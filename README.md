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
KISSY.add(function(S , Chart){
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