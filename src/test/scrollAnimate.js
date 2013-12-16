/*
* mobile ui ScrollSwipe 依赖 zepto.js  作者：wenren
*/
(function($){
	//判断是否支持css3动画
	var transitions = (function(temp) {
        var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
        for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
        return false;
    })(document.createElement('swipe'));
    var ScrollSwipe = function(container,options){
    	if (!container) return;
       	var contai = container.find('.ScrollSwipe');
       	var ch = contai.children();
    	var len = ch.length,wid = container.width(),interval;
    	//第一次
    	var index = parseInt(options.startSlide, 10) || 0; 
    	//如果只有一个，暂停动画。
    	options.continuous = options.continuous !== undefined ? options.continuous : true;
    	//开始时间
    	var delay = options.auto || 3000;
    	//动画间隔时间
    	var speed = options.speed || 300;
    	if(len < 2){
       		options.continuous = false;
       	}
       	//console.log(options.continuous);
       	var slidePos = new Array(len);
       	//console.log(slidePos);
       	var self = this;
		//初始化css3动画属性
	    var translate = function(index, dist, speed) {
	        var slide = ch[index];
	        // console.log(slide);
	        // console.log(speed);
	        slidePos[index] = dist;
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
	   	var  circle = function(index) {
        	return (len + (index % len)) % len;
    	};
	    this.slide = function(to,slideSpeed){
	    	// console.log(index);
	    	// console.log(to);
	    	if (index == to) return;
	    	var direction = Math.abs(index-to) / (index-to); // 1: backward, -1: forward
            // get the actual position of the slide
            // console.log(slidePos);
            if (options.continuous) {
                var natural_direction = direction;
                direction = -slidePos[to] / wid;
                // console.log(direction);
                // if going forward but to < index, use to = slides.length + to
                // if going backward but to > index, use to = -slides.length + to
                if (direction !== natural_direction) to =  -direction * len + to;
            };
            // console.log('index '+ index);
            // console.log('to ' + to);
            var diff = Math.abs(index-to) - 1;
            // console.log(diff);
            // move all the slides between index and to in the right direction
            while (diff--) {
            	// console.log(123);
            	translate( circle((to > index ? to : index) - diff - 1), wid * direction, 0);
            }
            to = to;
            // console.log(slideSpeed);
            translate(index, wid * direction, slideSpeed || speed);
            translate(to, 0, slideSpeed || speed);
            // console.log(to - direction);
            if (options.continuous) {
            	// translate(circle(to - direction), -(wid * direction), 0); // we need to get the next in place
            }
            index = to;
            begin();
	    }
	    //前一个
	    var prev = function() {
	        if (options.continuous) self.slide(index-1);
	        else if (index) self.slide(index-1);
	    }
	    //下一个
	    var next = function() {
	    	console.log(index+1);
	        if (options.continuous) self.slide(index+1);
	        else if (index < len - 1) self.slide(index+1);
	    }
	    //开始动画
	    var begin = function() {
	        interval = setTimeout(next, delay);
	    };
	    //停止动画
	    var stop = function() {
	        delay = 0;
	        clearTimeout(interval);
	    };
       	container.css({visibility:'visible'});
       	contai.css({width:wid*len,left:index*-wid,position:'relative',overflow:'hidden'});
       	while(len--){
       		var slide = ch.eq(len);
       		slide.css({width:wid});
       		slide.attr('data-index',len);
       		if(transitions){
       			slide.css({left:len*-wid});
       			translate(len,index>len ? -wid : (index < len ? wid : 0), 0);
       		}
       	}

       	contai.fadeIn('slow');
       	begin();
    }
    $.fn.scrollAnimate = function(options){
		new ScrollSwipe(this,options);
    }
    $.fn.scrollAnimate.Constructor = ScrollSwipe;
})(Zepto);