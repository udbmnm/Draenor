module.exports = function(grunt){
    var pkg = grunt.file.readJSON('package.json');
    var op = {
        undef: true, // 禁止使用未定义变量
        unused: true, // 禁止定义的变量未使用
        camelcase: true, // 禁止使用未定义变量
        curly: true, // if for 后语句块必须大括号包裹
        maxdepth: 2, // 语句块嵌套层数限制
        maxparams: 3, // 函数最大参数个数限制
        asi: false //  分号缺失检测
    }
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
                    {src:['src/*.js'],dest:'build/rainbow.js'}
                ]
            }
        },
        uglify:{  //文件压缩
            library:{
                options:{
                    banner:'<%=banner%>'
                },
                files:[
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['./*.js'],
                        dest: 'build/',                         
                        ext: '.min.js',
                    },
                    {
                        src:'build/rainbow.js',
                        dest:'build/rainbow.min.js'
                    }
                ]
            }
        }
    });
    //定制task
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //库文件libs分配命令执行
    grunt.registerTask('libs',['concat:library','uglify:library']);
}