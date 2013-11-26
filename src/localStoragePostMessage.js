/*
*   mobile localStorage 依赖zepto.js 参考xueduany/localstore  作者：wenren
*/
(function($){
    var storage = localStorage,localstoreConnectors = [],index;
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
            console.log(data);
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
    *   @param callback {function}
    */
    var set = function(key,value,callback){
        var v = value;
        if($.type(value) === 'object' || $.type(value) === 'array') v = JSON.stringify(value);
        storage.setItem(key,v);
        if(typeof callback === 'function') callback.call(this);
    }
    /**
    *   @method get
    *   @param key {string}
    */
    var get = function(key){
        return storage.getItem(key);
    }
    /**
    *   @method isExists
    *   @param key {string}
    */
    var isExists = function(key){
        return storage.getItem(key) === null || storage.getItem(key) === undefined ? false : true;
    }
    /**
    *   @method createIframe
    *   @param url {string}
    */
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
    *   @param bool {boolean or string}
    */
    var remove = function(bool){
        if($.type(bool) === 'boolean'){
            storage.clear();
        }else{
            storage.remove(bool);
        }
    }
    $.storage = {
        receiveMessage:receiveMessage,
        set:set,
        get:get,
        isExists:isExists,
        postMessage:postMessage,
        remove:remove
    }
})(Zepto);