/*
* mobile ui browser 浏览器判断与网页抓取正则 依赖 zepto.js  作者：wenren
*/
(function($){
  //os
  $.browser = {
      IE: !!(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1),
      Opera: navigator.userAgent.indexOf('Opera') > -1,
      //检测浏览器是否为WebKit内核
      WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
      //检测浏览器是否为Gecko内核，如Firefox
      Gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') === -1,
      MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/),
      android: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1
  }
  $.webPageReg = {
      //获取网页body部份代码
      body:/<body[^>]*>([\s\S]*)<\/body>/i,
      //获取网页style部份代码
      style:/<style[^>]*>([\s\S]*)<\/style>/i,
      //获取网页script部份代码
      script:/<script\b[^<]*(?:(?!<\/script)<[^>]*)*<\/script>/gi
  }
})(Zepto);