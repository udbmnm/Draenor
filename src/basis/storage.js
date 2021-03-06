/*
*   mobile modules storage 依赖zepto.js 参考xueduany/localstore  作者：wenren
*/
(function($){
    var storage = localStorage,localstoreConnectors = [],index,session = sessionStorage;
    var loca = window.location;
    $.PATH = {
        host:'http://'+loca.host+'/'
    }
    $.DOMcollection = {};
    /**
    *   @method receiveMessage
    *   @param config {array}
    *   @param callback {function}
    */
    var receiveMessage = function(config,callback){
        var c = config;
        index = 0;
        c.forEach(function(url){
            localstoreConnectors.push({
                status:0,
                location:url,
                connector: createIframe(url)
            });
        });
        localstoreConnectors.cmdMap = {};
        window.addEventListener('message',function(e){
            var data = e.data;
            localstoreConnectors.cmdMap['message_'+index] = $.parseJSON(data);
            if(index === localstoreConnectors.length - 1) callback(localstoreConnectors.cmdMap);
            index++;
        },false);
    }
    /**
    *   save data in LocalStorage
    *   @method save
    *   @param key {string}
    *   @param value {any} 
    *   @param callback {function || boolean}
    */
    var set = function(key,value,bool){
        bool ? session.setItem(key,value) : storage.setItem(key,value);
    }
    /**
    *   @method get
    *   @param key {string}
    *   @param bool {boolean}
    */
    var get = function(key,bool){
        if(bool){
            return session.getItem(key);
        }else{
            return storage.getItem(key);
        }
    }
    /**
    *   @method isExists
    *   @param key {string}
    *   @param bool {boolean}
    */
    var isExists = function(key,bool){
        if(bool){
            return session.getItem(key) === null || session.getItem(key) === undefined ? false : true;
        }else{
            return storage.getItem(key) === null || storage.getItem(key) === undefined ? false : true;
        }
    }
    var createIframe = function(url){
        var connectorIframe = document.createElement('iframe');
        connectorIframe.style.display = 'none';
        connectorIframe.src = url;
        document.body.appendChild(connectorIframe);
        return connectorIframe.contentWindow;
    }
    /**
    *   @method postMessage
    *   @param config {array}
    *   @param value {array}
    */
    var postMessage = function(config,value){
        var c = config,v;
        c.forEach(function(url,i){
            $.type(value[i]) === 'object' || $.type(value[i]) === 'array' ? v = JSON.stringify(value[i]) : v = value[i];
            window.parent.postMessage(v,url);
        });
    }
    /**
    *   @method remove
    *   @param bool {boolean}
    */
    var remove = function(key,bool){
        if(bool){
            session.removeItem(key);
        }else{
            storage.removeItem(key);
        }
    }
    /**
    *   @method clear
    *   @param bool {boolean}
    */
    var clear = function(bool){
        if(bool){
            session.clear();
        }else{
            storage.clear();
        }
    }
    $.storage = {
        receiveMessage:receiveMessage,
        set:set,
        get:get,
        isExists:isExists,
        postMessage:postMessage,
        remove:remove,
        clear:clear
    }
    /**
    *   @method parseUrl
    */
    $.parseUrl = function(){
        var HREF = window.location.href,regx = /(\?|\#)(.+)/,bool;
        var ROUE = regx.exec(HREF);
        ROUE !== null ? bool = decodeURI(ROUE[2]) : bool = false;
        return bool;
    }
    /**
    *   @method stringify
    *   @param obj {object json}
    */
    $.stringify = function(obj){
        return JSON.stringify(obj);
    }
    /**
    *   @class Guid
    *   @param g {string || number 32}
    */
    var Guid = function(g){
        var arr = new Array();
        if (typeof(g) == "string"){
                InitByString(arr, g);
        }else{
                InitByOther(arr);
        }
        /**
        *   返回一个值，该值指示 Guid 的两个实例是否表示同一个值。
        *   @method Equals
        *   @param o {object}
        */
        this.Equals = function(o){
            if (o && o.IsGuid){
                return this.ToString() == o.ToString();
            }
            else{
                return false;
            }
        }
        /**
        *   Guid对象的标记
        *   @method IsGuid
        */
        this.IsGuid = function(){}
        /**
        *   返回 Guid 类的此实例值的 String 表示形式。
        *   @method ToString
        *   @param format {string}
        */
        this.ToString = function(format){
            if(typeof(format) == "string"){
                    if (format == "N" || format == "D" || format == "B" || format == "P"){
                            return ToStringWithFormat(arr, format);
                    }
                    else{
                            return ToStringWithFormat(arr, "D");
                    }
            }
            else{
                    return ToStringWithFormat(arr, "D");
            }
        }
        function InitByString(arr, g){
            g = g.replace(/\{|\(|\)|\}|-/g, "");
            g = g.toLowerCase();
            if (g.length != 32 || g.search(/[^0-9,a-f]/i) != -1){
                    InitByOther(arr);
            }
            else{
                    for (var i = 0; i < g.length; i++){
                            arr.push(g[i]);
                    }
            }
        }
        function InitByOther(arr){
            var i = 32;
            while(i--){
                arr.push("0");
            }
        }
        /**
            根据所提供的格式说明符，返回此 Guid 实例值的 String 表示形式。
            N  32 位： xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            D  由连字符分隔的 32 位数字 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 
            B  括在大括号中、由连字符分隔的 32 位数字：{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx} 
            P  括在圆括号中、由连字符分隔的 32 位数字：(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
            @method ToStringWithFormat  
        */
        function ToStringWithFormat(arr, format){
            switch(format){
                case "N":
                        return arr.toString().replace(/,/g, "");
                case "D":
                        var str = arr.slice(0, 8) + "-" + arr.slice(8, 12) + "-" + arr.slice(12, 16) + "-" + arr.slice(16, 20) + "-" + arr.slice(20,32);
                        str = str.replace(/,/g, "");
                        return str;
                case "B":
                        var str = ToStringWithFormat(arr, "D");
                        str = "{" + str + "}";
                        return str;
                case "P":
                        var str = ToStringWithFormat(arr, "D");
                        str = "(" + str + ")";
                        return str;
                default:
                        return new Guid();
            }
        }
    }
    var NewGuid = function(){
        var g = "";
        var i = 32;
        while(i--){
            g += Math.floor(Math.random()*16.0).toString(16);
        }
        return new Guid(g);
    }
    var GUID = NewGuid();
    /**
    *   @method guid
    */
    $.guid = GUID;
    /**
    *   @method error
    */
    var error = function(){
        var body = $('body');
        var html = '<div id="backdrop" class="modal-backdrop fade in" style="display:none;"></div>' + '<div class="error" id="error_parent" style="display:none;"><h1 id="error_content"></h1></div>';
        body.append(html);
        $.DOMcollection.backdrop = $('#backdrop');
        var e_c = $('#error_content'),e_p = $('#error_parent');
        return {
            /**
            *   @method show
            *   @param str {string}
            */
            show:function(str){
                $.DOMcollection.backdrop.show();
                e_c.html(str);
                e_p.show();
            },
            /**
            *   @method hide
            */
            hide:function(callback){
                setTimeout(function(){
                    $.DOMcollection.backdrop.hide();
                    e_p.hide();
                    if(typeof callback === 'function'){

                        callback();
                    }
                },2000);
            }
        }
    }
   $.error = error();
   /**
    *   @method wait
   */
   var wait = function(){
        var body = $('body');
        var html = '<div class="wait" id="wait" style="display:none;"><img src='+$.PATH.host+'css/img/loading.gif></div>';
        body.append(html);
        var waiting = $('#wait');
        return{
            show:function(){
                $.DOMcollection.backdrop.show();
                waiting.show();
            },
            hide:function(callback){
                $.DOMcollection.backdrop.hide();
                waiting.hide();
                if(typeof callback === 'function'){
                    callback();
                }
            }
        }
   } 
   $.wait = wait();
})(Zepto);