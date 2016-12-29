/*
* 使用方法: node testfile.js 默认demo目录下的所有html文件,或者只测试bar目录下的demo: node testfile.js path=/demo/bar
* 传参:path=/demo/相对目录名称,如:path=/demo/bar path=/demo/hybrid
* 功能:执行node testfile.js 程序会自动访问制定目录下的每一个HTML文件,并将页面返回的日志输出到node控制台,方便版本更新后对其他模块产生影响的排查
* Author:不决
* Date:2016-12-23
* 参考:http://sentsin.com/web/658.html
* http://www.seleniumhq.org/projects/
 */
var webdriver = require('selenium-webdriver');
var fs = require('fs');
var fileList = [];
var NUM = 0;

var driver = new webdriver.Builder().
withCapabilities(webdriver.Capabilities.chrome()).
build();

function walk(path) {
    var dirList = fs.readdirSync(path);
    dirList.forEach(function (item) {
        if (fs.statSync(path + '/' + item).isDirectory()) {
            walk(path + '/' + item);
        } else {
            if (item.indexOf('.html') > 0) {
                fileList.push(path + '/' + item);
            }

        }
    });
}

function readFile(filename) {
    console.log("-------   open:\t"+filename.replace(__dirname,''));
    driver.get('file://' + filename);

    driver.manage().logs().get(webdriver.logging.Type.BROWSER, webdriver.logging.Level.ALL)
        .then(function (entries) {
            entries.forEach(function (entry) {
                console.log('[%s] %s', entry.level.name, entry.message);
            });
            if (NUM + 1 < fileList.length) {
                setTimeout(function () {
                    promiseCall(fileList[++NUM]).then(readFile);
                }, 500);
            }else{

                console.log('测试完毕,共测试了'+fileList.length+'个DEMO');
            };

        });
}

function promiseCall(filename) {
    return new Promise(function (resolve, reject) {
        resolve(filename)
    })
}



var args = process.argv.slice(2);
var path = __dirname + '/demo';
args.forEach(function (val) {
    if (val.indexOf('path') != -1) {
        path = __dirname + val.split('=')[1];
    }
});


//获取html列表
walk(path);
//访问读取日志

console.log('\n\n测试开始:\n\n');

promiseCall(fileList[0]).then(readFile);








