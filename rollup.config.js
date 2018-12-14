var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var commonjs = require('rollup-plugin-commonjs');
var resolve = require('rollup-plugin-node-resolve');
var uglify = require('rollup-plugin-uglify');

rollup.rollup({
    input: 'src/index.js',
    plugins: [
      babel({
        //exclude : 'node_modules/**',
        include : ['./src/**','node_modules/mmvis/**', "node_modules/canvax/**"]
      }),
      resolve({ jsnext: true, main: true, browser: true }), 
      commonjs()
    ]
}).then(function(bundle) {

	// output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
    // amd – 使用像requirejs一样的银木块定义
    // cjs – CommonJS，适用于node和browserify / Webpack
    // es6 (default) – 保持ES6的格式
    // iife – 使用于<script> 标签引用的方式
    // umd – 适用于CommonJs和AMD风格通用模式

    bundle.write({
        format: 'iife',
        name: 'Chartx',
        file: 'dist/chartx.js',
        //sourceMap: 'inline'
    });

    /*
    bundle.write({
        format: 'umd',
        name: 'Chartx',
        file: 'dist/umd/chartx.js',
        //sourceMap: 'inline'
    });

    
    bundle.write({
        format: 'amd',
        name: 'Chartx',
        file: 'dist/amd/chartx.js',
        //sourceMap: 'inline'
    });

    

    bundle.write({
        format: 'cjs',
        name: 'Chartx',
        file: 'dist/cjs/chartx.js',
        //sourceMap: 'inline'
    });
    */

});