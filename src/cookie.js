/*
* mobile ui browser 依赖 zepto.js  作者：wenren
*/
(function($){
    var cookie = function (name, value, options) {
        if (typeof value != 'undefined') {
            options = options || {};
            if (value === null) {
                value = '';
                options = $.extend({}, options);
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString();
            }
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = $.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    };
    $.cookie = {
        /**
        *   @method setCookie
        *   @param name {String} 设置cookie的key
        *   @param vlaue {String} 设置cookie的value 
        *   @param opts {Object} 设置cookie的多选参数
        */
        setCookie:function(name, value, opts){
            var o = opts;
            if(!o) o = { path: '/', expires: 1 }
            cookie(name, value, opts);
        },
        /**
        *   @method getCookie
        *   @param name {String} 获取cookie的key
        *   @return {String} 返回获取的cookie
        */
        getCookie:function(name){
            if(!name) return false;
            return cookie(name);
        },
        /**
        *   @method deleteCookie
        *   @param name {String} 删除使用需要指明cookie的key
        */
        deleteCookie:function(name){
            var expdate = new Date(); 
            expdate.setTime(expdate.getTime() - (86400 * 1000 * 1)); 
            $.cookie.setCookie(name, "", expdate); 
        },
        /**
        *   @method isExists
        *   @param name {String} 判断某个cookie是否存在
        */
        isExists:function(name){
            var cookie = $.cookie.getCookie(name);
            try{
                if($.type(cookie) === 'string'){
                    if(cookie.length !== 0 ){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            }catch(e){
                console.info('error' + e);
            }
        }
    }
    /**
    *   @method gotoPage
    *   @param path {String} 转跳页面时的参数
    */
    $.gotoPage = function(path){
        window.location.href = path;
    }
})(Zepto);