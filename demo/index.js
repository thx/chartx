var DvixSite = {
        local : !! ~location.search.indexOf('local'),
        daily : !! ~location.search.indexOf('daily'),
        debug : !! ~location.search.indexOf('debug'),
        build : !! ~location.search.indexOf('build')
    };

if(  (/daily.taobao.net/g).test(location.host)  ){
    DvixSite.daily = true;
}

var canvaxVersion = "2014.08.19";
var canvaxUrl     = "http://g.tbcdn.cn/thx/canvax/"+ canvaxVersion +"/";
if( DvixSite.daily ){
    canvaxVersion = '2014.10.22';
    canvaxUrl     = "http://g.assets.daily.taobao.net/thx/canvax/" + canvaxVersion + "/";
}
if( DvixSite.local ){
    //本地环境测试
    //canvaxUrl = "http://nick.daily.taobao.net/canvax"
}

KISSY.config({
    packages: [{
        name  : 'canvax' , 
        path  :  canvaxUrl,
        debug :  DvixSite.debug,
        combine : false 
    },{
        name  : 'dvix',
        path  : '../../',
        debug : DvixSite.debug,
        combine : false
    }]
});


