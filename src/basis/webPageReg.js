/*
* mobile modules 网页抓取正则 依赖 zepto.js  作者：wenren
*/
(function($){
  $.webPageReg = {
      //获取网页body部份代码
      body:/<body[^>]*>([\s\S]*)<\/body>/i,
      //获取网页style部份代码
      style:/<style[^>]*>([\s\S]*)<\/style>/i,
      //获取网页script部份代码
      script:/<script\b[^<]*(?:(?!<\/script)<[^>]*)*<\/script>/gi
  }
})(Zepto);