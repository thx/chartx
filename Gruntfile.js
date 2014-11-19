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
                { expand: true, cwd: 'dvix', src: ['**','!index.js'], dest: 'build/dvix'},
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
                 'dvix/index.js'
             ],
             dest: 'build/dvix/index.js'
         }
      }
  });
 
  //载入concat和uglify插件，分别对于合并和压缩
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
 
  //注册任务
  grunt.registerTask('default', [ 'clean' , 'copy' , 'concat' , 'uglify'  ]);
}


