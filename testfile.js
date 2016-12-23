
/*参考:http://sentsin.com/web/658.html
*
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
    driver.get('file://' + filename);
    driver.manage().logs().get(webdriver.logging.Type.BROWSER, webdriver.logging.Level.ALL)
        .then(function (entries) {
            entries.forEach(function (entry) {
                console.log('[%s] %s', entry.level.name, entry.message);
            });
            if (NUM + 1 < fileList.length) {
                setTimeout(function () {
                    promiseCall(fileList[NUM++]).then(readFile);

                }, 500);
            }

        });
}

function promiseCall(filename) {
    return new Promise(function (resolve, reject) {
        resolve(filename)
    })
}
//获取html列表
walk(__dirname + '/demo');
//访问读取日志
promiseCall(fileList[0]).then(readFile);








