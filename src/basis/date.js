/*
* mobile modules date 依赖 zepto.js  作者：wenren
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