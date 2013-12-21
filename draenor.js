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
            if( o === undefined ) o = { path: '/', expires: 1 }
            cookie(name, value, opts);
        },
        /**
        *   @method getCookie
        *   @param name {String} 获取cookie的key
        *   @return {String} 返回获取的cookie
        */
        getCookie:function(name){
            if( name === undefined ) return null;
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
/*
* mobile ui date 依赖 zepto.js  作者：wenren
*/
(function($){
    $.dateParse = function(options){
        var date,parse,yester;
        var nonNegative = /^-[1-9]\d*$/,reg = /\.\d/;
        if($.type(options) === 'number'){
            yester = new Date(options);
            var ye = {
                "M" : yester.getMonth() + 1, 
                "d" : yester.getDate(),
                "h" : yester.getHours(), 
                "m" : yester.getMinutes(),
                "s" : yester.getSeconds(),
                "q" : Math.floor((yester.getMonth() + 3) / 3),
                "S" : yester.getMilliseconds(), 
                "parse" : yester.getTime(),
                "ye":yester.getFullYear()
            }
        }
        date = new Date();
        var o = {
            "M" : date.getMonth() + 1,
            "d" : date.getDate(),
            "h" : date.getHours(),
            "m" : date.getMinutes(),
            "s" : date.getSeconds(),
            "q" : Math.floor((date.getMonth() + 3) / 3),
            "S" : date.getMilliseconds(),
            "parse" : date.getTime(),
            "ye":date.getFullYear()
        }
        return {
            parseTime:function(){
                var differ = o.parse - ye.parse;
                var year,month,days,hours,minutes,seconds,time = '',_time;
                if(nonNegative.test(differ)) return '时间毫秒差为负数';
                days = Math.floor(differ/(24*3600*1000));
                if(!days){
                    hours = Math.floor(differ/(3600*1000));
                    if(!hours){
                        minutes = Math.floor(differ/(60*1000));
                        if(!minutes){
                            seconds = Math.floor(differ/(1000));
                            time += seconds + '秒前';
                        }else{
                            time += minutes + '分钟前';
                        }
                    }else{
                        time += hours + '小时前';
                    }
                }else{
                    month = Math.floor(days/30);
                    if(!month){
                        time += days +'天前';
                    }else{
                        year = Math.floor(month/12);
                        if(!year){
                            var _month = reg.exec(days/30);
                            if(_month){
                                _time = _month[0].replace(/\./,'') + '前';
                            }
                            time += month + '月'+ (_time || '前');
                        }else{
                            var _year = reg.exec(month/12);
                            if(_year){
                                _time = _year[0].replace(/\./,'') + '前';
                            }
                            time += year + '年' + (_time || '前');
                        }
                    }
                }
                return time;
            },
            Format:function(format){
                var week = {           
                    "0":"/u65e5",           
                    "1":"/u4e00",           
                    "2":"/u4e8c",           
                    "3":"/u4e09",           
                    "4":"/u56db",           
                    "5":"/u4e94",           
                    "6":"/u516d"          
                };           
                if(/(y+)/.test(format)){           
                    format = format.replace(RegExp.$1, (o.ye + "").substr(4 - RegExp.$1.length));           
                }           
                if(/(E+)/.test(format)){           
                    format = format.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay()+""]);           
                }           
                for(var k in o){           
                    if(new RegExp("("+ k +")").test(format)){           
                        format = format.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
                    }           
                }           
                return format;
            },
            time:o
        }
    }
})(Zepto);
/*
* mobile ui dialog 对话框 依赖 zepto.js  作者：wenren
*/
(function($){
  var Dialog = function(dom,options){
      this.options = options;
  }
  Dialog.prototype = {
      /**
      * open dialog 
      * @method show
      */
      show:function(){          
          $.DOMcollection.backdrop.show();
          this.show();
      },
      /**
      * close dialog
      * @method hide
      */
      hide:function(){
          $.DOMcollection.backdrop.hide();
          this.hide();
      }
  }
  $.fn.dialog = function(options){
      return this.each(function(){
          var $this = $(this);
          var data = $this.data('dialog');
          if(!data){
              $this.data('dialog',(data = new Dialog($this,options)));
          }
          if(typeof options === 'string'){
              data[options].call($this);
          }
      });
  }
  $.fn.dialog.Constructor = Dialog
})(Zepto);
/*
* mobile ui 地理位置 依赖 zepto.js  作者：wenren
*/
(function($){
	var throwError = function(status,message,callback){
		$.geolocation = {
			"status":status,
			"message":message
		}
    if(typeof callback === 'function') callback($.geolocation);
	} 
	var getCurrentPosition = function(callback){
  		if(navigator.geolocation){
  			navigator.geolocation.getCurrentPosition(function(options){
  				$.geolocation = {
  					"latitude":options.coords.latitude,
  					"longitude":options.coords.longitude
  				}
          if(typeof callback === 'function') callback($.geolocation);
  			},function(error){
  				switch(error.code){
  					case 0:
  							throwError(0,error.message,callback);
  						break;
  					case 1:
  							throwError(1,error.message,callback);
  						break;
  					case 2:
  							throwError(2,error.message,callback);
  						break;
  					case 3:
  							throwError(3,error.message,callback);
  						break;
  				}
  			});
  		}
  	}
  $.geolocation;
	$.geolocationSarat = function(bool,callback){
		if(bool){
			if(navigator.geolocation){
				getCurrentPosition(callback);
			}
		}
	}
})(Zepto);
/*
* mobile ui 依赖 zepto.js  作者：wenren
*/
(function($){
	var SimpleAnalysis = function(elements,options){
		var newArray = [],Cun = parseInt(options.Cnumber),setData = options.setData;
		var newColor = ['#fec960','#49b5ed','#e86b66','#3dbc7c','#8794ff'];
		var Clen = newColor.length,Sindex = 1;
		setData.forEach(function(v,i){
			var count = Math.floor((parseInt(v.count) / Cun)*100);
			v.percentage = count + '%';
			newArray.push(count);
			if(i === Clen*Sindex){
				Sindex ++;
			}
			v.color = i < Clen ? newColor[i] : newColor[Clen - ((Clen*Sindex)%i + 1)];
		});
		var anRender = $.template.compile(options.template);
		var anHtml = anRender({"anaVote":options.setData});
		elements.html(anHtml);
		elements.show();
		var analyAnimate = elements.find('div.analyAnimate');
		var animate =  new $.animates();
		setTimeout(function(){
			newArray.forEach(function(v,i){
				var slide = analyAnimate[i];
				animate.concat(slide,{width:v+'%'});
				animate.start();
			});
		},500)
	}
	$.fn.simpleAnalysis = function(options){
		new SimpleAnalysis(this,options);
	}
	$.fn.simpleAnalysis.Constructor = SimpleAnalysis;
})(Zepto);
/*
*   mobile localStorage 依赖zepto.js 参考xueduany/localstore  作者：wenren
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
        if(!bool){
            throw new Error('URL解析出错');
        }
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
            hide:function(){
                $.DOMcollection.backdrop.hide();
                waiting.hide();
            }
        }
   } 
   $.wait = wait();
})(Zepto);
/*
* mobile ui 2d css3动画 依赖 zepto.js  作者：wenren
*/
(function($){
  	$.transformX = function(slides,index, dist, speed){
  		var slide = slides[index];
        var style = slide && slide.style;
        if (!style) return;
        style.webkitTransitionDuration =
            style.MozTransitionDuration =
                style.msTransitionDuration =
                    style.OTransitionDuration =
                        style.transitionDuration = speed + 'ms';

        style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
        style.msTransform =
            style.MozTransform =
                style.OTransform = 'translateX(' + dist + 'px)';
  	}
  	$.transformY = function(slides,index, dist, speed){
  		var slide = slides[index];
        var style = slide && slide.style;
        if (!style) return;
        style.webkitTransitionDuration =
            style.MozTransitionDuration =
                style.msTransitionDuration =
                    style.OTransitionDuration =
                        style.transitionDuration = speed + 'ms';

        style.webkitTransform = 'translate(0,'+dist+'px)' + 'translateZ(0)';
        style.msTransform =
            style.MozTransform =
                style.OTransform = 'translateY(' + dist + 'px)';
  	}
})(Zepto);
/*
* mobile ui verification 表单验证 Forms 依赖 zepto.js  作者：wenren
*/
(function($){
  var bool = true,muster = {}
  //验证
  var trigger = function(target,self,event){
      var elements = self.input,regx = self.options.regx;
      var i = 0,len = elements.length;
      for(;i<len;i++){
          var el = elements.eq(i);
          var value = el.val();
          if(value.length === 0){
              $.error.show(self.defaultmessage);
              $.error.hide();
              bool = false;
              break;
          }
          if(regx !== undefined){
            var x = regx[i];
            if(x !== undefined){
                if(!x.desc){
                    for(var c in x){
                        if(!x[c].test(value)){
                            $.error.show(c);
                            $.error.hide();
                            bool = false;
                            break;
                        }
                        bool = true;
                    }
                    if(!bool){
                      break;
                    }
                }
            }
          }
          bool = true;
          muster[el.attr('data-key')] = value; 
      }
      if(bool){
          self.options.affairFun.call(target,muster,event);
      }
  }
  /**
  *   Verification forms input
  *   @class Verification
  *   @param id {document object}
  *   @param options {object}
  */
  var Verification = function(dom,options){
      this.dom = dom,this.id = dom.attr('id'),this.options = options;
      this.input = this.dom.find('input');
      var type = this.options.type ||'tap';
      var submitE = $(this.options.submitElements);
      var Self = this;
      this.defaultmessage = options.defaultmessage || '账户或密码不能为空';
      submitE.on(type,function(event){
          trigger(this,Self,event);
      });
  }
  $.fn.verification = function(options,callback){
      return this.each(function(){
          var $this = $(this);
          var data = $this.data('verification');
          if(!data){
              $this.data('verification',(data = new Verification($this,options)));
          }
      });
  }
  $.fn.verification.Constructor = Verification;
})(Zepto);
/*
* mobile ui 网页抓取正则 依赖 zepto.js  作者：wenren
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