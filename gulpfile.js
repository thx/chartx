const gulp = require('gulp');
const babel = require('gulp-babel');
const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const colors = require('colors-console');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;
const rename = require('gulp-rename');
const replace = require('gulp-string-replace');
const strip = require('@rollup/plugin-strip');
const fs = require('fs-extra');
const eslint = require('gulp-eslint');

let time = new Date().getTime();
let _srcPath = "src/**/*.js";

let stuffZero = ( num = 0 ) => {
    if( num < 10 ){
        return "0"+num
    } else {
        return num;
    }
}

let timeStr = ( time = new Date().getTime() ) => {
    let _t = new Date( time );
    return stuffZero(_t.getHours())+":"+stuffZero(_t.getMinutes())+":"+stuffZero(_t.getSeconds());
}

let timeWait = ( mt = 0 ) => {
    var str;
    if( mt < 1000 ) str = mt+" ms";
    if( mt > 1000 ) str = (mt/1000).toFixed(3)+" s";
    return colors(mt<6000?'green':'red', str);
}

let cleanHandle = ()=>{
    return new Promise( resolve => {
       return gulp.src('dist/*', {read: false})
        .pipe( clean() )
        .on('finish', ()=>{
            console.log( 'clean finish' )
            resolve();
        });
    } )
};

let babelHandle = ( _src = _srcPath ) => {
    return new Promise( resolve => {
        gulp.src( _src ,{ buffer: true, read: true, base: './src/' })
        .pipe(babel({
            presets: ['@babel/env'],
            plugins: [
                "@babel/plugin-proposal-class-properties",
                //"transform-es2015-modules-umd"
                [ "@babel/plugin-transform-runtime"]
            ]
        }))
        //.pipe(eslint())
        //.pipe(eslint.format())
        //.pipe(eslint.failAfterError())
        //.pipe(uglify())
        .pipe( gulp.dest('dist') )
        .on('finish', ()=>{
            console.log( 'babel finish' )
            resolve();
        });
    } );
};

let versionHandle = () => {
    return new Promise( resolve => {
        const packageObj = fs.readJsonSync('./package.json')
        let version = packageObj.version;
        return gulp.src( ["dist/index.js"] )
        .pipe( replace( '__VERSION__', version ) )
        .pipe( gulp.dest("dist/") )
        .on('finish', ()=>{
            console.log( 'version finish' )
            resolve();
        });
    } );
    
};

//task babel
let babelSrc = ()=>{
    return babelHandle();
};

let getRollupOpts = ()=>{
    let inputOptions = {
        input: './dist/index.js',
        plugins: [
            resolve({ mainFields:['module', 'main'], browser: true }), 
            commonjs(),
            strip({
                debugger: false
            })
        ]
    };
    
    let outputOptions = [
        {
            file: './dist/index.iife.js',
            format: 'iife',
            name: ['chartx'],
            globals: {
                Canvax: 'Canvax'
            }
        },
        {
            file: './dist/index.es.js',
            format: 'es',
            name: 'chartx',
            globals: {
                Canvax: 'Canvax'
            }
        },
        {
            file: './dist/index.cjs.js',
            format: 'cjs',
            name: 'chartx',
            globals: {
                Canvax: 'Canvax'
            }
        }
    ];

    return { inputOptions, outputOptions }
}

let rollupNum = 0;
//task rollup
let rollupDist = ()=>{
    
    let { inputOptions, outputOptions } = getRollupOpts();

    return new Promise( resolve => {
        const watcher = rollup.watch({
            ...inputOptions,
            output: outputOptions,
            watch: {
              include : './dist/**/*.js',
              exclude : ['./dist/chartx.js']
            }
        });

        watcher.on('event', event => {
         
            //console.log( event.code )
            //event.code 会是下面其中一个：
            //START        — 监听器正在启动（重启）
            //BUNDLE_START — 构建单个文件束
            //BUNDLE_END   — 完成文件束构建
            //END          — 完成所有文件束构建
            //ERROR        — 构建时遇到错误
            //FATAL        — 遇到无可修复的错误

            if( event.code == "ERROR" ){
                console.log( event )
            }
            if( event.code == "START" ){
                console.log(`[${colors('grey',timeStr(time))}] rollup start ...`)
                time = new Date().getTime();
            };
            if( event.code == 'END' ){
                if( rollupNum ){
                    console.log(`[${colors('grey',timeStr(time))}] rollup after ${timeWait(new Date().getTime() - time)}`)
                    console.log('watching...');
                };
                rollupNum++;
                resolve();
            };
            
        });
    } )
};

//task watch to babel
let watchSrc = () => {
    console.log('watching...');
    const watcher = gulp.watch([ _srcPath ]);
    watcher.on('change', async function(path, stats) {
        let newTime = new Date().getTime();
        if( newTime - time < 300 ){
            return;
        };
        time = newTime;
        console.log(`[${colors('grey',timeStr(time))}] File ${path} was changed`);
        await babelHandle( path );
        console.log(`[${colors('grey',timeStr(time))}] babel after ${timeWait(new Date().getTime() - time)}`)
    });
    return watcher;
};

let copyToCdn = ()=> {
    return new Promise( resolve => {
        return pipeline(
            gulp.src(['./dist/index.iife.js']), //只有iife需要压缩，因为是给到chartpark拼文件用的
            uglify(),
            //rename({ suffix: '.min' }),
            gulp.dest('./cdn/')
        ).on("end",()=>{
            resolve();
        });
    } )
}

//把mmvis从 node_models 里面copy到本地
exports.default = gulp.series(cleanHandle, babelSrc, versionHandle, rollupDist, watchSrc);
exports.cdn = gulp.series( copyToCdn )