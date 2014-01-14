module.exports = function(grunt) {
  //配置参数
  grunt.initConfig({
     uglify: {
           options: {
               beautify: {
                    ascii_only: true
               }
            },
            app: {
                expand: true,
                cwd: "build/visualization/",
                src: ['**/*.js', '!**/*-min.js'],
                dest: "build/visualization/",
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
             {
                 expand: true, cwd: 'visualization', src: ['**'], dest: 'build/visualization'}
             ]
         }
      }
  });
 
  //载入concat和uglify插件，分别对于合并和压缩
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
 
  //注册任务
  grunt.registerTask('default', [  'copy' , 'uglify' ]);
}


