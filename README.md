# Draenor #

<a href="https://github.com/xiangwenwe/Draenor">Draenor.js</a>是基于zepto.js的插件集合，用于mobile web 页面，提供了比如对本地缓存，postMessage通信的封装，更提供了很多可选的ui插件，如dialog对话框，表单验证等。所有的集合，以zepto.js插件的形式编写，各分模块。

# build #

使用grunt工具，对其build，运行：

	grunt libs  压缩src目录中的js文件 style目录中的css文件
	
	grunt a 输出压缩所有模块
	
	grunt b 输出不压缩所有模块

	grunt c 输出基础模块压缩，ui模块压缩

# 程序运行条件 #

在页面中，先引入zepto.js，draenor.css，再依次引入其他插件模块。



