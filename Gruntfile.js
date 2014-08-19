module.exports = function(grunt) {
  //配置参数
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
            }
         },
         app: {
             expand: true,
             cwd: "build/dvix/",
             src: ['**/*.js', '!**/*-min.js'],
             dest: "build/dvix/",
             ext: '-min.js' // '-min.js'
         }
     },
     copy: {
         main: {
             files: [
             /*{
                 expand: true, src: ['library/underscore.js' , 'library/excanvas.js' , 'library/color.js'], dest: 'build/'
             },
             */
             { expand: true, cwd: 'dvix', src: ['**'], dest: 'build/dvix'},
             { expand: true, cwd: 'demo', src: ['**'], dest: 'build/demo'},
             { expand: true, cwd: 'gameDemo', src: ['**'], dest: 'build/gameDemo'}
             ]
         }
      },
      autoname: {
         build: {
             // targetDir,要执行的目标目录，一般为打包的build目录
             targetDir : "./build"
         }
      }
  });
 
  //载入concat和uglify插件，分别对于合并和压缩
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-auto-kissy-module-name');
  grunt.loadNpmTasks('grunt-contrib-clean');
 
  //注册任务
  grunt.registerTask('default', [ 'clean' , 'copy' , 'uglify' , 'autoname' ]);
}


