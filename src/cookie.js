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
        *   @param name {string}
        *   @param vlaue {string}
        *   @param opts {object}
        */
        setCookie:function(name, value, opts){
            var o = opts;
            if( o === undefined ) o = { path: '/', expires: 1 }
            cookie(name, value, opts);
        },
        /**
        *   @method getCookie
        *   @param name {string}
        */
        getCookie:function(name){
            if( name === undefined ) return null;
            return cookie(name);
        },
        /**
        *   @method deleteCookie
        *   @param name {string}
        */
        deleteCookie:function(name){
            var expdate = new Date(); 
            expdate.setTime(expdate.getTime() - (86400 * 1000 * 1)); 
            $.cookie.setCookie(name, "", expdate); 
        }
    }
})(Zepto);