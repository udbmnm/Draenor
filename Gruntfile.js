module.exports = function(grunt){
    var pkg = grunt.file.readJSON('package.json');
    //grunt插件，对项目分配运行命令，将进行代码检测，文件合并，文件压缩，单元测试等服务。
    grunt.initConfig({
        pkg:pkg,
        banner:'/*\n'+
            '*  Copyright <%= grunt.template.today("yyyy-mm-dd")%>\n'+
            '*  Author <%=pkg.author%>\n'+
            '*  Dependent <%=pkg.message%>'+
            '*/\n\n',
        concat:{  //文件合并
            library:{      //分配项目运行命令 
                options:{
                    banner:'<%=banner%>'
                },
                files:[
                    {src:['src/build/*.js'],dest:'draenor.min.js'}
                ]
            }
        },
        cssmin:{
            library:{
                options:{
                    banner:'<%=banner%>'
                },
                files:[
                    {src:['style/reset.css','style/draenor.css'],dest:'draenor.min.css'}
                ]
            }
        },
        uglify:{  //文件压缩
            library:{
                files:[
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['./*.js'],
                        dest: 'src/build/',                         
                        ext: '.min.js',
                    }
                ]
            }
        }
    });
    //定制task
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('libs',['uglify:library','cssmin:library']);
    grunt.registerTask('conLibs',['concat:library']);
}