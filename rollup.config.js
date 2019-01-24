import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import {uglify} from 'rollup-plugin-uglify';

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
            resolve({ jsnext: true, main: true, browser: true }), 
            commonjs(),
            babel({
                exclude: /node_modules\/(?!.*@*(mmvis|canvax)\/).*/,
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
                plugins: [ ]
            })
        ]
    }
]
