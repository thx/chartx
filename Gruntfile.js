module.exports = function(grunt) {
  //配置参数
  var bc = "build/chartx/"
  grunt.initConfig({
     clean : {
         build : {
             src : "./build" 
         }
     },
     uglify: {
         options: {
            beautify: {
                 ascii_only: true
            },
            compress: {
                drop_console: true
            }
         },

         min: {
             expand: true,
             cwd: bc,
             src: ['**/*.js'],
             dest:bc,
             ext: '-min.js' // '.js'
         }
     },
     copy: {
         main: {
             files: [
                //{ expand: true, cwd: 'chartx', src: ['**','!index.js'], dest: 'build/chartx'},
                { expand: true, cwd: 'chartx', src: ['**'], dest: 'build/chartx'},
                { expand: true, cwd: 'demo', src: ['**'], dest: 'build/demo'}
             ]
         }
      },
      concat : {

         options: {
             separator: '\n\n',
             process: function(src, filepath) {
                 var develop = /\/\/BEGIN\(develop\)[\s\S]+?\/\/END\(develop\)/mg;
                 return src.replace( develop , "" );
             }
         },
         dist : {
             src: [
                //'chartx/index.js',
                //'chartx/chart/index.js',
                 bc+"index.js",
                 bc+"chart/index.js",
                 bc+"components/**/*.js"
             ],
             dest: bc+'index.js'
         },
         bar : {
             src : [
                 bc+"chart/bar/graphs.js",
                 bc+"chart/bar/tips.js",
                 bc+"chart/bar/xaxis.js",

                 bc+"chart/bar/index.js"
                 
             ],
             dest : bc+"chart/bar/index.js"
         },
         bar_h : {
             src : [
                 bc+"chart/bar/horizontal/graphs.js",
                 bc+"chart/bar/horizontal/tips.js",
                 bc+"chart/bar/horizontal/xaxis.js",
                 bc+"chart/bar/horizontal.js"
             ],
             dest : bc+"chart/bar/horizontal.js"
         },
         line : {
             src : [
                 bc+"chart/line/tips.js",
                 bc+"chart/line/xaxis.js",
                 bc+"chart/line/index.js"
             ],
             dest : bc+"chart/line/index.js"
         },
         map : {
             src : [
                 bc+"chart/map/mapdata.js",
                 bc+"chart/map/tips.js",

                 bc+"chart/map/index.js",
                 
             ],
             dest : bc+"chart/map/index.js"
         },
         pie : {
             src : [
                 bc+"chart/pie/pie.js",
                 bc+"chart/pie/index.js"
                 
             ],
             dest : bc+"chart/pie/index.js"
         },
         radar : {
             src : [
                 bc+"chart/radar/back.js",
                 bc+"chart/radar/graphs.js",
                 bc+"chart/radar/xaxis.js",
                 bc+"chart/radar/index.js"
                 
             ],
             dest : bc+"chart/radar/index.js"
         },
         scat : {
             src : [
                 bc+"chart/scat/xaxis.js",
                 bc+"chart/scat/graphs.js",
                 bc+"chart/scat/index.js"
                 
             ],
             dest : bc+"chart/scat/index.js"
         }
      }
  });
 
  //载入concat和uglify插件，分别对于合并和压缩
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
 
  //注册任务
  grunt.registerTask('default', [ 'clean' , 'copy' ,  'concat' ,  'uglify:min'  ]);
}


