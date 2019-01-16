var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var commonjs = require('rollup-plugin-commonjs');
var resolve = require('rollup-plugin-node-resolve');

// output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
// amd – 使用像requirejs一样的银木块定义
// cjs – CommonJS，适用于node和browserify / Webpack
// es6 (default) – 保持ES6的格式
// iife – 使用于<script> 标签引用的方式
// umd – 适用于 CommonJs 和 AMD 风格通用模式

export default [
    {
        input : 'src/index.js',
        output: [
            {
            file : "dist/chartx.js",
            name : "Chartx",
            format : "iife"
            }
        ],
        plugins: [
            babel({
                exclude: /node_modules\/(?!.*@*(mmvis|canvax)\/).*/,
                externalHelpers: true,
                babelrc: false,
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            "modules": false,
                            "loose": false 
                        }
                    ]
                ],
                plugins: [
                    "@babel/plugin-external-helpers"
                ]
            }),
            resolve({ jsnext: true, main: true, browser: true }), 
            commonjs()
            //uglify()
        ]
    }
]